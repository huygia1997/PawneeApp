sap.ui.define([
	"Mortgage-App/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'Mortgage-App/model/models'
], function(BaseController, JSONModel, models) {
	"use strict";

	var gMap, dataLocation = [],
		count = 0;
	return BaseController.extend("Mortgage-App.controller.NearByLocation", {

		onInit: function() {
			var oRouter = this.getRouter();
			var oModel = new sap.ui.model.json.JSONModel();
			this.setModel(oModel, "dataCity");

			var oModelShop = new JSONModel();
			this.setModel(oModelShop, "oModelShop");

			var keyOfDialog = new sap.ui.model.json.JSONModel({
				"keyDis": "",
				"keyCate": "",
				"isFiltering": false
			});
			this.setModel(keyOfDialog, "keyOfDialog");

			this.getView().byId("map_canvas").addStyleClass("myMap");
			oRouter.getRoute("nearByLocation").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function(oEvent) {
			this.lat = oEvent.getParameter("arguments").lat;
			this.lng = oEvent.getParameter("arguments").lng;

			this.getMyMarker(this.lat, this.lng);

			this.getAllMarker(this.lat, this.lng);
		},

		getMyMarker: function(lat, lng) {
			var checkFilter = this.getModel("keyOfDialog").getProperty("/isFiltering");
			if (checkFilter === false) {
				var latLong = new google.maps.LatLng(lat, lng);
				var currentPos = new google.maps.Marker({
					position: latLong,
					map: gMap,
					icon: {
						url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
					}
				});
				gMap.setZoom(15);
				gMap.setCenter(currentPos.getPosition());
			}
			// else {

			// }

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
			var keyDistrics = this.getView().byId("filterDistrict").getSelectedItem().getKey();
			var keyItem = this.getView().byId("filterItem").getSelectedItem().getKey();

			this.getModel("keyOfDialog").setProperty("/keyDis", keyDistrics);
			this.getModel("keyOfDialog").setProperty("/keyCate", keyItem);

			this._FilterDialog.close();
		},

		navToSearchFilterShop: function() {
			this.getRouter().navTo("searchFilterShop");
		},

		getAllMarker: function(lat, lng, count) {
			var titleModel = new JSONModel();
			this.setModel(titleModel, "titleModel");
			var data = models.getLocationNearBy(lat, lng);
			if (!data) {
				this.getModel("titleModel").setProperty("/title", "Không có Cửa hàng nào gần bạn!");
			} else {
				for (var i = 0; i < data.length; i++) {
					dataLocation.push(data[i]);
				}
				this.createLocationShop(dataLocation, lat, lng);
			}
		},

		createLocationShop: function(dataLoca, lat, lng) {
			for (var i = 0; i < dataLoca.length; i++) {
				var latShop = dataLoca[i].latitude;
				var lngShop = dataLoca[i].longtitude;
				var shopName = dataLoca[i].shopName;
				var distance = this.calculateDistance(latShop, lngShop, lat, lng);
				if (distance <= 1000) {
					this.getPositionOfMarker(latShop, lngShop, shopName);
					this.getModel("titleModel").setProperty("/title", "Kết quả tìm kiếm 'gần đây 1km'");
				} else {
					this.getModel("titleModel").setProperty("/title", "Không có Cửa hàng nào gần 1km");
				}
			}
		},

		getPositionOfMarker: function(lat, lng, shopName) {
			var position = {
				lat: lat,
				lng: lng
			};
			this.addMarker(position, shopName);
		},

		findMore: function() {
			count++;
			for (var i = 0; i < dataLocation.length; i++) {
				var latShop = dataLocation[i].latitude;
				var lngShop = dataLocation[i].longtitude;
				var shopName = dataLocation[i].shopName;
				var distance = this.calculateDistance(latShop, lngShop, this.lat, this.lng);
				if (count == 1) {
					if (distance <= 3000) {
						this.getPositionOfMarker(latShop, lngShop, shopName);
						this.getModel("titleModel").setProperty("/title", "Kết quả tìm kiếm 'gần đây 3km'");
					}
				} else if (count == 2) {
					if (distance <= 5000) {
						this.getPositionOfMarker(latShop, lngShop, shopName);
						this.getModel("titleModel").setProperty("/title", "Kết quả tìm kiếm 'gần đây 5km'");
					}
				} else {
					this.getModel("titleModel").setProperty("/title", "Chỉ tìm kiếm trong vòng bán kính 5km!");
				}
			}
		},

		calculateDistance: function(latShop, longShop, locationLat, locationLong) {
			var R = 6371e3; // metres
			var φ1 = this.toRadians(locationLat);
			var φ2 = this.toRadians(latShop);
			var Δφ = this.toRadians(latShop - locationLat);
			var Δλ = this.toRadians(longShop - locationLong);

			var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
				Math.cos(φ1) * Math.cos(φ2) *
				Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

			var d = R * c;

			return d;
		},

		toRadians: function(deg) {
			var pi = Math.PI;
			return deg * (pi / 180);
		},

		setAllMarkers: function() {
			for (var i = 0; i < this.markers.length; i++) {
				this.markers[i].setMap(gMap);
			}
		},

		addMarker: function(position, name) {
			var latLog = new google.maps.LatLng(position.lat, position.lng);
			var marker = new google.maps.Marker({
				position: latLog,
				map: gMap,
				animation: google.maps.Animation.DROP
			});
			var infowindow = new google.maps.InfoWindow({
				content: name
			});
			marker.addListener('click', function() {
				infowindow.open(gMap, marker);
			});
			// this.markers.push(marker);
		},

		onAfterRendering: function() {
			var mapOptions = {
				center: new google.maps.LatLng(0, 0),
				zoom: 10,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			gMap = new google.maps.Map(this.getView().byId("map_canvas").getDomRef(), mapOptions);
		}

	});
});