sap.ui.define([
	'Mortgage-App/controller/BaseController',
	'Mortgage-App/model/models',
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageBox'
], function(BaseController, models, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("Mortgage-App.controller.LoginPage", {
		onInit: function() {
			var loginModel = new JSONModel({
				username: "",
				password: "",
				failed: false,
				isLogging: false
			});
			this.setModel(loginModel, "loginModel");
		},

		openRegisterPage: function() {
			this.getRouter().navTo("registerPage");
		},

		validateEmail: function() {
			var emailValue = this.getView().byId("userName").getValue();

			var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;

			if (!mailregex.test(emailValue)) {
				this.getView().byId("userName").setValueState(sap.ui.core.ValueState.Error);
			}
		},

		checkToLogin: function() {
			var emailValue = this.getView().byId("userName").getValue();
			var checkEmail = this.validateEmailGlobal(emailValue);
			var loginModel = this.getModel("loginModel");
			var username = loginModel.getProperty("/username");
			var password = loginModel.getProperty("/password");
			// 
			if (username === "" || password === "") {
				this.getView().byId("userName").setValueState(sap.ui.core.ValueState.Error);
				this.getView().byId("passwordUser").setValueState(sap.ui.core.ValueState.Error);
				MessageBox.error("Không được để trống!");
			} else if (!checkEmail) {
				MessageBox.error("Email không đúng định dạng");
			} else {
				var dataLogin = models.checkLogin(username, password);
				console.log(dataLogin);
				// console.log(dataLogin);
				if (dataLogin.status === 401) {
					localStorage.setItem("isLogging", false);
					MessageBox.error("Email hoặc Mật khẩu không đúng!");
				} else {
					this.getGlobalModel().setProperty("/accountId", dataLogin.id);
					this.getGlobalModel().setProperty("/username", dataLogin.username);
					this.getGlobalModel().setProperty("/role", dataLogin.role);
					this.getGlobalModel().setProperty("/password", dataLogin.password);
					this.getGlobalModel().setProperty("/lat", dataLogin.lat);
					this.getGlobalModel().setProperty("/lng", dataLogin.lng);

					//save_login to LocalStorage
					localStorage.setItem("username", dataLogin.username);
					localStorage.setItem("token", dataLogin.password);
					localStorage.setItem("uid", dataLogin.id);

					this.getRouter().navTo("userDetail");

					setInterval(this.getCountNoti(dataLogin.id), 10000);
					localStorage.setItem("isLogging", true);
				} 
			}
		}
	});

});