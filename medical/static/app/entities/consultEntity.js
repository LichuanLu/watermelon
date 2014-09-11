define(["backbone", "marionette", "config/base/constant", "utils/reqcmd"], function(Backbone, Marionette, Constant, ReqCmd) {
	// body...
	"use strict";
	var ConsultModel = Backbone.Model.extend({
		//urlRoot: Constant+'/locale',
	});

	var ConsultCollection = Backbone.Collection.extend({
		model: ConsultModel,
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
		//type -- doctor , user 
		//id -- doctorId , userId
		getConsultCollection: function(params, collection, type, id) {
			if (!params) {
				params = {};
			}
			if (typeof params === 'object') {
				params = $.param(params);
			}
			var consultCollection;

			if (collection) {
				consultCollection = collection;
				consultCollection.reset();

			} else {
				consultCollection = new ConsultCollection();
				if (type === "doctor") {
					consultCollection.url = "/doctor/" + id + "/consultList";
				} else if (type === "user") {
					consultCollection.url = "/user/" + id + "/consultList";

				}
			}

			consultCollection.fetch({
				success: function() {
					console.log("fetch success");
					ReqCmd.reqres.request('consultEntity:getConsultCollection:fetch');
				},
				data: params
			});

			return consultCollection
		},

		getConsultDetailCollection: function(params, collection, type, id) {
			if (!params) {
				params = {};
			}
			if (typeof params === 'object') {
				params = $.param(params);
			}
			var consultCollection;

			if (collection) {
				consultCollection = collection;
				consultCollection.reset();

			} else {
				consultCollection = new ConsultCollection();
				if (type === "doctor") {
					consultCollection.url = "/doctor/" + id + "/consultList";
				} else if (type === "user") {
					consultCollection.url = "/user/" + id + "/consultList";

				}
			}

			consultCollection.fetch({
				success: function() {
					console.log("fetch success");
					ReqCmd.reqres.request('consultEntity:getConsultDetailCollection:fetch');
				},
				data: params
			});

			return consultCollection

		},
		addConsult: function(params, callback,context) {
			if (!params) {
				params = {};
			}
			if (typeof params === 'object') {
				params = $.param(params);
			}
			$.ajax({
				url: '/consult/add',
				data: params,
				dataType: 'json',
				type: 'POST',
				success: function(data) {
					if (data.status != 0) {
						this.onError(data);

					} else {
						Messenger().post({
							message: '成功新建留言',
							type: 'success',
							showCloseButton: true
						});
						callback.call(context);
					}
				},
				onError: function(res) {
					// this.resetForm();
					//var error = jQuery.parseJSON(data);
					if (res.status == 2) {
						window.location.replace('/loginPage')

					} else if (res.status == 4) {
						window.location.replace('/error')

					}
					if (typeof res.msg !== 'undefined') {
						Messenger().post({
							message: "错误信息:" + res.msg,
							type: 'error',
							showCloseButton: true
						});
					}

				}
			});


		}


	};

	return {
		API: API
	}

});