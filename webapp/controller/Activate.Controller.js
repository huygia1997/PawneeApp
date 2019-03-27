sap.ui.define([
	'Mortgage-App/controller/BaseController',
	"sap/ui/model/json/JSONModel",
	'Mortgage-App/model/models'
], function(BaseController, JSONModel, models) {
	"use strict";

	return BaseController.extend("Mortgage-App.controller.ItemDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Mortgage-App.view.SearchFilterShop
		 */
		onInit: function() {
			var oRouter = this.getRouter();
			var activateModel = new JSONModel({
				text: "",
				isActivate: false
			});
			this.setModel(activateModel, "activateModel");

			oRouter.getRoute("activate").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function(oEvent) {
			var token = oEvent.getParameter("arguments").token;
			var data = models.checkActivate(token);
			var getModel = this.getModel("activateModel");
			if (data.status === 200) {
				this.getView().byId("text_activate").addStyleClass("un_activate");
				getModel.setProperty("/isActivate", true);
				getModel.setProperty("/text", "Đăng kí tài khoản thành công!");
			} else {
				this.getView().byId("text_activate").addStyleClass("activate");
				getModel.setProperty("/isActivate", false);
				getModel.setProperty("/text", "Đăng kí tài khoản thất bại!");
			}
		},
		
		backHome: function() {
			this.getRouter().navTo("home");
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf Mortgage-App.view.SearchFilterShop
		 */
		onBeforeRendering: function() {

		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Mortgage-App.view.SearchFilterShop
		 */
		onAfterRendering: function() {

		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Mortgage-App.view.SearchFilterShop
		 */
		onExit: function() {

		}

	});

});