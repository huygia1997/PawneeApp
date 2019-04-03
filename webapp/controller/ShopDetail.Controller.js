sap.ui.define([
	'Mortgage-App/controller/BaseController',
	"sap/ui/model/json/JSONModel",
	'Mortgage-App/model/models',
	'sap/m/MessageBox'
], function(BaseController, JSONModel, models, MessageBox) {
	"use strict";
	var arrayList = [];
	var gMap;
	return BaseController.extend("Mortgage-App.controller.ShopDetail", {
		onInit: function() {
			var oRouter = this.getRouter();

			this.getView().byId("map").addStyleClass("myMap");
			oRouter.getRoute("shopDetail").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function(oEvent) {
			var shopId = oEvent.getParameter("arguments").shopId;
			var userId = localStorage.getItem("uid");
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
				id: res.id,
				shopName: res.shopName,
				phoneNumber: res.phoneNumber,
				fullAddress: res.fullAddress,
				facebook: res.facebook,
				viewCount: res.viewCount,
				avaUrl: res.avaUrl,
				rating: res.rating,
				lat: res.latitude,
				lng: res.longtitude,
				policy: res.policy,
				checkFavorite: res.checkFavorite,
				checkRate: res.checkRate
			});
			this.setModel(dataShopDetail, "dataShopDetail");
			// console.log(dataShopDetail);
			this.setLocationShop(lat, lng);
			this.visibleButton();
		},

		openDialogRating: function() {
			if (!this._RatingDialog) {
				this._RatingDialog = sap.ui.xmlfragment(this.getId(), "Mortgage-App.fragment.RatingBox",
					this);
				var ratingDialogModel = new JSONModel();
				this._RatingDialog.setModel(ratingDialogModel, "ratingResult");
				//Set models which is belonged to View to Fragment
				this.getView().addDependent(this._RatingDialog);
			}
			this._RatingDialog.open();
		},

		changeRating: function(oEvent) {
			var rate = oEvent.getSource().getProperty("value");
			var accountId = localStorage.getItem("uid");
			var shopId = this.getModel("dataShopDetail").getProperty("/id");

			var rating = models.ratingShop(rate, accountId, shopId);
			if (rating) {
				this.getModel("dataShopDetail").setProperty("/isRating", true);
			}
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

		visibleButton: function() {
			// var getCheckInLocal = localStorage.getItem("checkF");
			var checkF = this.getModel("dataShopDetail").getProperty("/checkFavorite");
			var checkRating = this.getModel("dataShopDetail").getProperty("/checkRate");
			var idUser = localStorage.getItem("uid");
			// var shopId = this.getModel("dataShopDetail").getProperty("/id");
			// hien nut quan tam

			if (checkF == true) {
				// arrayList = getCheckInLocal.split(",");
				// for (var i = 0; i < arrayList.length; i++) {
				// 	if (arrayList[i] == shopId) {
				// 		// hien button bo quan tam
				// 		this.getModel("dataShopDetail").setProperty("/check", true);
				// 	} 
				// }
				this.getModel("dataShopDetail").setProperty("/check", true);
			} else if (checkF == false) {
				this.getModel("dataShopDetail").setProperty("/check", false);
			} else {
				this.getView().byId("btn_visible_favorite").addStyleClass("display_none");
				this.getView().byId("btn_visible_unFavorite").addStyleClass("display_none");
			}
			if (!idUser) {
				this.getView().byId("check_rating").addStyleClass("display_none");
				this.getView().byId("check_policy").addStyleClass("display_none");
				this.getView().byId("check_view").addStyleClass("display_none");
			} else {
				this.getView().byId("check_rating").removeStyleClass("display_none");
				this.getView().byId("check_policy").removeStyleClass("display_none");
				this.getView().byId("check_view").removeStyleClass("display_none");
			}
			if (checkRating == true) {
				this.getView().byId("btn_visible_rating").addStyleClass("display_none");
			}
		},

		interestedShop: function() {
			var userId = localStorage.getItem("uid");
			var shopId = this.getModel("dataShopDetail").getProperty("/id");
			// var getCheckInLocal = localStorage.getItem("checkF");
			var checkFavorite = models.checkFavorite(shopId, userId);
			if (userId != null) {
				// if (!getCheckInLocal) {
				// 	if (checkFavorite === "success") {
				// 		MessageBox.success("Cảm ơn bạn đã quan tâm đến Cửa hàng!");
				// 		this.getModel("dataShopDetail").setProperty("/check", true);
				// 		localStorage.setItem("checkF", shopId);
				// 	}
				// } else {
				// 	localStorage.removeItem("checkF");
				// 	arrayList = getCheckInLocal.split(",");
				// 	if (checkFavorite === "success") {
				// 		MessageBox.success("Cảm ơn bạn đã quan tâm đến Cửa hàng!");
				// 		this.getModel("dataShopDetail").setProperty("/check", true);
				// 		arrayList.push(shopId);
				// 		localStorage.setItem("checkF", arrayList);
				// 	}
				// }
				if (checkFavorite === "success") {
					MessageBox.success("Cảm ơn bạn đã quan tâm đến Cửa hàng!");
					this.getModel("dataShopDetail").setProperty("/check", true);
					// localStorage.setItem("checkF", shopId);
				}
			} else {
				MessageBox.error("Bạn phải đăng nhập mới sử dụng được chức năng này!");
			}
		},

		unInterestedShop: function() {
			var userId = localStorage.getItem("uid");
			var shopId = this.getModel("dataShopDetail").getProperty("/id");
			// var getCheckInLocal = localStorage.getItem("checkF");
			// if (arrayList.length) {
			// 	arrayList = getCheckInLocal.split(",");
			// }
			var checkUnFavorite = models.checkUnFavorite(shopId, userId);
			if (checkUnFavorite === "success") {
				// var newArray = [];
				// localStorage.removeItem("checkF");
				this.getModel("dataShopDetail").setProperty("/check", false);
				// for (var i = 0; i < arrayList.length; i++) {
				// 	if (arrayList[i] != shopId) {
				// 		newArray.push(arrayList[i]);
				// 	}
				// }
				// localStorage.setItem("checkF", newArray);
				MessageBox.success("Đã bỏ Quan tâm!");
			}
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