sap.ui.define([
	'Mortgage-App/controller/BaseController',
	"sap/ui/model/json/JSONModel",
	'Mortgage-App/model/models'
], function(BaseController, JSONModel, models) {
	"use strict";

	return BaseController.extend("Mortgage-App.controller.SearchFilterShop", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Mortgage-App.view.SearchFilterShop
		 */
		onInit: function() {

			var oModel = new sap.ui.model.json.JSONModel();
			this.setModel(oModel, "dataCity");

			var oModelShop = new JSONModel();
			this.setModel(oModelShop, "oModelShop");

			var keyOfDialog = new JSONModel({
				"keyDis": "",
				"keyCate": "",
				"isFiltering": 1
			});
			this.setModel(keyOfDialog, "keyOfDialog");
			this.getBestShop();
		},

		_onRouteMatched: function() {

		},

		getDataCategory: function() {
			var dataCate = models.getDataCategory();
			if (dataCate) {
				var oModelCate = new JSONModel();
				oModelCate.setData({
					results: dataCate
				});
				this.setModel(oModelCate, "dataCate");
			}
		},

		getDataCity: function() {
			//get data city
			var dataCiti = models.getDataCity();
			if (dataCiti) {
				var oModelCiti = this.getModel("dataCity");

				oModelCiti.setProperty("/results", dataCiti);
				oModelCiti.setProperty("/selectedCity", dataCiti[0].id);
				oModelCiti.updateBindings();
			}
			//get data district
			var dataDistrict = models.getDataDistrict();
			if (dataDistrict) {
				var dataDis = [];
				for (var i = 0; i < dataDistrict.length; i++) {
					dataDis.push(dataDistrict[i]);
				}

				var oModelDis = new JSONModel();
				oModelDis.setData({
					results: dataDis
				});
				this.setModel(oModelDis, "dataDis");
				this.onChangeCity();
			}
		},

		getDistrictByCity: function(cityId) {
			var filters = [];
			var cityIdFilter = new sap.ui.model.Filter({
				path: "cityId",
				operator: "EQ",
				value1: cityId
			});
			filters.push(cityIdFilter);
			this.byId("filterDistrict").getBinding("items").filter(filters);
		},

		onChangeCity: function() {
			var cityModel = this.getModel("dataCity");
			if (cityModel) {
				// var cityContext = this.getView().byId("filterCity").getSelectedItem().getKey();
				var keyCity = cityModel.getProperty("/selectedCity");
				this.getDistrictByCity(keyCity);
			}
		},

		backToPreviousPage: function() {
			this.back();
		},

		getBestShop: function(page, sort) {
			this.getModel("oModelShop").setData(null);
			this.getModel("oModelShop").updateBindings();
			// check was filter or sort
			var check = this.getModel("keyOfDialog").getProperty("/isFiltering");

			if (check === 1) {
				var lat = this.getGlobalModel().getProperty("/lat");
				var lng = this.getGlobalModel().getProperty("/lng");
				var dataBestShop = models.getBestShop(lat, lng);
				if (dataBestShop) {
					var oModelShop = this.getModel("oModelShop");
					oModelShop.setData({
						results: dataBestShop
					});
				}
			} else if (check === 2) {
				var keyModel = this.getModel("keyOfDialog");
				var dis = keyModel.getProperty("/keyDis");
				var cate = keyModel.getProperty("/keyCate");
				var dataFilterShop = models.getShopByFilter(cate, dis);
				if (dataFilterShop) {
					var oModelFilterShop = this.getModel("oModelShop");
					oModelFilterShop.setData({
						results: dataFilterShop
					});
				}
			} else {
				var dataSortShop = models.getShopBySort(page, sort);
				if(dataSortShop) {
					var oModelSortShop = this.getModel("oModelShop");
					oModelSortShop.setData({
						results: dataSortShop
					});
				}
			}
		},

		navToNearByLocation: function() {
			var lat = this.getGlobalModel().getProperty("/lat");
			var lng = this.getGlobalModel().getProperty("/lng");
			this.getRouter().navTo("nearByLocation", {
				lat: lat,
				lng: lng
			}, false);
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

		openDialogFilter: function() {
			if (!this._FilterDialog) {
				this._FilterDialog = sap.ui.xmlfragment(this.getId(), "Mortgage-App.fragment.FilterBox",
					this);
				var filterDialogModel = new JSONModel();
				this._FilterDialog.setModel(filterDialogModel, "filterResult");
				//Set models which is belonged to View to Fragment
				this.getView().addDependent(this._FilterDialog);
				/** Get data **/
				this.getDataCity();
				this.getDataCategory();
				/***************************************************/
			}
			this._FilterDialog.open();
		},

		searchPlaceByForm: function() {
			this.getModel("keyOfDialog").setProperty("/isFiltering", 2);

			var keyDistrics = this.getView().byId("filterDistrict").getSelectedItem().getKey();
			var keyItem = this.getView().byId("filterItem").getSelectedItem().getKey();

			this.getModel("keyOfDialog").setProperty("/keyDis", keyDistrics);
			this.getModel("keyOfDialog").setProperty("/keyCate", keyItem);

			this.getBestShop();
			this._FilterDialog.close();
		},

		onChangeSort: function() {
			var selectText = this.getView().byId("filterSort").getSelectedItem().getText();
			switch (selectText) {
				case "Tất cả":
					this.getModel("keyOfDialog").setProperty("/isFiltering", 3);
					this.getBestShop(0, 3);
					break;
				case "Xếp hạng":
					this.getModel("keyOfDialog").setProperty("/isFiltering", 3);
					this.getBestShop(0, 1);
					break;
				case "Đề xuất":
					this.getModel("keyOfDialog").setProperty("/isFiltering", 1);
					this.getBestShop();
					break;
				case "Lượt xem":
					this.getModel("keyOfDialog").setProperty("/isFiltering", 3);
					this.getBestShop(0, 2);
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