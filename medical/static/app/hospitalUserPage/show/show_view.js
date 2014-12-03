define(['utils/reqcmd', 'lodash', 'marionette', 'templates', 'ladda-bootstrap', 'jquery.uploader.main',
		'patienthome/show/show_view','modal/modal_view' ,'dust', 'dustMarionette', "bootstrap", 'bootstrap.select', 'jquery-ui'
	],
	function(ReqCmd, Lodash, Marionette, Templates, ladda, FileUploaderMain, PatientHomeShowView, ModalView) {
		// body...
		"use strict";
		var HospitalUserPageView = Marionette.Layout.extend({
			initialize: function() {
				console.log("init HospitalUserPageView");
				this.bindUIElements();
			},
			regions: {
				"allDiagnoseTable": "#submitted-diagnose-tbody",
				"unfinishDiagnoseTable": "#notsubmit-diagnose-tbody",
				"fileUploadRegion": "#file-management-region"
			},
			el: "#hospital-user-content",
			ui: {
				"allDiagnoseForm": "#submitted-diagnose-wrapper form",
				"allDiagnoseSearchBtn": "#submitted-diagnose-wrapper .submit-btn",
			},
			events: {
				"click @ui.allDiagnoseSearchBtn": "allDiagnoseSearch"

			},
			attachEndHandler: function() {
				$('#hospitalUserTab a').click(function(e) {
					e.preventDefault();
					$(this).tab('show');
				});

				$("select").not('.multiselect').selectpicker({
					style: 'btn-sm btn-primary',
					title: "没有选中"
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

				this.initUnFinishDiagnoseView();
				this.initAllDiagnoseView();
				$('body').show();

			},
			initUnFinishDiagnoseView: function() {
				// var params = this.ui.allDiagnoseForm.serialize();
				ReqCmd.commands.execute("initUnFinishDiagnoseView:HospitalUserPageView");

			},
			initAllDiagnoseView: function() {
				var params = this.ui.allDiagnoseForm.serialize();
				ReqCmd.commands.execute("initAllDiagnoseView:HospitalUserPageView", params);

			},
			allDiagnoseSearch: function(e) {
				e.preventDefault();
				this.initAllDiagnoseView();

			}

		});



		var HospitalUserAllDiagnoseCollectionView = Marionette.CollectionView.extend({
			initialize: function() {},
			onRender: function() {
				console.log("HospitalUserAllDiagnoseCollectionView render");


			},
			onShow: function() {
				console.log("HospitalUserAllDiagnoseCollectionView onShow");
				//init the modal onshow
			},
			el: "#submitted-diagnose-tbody"
		});

		var HospitalUserAllDiagnoseItemView = Marionette.ItemView.extend({
			template: "hospitalUserSubmittedDiagnoseItem",
			initialize: function() {
				console.log("HospitalUserAllDiagnoseItemView init");
				this.listenTo(this.model, 'sync', this.render, this);


			},
			onRender: function() {
				console.log("HospitalUserAllDiagnoseItemView render");
				// get rid of that pesky wrapping-div
				// assumes 1 child element			
				this.$el = this.$el.children();
				this.setElement(this.$el);

			},
			ui: {},
			events: {}
		});

		var HospitalUserUnfinishDiagnoseCollectionView = Marionette.CollectionView.extend({
			initialize: function() {
				this.listenTo(this.collection, 'sync', this.render, this);
				this.appInstance = require('app');
			},
			onRender: function() {
				console.log("HospitalUserUnfinishDiagnoseCollectionView render");
				// this.$el = this.$el.children();
				// this.setElement(this.$el);
			},
			onShow: function() {
				console.log("HospitalUserUnfinishDiagnoseCollectionView onShow");
				//init the modal onshow
				ReqCmd.reqres.request("HospitalUserUnfinishDiagnoseCollectionView:onShow");
			},
			el: "#notsubmit-diagnose-tbody",
			itemViewOptions: function() {
				return {
					parentsInstance: this
				};
			}

		});

		var HospitalUserUnfinishDiagnoseItemView = Marionette.ItemView.extend({

			template: "hospitalUserDiagnoseItem",
			initialize: function(options) {
				console.log("HospitalUserUnfinishDiagnoseItemView init");
				this.listenTo(this.model, 'sync', this.render, this);
				this.parentsInstance = options.parentsInstance;



			},
			onRender: function() {
				console.log("HospitalUserUnfinishDiagnoseItemView render");
				// get rid of that pesky wrapping-div
				// assumes 1 child element			
				this.$el = this.$el.children();
				this.setElement(this.$el);

			},
			ui: {
				"deleteLinks": ".rm-diagnose-link",
				"detailLinks":".detail-diagnose-link"
			},
			events: {
				"click @ui.deleteLinks": "deleteDiagnose",
				"click @ui.detailLinks": "detailDiagnose"

			},
			deleteDiagnose: function(e) {
				e.preventDefault();
				var $link = $(e.target);
				if ($link.is('.rm-diagnose-link')) {
					console.log("rm-diagnose-link click");
					var model = this.model;
					var deleteDiagnoseModalView = new PatientHomeShowView.DeleteDiagnoseModalView({
						model: model
					});

					this.parentsInstance.appInstance.modalRegion.show(deleteDiagnoseModalView);

				}

			},
			detailDiagnose: function(e) {
				e.preventDefault();
				var $link = $(e.target);
				if ($link.is('.detail-diagnose-link')) {
					console.log("detail-diagnose-link click");
					var model = this.model;
					var params = "diagnoseId=" + model.get('id');

					ReqCmd.commands.execute("HospitalUserUnfinishDiagnoseItemView:detailDiagnose", params);

					


				}

			}

		});

		var FileUploadListView = Marionette.CollectionView.extend({
			initialize: function() {
				this.listenTo(this.collection, 'sync', this.render, this);
				this.appInstance = require('app');
			},
			onRender: function() {
				console.log("FileUploadListView render");
				// this.$el = this.$el.children();
				// this.setElement(this.$el);
			},
			onShow: function() {
				console.log("FileUploadListView onShow");
				//init the modal onshow
			},
			el: "#file-management-wrapper",
			itemViewOptions: function() {
				return {
					parentsInstance: this
				};
			}

		});

		var FileUploadItemView = Marionette.ItemView.extend({
			template: "hospitalUserFileUpload",
			initialize: function(options) {
				console.log("FileUploadItemView init");
				this.listenTo(this.model, 'sync', this.render, this);
				this.parentsInstance = options.parentsInstance;
				this.diagnoseId = this.model.get("id");

			},
			onRender: function() {
				console.log("FileUploadItemView render");
				// get rid of that pesky wrapping-div
				// assumes 1 child element			
				this.$el = this.$el.children();
				this.setElement(this.$el);

			},
			onDomRefresh: function() {
				//console.log($('.dicom-file-upload'));
				var that = this;
				this.$el.find('.dicom-file-upload').fileupload({
					disableImageResize: false,
					maxFileSize: 200000000,
					// acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
					maxNumberOfFiles: 1,
					acceptFileTypes: /(\.|\/)(zip|jpe?g|png|rar)$/i,
					// locale: FileUploaderMain.zhCNLocale,

					// Uncomment the following to send cross-domain cookies:
					//xhrFields: {withCredentials: true},
					messages:FileUploaderMain.message,

					url: '/file/upload',
					uploadTemplateId: FileUploaderMain.uploadTemplateStr,
					downloadTemplateId: FileUploaderMain.downloadTemplateStr

				}).bind('fileuploadsubmit', function(e, data) {
					data.formData = {
						diagnoseId: that.diagnoseId,
						type: 0
					};
					var fileUploadingModalView = new ModalView.FileUploadingModalView({});

					that.parentsInstance.appInstance.modalRegion.show(fileUploadingModalView);


				})
				.bind('fileuploadalways', function(e, data) {
					that.parentsInstance.appInstance.modalRegion.close();

				});
				this.$el.find('.medical-report-fileupload').fileupload({
					disableImageResize: false,
					maxFileSize: 200000000,
					// acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
					maxNumberOfFiles: 5,
					acceptFileTypes: /(\.|\/)(zip|jpe?g|png|rar)$/i,
					// locale:FileUploaderMain.zhCNLocale,
					messages:FileUploaderMain.message,

					// Uncomment the following to send cross-domain cookies:
					//xhrFields: {withCredentials: true},
					url: '/file/upload',
					uploadTemplateId: FileUploaderMain.uploadTemplateStr,
					downloadTemplateId: FileUploaderMain.downloadTemplateStr

				}).bind('fileuploadsubmit', function(e, data) {
					data.formData = {
						diagnoseId: that.diagnoseId,
						type: 1
					};
					var fileUploadingModalView = new ModalView.FileUploadingModalView({});

					that.parentsInstance.appInstance.modalRegion.show(fileUploadingModalView);

				})
				.bind('fileuploadalways', function(e, data) {
					that.parentsInstance.appInstance.modalRegion.close();

				});
			},
			ui: {
				"reuploadBtn": '.edit-file-wrapper .btn',
				"applyBtn": '.apply-btn',

			},
			events: {
				'click @ui.reuploadBtn': "reuploadFile",
				"click @ui.applyBtn": "applySubmit"

			},
			onShow: function() {},
			reuploadFile: function(e) {
				e.preventDefault();
				//1 means other file , 0 means dicom file  
				var $target = $(e.target);
				var type = $target.data('type');
				var data = {
					diagnoseId: this.diagnoseId,
					type: type
				}
				var url = "/file/disable";
				var l = ladda.create(e.target);
				l.start();
				$.ajax({
					url: url,
					dataType: 'json',
					type: 'POST',
					data: data,
					success: function(data) {
						if (data.status != 0) {
							this.onError(data);

						} else {
							Messenger().post({
								message: '重新提交成功',
								type: 'success',
								showCloseButton: true
							});
							var $editWrapper = $target.closest('.edit-file-wrapper');
							var $newWrapper = $editWrapper.siblings('.new-file-wrapper');
							$editWrapper.hide();
							$newWrapper.show();
							console.log("reupload file");

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
					complete: function(status, request) {
						l.stop();
					}
				});


			},
			applySubmit: function(e) {
				var diagnoseId = this.diagnoseId;
				var that = this;
				var $target = $(e.target);
				var $parent = $target.closest('.file-upload-item');
				console.log("apply submit");
				var applySubmitUrl = "/diagnose/" + diagnoseId + "/toNeedPay";
				var l = ladda.create(e.target);
				l.start();
				
				var fileIds = '';

				var $fileIds = $parent.find('.file-link');
				$fileIds.each(function(index, element) {
					var tempIdStr = $(element).data('fileid');
					if (typeof tempIdStr !== 'undefined' && tempIdStr != 'undefined' && tempIdStr) {
						fileIds += "&fileIds=" + tempIdStr;
					}
				});

				var $downloadFileLinks = $parent.find('.downloadFileLink');
				$downloadFileLinks.each(function(index, element) {
					var tempIdStr = $(element).data('fileid');
					if (typeof tempIdStr !== 'undefined' && tempIdStr != 'undefined' && tempIdStr) {
						fileIds += "&fileIds=" + tempIdStr;
					}
				});
				$.ajax({
					url: applySubmitUrl,
					dataType: 'json',
					type: 'POST',
					data: fileIds,
					success: function(data) {
						if (data.status != 0) {
							this.onError(data);

						} else {
							Messenger().post({
								message: '文件已经提交成功',
								type: 'success',
								showCloseButton: true
							});
							that.$el.hide();

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
					complete: function(status, request) {
						l.stop();
					}
				});

			}

		})

		return {
			HospitalUserPageView: HospitalUserPageView,
			HospitalUserAllDiagnoseCollectionView: HospitalUserAllDiagnoseCollectionView,
			HospitalUserAllDiagnoseItemView: HospitalUserAllDiagnoseItemView,
			HospitalUserUnfinishDiagnoseCollectionView: HospitalUserUnfinishDiagnoseCollectionView,
			HospitalUserUnfinishDiagnoseItemView: HospitalUserUnfinishDiagnoseItemView,
			FileUploadListView: FileUploadListView,
			FileUploadItemView: FileUploadItemView
		}
	});