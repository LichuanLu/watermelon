define(['utils/reqcmd', 'lodash', 'marionette', 'templates', 'dust', 'dustMarionette', "bootstrap"], function(ReqCmd, Lodash, Marionette, Templates) {
	// body...
	"use strict";
	var HospitalUserPageView = Marionette.Layout.extend({
		initialize: function() {
			console.log("init HospitalUserPageView");
			this.bindUIElements();
		},
		regions: {
		},
		el: "#hospital-user-content",
		ui: {
		},
		events: {
		},
		attachEndHandler: function() {

		}

	});


	return {
		HospitalUserPageView: HospitalUserPageView
	}
});