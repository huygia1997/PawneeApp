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

			var oRouter = this.getRouter();

			oRouter.getRoute("searchFilterItem").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function() {
			var oModelItem = new JSONModel();
			this.setModel(oModelItem, "oModelItem");

			this.getBestItem();
			var filterCate = new JSONModel();
			this.setModel(filterCate, "filterCate");
		},

		backToPreviousPage: function() {
			this.back();
		},

		getBestItem: function(sort, page, cateId) {
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
				var dataItemSort = models.getItemBySort(sort, page, cateId);
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

		selectOptionCate: function(oEvent) {
			var item = oEvent.getSource();
			var bindingContext = item.getBindingContext("listResult");
			if (bindingContext) {
				var cateId = bindingContext.getProperty("id");
				this.getModel("filterCate").setProperty("/filter", cateId);

				this.getBestItem(6, 0, cateId);

				this._CateDialog.close();
			}
		},

		openDialogFilterByCate: function() {
			if (!this._CateDialog) {
				this._CateDialog = sap.ui.xmlfragment(this.getId(), "Mortgage-App.fragment.ListCategory",
					this);
				var listDialogModel = new JSONModel();
				var getList = models.getAllCategory();
				listDialogModel.setData({
					results: getList
				});
				this._CateDialog.setModel(listDialogModel, "listResult");
				//Set models which is belonged to View to Fragment
				this.getView().addDependent(this._CateDialog);
			}
			this._CateDialog.open();
		},

		openDialogSort: function() {
			if (!this._SortDialog) {
				this._SortDialog = sap.ui.xmlfragment(this.getId(), "Mortgage-App.fragment.SortBox",
					this);
				var sortDialogModel = new JSONModel();
				var getSort = models.getListSortItem();
				sortDialogModel.setData({
					results: getSort
				});
				this._SortDialog.setModel(sortDialogModel, "sortResult");
				//Set models which is belonged to View to Fragment
				this.getView().addDependent(this._SortDialog);
			}
			this._SortDialog.open();
		},

		selectOptionSort: function(oEvent) {
			var item = oEvent.getSource();
			var bindingContext = item.getBindingContext("sortResult");
			if (bindingContext) {
				var sortId = bindingContext.getProperty("sortId");
				var cateId = this.getModel("filterCate").getProperty("/filter");

				this.getBestItem(sortId, 0, cateId);

				this._SortDialog.close();
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
