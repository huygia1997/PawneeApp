sap.ui.define([
	'Mortgage-App/controller/BaseController',
	"sap/ui/model/json/JSONModel",
	'Mortgage-App/model/models',
	'sap/m/MessageBox'
], function(BaseController, JSONModel, models, MessageBox) {
	"use strict";

	return BaseController.extend("Mortgage-App.controller.RegisterShop", {
		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			this.setModel(oModel, "dataCity");
			
			this.getDataCity();
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
			console.log(dataDistrict);
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
	});

});