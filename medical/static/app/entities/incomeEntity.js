define(["backbone","marionette","config/base/constant","utils/reqcmd"],function (Backbone,Marionette,Constant,ReqCmd) {
	// body...
	"use strict";
	var SummaryModel = Backbone.Model.extend({
		success: function(data, textStatus, jqXHR) {
			console.dir(data);

		},
		onError: function(data) {
			console.dir(data);
		},
		parse: function(resp) {
			//this.pageNumber = resp.data.pageNumber;
			//console.log(resp.data);
			return resp.data
		}
	});

	// var FavoriteCollection = Backbone.Collection.extend({
	// 	model:FavoriteModel,
	// 	success: function (data,textStatus,jqXHR) {
	// 		// body...
	// 		console.dir(data);
	// 	},
	// 	onError: function (data) {
	// 		// body...
	// 		console.dir(data);
	// 	},
	// 	parse: function (resp) {
	// 		// body...
	// 		console.dir(resp.data);
	// 		return resp.data
	// 	}
	// });
	
	var API = {
		getIncomeSummary: function (params) {
			if(!params){
				params = {};
			}
			var summaryModel = new SummaryModel();
			summaryModel.url = "/stats/summary";
			summaryModel.fetch({
				success:function () {
					// ReqCmd.reqres.request("localelistfetch:success");
					console.log("summaryModel fetch success");
				},
				data:params
			});

			return summaryModel
		}
	};
	
	return {
		API:API
	}

});
		