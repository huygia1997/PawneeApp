sap.ui.define([
	'Mortgage-App/controller/BaseController',
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("Mortgage-App.controller.LoginAndRegister", {
		onInit: function(){
			
		},
		
		navToRegister: function() {
			this.getRouter().navTo("registerPage");
		},
		
		navToLogin: function() {
			this.getRouter().navTo("loginPage");
		}
	});

});