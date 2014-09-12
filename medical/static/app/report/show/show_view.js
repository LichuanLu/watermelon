define(['utils/reqcmd', 'lodash', 'marionette', 'templates','dust', 'dustMarionette', "bootstrap"], function(ReqCmd, Lodash, Marionette, Templates) {
	// body...
	"use strict";
	var ReportPreviewView = Marionette.Layout.extend({
		initialize: function() {
			console.log("init FollowUserLayoutView");
			this.bindUIElements();
		},
		regions: {},
		el: "#preview-report-content",
		ui: {
		},
		events: {},
		attachEndHandler: function() {
			$('body').show();
		}
	});

	return {
		ReportPreviewView: ReportPreviewView
	}
});