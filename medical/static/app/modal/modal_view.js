define(['config/base/constant', 'utils/reqcmd', 'lodash', 'marionette', 'templates', 'ladda-bootstrap', 'jquery.uploader.main',
	'config/validator/config', 'spin', 'bootstrap', 'dust', 'dustMarionette', 'jquery.psteps',
	'jquery.uploadify', 'jquery.imgareaselect', 'utils/countDown', 'bootstrap.multiselect'
], function(Constant, ReqCmd, Lodash, Marionette, Templates, ladda, FileUploaderMain) {
	"use strict";
	var MobileBindModalView = Marionette.ItemView.extend({
		template: "mobileBindModal",
		initialize: function(options) {
			console.log("MobileBindModalView init");

		},
		ui: {
			"mobileNumberInput": "#mobileNumber"
		},
		events: {
			"blur @ui.mobileNumberInput": "mobileNumberChange"
		},
		mobileNumberChange: function(e) {
			var mobileNum = this.ui.mobileNumberInput.val();
			this.mobileNumber = mobileNum;
			console.log(mobileNum);

		},
		onRender: function() {
			console.log("MobileBindModalView render");
			// get rid of that pesky wrapping-div
			// assumes 1 child element			
			this.$el = this.$el.children();
			this.setElement(this.$el);

		},
		onShow: function() {
			console.log("MobileBindModalView on show");
			this.mobileNumber = this.model.get('mobile');
			var that = this;

			$('#mobileSteps').psteps({
				traverse_titles: 'visited',
				steps_width_percentage: false,
				content_headings: true,
				step_names: false,
				check_marks: false,
				validate_errors: false,
				validate_next_step: true,
				ignore_errors_on_next: true,
				ignore_errors_on_submit: true,
				content_headings_after: '.before-heading',
				validation_rule: function() {
					// var cur_step = $(this);
					// if(cur_step.hasClass('pstep1')){
					// 	if(that.getVerifyCode()){
					// 		return true
					// 	}else{
					// 		return false
					// 	}
					// }
					return true
				},
				steps_onload: function() {
					var cur_step = $(this);
					console.log(cur_step);
					if (cur_step.hasClass('pstep2')) {
						that.getVerifyCode();
					}
				},
				ajaxDefer: function() {

					var cur_step = $(this);
					if (cur_step.hasClass('pstep2')) {
						var l = ladda.create(document.querySelector('#nextBtn'));
						l.start();
						var params = {
							mobile: that.mobileNumber
						}
						return $.ajax({
							url: "/user/mobile/checkVerifyCode",
							dataType: 'json',
							type: 'GET',
							data: params,
							success: function(data) {
								if (data.status != 0) {
									this.onError(data);

								} else {
									Messenger().post({
										message: 'Success verify',
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

							},
							complete: function() {
								l.stop();
							}
						});

					} else if (cur_step.hasClass('pstep3')) {
						var l = ladda.create(document.querySelector('#submitBtn'));
						l.start();
						var params = {
							mobile: that.mobileNumber,
							status: 0
						}
						return $.ajax({
							url: "/user/mobile/update",
							dataType: 'json',
							type: 'POST',
							data: params,
							success: function(data) {
								if (data.status != 0) {
									this.onError(data);

								} else {
									Messenger().post({
										message: 'Success Modify',
										type: 'success',
										showCloseButton: true
									});
									ReqCmd.reqres.request('MobileBindModalView:submit:success');

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

							},
							complete: function() {
								l.stop();
							}
						});

					} else {
						var dtd = $.Deferred();
						dtd.resolve();
						return dtd.promise();

					}


				}
			});
		},
		getVerifyCode: function() {
			// var url = Constant.AJAX_PREFIX + '/user/getverificationcode';
			var that = this;
			$('#getVerifyCodeBtn').countDown({});
			var params = {
					mobile: this.mobileNumber
				}
				// $.ajax({
				// 	type: 'POST',
				// 	dataType: 'JSON',
				// 	contentType: 'application/json',
				// 	data: JSON.stringify(data),
				// 	url: url,
				// 	success: function(data, status, request) {
				// 		console.log('success');

			// 		if (!(data.errorDescription && data.errorCode)) {
			// 			Messenger().post({
			// 				message: "获取验证码成功",
			// 				type: 'success',
			// 				showCloseButton: true
			// 			});
			// 			that.ui.regSteps.eq(1).children("i").add(that.ui.lines.eq(0)).addClass("pass");
			// 			that.ui.formStep02.removeClass("hide").siblings("form").addClass("hide");

			// 		} else {
			// 			this.onError(data);
			// 		}
			// 	},
			// 	onError: function(data) {
			// 		if (typeof data.errorDescription !== 'undefined') {
			// 			Messenger().post({
			// 				message: "%ERROR_MESSAGE:" + data.errorDescription,
			// 				type: 'error',
			// 				showCloseButton: true
			// 			});
			// 		}
			// 	}
			// });
			return true;
		}
	});



	var ImageAreaSelectModalView = Marionette.ItemView.extend({
		template: "imgareaselectModal",
		initialize: function(options) {
			console.log("ImageAreaSelectModalView init");
			this.uploadUrl = options.uploadUrl;
			console.log(this.uploadUrl);

		},
		onRender: function() {
			console.log("ImageAreaSelectModalView render");
			// get rid of that pesky wrapping-div
			// assumes 1 child element			
			this.$el = this.$el.children();
			this.setElement(this.$el);

		},
		onShow: function() {
			this.initUpload();
		},
		ui: {
			'submitBtn': 'button[name="submit"]'
		},
		events: {
			'click @ui.submitBtn': 'submitHandler'
		},
		submitHandler: function() {
			if (this.successCutCallBack) {
				this.successCutCallBack.call(this);
			}
		},
		initUpload: function() {
			/* 头像上传 */
			var $txt = $("#upFace").prev(".txt"),
				$progress = $txt.prev(".progress").children(".bar"),
				$pct = $txt.children(".pct"),
				$countdown = $txt.children(".countdown"),
				flag = true,
				pct, interval, countdown = 0,
				byteUped = 0;

			//set token
			var url = Constant.AJAX_PREFIX + '/file/uploadUserPortrait';
			var MyApp = require('app');
			if (MyApp && MyApp.authSession) {
				console.log(MyApp.authSession.get('access_token'));
				// settings.data = $.extend(settings.data, {
				//     access_token: 'test'
				// });
				// var rex = new RegExp("[\\?&][\w.]+=([^&#]*)").test(settings.url);
				var rex = url.match(/[\\?&][\w.]+=([^&#]*)/);
				// console.log(settings.data);
				// console.log(settings.url);
				// console.log(rex);
				var token = MyApp.authSession.get('access_token');

				if (typeof token === 'undefined' || token == '') {
					if (MyApp.authSession.get('0') && MyApp.authSession.get('0').hasOwnProperty('access_token')) {
						token = MyApp.authSession.get('0').access_token;
					} else {
						token = '';
					}

				}
				if (rex) {
					url = url + '&access_token=' + token;

				} else {
					url = url + '?access_token=' + token;
				}

				// settings.url = settings.url+ '&access_token=test';
				//return true;
			}


			var that = this;

			$("#upFace").uploadify({
				'height': 40,
				'width': 68,
				'multi': false,
				'simUploadLimit': 1,
				'swf': '/static/app/lib/uploadify/uploadify.swf',
				"buttonClass": "btn btn-primary btn-large",
				'buttonText': '上 传',
				'uploader': url,
				'auto': true, // 选中后自动上传文件
				'fileTypeExts': '*.jpg;*.png;',
				'fileSizeLimit': 2048, // 限制文件大小为2m
				'fileObjName': 'file',
				'onInit': function() {
					$("#upFace").next(".uploadify-queue").remove();
				},
				'onUploadStart': function(file) {},
				'onUploadSuccess': function(file, data, Response) {
					if (Response) {
						$countdown.text("00:00:00");
						$progress.width("0");
						$pct.text("0%");
						if (data) {
							var objvalue = eval("(" + data + ")");
							if (objvalue.item) {
								// $("#attIdID").val(objvalue.item.filename);
								// $("#facePreview2").hide();
								// $("#cutimg-box").removeClass("hide");
								$("#submit").removeAttr("disabled");
								$('#uploadedFileGroup').show();
								// $('#uploadFileGroup').hide();
								$("#ferret").attr("src", objvalue.item.filename);

								// uncomment this to enable cut image feature
								// $("#minImg").attr("src", objvalue.item.filename);


								$("#ferret").one('load', function() { //Set something to run when it finishes loading
									//remove this line to enable cut image feature
									that.successCutCallBack = function() {
										ReqCmd.commands.execute('ImageAreaSelectModalView:submitCut:success', objvalue.item.filename);
									}
									//uncomment this to enable cut image feature
									//that.successCutCallBack = that.initCutImage(objvalue.item.filename, 100, 100, 123); //Fade it in when loaded
								});

							}

						}



					}
				},
				'onUploadProgress': function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
					pct = Math.round((bytesUploaded / bytesTotal) * 100) + '%';
					byteUped = bytesUploaded;
					if (flag) {
						interval = setInterval(uploadSpeed, 100);
						flag = false;
					}
					if (bytesUploaded == bytesTotal) {
						clearInterval(interval);
					}

					$progress.width(pct);
					$pct.text(pct);
					countdown > 0 && $countdown.text(secTransform((bytesTotal - bytesUploaded) / countdown * 10));
				}
			});

			function uploadSpeed() {
				countdown = byteUped - countdown;
			}

			function secTransform(s) {
				if (typeof s == "number") {
					s = Math.ceil(s);
					var t = "";
					if (s > 3600) {
						t = completeZero(Math.ceil(s / 3600)) + ":" + completeZero(Math.ceil(s % 3600 / 60)) + ":" + completeZero(s % 3600 % 60);
					} else if (s > 60) {
						t = "00:" + completeZero(Math.ceil(s / 60)) + ":" + completeZero(s % 60);
					} else {
						t = "00:00:" + completeZero(s);
					}
					return t;
				} else {
					return null;
				}
			}

			function completeZero(n) {
				return n < 10 ? "0" + n : n;
			}


		},
		initCutImage: function(imgSrcPath, zoomWidth, zoomHeight, imgId) {

			var imgDivW = Math.round($("#big-imgDiv").width());
			var imageW = 100;
			var imageH = 100;
			var cutImageW = 0;
			var cutImageH = 0;
			var cutImageX = 0;
			var cutImageY = 0;
			var minWidth = zoomWidth;
			var minHeight = zoomHeight;
			var scale = 1;
			var uploadImgStatus = 0;

			function submitCut() {
				$.ajax({
					url: Constant.AJAX_PREFIX + '/file/uploadUserPortrait/cutImage',
					dataType: 'JSON',
					type: 'POST',
					contentType: 'application/json',
					data: JSON.stringify({
						imgSrcPath: imgSrcPath,
						imgWidth: cutImageW,
						imgHeight: cutImageH,
						imgTop: cutImageX,
						imgLeft: cutImageY,
						imgScale: scale,
						reMinWidth: minWidth,
						reMinHeight: minHeight,
						imgId: imgId
					}),
					success: function(data, status, request) {
						console.log('success');
						Messenger().post({
							message: "裁减图片成功",
							type: 'success',
							showCloseButton: true
						});
						ReqCmd.commands.execute('ImageAreaSelectModalView:submitCut:success', data.item.filename);
					},
					onError: function(data) {
						if (typeof data.errorDescription !== 'undefined') {
							Messenger().post({
								message: "%ERROR_MESSAGE:" + data.errorDescription,
								type: 'error',
								showCloseButton: true
							});
						}
					}
				});

			}

			function preview(img, selection) {
				showCut(selection.width, selection.height, selection.x1, selection.y1);
			}

			function showCut(w, h, x, y) {
				var scaleX = minWidth / w;
				var scaleY = minHeight / h;
				$("#facePreview .imgshow img, #minImg").each(function() {
					scaleX = $(this).parent().width() / w;
					scaleY = $(this).parent().height() / h;
					$(this).css({
						width: Math.round(scaleX * imageW * scale) + 'px',
						height: Math.round(scaleY * imageH * scale) + 'px',
						marginLeft: '-' + Math.round(scaleX * x) + 'px',
						marginTop: '-' + Math.round(scaleY * y) + 'px'
					});
				});
				cutImageW = w;
				cutImageH = h;
				cutImageX = x;
				cutImageY = y;
			}

			imageW = $('#ferret').width();
			imageH = $('#ferret').height();
			if (imageW > imgDivW) {
				scale = imgDivW / imageW;
				$('#ferret').css({
					width: Math.round(imgDivW) + 'px',
					height: 'auto'
				});
			}

			//默认尺寸
			if (imageW < minWidth || imageH < minHeight) {
				alert("源图尺寸小于缩略图，请重新上传一个较大的图片。");
				return;
			}
			/* if(imageW==minWidth&&imageH==minHeight) {
			alert("源图和缩略图尺寸一致，请重设缩略图大小。");
			return;
		} */
			$('#imgDiv').css({
				'width': minWidth + 'px',
				'height': minHeight + 'px'
			});

			var minSelW = Math.round(minWidth * scale);
			var minSelH = Math.round(minHeight * scale);
			$('#ferret').imgAreaSelect({
				selectionOpacity: 0,
				outerOpacity: '0.5',
				selectionColor: '#ffffff',
				borderColor1: "#6fa7c6",
				borderColor2: "transparent",
				onSelectChange: preview,
				minWidth: minSelW,
				minHeight: minSelH,
				aspectRatio: minWidth + ":" + minHeight,
				x1: 0,
				y1: 0,
				x2: parseInt(minWidth),
				y2: parseInt(minHeight)
			});
			showCut(minWidth, minHeight, 0, 0);
			return submitCut;

		}

	});



	var DeleteModalView = Marionette.ItemView.extend({
		template: "deleteModal",
		initialize: function() {
			console.log("DeleteModalView init");
		},
		onRender: function() {
			console.log("DeleteModalView render");
			// get rid of that pesky wrapping-div
			// assumes 1 child element			
			this.$el = this.$el.children();
			this.setElement(this.$el);

		},
		onShow: function() {},
		ui: {
			'submitBtn': 'button[name="submit"]'
		},
		events: {
			'click @ui.submitBtn': 'submitHandler'
		},
		submitHandler: function() {
			ReqCmd.commands.execute('DeleteModalView:submitHandler', this.model);
		}

	});

	//used for all confirm modal
	var ConfirmModalView = Marionette.ItemView.extend({
		template: "confirmModal",
		initialize: function(options) {
			console.log("ConfirmModalView init");
			this.submitCallback = options.callback;
			this.callbackContext = options.callbackContext;
		},
		onRender: function() {
			console.log("ConfirmModalView render");
			// get rid of that pesky wrapping-div
			// assumes 1 child element			
			this.$el = this.$el.children();
			this.setElement(this.$el);

		},
		onShow: function() {},
		ui: {
			'submitBtn': 'button[name="submit"]'
		},
		events: {
			'click @ui.submitBtn': 'submitHandler'
		},
		submitHandler: function(e) {
			if (this.submitCallback && this.callbackContext) {
				this.submitCallback.call(this.callbackContext);
			}
		}

	});


	//update doctor info
	var UpdateDoctorInfo = Marionette.ItemView.extend({
		template: "updateDoctorInfoModal",
		initialize: function(options) {
			console.log("UpdateDoctorInfo init");
		},
		onRender: function() {
			console.log("UpdateDoctorInfo render");
			// get rid of that pesky wrapping-div
			// assumes 1 child element			
			this.$el = this.$el.children();
			this.setElement(this.$el);

		},
		onShow: function() {
			var that = this;
			$('#avatarUpload').fileupload({
				disableImageResize: false,
				maxFileSize: 200000000,
				acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
				maxNumberOfFiles: 5,

				// Uncomment the following to send cross-domain cookies:
				//xhrFields: {withCredentials: true},
				url: '/acount/uploadAvatar',
				uploadTemplateId: FileUploaderMain.uploadTemplateStr,
				downloadTemplateId: FileUploaderMain.downloadTemplateStr

			}).bind('fileuploadsubmit', function(e, data) {
				// The example input, doesn't have to be part of the upload form:
				data.formData = {
					doctorId: that.model.get('doctorId')
				};
				// if (!data.formData.diagnoseId) {
				//   data.context.find('button').prop('disabled', false);
				//   input.focus();
				//   return false;
				// }
			});

			//multi select
			// $("select.multiselect").multiselect({
			// 	enableFiltering: true,
			// 	filterPlaceholder: "搜索",
			// 	nonSelectedText: "没有选中"
			// 	// buttonWidth: '300px'
			// });
			ReqCmd.reqres.request('UpdateDoctorInfo:onShow');
		},
		ui: {
			'submitBtn': 'button[name="submit"]',
			'doctorInfoForm': '#doctorInfoForm'
		},
		events: {
			'click @ui.submitBtn': 'submitHandler'
		},
		submitHandler: function(e) {
			var params = this.ui.doctorInfoForm.serialize();
			params += '&doctorId=' + this.model.get('doctorId') + '&status=0'
			ReqCmd.commands.execute('UpdateDoctorInfo:submitHandler', params);
		}

	});

	var CreateConsultView = Marionette.ItemView.extend({
		template: "createConsultViewModal",
		initialize: function(options) {
			console.log("CreateConsultView init");
		},
		onRender: function() {
			console.log("CreateConsultView render");
			// get rid of that pesky wrapping-div
			// assumes 1 child element			
			this.$el = this.$el.children();
			this.setElement(this.$el);

		},
		onShow: function() {
			var that = this;
			var $select = $('#diagnoseSelect');
			// if ($select) {
			// 	var params = {
			// 		type:6
			// 	}
			// 	if(this.model.get("isDoctor")){
			// 		this.selectData = DiagnoseEntity.API.getDiagnoseList(params);
			// 	}else{
			// 		this.selectData = DiagnoseEntity.API.getPatientDiagnoseList(params);
			// 	}				
			// }
			ReqCmd.commands.execute('CreateConsultView:onShow',$select);
		},
		ui: {
			'submitBtn': 'button[name="submit"]',
			'consultForm': '#consultForm'
		},
		events: {
			'click @ui.submitBtn': 'submitHandler'
		},
		submitHandler: function(e) {
			var params = this.ui.consultForm.serialize();
			ReqCmd.commands.execute('CreateConsultView:submitHandler', params);
		}
	});



	return {
		ImageAreaSelectModalView: ImageAreaSelectModalView,
		DeleteModalView: DeleteModalView,
		MobileBindModalView: MobileBindModalView,
		ConfirmModalView: ConfirmModalView,
		UpdateDoctorInfo: UpdateDoctorInfo,
		CreateConsultView: CreateConsultView
	}
});