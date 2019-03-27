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

			oRouter.getRoute("itemDetail").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function(oEvent) {
			var itemId = oEvent.getParameter("arguments").itemId;
			var userId = this.getGlobalModel().getProperty("/accountId");
			var data = models.getItemDetail(itemId, userId);
			if (data) {
				this.setDataItem(data);
			}
		},

		setDataItem: function(res) {
			var oModelItem = new JSONModel({
				name: res.name,
				price: res.price,
				cateName: res.categoryName,
				catePic: res.categoryImgUrl,
				checkFavorite: res.checkFavorite,
				view: res.view,
				pictureURL: res.pictureURL,
				avaUrl: res.avaUrl
			});
			this.setModel(oModelItem, "oModelItem");
			console.log(oModelItem);
		},

		backToPreviousPage: function() {
			this.back();
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