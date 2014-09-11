define(['utils/reqcmd', 'lodash', 'marionette', 'templates',
		'ladda-bootstrap', 'modal/modal_view',
		'dust', 'dustMarionette', "bootstrap", 'bootstrap.select', 'config/validator/config'
	],
	function(ReqCmd, Lodash, Marionette, Templates, ladda, ModalView) {
		// body...
		"use strict";
		var PatientHomePageLayoutView = Marionette.Layout.extend({
			initialize: function() {
				console.log("init PatientHomePageLayoutView");
				this.bindUIElements();
			},
			regions: {
				"contentRegion": "#contentRegion",
				"diagnoseDetailTrackRegion": "#diagnose-detail-track-wrapper"
			},
			el: "#patienthome-content",
			ui: {
				"patientActionLinks": "#patient-actions ul a",
				"headerTitle": "#patient-action-header h6"

			},
			events: {
				"click @ui.patientActionLinks": "patientActionLinksHandler"
			},
			attachEndHandler: function() {

				this.ui.patientActionLinks.filter("[name*='diagnoseLink']").click();
			},
			patientActionLinksHandler: function(e) {
				e.preventDefault();
				//e.stopPropagation();
				//console.dir($(e.target));
				var $target = $(e.target);
				if ($target.is('span')) {
					$target = $target.closest('a');
				}
				console.log($target.attr("name"));
				this.ui.patientActionLinks.removeClass('active');
				$target.addClass('active');
				ReqCmd.commands.execute("patientHomePageLayoutView:changeContentView", $target.attr("name"));

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
				this.appInstance = require('app');

			},
			onShow: function() {
				$("select").selectpicker({
					style: 'btn-sm btn-primary'
				});

			},
			ui: {
				"submitBtn": "#patient-action-content .submit-btn",
				"typeSelect": "#patient-action-content select",
				"diagnoseAllWrapper": "#diagnose-all-wrapper"
			},
			events: {
				"click @ui.submitBtn": "searchDiagnose"
			},
			template: "diagnoseLayout",
			itemViewContainer: "#diagnose-tbody",
			searchDiagnose: function(e) {
				e.preventDefault();
				ReqCmd.commands.execute("DiagnoseListView:searchDiagnose", this.ui.typeSelect.val());
			},
			itemViewOptions: function() {
				return {
					parentsInstance: this
				};
			},
			hideView: function() {
				this.$el.hide();
			},
			showAndRefreshView: function() {
				this.$el.show();
				ReqCmd.commands.execute("DiagnoseListView:searchDiagnose", this.ui.typeSelect.val());


			}

		});

		var DiagnoseTableItemView = Marionette.ItemView.extend({
			initialize: function(options) {
				this.parentsInstance = options.parentsInstance;

			},
			template: "diagnoseItem",
			ui: {
				"actionLinks": ".action-group a",
				"detailLinks": ".detail-link",
				"deleteLinks": ".rm-diagnose-link"
			},
			events: {
				"click @ui.actionLinks": "actionLinkHandler",
				"click @ui.detailLinks": "detailLinksHandler",
				"click @ui.deleteLinks": "deleteDiagnose"
			},
			actionLinkHandler: function(e) {
				var $link = $(e.target);
				if ($link.is('.action-link')) {
					e.preventDefault();
					console.log("sharing-link click");
					var model = this.model;
					var sharingModalView = new SharingModalView({
						model: model
					});

					this.parentsInstance.appInstance.modalRegion.show(sharingModalView);

				}
			},
			detailLinksHandler: function(e) {
				e.preventDefault();
				ReqCmd.commands.execute("detailLinksHandler:DiagnoseTableItemView", this.model);

			},
			onRender: function() {
				//console.log("item render");
				// get rid of that pesky wrapping-div
				// assumes 1 child element			
				this.$el = this.$el.children();
				this.setElement(this.$el);
			},
			deleteDiagnose: function(e) {
				e.preventDefault();
				var $link = $(e.target);
				if ($link.is('.rm-diagnose-link')) {
					console.log("rm-diagnose-link click");
					var model = this.model;
					var deleteDiagnoseModalView = new DeleteDiagnoseModalView({
						model: model
					});

					this.parentsInstance.appInstance.modalRegion.show(deleteDiagnoseModalView);

				}

			}


		});

		var DeleteDiagnoseModalView = Marionette.ItemView.extend({
			template: "deleteDiagnoseModal",
			initialize: function() {
				console.log("DeleteDiagnoseModalView init");

			},
			onRender: function() {
				console.log("DeleteDiagnoseModalView render");
				// get rid of that pesky wrapping-div
				// assumes 1 child element			
				this.$el = this.$el.children();
				this.setElement(this.$el);

			},
			onShow: function() {

			},
			ui: {
				"saveBtn": "button[name=save]",
				"confirmForm": "#confirm-form"
			},
			events: {
				"click @ui.saveBtn": "confirmDelete"
			},
			confirmDelete: function(e) {
				var diagnoseId = this.ui.confirmForm.data('id');
				if (diagnoseId) {
					var that = this;
					$.ajax({
						url: "/diagnose/delete/" + diagnoseId,
						dataType: 'json',
						type: 'POST',
						success: function(data) {
							if (data.status != 0) {
								this.onError(data);

							} else {
								that.close();
								Messenger().post({
									message: 'SUCCESS.delete diagnose',
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



			}

		});

		var SharingModalView = Marionette.ItemView.extend({
			template: "sharingModal",
			initialize: function() {
				console.log("SharingModalView init");

			},
			onRender: function() {
				console.log("SharingModalView render");
				// get rid of that pesky wrapping-div
				// assumes 1 child element			
				this.$el = this.$el.children();
				this.setElement(this.$el);

			},
			onShow: function() {
				$('#score-select').selectpicker({
					style: 'btn-primary'
				});
			},
			ui: {
				"saveBtn": "button[name=save]",
				"sharingForm": "#sharing-form"
			},
			events: {
				"click @ui.saveBtn": "submitSharing"
			},
			submitSharing: function(e) {
				var diagnoseId = this.ui.sharingForm.data('id');
				var data = this.ui.sharingForm.serialize() + "&diagnoseId=" + diagnoseId;
				ReqCmd.commands.execute("submitSharing:SharingModalView", data);

			}

		});


		var AccountManageLayoutView = Marionette.ItemView.extend({
			initialize: function() {
				console.log("AccountManageLayoutView init");
				this.model.on('change', this.render);
				this.AppInstance = require('app');

			},
			template: "patientAccountManageLayout",
			ui: {
				"editBtns": ".edit-btn",
				"editBlocks": "#patient-user-account-form .edit-block",
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
				$('#patient-user-password-form').find('input').val('');
			},
			submitPassword: function(e) {
				e.preventDefault();
				if ($('#patient-user-password-form').valid()) {
					var that = this;
					var l = ladda.create(e.target);
					l.start();
					var url = "/account/changePasswd";
					var data = $('#patient-user-password-form').serialize();
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
						onError: function(data) {
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
				this.model.set('type', 1);
				var that = this;

				// console.log(data);
				var l = ladda.create(e.target);
				l.start();

				var url = '/account/admin';
				var that = this;
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
								type:2
							}
							that.resetModel(params);
							Messenger().post({
								message: "修改成功",
								type: 'success',
								showCloseButton: true
							});
						}

					},
					onError: function(data) {
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

				$('#patient-user-password-form').validate({
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
				console.log('AccountManageLayoutView onshow');
			}
		});

		var MessageLayoutView = Marionette.Layout.extend({
			initialize: function() {
				console.log("MessageLayoutView init");

			},
			template: "patientMessageLayout",
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


		var FavoriteLayoutView = Marionette.Layout.extend({
			initialize: function() {
				console.log("FavoriteLayoutView init");

			},
			regions: {
				"doctorListRegion": "#doctor-wrapper"
			},
			template: "favoriteLayout",
			ui: {},
			events: {},
			onRender: function() {},
			onShow: function() {
				var $this = $(this);
				console.dir($('#favoriteTab a'));
				$('#favoriteTab a').click(function(e) {
					e.preventDefault();
					$(this).tab('show');
				});
				ReqCmd.reqres.request('onShow:FavoriteLayoutView');
			}
		});



		var FavoriteCollectionView = Marionette.CollectionView.extend({
			initialize: function() {
				console.log("FavoriteCollectionView init");
				this.appInstance = require('app');

			},
			tagName: "ul",
			className: "favorite-list",
			ui: {},
			events: {},
			onRender: function() {},
			onShow: function() {},
			itemViewOptions: function() {
				return {
					parentsInstance: this
				};
			}
		});

		var FavoriteItemView = Marionette.ItemView.extend({
			initialize: function(options) {
				console.log("FavoriteItemView init");
				this.parentsInstance = options.parentsInstance;
			},
			template: "favoriteItem",
			ui: {
				"cancelFavoriteLinks": "a.del"
			},
			events: {
				"click @ui.cancelFavoriteLinks": "cancelFavoriteHandler"
			},
			onRender: function() {},
			cancelFavoriteHandler: function(e) {
				console.log($(e.target));
				var id = $(e.target).data('id');
				console.log(id);
				var model = this.model;
				var cancelFavoriteModalView = new CancelFavoriteModalView({
					model: model
				});

				this.parentsInstance.appInstance.modalRegion.show(cancelFavoriteModalView);
			},
			onShow: function() {}
		});



		var CancelFavoriteModalView = Marionette.ItemView.extend({
			template: "cancelFavoriteModalView",
			initialize: function() {
				console.log("CancelFavoriteModalView init");

			},
			onRender: function() {
				console.log("CancelFavoriteModalView render");
				// get rid of that pesky wrapping-div
				// assumes 1 child element			
				this.$el = this.$el.children();
				this.setElement(this.$el);

			},
			onShow: function() {},
			ui: {
				"saveBtn": "button[name=save]"
			},
			events: {
				"click @ui.saveBtn": "removeFavorite"
			},
			removeFavorite: function(e) {
				//var favoriteId = this.model.get('id');
				ReqCmd.commands.execute("removeFavorite:CancelFavoriteModalView", this.model);
			}

		});

		var DetailTrackLayoutView = Marionette.Layout.extend({
			initialize: function() {
				console.log("DetailTrackLayoutView init");
				this.listenTo(this.model, 'change', this.render, this);


			},
			regions: {},
			template: "detailTrackLayout",
			ui: {
				"backLink": ".back-link-wrapper > a"
			},
			events: {
				"click @ui.backLink": "backLinkHandler"
			},
			onRender: function() {
				console.log("DetailTrackLayoutView on render");
				var $activeDiv = $('.bs-wizard .bs-wizard-step.active');
				if ($activeDiv) {
					$activeDiv.prevAll().removeClass("disabled").addClass("complete");
				}

			},
			onShow: function() {
				console.log("DetailTrackLayoutView on show");


			},
			backLinkHandler: function(e) {
				ReqCmd.reqres.request("backLinkHandler:DetailTrackLayoutView");
			}
		});



		return {
			PatientHomePageLayoutView: PatientHomePageLayoutView,
			DiagnoseListView: DiagnoseListView,
			DiagnoseTableItemView: DiagnoseTableItemView,
			AccountManageLayoutView: AccountManageLayoutView,
			MessageLayoutView: MessageLayoutView,
			FavoriteLayoutView: FavoriteLayoutView,
			FavoriteCollectionView: FavoriteCollectionView,
			FavoriteItemView: FavoriteItemView,
			DetailTrackLayoutView: DetailTrackLayoutView,
			DeleteDiagnoseModalView: DeleteDiagnoseModalView
		}
	});