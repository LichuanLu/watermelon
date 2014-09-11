define(["backbone", "marionette", "config/base/constant", "utils/reqcmd"], function(Backbone, Marionette, Constant, ReqCmd) {
	// body...
	"use strict";
	var DiagnoseModel = Backbone.Model.extend({
		//urlRoot: Constant+'/locale',
	});

	var DiagnoseCollection = Backbone.Collection.extend({
		model: DiagnoseModel,
		success: function(data, textStatus, jqXHR) {
			// body...
			console.dir(data);
		},
		onError: function(data) {
			// body...
			console.dir(data);
		}
	});


	var DiagnoseWithAmountModel = Backbone.Model.extend({
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


	var DoctorAuditModel = Backbone.Model.extend({
		//urlRoot: Constant+'/locale',
	});

	var DoctorAuditModelCollection = Backbone.Collection.extend({
		model: DoctorAuditModel,
		success: function(data, textStatus, jqXHR) {
			// body...
			console.dir(data);
		},
		onError: function(data) {
			// body...
			console.dir(data);
		}
	});


	var DoctorAuditWithAmountModel = Backbone.Model.extend({
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


	//for sharing
	var SharingAuditModel = Backbone.Model.extend({
		//urlRoot: Constant+'/locale',
	});

	var SharingAuditModelCollection = Backbone.Collection.extend({
		model: SharingAuditModel,
		success: function(data, textStatus, jqXHR) {
			// body...
			console.dir(data);
		},
		onError: function(data) {
			// body...
			console.dir(data);
		}
	});


	var SharingAuditWithAmountModel = Backbone.Model.extend({
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
	//gratitude 
	var GratitudeAuditModel = Backbone.Model.extend({
		//urlRoot: Constant+'/locale',
	});

	var GratitudeAuditModelCollection = Backbone.Collection.extend({
		model: GratitudeAuditModel,
		success: function(data, textStatus, jqXHR) {
			// body...
			console.dir(data);
		},
		onError: function(data) {
			// body...
			console.dir(data);
		}
	});


	var GratitudeAuditWithAmountModel = Backbone.Model.extend({
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
		getDiagnoseWithAmount: function(params, model) {
			if (!params) {
				params = {};
			}
			if (typeof params === 'object') {
				params = $.param(params);
			}
			var diagnosemodel;

			if (model) {
				diagnosemodel = model;
				diagnosemodel.clear();

			} else {
				diagnosemodel = new DiagnoseWithAmountModel();
				diagnosemodel.url = "/diagnose/list/needpay";
			}

			diagnosemodel.fetch({
				success: function() {
					console.log("fetch success");
					ReqCmd.reqres.request('kefuEntity:getDiagnoseWithAmount:fetch');
				},
				data: params
			});

			return diagnosemodel
		},
		getDoctorAuditWithAmount: function(params, model) {
			if (!params) {
				params = {};
			}
			if (typeof params === 'object') {
				params = $.param(params);
			}
			var doctormodel;

			if (model) {
				doctormodel = model;
				doctormodel.clear();

			} else {
				doctormodel = new DoctorAuditWithAmountModel();
				doctormodel.url = "/doctor/draftList";
			}

			doctormodel.fetch({
				success: function() {
					console.log("fetch success");
					ReqCmd.reqres.request('kefuEntity:getDoctorAuditWithAmount:fetch');
				},
				data: params
			});

			return doctormodel

		},
		getSharingAuditWithAmount: function(params, model) {
			if (!params) {
				params = {};
			}
			if (typeof params === 'object') {
				params = $.param(params);
			}
			var sharingmodel;

			if (model) {
				sharingmodel = model;
				sharingmodel.clear();

			} else {
				sharingmodel = new SharingAuditWithAmountModel();
				sharingmodel.url = "/diagnoseComment/draftList.json";
			}

			sharingmodel.fetch({
				success: function() {
					console.log("fetch success");
					ReqCmd.reqres.request('kefuEntity:getSharingAuditWithAmount:fetch');
				},
				data: params
			});

			return sharingmodel

		},
		getGratitudeAuditWithAmount: function(params, model) {
			if (!params) {
				params = {};
			}
			if (typeof params === 'object') {
				params = $.param(params);
			}
			var gratitudemodel;

			if (model) {
				gratitudemodel = model;
				gratitudemodel.clear();

			} else {
				gratitudemodel = new GratitudeAuditWithAmountModel();
				gratitudemodel.url = "/gratitude/draft/list";
			}

			gratitudemodel.fetch({
				success: function() {
					console.log("fetch success");
					ReqCmd.reqres.request('kefuEntity:getGratitudeAuditWithAmount:fetch');
				},
				data: params
			});

			return gratitudemodel

		}



	};

	return {
		API: API,
		DiagnoseCollection: DiagnoseCollection,
		DoctorAuditModelCollection: DoctorAuditModelCollection,
		SharingAuditModelCollection:SharingAuditModelCollection,
		GratitudeAuditModelCollection:GratitudeAuditModelCollection

	}

});