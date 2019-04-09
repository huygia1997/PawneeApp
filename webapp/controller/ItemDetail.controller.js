sap.ui.define([
	'Mortgage-App/controller/BaseController',
	"sap/ui/model/json/JSONModel",
	'Mortgage-App/model/models',
	'sap/m/MessageBox'
], function(BaseController, JSONModel, models, MessageBox) {
	"use strict";

	return BaseController.extend("Mortgage-App.controller.ItemDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Mortgage-App.view.SearchFilterShop
		 */
		onInit: function() {
			var oRouter = this.getRouter();

			oRouter.getRoute("itemDetail").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function(oEvent) {
			var itemId = oEvent.getParameter("arguments").itemId;
			var userId = localStorage.getItem("uid");
			var data = models.getItemDetail(itemId, userId);
			if (data) {
				this.setDataItem(data);
			}
		},

		setDataItem: function(res) {
			var oModelItem = new JSONModel({
				id: res.id,
				name: res.name,
				price: res.price,
				cateName: res.categoryName,
				catePic: res.categoryImgUrl,
				checkFavorite: res.checkFavorite,
				view: res.view,
				pictureURL: res.pictureURL,
				avaUrl: res.avaUrl
			});
			this.setModel(oModelItem, "oModelItem");

			var getUserOfItem = new JSONModel();
			getUserOfItem.setData(res.shop);
			this.setModel(getUserOfItem, "userOfItem");

			var oModelImages = new JSONModel();
			oModelImages.setData({
				results: res.pictureURL
			});
			this.setModel(oModelImages, "oModelImages");
			this.visibleButton();
		},

		backToPreviousPage: function() {
			this.back();
		},

		interestedItem: function() {
			var itemId = this.getModel("oModelItem").getProperty("/id");
			var userId = localStorage.getItem("uid");
			var checkFavorite = models.checkFavoriteItem(itemId, userId);
			if (checkFavorite === "success") {
				MessageBox.success("Cảm ơn bạn đã quan tâm đến Món hàng!");
				this.getModel("oModelItem").setProperty("/check", true);
				// localStorage.setItem("checkF", shopId);
			}
		},

		unInterestedItem: function() {
			var itemId = this.getModel("oModelItem").getProperty("/id");
			var userId = localStorage.getItem("uid");
			var checkUnFavorite = models.checkUnFavoriteItem(itemId, userId);
			if (checkUnFavorite === "success") {
				MessageBox.success("Đã bỏ Quan tâm Món hàng!");
				this.getModel("oModelItem").setProperty("/check", false);
			}
		},

		visibleButton: function() {
			var checkF = this.getModel("oModelItem").getProperty("/checkFavorite");
			var userId = localStorage.getItem("uid");
			if (userId) {
				if (checkF == true) {
					this.getModel("oModelItem").setProperty("/check", true);
				} else if (checkF == false) {
					this.getModel("oModelItem").setProperty("/check", false);
				}
			}
		},

		openDialogShop: function() {
			var idUser = localStorage.getItem("uid");
			if (idUser) {
				if (!this._ShopDialog) {
					this._ShopDialog = sap.ui.xmlfragment(this.getId(), "Mortgage-App.fragment.ShopBox",
						this);
					var filterDialogModel = new JSONModel();
					this._ShopDialog.setModel(filterDialogModel, "filterResult");
					this._ShopDialog.getModel("userOfItem");
					//Set models which is belonged to View to Fragment
					this.getView().addDependent(this._ShopDialog);
				}
				this._ShopDialog.open();
			} else {
				MessageBox.information("Hãy đăng nhập để sử dụng chức năng này!");
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
