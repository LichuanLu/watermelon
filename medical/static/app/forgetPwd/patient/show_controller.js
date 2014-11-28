define(['lodash', 'config/base/constant', 'config/controllers/_base_controller', 'forgetPwd/patient/show_view', 'utils/reqcmd'], function(Lodash, CONSTANT, BaseController, View, ReqCmd) {
	// body...
	"use strict";
	var ShowController = BaseController.extend({
		initialize: function() {

			this.layoutView = this.getForgetPwdPageLayoutView();

			this.show(this.layoutView, {
				name: "forgetPwdPageLayoutView",
				//as bindAll this,so don't need that
				instance: this
			});

			//instance is this controller instance
			ReqCmd.commands.setHandler("forgetPwdPageLayoutView:attached", Lodash.bind(function(instance) {
				console.log("attached end");
				this.layoutView.attachEndHandler();
			},this));
			
			console.log('follow controller init end');

		},
		getForgetPwdPageLayoutView: function() {
			return new View.ForgetPwdPageLayoutView();
		}

	});

	return ShowController;

});