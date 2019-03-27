sap.ui.define([
	'Mortgage-App/controller/BaseController',
	"sap/ui/model/json/JSONModel",
	'Mortgage-App/model/models',
	'sap/m/MessageBox'
], function(BaseController, JSONModel, models, MessageBox) {
	"use strict";

	return BaseController.extend("Mortgage-App.controller.UserDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Mortgage-App.view.Search
		 */
		onInit: function() {
			var userId = this.getGlobalModel().getProperty("/accountId");
			this.getCountNoti(userId);
			var dataUser = new JSONModel();
			this.setModel(dataUser, "dataUser");

			this.getUserInfo();
		},

		getUserInfo: function() {
			var id = localStorage.getItem("uid");
			var data = models.getUserDetail(id);
			if (data.status === 400) {
				localStorage.setItem("isLogging", false);
				MessageBox.error("Đăng nhập lại!");
				this.getRouter().navTo("home");
			} else {
				// set data user information
				var getModelUserInfo = this.getModel("dataUser");
				getModelUserInfo.setProperty("/name", data.name);
				getModelUserInfo.setProperty("/email", data.email);
				getModelUserInfo.setProperty("/phone", data.phoneNumber);
				getModelUserInfo.setProperty("/address", data.address);
				getModelUserInfo.setProperty("/avaURL", data.avaURL);

				// get data notification
				var listNotification = data.listNotification;
				var dataNotify = new JSONModel();
				dataNotify.setData({
					results: listNotification
				});
				this.setModel(dataNotify, "dataNotify");

				// get data transaction
				var listTrans = data.listTransaction;
				var dataTrans = new JSONModel();
				dataTrans.setData({
					results: listTrans
				});
				this.setModel(dataTrans, "dataTrans");
			}
		},

		updateUserInfo: function() {
			var uid = localStorage.getItem("uid");
			var getImg = this.getView().byId("img_user").getSrc();
			var getValueName = this.getView().byId("nameInput").getValue();
			var getValuePhone = this.getView().byId("phoneInput").getValue();
			var getValueAddress = this.getView().byId("addressInput").getValue();
			
			this.getModel("dataUser").setProperty("/name", getValueName);
			this.getModel("dataUser").setProperty("/phone", getValuePhone);
			this.getModel("dataUser").setProperty("/address", getValueAddress);
			var data = {
				userName: getValueName,
				phone: getValuePhone,
				acountId: uid,
				avaUrl: getImg,
				address: getValueAddress
			};

			var update = models.updateUserInfo(data);
			if (update === "success") {
				MessageBox.success("Cập nhật thành công!");
				var modelUserInfo = this.getModel("dataUser");
				modelUserInfo.setProperty("/name", getValueName);
				modelUserInfo.setProperty("/phone", getValuePhone);
				modelUserInfo.setProperty("/address", getValueAddress);
				modelUserInfo.updateBindings(true);
			} else if (update.status === 405) {
				MessageBox.error("Cập nhật thất bại");
			}
		},

		logout: function() {
			this.getGlobalModel().setProperty("/accountId", "");
			this.getGlobalModel().setProperty("/username", "");
			this.getGlobalModel().setProperty("/role", "");
			this.getGlobalModel().setProperty("/password", "");
			this.getGlobalModel().setProperty("/lat", "");
			this.getGlobalModel().setProperty("/lng", "");

			// remove localStorage
			localStorage.removeItem("username");
			localStorage.removeItem("token");
			localStorage.removeItem("isLogging");
			localStorage.removeItem("uid");

			var oModelNoti = this.getModel("noti");
			oModelNoti.setProperty("/count", "");
			oModelNoti.updateBindings(true);

			this.getRouter().navTo("home");
		},

		onUploadPress: function(oEvt) {
			var that = this;
			var oFileUploader = oEvt.getSource();
			var aFiles = oEvt.getParameters().files;
			console.log(aFiles);
			var currentFile = aFiles[0];
			this.resizeAndUpload(currentFile, {
				success: function(oEvt) {
					oFileUploader.setValue("");
					//Here the image is on the backend, so i call it again and set the image
					// var model = that.getModel("createTrans");
					var getModelUserInfo = that.getModel("dataUser");
					if (!getModelUserInfo) {
						return;
					}
					getModelUserInfo.setProperty("/avaURL", encodeURI(oEvt.data.link));
					// pics.push({
					// 	url: encodeURI(oEvt.data.link)
					// });
					getModelUserInfo.updateBindings(true);
				},
				error: function(oEvt) {
					//Handle error here
				}
			});
		},
		resizeAndUpload: function(file, mParams) {
			var that = this;
			var reader = new FileReader();
			reader.onerror = function(e) {
				//handle error here
			};
			reader.onloadend = function() {
				var tempImg = new Image();
				tempImg.src = reader.result;
				tempImg.onload = function() {
					that.uploadFile(tempImg.src, mParams, file);
				};
			};
			reader.readAsDataURL(file);
		},

		uploadFile: function(dataURL, mParams, file) {
			var xhr = new XMLHttpRequest();
			var BASE64_MARKER = 'data:' + file.type + ';base64,';
			var base64Index = dataURL.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
			var base64string = dataURL.split(",")[1];

			xhr.onreadystatechange = function(ev) {
				if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 201)) {
					mParams.success(JSON.parse(xhr.response));
				} else if (xhr.readyState == 4) {
					mParams.error(ev);
				}
			};
			var URL = "https://api.imgur.com/3/upload";
			var fileName = (file.name === "image.jpeg") ? "image_" + new Date().getTime() + ".jpeg" : file.name;
			xhr.open('POST', URL, true);
			xhr.setRequestHeader("Content-type", file.type); //"application/x-www-form-urlencoded");
			xhr.setRequestHeader("Authorization", "Bearer 5c25e781ffc7f495059078408c311799e277d70e"); //"application/x-www-form-urlencoded");
			var data = base64string;
			xhr.send(data);
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf Mortgage-App.view.Search
		 */
			onBeforeRendering: function() {

		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Mortgage-App.view.Search
		 */
		onAfterRendering: function() {

		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Mortgage-App.view.Search
		 */
		onExit: function() {

		}

	});

});