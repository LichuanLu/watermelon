define(['utils/reqcmd', 'lodash', 'marionette', 'templates', 'dust', 'dustMarionette', "bootstrap", 'bootstrap.select', 'bootstrap-treeview', 'flat_ui_custom'], function(ReqCmd, Lodash, Marionette, Templates) {
	// body...
	"use strict";
	var FzPageLayoutView = Marionette.Layout.extend({
		initialize: function() {
			console.log("init FzPageLayoutView");
			this.bindUIElements();
		},
		regions: {
		},
		el: "#admin-fenzhen-content",
		ui: {
		},
		events: {
		},
		attachEndHandler: function() {
			var $this = $(this);
			console.dir($('#fenzhenTab a'));
			$('#fenzhenTab a').click(function(e) {
				e.preventDefault();
				$(this).tab('show');
			});
		}
	});

	return {
		FzPageLayoutView: FzPageLayoutView
	}
});