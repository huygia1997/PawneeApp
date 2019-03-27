sap.ui.define([
	'Mortgage-App/controller/BaseController',
	"sap/ui/model/json/JSONModel",
	"Mortgage-App/model/formatter",
	'Mortgage-App/model/models'
], function(BaseController, JSONModel, formatter, models) {
	"use strict";

	return BaseController.extend("Mortgage-App.controller.Notification", {
		
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Mortgage-App.view.Search
		 */
		onInit: function() {
			this.getAllNoti();
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf Mortgage-App.view.Search
		 */
		 
		 getAllNoti: function() {
		 	var id = localStorage.getItem("uid");
		 	console.log(id);
		 	var data = models.getNotifications(id);
		 	if(data) {
		 		var oModel = new JSONModel();
				oModel.setData({
					results: data
				});
				this.setModel(oModel, "dataNotify");
		 	}
		 },
		 
		 selectNotify: function(oEvent) {
		 	var getSource = oEvent.getSource();
		 	var bindingContext = getSource.getBindingContext("dataNotify");
		 	if(bindingContext) {
		 		var objId = bindingContext.getProperty("objectId");   
		 		this.getRouter().navTo("notificationDetail", {
					objId: objId
				}, false);
		 	}
		 },
		 
		onBeforeRendering: function() {

		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Mortgage-App.view.Search
		 */
		onAfterRendering: function() {

		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Mortgage-App.view.Search
		 */
		onExit: function() {

		}

	});

});