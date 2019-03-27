sap.ui.define([
	'Mortgage-App/controller/BaseController',
	"sap/ui/model/json/JSONModel",
	'Mortgage-App/model/models'
], function(BaseController, JSONModel, models) {
	"use strict";

	return BaseController.extend("Mortgage-App.controller.SearchFilterItem", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Mortgage-App.view.SearchFilterShop
		 */
		onInit: function() {
			var oModelItem = new JSONModel();
			this.setModel(oModelItem, "oModelItem");

			this.getBestItem();
		},

		_onRouteMatched: function() {

		},

		backToPreviousPage: function() {
			this.back();
		},

		getBestItem: function(sort, page) {
			this.getModel("oModelItem").setData(null);
			this.getModel("oModelItem").updateBindings();
			// sort all
			var selectFirstKey = 6;
			if (!sort) {
				var dataItemFirstKey = models.getItemBySort(selectFirstKey, 0);
				if (dataItemFirstKey) {
					var oModelItem = this.getModel("oModelItem");
					oModelItem.setData({
						results: dataItemFirstKey
					});
				}
			} else {
				var dataItemSort = models.getItemBySort(sort, 0);
				if (dataItemSort) {
					var oModelSortItem = this.getModel("oModelItem");
					oModelSortItem.setData({
						results: dataItemSort
					});
				}
			}
		},

		navToItemDetail: function(oEvent) {
			var item = oEvent.getSource();
			var bindingContext = item.getBindingContext("oModelItem");
			if (bindingContext) {
				var itemId = bindingContext.getProperty("id");
				this.getRouter().navTo("itemDetail", {
					itemId: itemId
				}, false);
			}
		},

		onChangeSort: function() {
			var selectText = this.getView().byId("filterSort").getSelectedItem().getText();
			switch (selectText) {
				case "Tất cả":
					this.getBestItem(6, 0);
					break;
				case "Giá thấp nhất":
					this.getBestItem(5, 0);
					break;
				case "Giá cao nhất":
					this.getBestItem(4, 0);
					break;
				case "Lượt thích":
					this.getBestItem(3, 0);
					break;
				case "Lượt xem":
					this.getBestItem(2, 0);
					break;
				case "Sản phẩm mới":
					this.getBestItem(1, 0);
					break;
			}
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