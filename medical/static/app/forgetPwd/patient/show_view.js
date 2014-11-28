define(['utils/reqcmd', 'lodash', 'marionette', 'templates', 'ladda-bootstrap', 'login/login_app',
        'dust', 'dustMarionette', "bootstrap"],
    function (ReqCmd, Lodash, Marionette, Templates, ladda, LoginApp) {
        "use strict";
        var ForgetPwdPageLayoutView = Marionette.Layout.extend({
            initialize: function () {
                console.log("ForgetPwdPageLayoutView init");
                this.AppInstance = require('app');
                this.bindUIElements();
            },
            el: "#forgetPwdContent",
            ui: {
                "submitPwdBtn": "#submitPwdBtn",
                "mobileNumberInput": "#mobileNumber",
                "verifyCodeInput": "#verifyCode",
                "getVerifyCodeBtn": "#getVerifyCodeBtn"
            },
            events: {
                "click @ui.submitPwdBtn": "submitPassword",
                "blur @ui.mobileNumberInput": "getMobileNumber",
                "click @ui.getVerifyCodeBtn": "getVerifyCode"
            },

            getMobileNumber: function (e) {
                if ($('#mobileNumForm').valid()) {
                    document.getElementById("nextBtn").disabled = false;
                    var mobileNum = this.ui.mobileNumberInput.val();
                    this.mobileNumber = mobileNum;
                    console.log(mobileNum);
                }
                else {
                    document.getElementById("nextBtn").disabled = true;
                }
            },

            attachEndHandler: function () {

                $('body').show();

                console.log("attachEndHandler");
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
                    validation_rule: function () {
                        return true
                    },
                    steps_onload: function () {
                        var cur_step = $(this);
                        console.log(cur_step);
                        if (cur_step.hasClass('pstep1')) {
                            console.log("verify mobile number")
                            document.getElementById("nextBtn").disabled = true
                        }
                        if (cur_step.hasClass('pstep2')) {
                            document.getElementById("nextBtn").disabled = true;
                            console.log(that.mobileNumber);
                            that.getVerifyCode();
                        }
                        if (cur_step.hasClass('pstep3')) {
                            console.log(that.mobileNumber);
                        }
                    },
                    ajaxDefer: function () {
                        var cur_step = $(this);
                        if (cur_step.hasClass('pstep2')) {
                            var l = ladda.create(document.querySelector('#nextBtn'));
                            l.start();
                            var verifyCode = $('#verifyCode').val();
                            var params = {
                                mobile: that.mobileNumber,
                                verifyCode: verifyCode
                            }
                            return $.ajax({
                                dataType: 'JSON',
                                type: 'POST',
                                data: params,
                                url: "/user/mobile/update/" + that.mobileNumber,
                                success: function (data) {
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
                                onError: function (res) {
                                    // this.resetForm();
                                    //var error = jQuery.parseJSON(data);
                                    if (res.status == 1) {
                                        alert("验证码输入错误，请重新输入。")
                                    }
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
                                complete: function () {
                                    l.stop();
                                }
                            });

                        } else if (cur_step.hasClass('pstep1')) {
                            var l = ladda.create(document.querySelector('#nextBtn'));
                            l.start();
                            var phonenumber = $('#mobileNumber').val();

                            return $.ajax({
                                dataType: 'JSON',
                                type: 'GET',
                                url: "/user/mobile/VerifyPhone/" + phonenumber,
                                success: function (data) {
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
                                onError: function (res) {
                                    //this.resetForm();
                                    //var error = jQuery.parseJSON(data);
                                    //$('#mobileNumber').val('');
                                    if (res.status == 1) {

                                        alert("手机号: " + that.mobileNumber + " 未注册，请确认并重新输入。")

                                    }

                                    if (typeof res.msg !== 'undefined') {
                                        Messenger().post({
                                            message: "错误信息:" + res.msg,
                                            type: 'error',
                                            showCloseButton: true
                                        });
                                    }

                                },
                                complete: function () {
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

                $('#patient-user-password-form').validate({
                    rules: {
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
                    highlight: function (element) {
                        $(element).closest('.form-group').addClass('has-error');
                    },
                    unhighlight: function (element) {
                        $(element).closest('.form-group').removeClass('has-error');
                    },
                    errorElement: 'span',
                    errorClass: 'help-block',
                    errorPlacement: function (error, element) {
                        if (element.is(":hidden")) {
                            element.next().parent().append(error);
                        } else if (element.parent('.input-group').length) {
                            error.insertAfter(element.parent());
                        } else {
                            error.insertAfter(element);
                        }
                    }
                });

                $('#mobileNumForm').validate({
                    rules: {
                        mobileNum: {
                            required: true,
                            number: true,
                            minlength: 11,
                            maxlength: 11
                        }

                    },
                    ignore: [],
                    highlight: function (element) {
                        $(element).closest('.form-group').addClass('has-error');
                    },
                    unhighlight: function (element) {
                        $(element).closest('.form-group').removeClass('has-error');
                    },
                    errorElement: 'span',
                    errorClass: 'help-block',
                    errorPlacement: function (error, element) {
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

            submitPassword: function (e) {
                e.preventDefault();
                if ($('#patient-user-password-form').valid()) {
                    var that = this;
                    var l = ladda.create(e.target);
                    l.start();
                    var url = "/account/resetPasswd/" + that.mobileNumber;
                    var data = $('#patient-user-password-form').serialize();
                    $.ajax({
                        type: 'POST',
                        dataType: 'JSON',
                        data: data,
                        url: url,
                        success: function (data, status, request) {
                            console.log('success');
                            if (data.status != 0) {
                                this.onError(data);

                            } else {
                                Messenger().post({
                                    message: "密码重置成功",
                                    type: 'success',
                                    showCloseButton: true
                                });
                                window.location.replace('/homepage');
                            }

                        },
                        onError: function (res) {
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
                        complete: function (status, request) {
                            l.stop();
                        }
                    });
                }
            },

            getVerifyCode: function () {
                console.log(this.mobileNumber)
                var url = "/user/mobile/VerifyCode/" + this.mobileNumber;
                var that = this;
                $('#getVerifyCodeBtn').countDown({});
                var params = {
                    mobile: this.mobileNumber
                }
                $.ajax({
                    type: 'POST',
                    dataType: 'JSON',
                    contentType: 'application/json',
                    url: url,
                    success: function (data, status, request) {
                        console.log('success');
                        document.getElementById("nextBtn").disabled = false;

                        //if (!(data.errorDescription && data.errorCode)) {
                        if (data.status == 0) {
                            Messenger().post({
                                message: "获取验证码成功",
                                type: 'success',
                                showCloseButton: true
                            });

                        } else {
                            this.onError(data);
                        }
                    },
                    onError: function (res) {

                        if (typeof res.errorDescription !== 'undefined') {
                            Messenger().post({
                                message: "%ERROR_MESSAGE:" + res.errorDescription,
                                type: 'error',
                                showCloseButton: true
                            });
                        }
                    }

                });
                return true;

            }
        });

        return {
            ForgetPwdPageLayoutView: ForgetPwdPageLayoutView
        }

    });