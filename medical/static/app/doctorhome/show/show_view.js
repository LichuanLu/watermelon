define(['utils/reqcmd', 'lodash', 'marionette', 'templates', 'ladda-bootstrap', 'modal/modal_view', 'dust',
	'dustMarionette', "bootstrap", 'bootstrap.select', 'bootstrap-treeview',
	'flat_ui_custom', 'config/validator/config'
], function(ReqCmd, Lodash, Marionette, Templates, ladda, ModalView) {
	// body...
	"use strict";
	//var $;
	var DoctorHomePageLayoutView = Marionette.Layout.extend({
		initialize: function() {
			console.log("init DoctorHomePageLayoutView");
			this.bindUIElements();
		},
		regions: {
			"contentRegion": "#contentRegion",
			"newDiagnoseRegion": "#newDiagnoseRegion"
		},
		el: "#doctorhome-content",
		ui: {
			"doctorActionLinks": "#doctor-actions ul a",
			"headerTitle": "#doctor-action-header h6"

		},
		events: {
			"click @ui.doctorActionLinks": "doctorActionLinksHandler"
		},
		attachEndHandler: function() {

			this.ui.doctorActionLinks.filter("[name*='diagnoseLink']").click();
			$('body').show();
		},
		doctorActionLinksHandler: function(e) {
			e.preventDefault();
			//e.stopPropagation();
			//console.dir($(e.target));
			var $target = $(e.target);
			if ($target.is('span')) {
				$target = $target.closest('a');
			}
			console.log($target.attr("name"));
			this.ui.doctorActionLinks.removeClass('active');
			$target.addClass('active');
			ReqCmd.commands.execute("doctorHomePageLayoutView:changeContentView", $target.attr("name"));

			//change title
			var iconClass = $target.attr('class');
			var titleText = $target.find('.nav-text').html();
			//console.log(iconClass+','+text);
			//console.dir(this.ui);
			this.ui.headerTitle.html("<i class='" + iconClass + "'></i><span>" + titleText + "</span>");

		}

	});

	var DiagnoseListView = Marionette.CompositeView.extend({
		initialize: function() {
			console.log("init DiagnoseTableCollectionView");
		},
		onShow: function() {
			$("select").selectpicker({
				style: 'btn-sm btn-primary'
			});

			var $datepickerSelector = $("#startDateinput,#endDateinput");
			$datepickerSelector.each(function() {
				$(this).datepicker({
					showOtherMonths: true,
					selectOtherMonths: true,
				}).prev('.btn').on('click', function(e) {
					e && e.preventDefault();
					$(this).focus();
				});
				$.extend($.datepicker, {
					_checkOffset: function(inst, offset, isFixed) {
						return offset
					}
				});

				// Now let's align datepicker with the prepend button
				$(this).datepicker('widget').css({
					'margin-left': -$(this).prev('.input-group-btn').find('.btn').outerWidth()
				});

			});



		},
		ui: {
			"submitBtn": "#doctor-action-content .submit-btn",
			"typeSelect": "#doctor-action-content select"
		},
		events: {
			"click @ui.submitBtn": "searchDiagnose"
		},
		template: "doctorDiagnoseLayout",
		itemViewContainer: "#diagnose-tbody",
		searchDiagnose: function(e) {
			e.preventDefault();
			this.initDiagnoseListView();
		},
		initDiagnoseListView: function() {
			ReqCmd.commands.execute("DiagnoseListView:searchDiagnose", $('#doctor-action-content').find('.form-inline').serialize());
		}

	});

	var DiagnoseTableItemView = Marionette.ItemView.extend({
		initialize: function() {},
		template: "doctorDiagnoseItem",
		ui: {
			"actionLinks": ".action-group a"
		},
		events: {
			"click @ui.actionLinks": "actionHandler"
		},
		onRender: function() {
			//console.log("item render");
			// get rid of that pesky wrapping-div
			// assumes 1 child element			
			this.$el = this.$el.children();
			this.setElement(this.$el);
		},
		actionHandler: function(e) {
			var statusId = this.model.get('statusId');
			if (statusId != 6) {
				e.preventDefault();
				ReqCmd.commands.execute("DiagnoseTableItemView:actionHandler", this.model);
			}

		}


	});

	//manage account view
	var AccountManageLayoutView = Marionette.ItemView.extend({
		initialize: function() {
			console.log("AccountManageLayoutView init");
			this.model.on('change', this.render);
			this.AppInstance = require('app');

		},
		template: "doctorAccountManageLayout",
		ui: {

			"editBtns": ".edit-btn",
			"editBlocks": "#doctor-user-account-form .edit-block",
			"cancelSubmit": ".btn-cancel",
			"submitBtn": ".btn-submit",
			"bindMobileBtn": "#bindMobileBtn",
			"editMobileBtn": "#editMobileBtn",
			"submitPwdBtn": "#submitPwdBtn"
		},
		events: {
			"click @ui.editBtns": "editFormHandler",
			"click @ui.cancelSubmit": "cancelSubmit",
			"click @ui.submitBtn": "submitChange",
			"click @ui.bindMobileBtn": "bindMobileHandler",
			"click @ui.editMobileBtn": "editMobileHandler",
			"click @ui.submitPwdBtn": "submitPassword"
		},
		resetPwdForm: function() {
			$('#doctor-user-password-form').find('input').val('');
		},
		submitPassword: function(e) {
			e.preventDefault();
			if ($('#doctor-user-password-form').valid()) {
				var that = this;
				var l = ladda.create(e.target);
				l.start();
				var url = "/account/changePasswd";
				var data = $('#doctor-user-password-form').serialize();
				$.ajax({
					type: 'POST',
					dataType: 'JSON',
					data: data,
					url: url,
					success: function(data, status, request) {
						console.log('success');
						if (data.status != 0) {
							this.onError(data);

						} else {
							that.resetPwdForm();
							Messenger().post({
								message: "密码修改成功",
								type: 'success',
								showCloseButton: true
							});
						}

					},
					onError: function(res) {
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
					},
					complete: function(status, request) {
						l.stop();
					}
				});

			}

		},
		bindMobileHandler: function(e) {
			//set mobileType 1 bind , 2 modify
			this.model.set('mobileType', 1);
			var modalView = new ModalView.MobileBindModalView({
				model: this.model
			});
			this.AppInstance.modalRegion.show(modalView);
		},
		editMobileHandler: function(e) {
			//set mobileType 1 bind , 2 modify
			this.model.set('mobileType', 2);
			var modalView = new ModalView.MobileBindModalView({
				model: this.model
			});
			this.AppInstance.modalRegion.show(modalView);
		},
		editFormHandler: function(e) {
			e.preventDefault();
			var $target = $(e.target);
			$target.closest('.form-body').find('.show-block').hide();
			$target.closest('.form-body').find('.edit-block').show();

		},
		cancelSubmit: function(e) {
			e.preventDefault();
			var $target = $(e.target);
			$target.closest('.form-body').find('.show-block').show();
			$target.closest('.form-body').find('.edit-block').hide();
		},
		resetModel: function(params) {
			this.model.clear();
			this.model.fetch({
				data: params
			});
		},
		submitChange: function(e) {
			e.preventDefault();
			//need to add validate
			var $target = $(e.target);
			var $parent = $target.closest('.form-body');
			var $inputField = $parent.find('input, textarea, select');
			this.model.set($inputField.attr('name'), $inputField.val());
			//type = 2 means patient , type = 1 means doctor
			this.model.set('type', 1);
			var that = this;

			// console.log(data);
			var l = ladda.create(e.target);
			l.start();

			var url = '/account/admin';
			$.ajax({
				type: 'POST',
				dataType: 'JSON',
				data: that.model.toJSON(),
				url: url,
				success: function(data, status, request) {
					console.log('success');
					if (data.status != 0) {
						this.onError(data);

					} else {
						var params = {
							type: 1
						}
						that.resetModel(params);
						Messenger().post({
							message: "修改成功",
							type: 'success',
							showCloseButton: true
						});
					}

				},
				onError: function(res) {
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
				},
				complete: function(status, request) {
					l.stop();
				}
			});

		},
		onRender: function() {
			console.log('AccountManageLayoutView on render');

		},
		onDomRefresh: function() {
			this.ui.editBlocks.hide();
			var $this = $(this);
			console.dir($('#accountTab a'));
			$('#accountTab a').click(function(e) {
				e.preventDefault();
				$(this).tab('show');
			});

			//init validation

			$('#doctor-user-password-form').validate({
				rules: {
					oldPasswd: {
						required: true
					},
					newPasswd: {
						required: true,
						minlength: 8
					},
					newPasswd_confirm: {
						required: true,
						equalTo: "#newPasswordInput"
					}

				},
				ignore: [],
				highlight: function(element) {
					$(element).closest('.form-group').addClass('has-error');
				},
				unhighlight: function(element) {
					$(element).closest('.form-group').removeClass('has-error');
				},
				errorElement: 'span',
				errorClass: 'help-block',
				errorPlacement: function(error, element) {
					if (element.is(":hidden")) {
						element.next().parent().append(error);
					} else if (element.parent('.input-group').length) {
						error.insertAfter(element.parent());
					} else {
						error.insertAfter(element);
					}
				}
			});

		},

		onShow: function() {
			console.log("AccountManageLayoutView onshow");
		}
	});



	var NewDiagnoseLayoutView = Marionette.ItemView.extend({
		initialize: function(options) {
			console.log("init NewDiagnoseLayoutView");
			this.typeId = options.typeId;
			this.listenTo(this.model, 'sync', this.render, this);
			//tree data
			this.treedata = {};
			this.selectedTemplateNode = "";
			// this.bindUIElements();
		},
		template: "newDiagnoseLayout",
		ui: {
			"loadTemplateBtn": ".load-btn",
			"loadingBtn": ".loading-btn",
			"imageDesTextArea": "#imageDes",
			"diagnoseResultTextArea": "#diagnoseResult",
			"closeLink": ".close-link",
			"submitDiagnoseBtn": '.submit-btn',
			"techDesTextArea": "#techDes",
			"rollbackLink": "#rollback-link"
		},
		events: {
			"click @ui.loadTemplateBtn": "loadTemplate",
			"click @ui.closeLink": "closeRegion",
			"click @ui.submitDiagnoseBtn": "submitDiagnose",
			"click @ui.rollbackLink": "rollbackDiagnose"
		},
		editFormHandler: function(e) {

		},
		rollbackDiagnose: function(e) {
			e.preventDefault();
			ReqCmd.commands.execute('rollbackDiagnose:NewDiagnoseLayoutView', this.model);
		},
		submitDiagnose: function(e) {
			e.preventDefault();
			var $target = $(e.target);
			var targetId = $target.attr("id");
			var $newDiagnoseForm = $('#new-diagnose-form');
			//console.log(targetId);
			var status;
			if (targetId === 'saveDiagnoseBtn') {
				status = 0;
			} else if (targetId === 'previewDiagnoseBtn') {
				status = 0;
			} else if (targetId === 'submitDiagnoseBtn') {
				status = 2;
			}
			if (status !== 'undefined') {
				var data = $newDiagnoseForm.serialize() + "&status=" + status + "&diagnoseId=" + this.model.get('id');
				var reportId = $newDiagnoseForm.data('report-id');
				var type = this.typeId;
				if (reportId) {
					data += "&reportId=" + reportId;
				}
				if (type) {
					data += "&type=" + type;
				}
				var url;
				if (window.location.href.indexOf('fenzhen') > -1) {
					console.log('admin fenzhen page');
					url = '/admin/report/addOrUpate';

				} else {
					url = '/doctor/report/update';

				}
				var that = this;
				$.ajax({
					url: url,
					data: data,
					dataType: 'json',
					type: 'POST',
					success: function(data) {
						if (data.status != 0) {
							this.onError(data);

						} else {
							if (targetId === 'previewDiagnoseBtn') {
								window.open('/diagnose/' + that.model.get('id') + '/pdf', '_blank');
							} else {
								that.closeRegionAction();
							}
							Messenger().post({
								message: 'SUCCESS.Create diagnose',
								type: 'success',
								showCloseButton: true
							});
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


		},
		onRender: function() {

		},
		closeRegion: function(e) {
			e.preventDefault();
			this.closeRegionAction();
		},
		closeRegionAction: function() {
			ReqCmd.reqres.request("NewDiagnoseLayoutView:closeRegion");
		},
		loadTemplate: function(e) {
			e.preventDefault();
			if (this.selectedTemplateNode) {
				if (this.selectedTemplateNode.imageDesc && this.selectedTemplateNode.diagnoseDesc) {
					this.ui.imageDesTextArea.val(this.selectedTemplateNode.imageDesc);
					this.ui.diagnoseResultTextArea.val(this.selectedTemplateNode.diagnoseDesc);
				}

				// that.ui.techDesTextArea.val(data.techDes);

			}

			// var $templateLi = $('#tree ul').find('.node-selected');
			// var text = $templateLi.text();

			//var that = this;
			// if (href !== '#') {
			// 	this.ui.loadTemplateBtn.hide();
			// 	this.ui.loadingBtn.show();
			// 	var data = 'templateId=' + href;
			// 	$.ajax({
			// 		url: '/diagnose/template',
			// 		data: data,
			// 		dataType: 'json',
			// 		type: 'GET',
			// 		success: function(data) {
			// 			if (data.status != 0) {
			// 				this.onError(data);

			// 			} else {
			// 				Messenger().post({
			// 					message: 'SUCCESS. Product import started. Check back periodically.',
			// 					type: 'success',
			// 					showCloseButton: true
			// 				});
			// 				this.setTemplate(data.data);

			// 			}
			// 		},
			// 		onError: function(res) {
			// 			this.resetForm();
			// 			//var error = jQuery.parseJSON(data);
			// 			if (typeof res.msg !== 'undefined') {
			// 				Messenger().post({
			// 					message: "错误信息:" + res.msg,
			// 					type: 'error',
			// 					showCloseButton: true
			// 				});
			// 			}

			// 		},
			// 		setTemplate: function(data) {
			// 			if (data) {
			// 				that.ui.imageDesTextArea.val(data.imageDes);
			// 				that.ui.diagnoseResultTextArea.val(data.diagnoseResult);
			// 				that.ui.techDesTextArea.val(data.techDes);
			// 				this.resetForm();
			// 			}

			// 		},
			// 		resetForm: function() {
			// 			that.ui.loadTemplateBtn.show();
			// 			that.ui.loadingBtn.hide();
			// 		}
			// 	});

			// }

		},
		onShow: function() {
			// console.log(this.ui.templateLinks);
			// 	var data = [{
			// 		text: "CT",
			// 		nodes: [{
			// 			text: "呼吸系统",
			// 			nodes: [{
			// 				text: "心肺未见异常"
			// 			}, {
			// 				text: "右肺上叶干酪性肺炎并右肺下叶播放"

			// 			}]
			// 		}, {
			// 			text: "骨关节病变",
			// 			nodes: [{
			// 				text: "心肺未见异常"
			// 			}, {
			// 				text: "右肺上叶干酪性肺炎并右肺下叶播放"
			// 			}]
			// 		}]
			// 	}, {
			// 		text: "MR",
			// 		nodes: [{
			// 			text: "呼吸系统",
			// 			nodes: [{
			// 				text: "心肺未见异常"
			// 			}, {
			// 				text: "右肺上叶干酪性肺炎并右肺下叶播放"

			// 			}]
			// 		}, {
			// 			text: "骨关节病变",
			// 			nodes: [{
			// 				text: "心肺未见异常"
			// 			}, {
			// 				text: "右肺上叶干酪性肺炎并右肺下叶播放"
			// 			}]
			// 		}]
			// 	}];

			// 	$('#tree').treeview({
			// 		data: data,
			// 		enableLinks: true
			// 		// showBorder:false
			// 	});
		},
		onDomRefresh: function() {
			this.treedata = [{
				text: "ct"
			}, {
				text: "mri"
			}];
			this.refreshTree(this.treedata);
			var that = this;

			$('#tree').on('nodeSelected', function(event, node) {
				//console.dir(node);
				var nodeText = node.text;
				var nodeParent = node.parent;
				that.selectedTemplateNode = node;

				if (nodeText === 'ct' || nodeText === 'mri') {
					var targetObj = Lodash.find(that.treedata, {
						'text': nodeText
					});
					if (!Lodash.has(targetObj, 'nodes')) {

						$.ajax({
							url: '/diagnoseTemplate/postionList',
							data: "diagnoseMethod=" + nodeText,
							dataType: 'json',
							type: 'GET',
							success: function(data) {
								if (data.status != 0) {
									this.onError(data);

								} else {
									// var targetObj = Lodash.find(that.treedata, {'text': nodeText});
									targetObj.nodes = this.parseResult(data.data, nodeText);
									console.dir(targetObj);
									that.refreshTree();
									Messenger().post({
										message: 'SUCCESS.Get diagnose template.',
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

							},
							parseResult: function(data, parent) {
								var resArr = [];
								Lodash(data).forEach(function(res) {
									var obj = {
										text: res,
										parent: parent
									};
									resArr.push(obj);
								});
								return resArr;

							}
						});
					}


				} else if (!node.last) {
					// var targetObj = Lodash.find(that.treedata, {
					// 	'text': nodeText
					// });
					var targetObj;
					if (nodeParent == 'ct') {
						targetObj = Lodash.find(that.treedata[0].nodes, {
							'text': nodeText
						});
					} else if (nodeParent == 'mri') {
						targetObj = Lodash.find(that.treedata[1].nodes, {
							'text': nodeText
						});
					}

					if (!Lodash.has(targetObj, 'nodes')) {

						$.ajax({
							url: '/diagnoseTemplate/diagnoseAndImageDesc',
							data: "diagnoseMethod=" + node.parent + "&diagnosePostion=" + nodeText,
							dataType: 'json',
							type: 'GET',
							success: function(data) {
								if (data.status != 0) {
									this.onError(data);

								} else {
									targetObj.nodes = this.parseResult(data.data);
									console.dir(targetObj);
									that.refreshTree();
									Messenger().post({
										message: 'SUCCESS.Get diagnose template.',
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

							},
							parseResult: function(data) {
								Lodash(data).forEach(function(res) {
									res.text = res.diagnoseDesc;
									res.last = true;
								});
								return data;
							}
						});
					}

				}
				// else if(node.last){
				// 	that.selectedTemplateNode = node;
				// }



			});
		},
		refreshTree: function(data) {
			var treedata;
			if (data) {
				treedata = data;
			} else {
				treedata = this.treedata;
			}
			$('#tree').treeview({
				data: treedata,
				enableLinks: false
				// showBorder:false
			});
		}
	});

	var NewAuditLayoutView = Marionette.ItemView.extend({
		initialize: function() {
			console.log("init NewAuditLayoutView");
			this.listenTo(this.model, 'sync', this.render, this);

		},
		template: "newAuditLayout",
		ui: {

			"auditTextArea": "#auditText",
			"closeLink": ".close-link",
			"submitAuditBtn": '.submit-btn'
		},
		events: {
			"click @ui.closeLink": "closeRegion",
			"click @ui.submitAuditBtn": "submitAudit"
		},
		editFormHandler: function(e) {},
		submitAudit: function(e) {
			e.preventDefault();
			var $target = $(e.target);
			var targetId = $target.attr("id");
			//console.log(targetId);
			var type;
			if (targetId === 'saveAuditBtn') {
				type = 0;
			} else if (targetId === 'previewAuditBtn') {
				type = 1;
			} else if (targetId === 'submitAuditBtn') {
				type = 2;
			}


			if (type !== 'undefined') {
				var data = $('#new-audit-form').serialize() + "&type=" + type + "&diagnoseId=" + this.model.get('id');
				$.ajax({
					url: '/doctor/audit/create',
					data: data,
					dataType: 'json',
					type: 'POST',
					success: function(data) {
						if (data.status != 0) {
							this.onError(data);

						} else {
							Messenger().post({
								message: 'SUCCESS. Product import started. Check back periodically.',
								type: 'success',
								showCloseButton: true
							});
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


		},
		closeRegion: function(e) {
			e.preventDefault();
			this.closeRegionAction();
			
		},
		closeRegionAction: function() {
			ReqCmd.reqres.request("NewDiagnoseLayoutView:closeRegion");
		}
	});

	var MessageLayoutView = Marionette.Layout.extend({
		initialize: function() {
			console.log("MessageLayoutView init");

		},
		template: "doctorMessageLayout",
		ui: {},
		regions: {
			"unReadMessageRegion": "#unread-message-region",
			"readMessageRegion": "#read-message-region"
		},
		events: {},
		onRender: function() {},
		onShow: function() {
			var $this = $(this);
			console.dir($('#messageTab a'));
			$('#messageTab a').click(function(e) {
				e.preventDefault();
				$(this).tab('show');
			});
			ReqCmd.reqres.request('showMessageList:MessageLayoutView');
		}
	});

	var RollbackModalView = Marionette.ItemView.extend({
		template: "rollbackDiagnoseModal",
		initialize: function() {
			console.log("RollbackModalView init");

		},
		onRender: function() {
			console.log("RollbackModalView render");
			// get rid of that pesky wrapping-div
			// assumes 1 child element			
			this.$el = this.$el.children();
			this.setElement(this.$el);

		},
		onShow: function() {},
		ui: {
			"saveBtn": "button[name=save]",
			"rollbackForm": "#rollback-form"
		},
		events: {
			"click @ui.saveBtn": "rollbackDiagnose"
		},
		rollbackDiagnose: function(e) {
			var diagnoseId = this.ui.rollbackForm.data('id');
			// var comments = this.ui.rollbackForm.find('textarea').val().trim();
			var data = this.ui.rollbackForm.serialize() + "&status=7";
			ReqCmd.commands.execute("rollbackDiagnose:RollbackModalView", diagnoseId, data);

		}

	});

	//consult  view
	var ConsultLayoutView = Marionette.Layout.extend({
		initialize: function() {
			console.log("ConsultLayoutView init");

		},
		template: "doctorConsultLayout",
		ui: {

		},
		regions: {
			"contentRegion": "#consultLayoutContent"
		},
		events: {},
		onRender: function() {},
		onShow: function() {
			ReqCmd.reqres.request("ConsultLayoutView:onshow");
		}
	});

	var ConsultListView = Marionette.CompositeView.extend({
		initialize: function(options) {
			console.log("ConsultListView init end");
		},
		onRender: function() {
			console.log("ConsultListView render");
		},
		onDomRefresh: function() {
			$("select").selectpicker({
				style: 'btn-sm btn-primary'
			});
		},
		ui: {
			"searchConsultForm": "#searchConsultForm",
			"submitBtn": ".submit-btn",
			"newConsultBtn": "#new-consult-btn"


		},
		events: {
			"click @ui.submitBtn": "searchConsult",
			"click @ui.newConsultBtn": "addConsult"

		},
		addConsult: function(e) {
			e.preventDefault();
			ReqCmd.commands.execute("ConsultDetailListView:addConsult");
		},
		searchConsult: function(e) {
			e.preventDefault();
			var params = this.ui.searchConsultForm.serialize();
			ReqCmd.commands.execute("ConsultListView:searchConsult", params, $("#searchConsultForm select").val());
		},
		template: 'consultListView',
		itemViewContainer: '#consult-tbody'

	});


	var ConsultListItemView = Marionette.ItemView.extend({
		template: "consultListItemView",
		initialize: function(options) {},
		ui: {
			"checkLink": ".action-group .check-link"
		},
		events: {
			"click @ui.checkLink": "checkDetail"
		},
		checkDetail: function(e) {
			var model = this.model;
			ReqCmd.commands.execute("ConsultListItemView:checkDetail", model);
		},
		onRender: function() {
			// get rid of that pesky wrapping-div
			// assumes 1 child element			
			this.$el = this.$el.children();
			this.setElement(this.$el);
		}
	});



	var ConsultDetailLayoutView = Marionette.Layout.extend({
		initialize: function() {
			console.log("ConsultDetailLayoutView init");

		},
		template: "consultDetailLayout",
		ui: {

		},
		regions: {
			"diagnoseRegion": "#diagnoseContent",
			"consultListRegion": "#consultListContent"
		},
		events: {},
		onRender: function() {},
		onShow: function() {
			ReqCmd.reqres.request("consultDetailLayoutView:onshow");
		}
	});

	//consult detail view
	var ConsultDetailListView = Marionette.CompositeView.extend({
		initialize: function() {
			console.log("ConsultDetailListView init");
		},
		template: "consultDetailList",
		ui: {
			"backLink": ".back-link",
			"addCommentsBtn": "#add-comments-btn",
			"commentsTextArea": "#new-comments-content"
		},
		events: {
			"click @ui.backLink": "backToList",
			"click @ui.addCommentsBtn": "addComments",
		},

		addComments: function(e) {
			e.preventDefault();
			$('.help-block').hide();
			var comments = this.ui.commentsTextArea.val().trim();
			if (comments) {
				var params = {
					userId: this.model.get("userId"),
					doctorId: this.model.get("doctorId"),
					title: this.model.get("title"),
					content: this.ui.commentsTextArea.val(),
					source_id: this.model.get("id"),
					// type is not follow parent model , but has own depends on patient and doctor send
					// type: this.model.get("type"),
					diagnoseId: this.model.get("diagnoseId")
				}
				ReqCmd.commands.execute("ConsultDetailListView:addComments", params);

			} else {
				$('.help-block').show();
			}

		},
		backToList: function(e) {
			e.preventDefault();
			ReqCmd.reqres.request("ConsultDetailListView:backToList");
		},
		onRender: function() {
			console.log("ConsultDetailListView render");
		},
		onShow: function() {
			console.log("ConsultDetailListView on show");
			// ReqCmd.reqres.request("ConsultLayoutView:onshow");
		},
		itemViewContainer: "#comments-wrapper"

	});


	var ConsultDetailItemView = Marionette.ItemView.extend({
		template: "consultDetailItem",
		initialize: function(options) {

		},
		ui: {},
		events: {},
		onRender: function() {
			// get rid of that pesky wrapping-div
			// assumes 1 child element			
			this.$el = this.$el.children();
			this.setElement(this.$el);
		}
	});

	var ConsultDiagnoseView = Marionette.ItemView.extend({
		template: "consultDiagnose",
		initialize: function(options) {
			console.log("ConsultDiagnoseView render");
			this.model.on('change', this.render);

		},
		ui: {},
		events: {},
		onRender: function() {
			console.log("ConsultDiagnoseView render");
			// get rid of that pesky wrapping-div
			// assumes 1 child element			
			this.$el = this.$el.children();
			this.setElement(this.$el);
		}

	});



	return {
		DoctorHomePageLayoutView: DoctorHomePageLayoutView,
		DiagnoseListView: DiagnoseListView,
		DiagnoseTableItemView: DiagnoseTableItemView,
		AccountManageLayoutView: AccountManageLayoutView,
		NewDiagnoseLayoutView: NewDiagnoseLayoutView,
		NewAuditLayoutView: NewAuditLayoutView,
		MessageLayoutView: MessageLayoutView,
		ConsultLayoutView: ConsultLayoutView,
		ConsultListView: ConsultListView,
		ConsultListItemView: ConsultListItemView,
		ConsultDetailLayoutView: ConsultDetailLayoutView,
		ConsultDetailListView: ConsultDetailListView,
		RollbackModalView: RollbackModalView,
		ConsultDetailItemView: ConsultDetailItemView,
		ConsultDiagnoseView: ConsultDiagnoseView
	}
});