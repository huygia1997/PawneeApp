sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"Mortgage-App/model/models",
	"sap/ui/model/json/JSONModel"
], function(UIComponent, Device, models, JSONModel) {
	"use strict";

	return UIComponent.extend("Mortgage-App.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			
			var globalModel = new JSONModel({
				"accountId": "",
				"roleId": "",
				"username": "",
				"password": "",
				"lat": null,
				"lng": null
			});
			
			this.setModel(models.createNotiModel(), "noti");
			this.setModel(globalModel, "globalProperties");
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			// create the views based on the url/hash
			this.getRouter().initialize();
		},
		
		getContentDensityClass: function() {
			if (!this._sContentDensityClass) {
				if (!Device.support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}
	});

});