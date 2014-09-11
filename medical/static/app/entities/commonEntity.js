define(["backbone", "marionette", "config/base/constant", "utils/reqcmd"], function(Backbone, Marionette, Constant, ReqCmd) {
	// body...
	"use strict";
	var SelectModel = Backbone.Model.extend({
		//urlRoot: Constant+'/locale',
	});

	var SelectCollection = Backbone.Collection.extend({
		model: SelectModel,
		success: function(data, textStatus, jqXHR) {
			// body...
			console.dir(data);
		},
		onError: function(data) {
			// body...
			console.dir(data);
		},
		parse: function(resp) {
			// body...
			console.dir(resp.data);
			return resp.data
		}
	});


	var API = {
		getSelectCollection: function(params, name) {
			if (!params) {
				params = {};
			}
			if (typeof params === 'object') {
				params = $.param(params);
			}
			
			var	selectCollection = new SelectCollection();
				selectCollection.url = "/"+name+"/list";
			
			selectCollection.fetch({
				success: function() {
					console.log("fetch success");
					// ReqCmd.reqres.request('commonEntity:getSelectCollection:fetch');
				},
				data: params
			});

			return selectCollection
		}


	};

	return {
		API: API
	}

});