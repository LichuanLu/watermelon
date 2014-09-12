define(['utils/reqcmd', 'lodash', 'marionette', 'templates', 'dust',
	'dustMarionette', "bootstrap"
], function(ReqCmd, Lodash, Marionette, Templates) {
	// body...
	"use strict";
	var KfPageLayoutView = Marionette.Layout.extend({
		initialize: function() {
			console.log("init KfPageLayoutView");
			this.bindUIElements();
		},
		regions: {
			"diagnoseRegion": "#diagnose-manage-wrapper",
			"doctorAuditRegion": "#user-manage-wrapper",
			"sharingAuditRegion": "#sharing-manage-wrapper",
			"gratitudeAuditRegion": "#gratitude-manage-wrapper"


		},
		el: "#admin-kefu-content",
		ui: {
			"payLink": ".pay-link",
			"confirmRegisterLink": ".confirm-register"

		},
		events: {
			'click @ui.payLink': "payLinkHandler",
			'click @ui.confirmRegisterLink': "confirmRegister"
		},
		confirmRegister: function(e) {
			e.preventDefault();
			var userid = $(e.target).closest('tr').data('userid');

			if (userid) {
				var params = {
					doctorId: userid,
					status: 0
				}
				var that = this;
				$.ajax({
					url: '/doctor/statuschange',
					data: params,
					dataType: 'json',
					type: 'POST',
					success: function(data) {
						if (data.status != 0) {
							this.onError(data);

						} else {
							Messenger().post({
								message: '成功更改医生状态',
								type: 'success',
								showCloseButton: true
							});
						}
					},
					onError: function(res) {
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


		},
		payLinkHandler: function(e) {
			e.preventDefault();
			var diagnoseId = $(e.target).closest('tr').data('id');
			if (diagnoseId) {
				var that = this;
				var url = "/diagnose/alipayurl/" + diagnoseId;
				$.ajax({
					url: url,
					dataType: 'json',
					type: 'POST',
					success: function(data) {
						if (data.status != 0) {
							this.onError(data);

						} else {
							// ReqCmd.commands.execute('payLinkHandler:KfPageLayoutView', data.data);
							Messenger().post({
								message: '成功确认支付请求',
								type: 'success',
								showCloseButton: true
							});
						}
					},
					onError: function(res) {
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
		},
		attachEndHandler: function() {
			var $this = $(this);
			console.dir($('#kefuTab a'));
			$('#kefuTab a').click(function(e) {
				e.preventDefault();
				$(this).tab('show');
			});
			$('body').show();


		}
	});

	var DisplayPayLinkModalView = Marionette.ItemView.extend({
		template: "displayPayLinkModal",
		initialize: function() {
			console.log("DisplayPayLinkModalView init");

		},
		onRender: function() {
			console.log("DisplayPayLinkModalView render");
			// get rid of that pesky wrapping-div
			// assumes 1 child element			
			this.$el = this.$el.children();
			this.setElement(this.$el);

		},
		onShow: function() {},
		ui: {},
		events: {}
	});


	//diagnose list view
	var DiagnoseListView = Marionette.CompositeView.extend({
		initialize: function(options) {
			console.log("DiagnoseListView init end");

		},
		onRender: function() {
			console.log("DiagnoseListView render");
		},
		template: 'diagnoseListView',
		itemViewContainer: '#diagnose-manage-tbody'
	});


	var DiagnoseListItemView = Marionette.ItemView.extend({
		template: "diagnoseListItemView",
		initialize: function(options) {},
		ui: {
			"payLink": ".pay-link",
			// "deleteLink": ".delete-link"
		},
		events: {
			"click @ui.payLink": "payLinkHandler",
			// "click @ui.deleteLink": "deleteHandler"
		},
		payLinkHandler: function(e) {
			var diagnoseId = this.model.get('id');
			ReqCmd.commands.execute("DiagnoseListItemView:payLinkHandler", diagnoseId);

		},
		// deleteHandler: function(e) {
		// 	var diagnoseId = this.model.get('id');
		// 	ReqCmd.commands.execute("DiagnoseListItemView:deleteHandler", diagnoseId);

		// },
		onRender: function() {
			// get rid of that pesky wrapping-div
			// assumes 1 child element			
			this.$el = this.$el.children();
			this.setElement(this.$el);
		}
	});



	var DoctorAuditListView = Marionette.CompositeView.extend({
		initialize: function(options) {
			console.log("DoctorAuditListView init end");

		},
		onRender: function() {
			console.log("DoctorAuditListView render");
		},
		template: 'doctorAuditListView',
		itemViewContainer: '#user-manage-tbody'

	});

	var DoctorAuditListItemView = Marionette.ItemView.extend({
		template: "doctorAuditListItemView",
		initialize: function(options) {},
		ui: {
			"confirmRegister": ".confirm-register",
			"deleteRegister": ".delete-register"
		},
		events: {
			"click @ui.confirmRegister": "confirmHandler",
			"click @ui.deleteRegister": "deleteHandler"
		},
		confirmHandler: function(e) {
			var doctorId = this.model.get('doctorId');
			ReqCmd.commands.execute("DoctorAuditListItemView:confirmHandler", doctorId);

		},
		deleteHandler: function(e) {
			var doctorId = this.model.get('doctorId');
			ReqCmd.commands.execute("DoctorAuditListItemView:deleteHandler", doctorId);
		},
		onRender: function() {
			// get rid of that pesky wrapping-div
			// assumes 1 child element			
			this.$el = this.$el.children();
			this.setElement(this.$el);
		}

	});

	//sharing view
	var SharingListView = Marionette.CompositeView.extend({
		initialize: function(options) {
			console.log("SharingListView init end");

		},
		onRender: function() {
			console.log("SharingListView render");
		},
		template: 'sharingListView',
		itemViewContainer: '#sharing-manage-tbody'
	});


	var SharingListItemView = Marionette.ItemView.extend({
		template: "sharingListItemView",
		initialize: function(options) {},
		ui: {
			"acceptLink": ".accept-link",
			"deleteLink": ".delete-link"
		},
		events: {
			"click @ui.acceptLink": "acceptLinkHandler",
			"click @ui.deleteLink": "deleteHandler"
		},
		acceptLinkHandler: function(e) {
			var sharingId = this.model.get('id');
			ReqCmd.commands.execute("SharingListItemView:acceptLinkHandler", sharingId);

		},
		deleteHandler: function(e) {
			var sharingId = this.model.get('id');
			ReqCmd.commands.execute("SharingListItemView:deleteHandler", sharingId);

		},
		onRender: function() {
			// get rid of that pesky wrapping-div
			// assumes 1 child element			
			this.$el = this.$el.children();
			this.setElement(this.$el);
		}
	});


	//gratitude view
	var GratitudeListView = Marionette.CompositeView.extend({
		initialize: function(options) {
			console.log("GratitudeListView init end");

		},
		onRender: function() {
			console.log("GratitudeListView render");
		},
		template: 'gratitudeListView',
		itemViewContainer: '#gratitude-manage-tbody'
	});


	var GratitudeListItemView = Marionette.ItemView.extend({
		template: "gratitudeListItemView",
		initialize: function(options) {},
		ui: {
			"acceptLink": ".accept-link",
			"deleteLink": ".delete-link"
		},
		events: {
			"click @ui.acceptLink": "acceptLinkHandler",
			"click @ui.deleteLink": "deleteHandler"
		},
		acceptLinkHandler: function(e) {
			var gratitudeId = this.model.get('id');
			ReqCmd.commands.execute("GratitudeListItemView:acceptLinkHandler", gratitudeId);

		},
		deleteHandler: function(e) {
			var gratitudeId = this.model.get('id');
			ReqCmd.commands.execute("GratitudeListItemView:deleteHandler", gratitudeId);

		},
		onRender: function() {
			// get rid of that pesky wrapping-div
			// assumes 1 child element			
			this.$el = this.$el.children();
			this.setElement(this.$el);
		}
	});

	return {
		KfPageLayoutView: KfPageLayoutView,
		DisplayPayLinkModalView: DisplayPayLinkModalView,
		DiagnoseListView: DiagnoseListView,
		DiagnoseListItemView: DiagnoseListItemView,
		DoctorAuditListView: DoctorAuditListView,
		DoctorAuditListItemView: DoctorAuditListItemView,
		SharingAuditListView: SharingListView,
		SharingAuditListItemView: SharingListItemView,
		GratitudeAuditListView: GratitudeListView,
		GratitudeAuditListItemView: GratitudeListItemView

	}
});