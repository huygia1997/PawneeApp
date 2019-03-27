sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel",
	"sap/m/BusyDialog",
	'sap/m/Button',
	'sap/m/MessageToast',
	'sap/m/ResponsivePopover',
	'sap/ui/core/syncStyleClass',
	'sap/m/NotificationListItem',
	'sap/ui/core/CustomData',
	'sap/m/ActionSheet',
	'sap/m/library',
	'sap/m/MessageBox'
], function(Controller, UIComponent, Device, JSONModel, BusyDialog, Button, MessageToast, ResponsivePopover, syncStyleClass,
	NotificationListItem, CustomData, ActionSheet, mobileLibrary, MessageBox) {
	"use strict";

	return Controller.extend("Mortgage-App.controller.BaseController", {
		onInit: function() {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.openLocationSystem();
		},

		openBusyDialog: function(oSetting) {
			if (!this.busyDialog) {
				this.busyDialog = new BusyDialog(oSetting);
			} else {
				this.busyDialog.setTitle(oSetting.title);
				this.busyDialog.getText(oSetting.text);
				this.busyDialog.setShowCancelButton(oSetting.showCancelButton);
			}
			this.busyDialog.open();
		},
		closeBusyDialog: function() {
			if (this.busyDialog) {
				this.busyDialog.close();
			}
		},
		/**
		 * Convenience method for getting the control of view by Id.
		 * @public
		 * @param {string} sId id of the control
		 * @returns {sap.m.control} the control
		 */
		getId: function() {
			return this.getView().getId();
		},
		byId: function(sId) {
			return this.getView().byId(sId);
		},
		getSId: function(id) {
			return this.getView().getId() + "--" + id;
		},
		/**
		 * Convenience method for getting the control of view by Id.
		 * @public
		 * @param {string} sId id of the control
		 * @returns {sap.m.control} the control
		 */
		toast: function(sMessage) {
			return MessageToast.show(sMessage);
		},

		back: function() {
			window.history.back();
		},

		getDevice: function() {
			return Device;
		},
		dialogClose: function(oSource) {
			oSource.close();
		},
		/**
		 * Convenience method for accessing the router in each controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			// if (sName === null || sName === "") {
			// 	return this.getOwnerComponent().getModel("i18n");
			// }
			return this.getView().getModel(sName) || this.getOwnerComponent().getModel(sName);
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		createModel: function(sName) {
			var model = new JSONModel();
			this.getView().setModel(model, sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},
		onDialogClose: function(e) {
			e.getSource().getParent().close();
		},
		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resource model of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		/**
		 * Convenience method to get the global model containing the global state of the app.
		 * @returns {object} the global Propery model
		 */
		getGlobalModel: function() {
			return this.getOwnerComponent().getModel("globalProperties");
		},
		/**
		 * Convenience method to get the global model containing the global state of the app.
		 * @returns {object} the global Propery model
		 */
		getFilterParmeter: function() {
			return this.getOwnerComponent().getModel("globalFilterParam");
		},
		/**
		 * Convenience method to get the global model containing the global state of the app.
		 * @returns {object} the global Propery model
		 */
		getCartModel: function() {
			return this.getOwnerComponent().getModel("CartProperties");
		},
		/**
		 * Convenience method
		 * @returns {object} the application controller
		 */
		getApplication: function() {
			return this.getGlobalModel().getProperty("/application");
		},
		btnBackHome: function() {
			this.getRouter().navTo("home");
		},

		navToLoginPage: function() {
			var isLogging = localStorage.getItem("isLogging");
			if (isLogging) {
				this.getRouter().navTo("userDetail");
			} else {
				this.getRouter().navTo("loginAndRegister");
			}

		},
		navToSearchFilterItem: function() {
			this.getRouter().navTo("searchFilterItem");
		},
		
		navToSearchFilterShop: function() {
			this.getRouter().navTo("searchFilterShop");
		},

		btnSearch: function() {
			this.getRouter().navTo("searchShop");
		},
		btnNoti: function() {
			var oModelNoti = this.getModel("noti");
			oModelNoti.setProperty("/count", "");
			oModelNoti.updateBindings(true);
			var isLogging = localStorage.getItem("isLogging");
			if (isLogging) {
				this.getRouter().navTo("notification");
			} else {
				MessageBox.error("Bạn phải đăng nhập mới sử dụng được chức năng này!");
			}

		},
		validateEmailGlobal: function(email) {

			var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;

			if (!mailregex.test(email)) {
				return false;
			}
			return true;
		},

		getCountNoti: function(userId) {
			var that = this;
			var isLogging = localStorage.getItem("isLogging");
			if (isLogging) {
				var onSuccess = function(res, status, xhr) {
					var oModelNoti = that.getModel("noti");
					oModelNoti.setData(res);

					oModelNoti.setProperty("/count", res.length);
					oModelNoti.updateBindings(true);
				};
				var onError = function(jqXHR, textStatus, errorThrown) {

				};
				$.ajax({
					type: "GET",
					// crossDomain: true,
					// url: "http://172.20.10.2:8080/get-notification",
					url: "model/notifications.json",
					dataType: "json",
					success: onSuccess,
					error: onError
				});
			}
		},

		openLocationSystem: function() {
			var that = this;
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					var lat = position.coords.latitude,
						lng = position.coords.longitude;
					that.getGlobalModel().setProperty("/lat", lat);
					that.getGlobalModel().setProperty("/lng", lng);
				}, function() {
					MessageBox.error("Bạn từ chối chia sẻ vị trí. Hãy bật nó lên để sử dụng chức năng này hoặc sử dụng các công cụ tìm kiếm khác.");
				});
			} else {
				// Browser doesn't support Geolocation
				MessageBox.error("Trình duyệt của bạn không hỗ trợ Geolocation");
			}
		}
	});

});