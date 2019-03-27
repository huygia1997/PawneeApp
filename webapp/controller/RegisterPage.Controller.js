sap.ui.define([
	'Mortgage-App/controller/BaseController',
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageBox',
	'Mortgage-App/model/models'
], function(BaseController, JSONModel, MessageBox, models) {
	"use strict";

	return BaseController.extend("Mortgage-App.controller.RegisterPage", {
		onInit: function() {

		},
		openLoginPage: function() {
			this.getRouter().navTo("loginPage");
		},
		checkToRegister: function() {
			var email = this.getView().byId("input_email").getValue();
			var password = this.getView().byId("input_password").getValue();
			var check = this.validateEmailGlobal(email);
			var checkPass = this.checkPassword();
			if (email === "" || password === "") {
				this.getView().byId("input_email").setValueState(sap.ui.core.ValueState.Error);
				this.getView().byId("input_password").setValueState(sap.ui.core.ValueState.Error);
				MessageBox.error("Không được để trống!");
			} else if (!check) {
				MessageBox.error("Email không đúng định dạng!");
			} else if (!checkPass) {
				MessageBox.error("Mật khẩu không trùng khớp!");
			} else {
				var checkRegister = models.checkRegister(email, password);
				if (checkRegister.status === 200) {
					MessageBox.success("Đăng kí thành công! Mở Email để kích hoạt tài khoản!");
				} else if(checkRegister.status === 406) {
					MessageBox.error("Tài khoản đã được đăng kí!");
				} else {
					MessageBox.error("Đăng kí thất bại!");
				}
			}
		},

		validateEmail: function() {
			var email = this.getView().byId("input_email").getValue();

			var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;

			if (!mailregex.test(email)) {
				this.getView().byId("input_email").setValueState(sap.ui.core.ValueState.Error);
			}
		},

		checkPassword: function() {
			var password = this.getView().byId("input_password").getValue();
			var rePassword = this.getView().byId("input_rePassword").getValue();
			if (password !== rePassword) {
				this.getView().byId("input_rePassword").setValueState(sap.ui.core.ValueState.Error);
				return false;
			}

			return true;
		}
	});

});