'use strict';
define(['utils/reqcmd', 'lodash', 'marionette', 'templates', 'ladda-bootstrap', 'modal/modal_view', 'dust',
	'dustMarionette', "bootstrap", 'bootstrap.select', 'bootstrap-treeview',
	'flat_ui_custom', 'config/validator/config'
], function(ReqCmd, Lodash, Marionette, Templates, ladda, ModalView) {
	var IncomeLayoutView = Marionette.Layout.extend({
		initialize: function() {
			console.log("IncomeLayoutView init");

		},
		template: "incomeLayout",
		ui: {
		},
		regions: {
			"summaryRegion": "#summaryRegionContent",
			"detailRegion": "#detailRegionContent",
		},
		events: {},
		onRender: function() {},
		onShow: function() {
			console.log('IncomeLayoutView on show');
			ReqCmd.reqres.request("IncomeLayoutView:onshow");
		}
	});

	var SummaryView = Marionette.ItemView.extend({
		template: "incomeSummary",
		initialize: function(options) {
			console.log("SummaryView init");
			this.listenTo(this.model, 'change', this.render, this);

		},
		ui: {
			"applyPayBtn": "#applyPayBtn"
		},
		events: {
			"click @ui.applyPayBtn": "applyPayAction"
		},
		applyPayAction: function(e) {

		},
		onRender: function() {
			// get rid of that pesky wrapping-div
			// assumes 1 child element			
			this.$el = this.$el.children();
			this.setElement(this.$el);
		}
	});


	return {
		IncomeLayoutView:IncomeLayoutView,
		SummaryView:SummaryView
	}
});