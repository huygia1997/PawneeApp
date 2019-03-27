sap.ui.define([
	'Mortgage-App/controller/BaseController',
	"sap/ui/model/json/JSONModel",
	'Mortgage-App/model/models'
], function(BaseController, JSONModel, models) {
	"use strict";

	var gMap;
	return BaseController.extend("Mortgage-App.controller.ShopDetail", {
		onInit: function() {
			var oRouter = this.getRouter();

			this.getView().byId("map").addStyleClass("myMap");
			oRouter.getRoute("shopDetail").attachPatternMatched(this._onRouteMatched, this);

		},

		_onRouteMatched: function(oEvent) {
			var shopId = oEvent.getParameter("arguments").shopId;
			var userId = this.getGlobalModel().getProperty("/accountId");
			var data = models.getShopDetail(shopId, userId);
			if (data) {
				this.getDataShop(data);
				this.getCateItem(data);
			}
		},

		getDataShop: function(res) {
			var lat = res.latitude,
				lng = res.longtitude;
			var dataShopDetail = new JSONModel({
				shopName: res.shopName,
				phoneNumber: res.phoneNumber,
				fullAddress: res.fullAddress,
				facebook: res.facebook,
				viewCount: res.viewCount,
				avaUrl: res.avaUrl,
				rating: res.rating,
				lat: res.latitude,
				lng: res.longtitude,
				policy: res.policy
			});
			this.setModel(dataShopDetail, "dataShopDetail");

			this.setLocationShop(lat, lng);
		},

		getCateItem: function(res) {
			var cateItem = new JSONModel();
			cateItem.setData({
				results: res.categoryItems
			});
			this.setModel(cateItem, "cateItem");
		},

		setLocationShop: function(lat, lng) {
			var latLong = new google.maps.LatLng(lat, lng);
			if (!this.marker) {
				this.marker = new google.maps.Marker({
					position: latLong,
					map: gMap
				});
				this.marker.setMap(gMap);
			} else {
				this.marker.setPosition(latLong);
			}
			gMap.setZoom(15);
			gMap.setCenter(this.marker.getPosition());
		},

		navToGGMap: function() {
			var lat = this.getModel("dataShopDetail").getData().lat;
			var lng = this.getModel("dataShopDetail").getData().lng;
			var url = "https://www.google.com/maps/dir//" + lat + "," + lng;
			sap.m.URLHelper.redirect(url, true);
		},

		backToPrevious: function() {
			this.back();
		},

		onAfterRendering: function() {
			var mapOptions = {
				center: new google.maps.LatLng(0, 0),
				zoom: 1,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			gMap = new google.maps.Map(this.getView().byId("map").getDomRef(), mapOptions);
		}
	});

});