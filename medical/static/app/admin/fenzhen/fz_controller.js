define(['lodash', 'config/base/constant', 'config/controllers/_base_controller', 'admin/fenzhen/fz_view', 'utils/reqcmd'], function(Lodash, CONSTANT, BaseController, View, ReqCmd) {
	// body...
	"use strict";
	var FzController = BaseController.extend({
		initialize: function() {

			this.layoutView = this.getFzPageLayoutView();

			this.show(this.layoutView, {
				name: "fenzhenPageLayoutView",
				//as bindAll this,so don't need that
				instance: this
			});

			//instance is this controller instance
			ReqCmd.commands.setHandler("fenzhenPageLayoutView:attached", Lodash.bind(function(instance) {
				console.log("fenzhenPageLayoutView attached end");
				this.layoutView.attachEndHandler();
			}, this));

		},
		getFzPageLayoutView: function() {
			return new View.FzPageLayoutView();
		}
	});

	return FzController;

});