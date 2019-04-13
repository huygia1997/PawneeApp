sap.ui.define([
	"Mortgage-App/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'Mortgage-App/model/models'
], function(BaseController, JSONModel, models) {
	"use strict";

	var gMap, dataLocation = [],
		count = 0,
		markers = [];
	return BaseController.extend("Mortgage-App.controller.NearByLocation", {

		onInit: function() {
			var oRouter = this.getRouter();

			var oModelShop = new JSONModel();
			this.setModel(oModelShop, "oModelShop");

			this.getView().byId("map_canvas").addStyleClass("myMap");
			oRouter.getRoute("nearByLocation").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function(oEvent) {
			this.radius = 5;
			this.lat = oEvent.getParameter("arguments").lat;
			this.lng = oEvent.getParameter("arguments").lng;

			this.getMyMarker(this.lat, this.lng);

			this.getAllMarker(this.lat, this.lng);
		},

		clearMarker: function() {
			for (var i = 0; i < markers.length; i++) {
				markers[i].setMap(null);
			}
			markers = [];
		},

		getMyMarker: function(lat, lng) {
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

		},

		navToSearchFilterShop: function() {
			this.getRouter().navTo("searchFilterShop");
		},

		getAllMarker: function(lat, lng, count) {
			var radius = this.radius;
			var titleModel = new JSONModel();
			this.setModel(titleModel, "titleModel");
			var data = models.getLocationNearBy(lat, lng, radius);
			if (data) {
				for (var i = 0; i < data.length; i++) {
					dataLocation.push(data[i]);
				}
				this.createLocationShop(dataLocation, lat, lng);
			} else {
				this.getModel("titleModel").setProperty("/title", "Không có Cửa hàng nào gần bạn!");
			}
		},

		createLocationShop: function(dataLocal, lat, lng) {
			if (dataLocal !== null) {
				for (var i = 0; i < dataLocal.length; i++) {
					var latShop = dataLocal[i].latitude;
					var lngShop = dataLocal[i].longtitude;
					var address = dataLocal[i].address;
					var fullAddress = address.fullAddress;
					var shopName = dataLocal[i].shopName;
					var shopId = dataLocal[i].id;
					var avatarUrl = dataLocal[i].avatarUrl;
					var data = {
						fullAddress: fullAddress,
						shopName: shopName,
						shopId: shopId,
						avatarUrl: avatarUrl
					};
					var distance = this.calculateDistance(latShop, lngShop, lat, lng);
					if (distance <= 1000) {
						this.getPositionOfMarker(latShop, lngShop, data);
						this.getModel("titleModel").setProperty("/title", "Kết quả tìm kiếm 'gần đây 1km'");
					} else {
						this.getModel("titleModel").setProperty("/title", "Không có Cửa hàng nào gần 1km");
					}
				}
			}
		},

		getPositionOfMarker: function(lat, lng, data) {
			var position = {
				lat: lat,
				lng: lng
			};
			this.addMarker(position, data);
		},

		onfindMorePress: function() {
			if (count < 2) {
				this.clearMarker();
			}
			count++;
			if (count == 3) {
				this.radius = 10;
				this.getAllMarker(this.lat, this.lng);
			}
			for (var i = 0; i < dataLocation.length; i++) {
				var list = dataLocation[i].address;
				var latShop = list.latitude;
				var lngShop = list.longtitude;
				var shopName = dataLocation[i].shopName;
				var shopId = dataLocation[i].id;
				var avatarUrl = dataLocation[i].avatarUrl;
				var data = {
					fullAddress: list.fullAddress,
					shopName: shopName,
					shopId: shopId,
					avatarUrl: avatarUrl
				};
				var distance = this.calculateDistance(latShop, lngShop, this.lat, this.lng);
				if (count == 1) {
					if (distance <= 3000) {
						this.getPositionOfMarker(latShop, lngShop, data);
						this.getModel("titleModel").setProperty("/title", "Kết quả tìm kiếm 'gần đây 3km'");
					}
				} else if (count == 2) {
					if (distance <= 5000) {
						this.getPositionOfMarker(latShop, lngShop, data);
						this.getModel("titleModel").setProperty("/title", "Kết quả tìm kiếm 'gần đây 5km'");
					}
				} else if (count == 3) {
					if (distance <= 10000) {
						this.getPositionOfMarker(latShop, lngShop, data);
						this.getModel("titleModel").setProperty("/title", "Kết quả tìm kiếm 'gần đây 10km'");
					}
				} else {
					this.getModel("titleModel").setProperty("/title", "Chỉ tìm kiếm trong vòng bán kính 10km!");
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

		addMarker: function(position, data) {
			var latLog = new google.maps.LatLng(position.lat, position.lng);
			var marker = new google.maps.Marker({
				position: latLog,
				map: gMap,
				animation: google.maps.Animation.DROP
			});
			markers.push(marker);
			var avatarUrl = data.avatarUrl;
			var shopName = data.shopName;
			var fullAddress = data.fullAddress;
			// var shopId = data.shopId;
			var content = "<div><image class='custom-image-box' src=" + avatarUrl + " /><div class='custom-content-box'><h1>" + shopName +
				"</h1><span>Địa chỉ: </span>" + fullAddress + "</span></div></div>";
			var infowindow = new google.maps.InfoWindow({
				content: content
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