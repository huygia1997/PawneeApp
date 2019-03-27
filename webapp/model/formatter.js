sap.ui.define([
	"sap/ui/core/ValueState"
], function(ValueState) {
	"use strict";
	return {
		transStatusState: function(sStatus) {
			switch (sStatus) {
				case 1: //NOT_OVERDUE
					return ValueState.Information;
				case 2: //WAIT_FOR_LIQUIDATION
					return ValueState.Error;
				case 3: //ON_DUE_DATE
					return ValueState.Warning;
				case 4: //REDEEMED
					return ValueState.Success;
				case 5: //LATE
					return ValueState.Error;
				case 6: //LIQUIDATION
					return ValueState.Success;
				case 7: //CANCELED
					return ValueState.None;
				default:
					return ValueState.None;
			}
		},
		transStatusDesc: function(sStatus) {
			var i18n = this.getResourceBundle();
			switch (sStatus) {
				case 1:
					return i18n.getText('NOT_OVERDUE'); //Information
				case 2:
					return i18n.getText('WAIT_FOR_LIQUIDATION'); //Accept
				case 3:
					return i18n.getText('ON_DUE_DATE'); //Warning
				case 4:
					return i18n.getText('REDEEMED'); // Neutral
				case 5:
					return i18n.getText('LATE'); //critical
				case 6:
					return i18n.getText('LIQUIDATION'); //Information
				case 7:
					return i18n.getText('CANCELED'); // Neutral
				default:
					return "";
			}
		},
		status: function(sStatus) {
			switch (sStatus) {
				case 1:
					return sap.ui.core.ValueState.Success;
				case 2:
					return sap.ui.core.ValueState.Warning;
				case 3:
					return sap.ui.core.ValueState.Error;
				default:
					return sap.ui.core.ValueState.None;
			}
		},
		statusNoti: function(status) {
			switch (status) {
				case 1:
					return "sap-icon://message-success";
				case 2:
					return "sap-icon://message-warning";
				case 3:
					return "sap-icon://message-error";
			}
		},
		intBoolRandomizer: function(iRandom) {
			return iRandom % 2 === 0;
		},
		favorite: function(sStatus) {
			return sStatus.length % 2 === 0;
		}
	};
});