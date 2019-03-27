sap.ui.define([
	'Mortgage-App/controller/BaseController',
	"sap/ui/model/json/JSONModel",
	'Mortgage-App/model/models',
	'sap/m/MessageBox'
], function(BaseController, JSONModel, models, MessageBox) {
	"use strict";

	return BaseController.extend("Mortgage-App.controller.Home", {
		onInit: function() {
			this.openLocationSystem();
			var lat = this.getGlobalModel().getProperty("/lat");
			var lng = this.getGlobalModel().getProperty("/lng");
			this.getBestShop(lat, lng);
			this.getBestSaleItem(lat, lng);
			var userId = this.getGlobalModel().getProperty("/accountId");
			this.getCountNoti(userId);
		},

		getBestShop: function(lat, lng) {
			var getData = models.getBestShop(lat, lng);
			if (getData) {
				var oModelShop = new JSONModel();
				oModelShop.setData({
					results: getData
				});
				this.setModel(oModelShop, "oModelShop");
			}
		},

		getBestSaleItem: function(lat, lng) {
			var getData = models.getBestSaleItem(lat, lng);
			if(getData) {
				var oModelShop = new JSONModel();
				oModelShop.setData({
					results: getData
				});
				this.setModel(oModelShop, "oModelSaleItem");
			}
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
		
		navToSaleItem: function() {
			// this.getRouter().navTo("searchFilterItem");
			this.getRouter().navTo("activate", {
				token: 123
			});
		},
		
		selectSaleItem: function(oEvent) {
			var item = oEvent.getSource();
			var bindingContext = item.getBindingContext("oModelSaleItem");
			if (bindingContext) {
				var itemId = bindingContext.getProperty("id");
				this.getRouter().navTo("itemDetail", {
					itemId: itemId
				}, false);
			}
		},
		
		navToRegisterShop: function() {
			var isLogging = localStorage.getItem("isLogging");
			if(isLogging) {
				this.getRouter().navTo("registerShop");
			} else {
				MessageBox.error("Bạn cần Đăng nhập để tiếp tục Đăng kí trở thành Chủ Shop trong hệ thống!");
			}
		}
	});

});