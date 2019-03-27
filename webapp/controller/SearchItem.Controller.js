sap.ui.define([
	'Mortgage-App/controller/BaseController',
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	var arrayKey = [];
	return BaseController.extend("Mortgage-App.controller.SearchItem", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Mortgage-App.view.Search
		 */
		onInit: function() {
			
		},

		onSearch: function(oEvent) {
			var value = oEvent.getParameter("query");
			if (value) {
				this.getRouter().navTo("resultSearchItem", {
					query: value
				});
				var getValue = this.getView().byId("searchField");
				getValue.setProperty("value", "");
			}

			var keyLocalStorage = localStorage.getItem("query_item");
			if (keyLocalStorage) {
				// remove localStorage
				localStorage.removeItem("query_item");
				// convert String to array
				arrayKey = keyLocalStorage.split(",");
				var hasValue = false;
				for (var i = 0; i < arrayKey.length; i++) {
					if (arrayKey[i] === value) {
						// duplicate keyword
						hasValue = true;
					}
				}
				if (!hasValue) {
					if (arrayKey.length >= 5) {
						for (var j = 0; j < arrayKey.length; j++) {
							if (j <= 3) {
								arrayKey[j] = arrayKey[j + 1];
							} else {
								arrayKey[j] = value;
							}
						}
					} else {
						arrayKey.push(value);
					}
				}

				localStorage.setItem("query_item", arrayKey);
				// console.log(arrayKey);
			} else {
				// set keyword to localStorage
				localStorage.setItem("query_item", value);
			}
			this.getKeywordWasSearch();

		},

		navToResultKeyword: function(oEvent) {
			var getSource = oEvent.getSource();
			var getBindingContext = getSource.getBindingContext("keyword");
			var getPath = getBindingContext.getProperty("");
			if (getPath) {
				this.getRouter().navTo("resultSearchItem", {
					query: getPath
				});
			}
		},

		getKeywordWasSearch: function() {
			var arr = [];
			var oModel = new JSONModel();
			var keyword = localStorage.getItem("query_item");
			// convert String to array
			arr = keyword.split(",");
			oModel.setData({
				results: arr
			});
			this.setModel(oModel, "keyword");
			// console.log(oModel);
		},
		
		navToSearchShop: function() {
			this.getRouter().navTo("searchShop");
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf Mortgage-App.view.Search
		 */
		onBeforeRendering: function() {

		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Mortgage-App.view.Search
		 */
		onAfterRendering: function() {
			this.getKeywordWasSearch();
		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Mortgage-App.view.Search
		 */
		onExit: function() {

		}

	});

});