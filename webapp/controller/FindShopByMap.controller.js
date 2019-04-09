sap.ui.define([
	'Mortgage-App/controller/BaseController',
	"sap/ui/model/json/JSONModel",
	'Mortgage-App/model/models',
	'sap/m/MessageBox'
], function(BaseController, JSONModel, models, MessageBox) {
	"use strict";
	var gMap;
	return BaseController.extend("Mortgage-App.controller.SearchFilterShop", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Mortgage-App.view.SearchFilterShop
		 */
		onInit: function() {
			var oRouter = this.getRouter();
			var oModel = new sap.ui.model.json.JSONModel();
			this.setModel(oModel, "dataCity");

			var oModelShop = new JSONModel();
			this.setModel(oModelShop, "oModelShop");

			var oModelMap = new JSONModel();
			this.setModel(oModelMap, "oModelMap");

			this.getView().byId("map").addStyleClass("myMap");
			oRouter.getRoute("findShopByMap").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function(oEvent) {
			var dis = oEvent.getParameter("arguments").dis;
			var cate = oEvent.getParameter("arguments").cate;
			this.getModel("oModelMap").setProperty("/dis", dis);
			this.getModel("oModelMap").setProperty("/cate", cate);
			this.getAllShop();

		},

		getAllShop: function() {
			var data;
			var dis = this.getModel("oModelMap").getProperty("/dis");
			var cate = this.getModel("oModelMap").getProperty("/cate");
			data = models.getAllShopByFilterOfMap(cate, dis);
			if (data.length > 0) {
				for (var i = 0; i < data.length; i++) {
					this.getPositionOfMarker(data[i]);
				}
			} else {
				MessageBox.information("Không có cửa hàng!");
			}
		},

		navToNearByLocation: function() {
			var lat = this.getGlobalModel().getProperty("/lat");
			var lng = this.getGlobalModel().getProperty("/lng");
			if (lat && lng) {
				this.getRouter().navTo("nearByLocation", {
					lat: lat,
					lng: lng
				}, false);
			} else {
				MessageBox.information("Bạn phải chia sẻ định vị mới sử dụng chức năng này!");
			}
		},

		searchPlaceByForm: function() {
			var keyDistrics = this.getView().byId("filterDistrict").getSelectedItem().getKey();
			var keyItem = this.getView().byId("filterItem").getSelectedItem().getKey();

			this.getModel("oModelMap").setProperty("/dis", keyDistrics);
			this.getModel("oModelMap").setProperty("/cate", keyItem);

			this.getAllShop();
			this._FilterDialog.close();
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

		getDataCategory: function() {
			var arrayOfHuy = [];
			var dataCate = models.getDataCategory();
			var objAll = {
				categoryName: "Tất cả"
			};
			arrayOfHuy.push(objAll);
			if (dataCate) {
				for (var i = 0; i < dataCate.length; i++) {
					arrayOfHuy.push(dataCate[i]);
				}
				var oModelCate = new JSONModel();
				oModelCate.setData({
					results: arrayOfHuy
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

		getPositionOfMarker: function(data) {
			var location = data.address;
			var latLog = new google.maps.LatLng(location.latitude, location.longtitude);
			var marker = new google.maps.Marker({
				position: latLog,
				map: gMap,
				animation: google.maps.Animation.DROP
			});
			var content = "<div><image class='custom-image-box' src=" + data.avatarUrl + " /><div class='custom-content-box'><h1>" + data.shopName +
				"</h1><span>" + data.address.fullAddress +"</span></div></div>";
			var infowindow = new google.maps.InfoWindow({
				// content: data.shopName
				content: content
			});
			marker.addListener('click', function() {
				infowindow.open(gMap, marker);
			});
			gMap.setZoom(13);
			gMap.setCenter(marker.getPosition());
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
			var mapOptions = {
				center: new google.maps.LatLng(0, 0),
				zoom: 1,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			gMap = new google.maps.Map(this.getView().byId("map").getDomRef(), mapOptions);
		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Mortgage-App.view.SearchFilterShop
		 */
		onExit: function() {

		}

	});

});