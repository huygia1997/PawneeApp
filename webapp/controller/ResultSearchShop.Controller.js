sap.ui.define([
	'Mortgage-App/controller/BaseController',
	"sap/ui/model/json/JSONModel",
	'Mortgage-App/model/models'
], function(BaseController, JSONModel, models) {
	"use strict";

	return BaseController.extend("Mortgage-App.controller.ResultSearchShop", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Mortgage-App.view.Search
		 */
		onInit: function() {
			var oRouter = this.getRouter();

			oRouter.getRoute("resultSearchShop").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function(oEvent) {
			var query = oEvent.getParameter("arguments").query;

			this.getShopByQuery(query);
		},

		getShopByQuery: function(query) {
			var data = models.searchShopByKeyword(query);
			if (data.length) {
				var oModelShop = new JSONModel();
				oModelShop.setData({
					results: data
				});
				this.setModel(oModelShop, "oModelShop");
			}
		},

		navToShopDetail: function(oEvent) {
			var item = oEvent.getSource();
			var bindingContext = item.getBindingContext("oModelShop");
			if (bindingContext) {
				var shopId = bindingContext.getProperty("id");
				this.getRouter().navTo("shopDetail", {
					shopId: shopId
				}, false);
			}
		},

		onSearch: function(oEvent) {
			var value = oEvent.getParameter("query");
			if (value) {
				this.getShopByQuery(value);
			}
			var getValue = this.byId("field_search");
			// console.log(getValue);
			getValue.setProperty("value", "");
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