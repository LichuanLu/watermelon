define(["backbone", "marionette", "config/base/constant", "utils/reqcmd"], function(Backbone, Marionette, Constant, ReqCmd) {
	// body...
	"use strict";
	var UserInfoModel = Backbone.Model.extend({
		//urlRoot: Constant+'/locale',
		parse: function(resp) {
			// body...
			console.dir(resp.data);
			return resp.data
		}
	});


	var API = {
		getUserInfo: function(params) {
			if (!params) {
				params = {};
			}
			var userInfoModel= new UserInfoModel();
			userInfoModel.url = "/account/info";
			userInfoModel.fetch({
				success: function() {
					console.log("userInfoModel fetch success");
				},
				data: params
			});

			return userInfoModel
		}
	};
	return {
		API: API
	}

});


