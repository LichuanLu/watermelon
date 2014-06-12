define(['lodash', 'config/base/constant', 'config/controllers/_base_controller', 'hospitalUserPage/show/show_view', 'utils/reqcmd'], function(Lodash, CONSTANT, BaseController, View, ReqCmd) {
	// body...
	"use strict";
	var ShowController = BaseController.extend({
		initialize: function() {

			this.layoutView = this.getHospitalUserPageView();

			this.show(this.layoutView, {
				name: "hospitalUserPageView",
				//as bindAll this,so don't need that
				instance: this
			});

			//instance is this controller instance
			ReqCmd.commands.setHandler("hospitalUserPageView:attached", Lodash.bind(function(instance) {
				console.log("attached end");
				this.layoutView.attachEndHandler();
			},this));

			
			console.log('follow controller init end');


		},
		getHospitalUserPageView: function(model) {
			var view = new View.HospitalUserPageView();
			return view;
		}

	});

	return ShowController;

});