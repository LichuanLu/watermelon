define(['lodash', 'config/base/constant', 'config/controllers/_base_controller',
    'admin/kefu/kf_view', 'modal/modal_view', 'common/common_view', 'utils/reqcmd', 'entities/kefuEntity', 'entities/commonEntity'
],
    function(Lodash, CONSTANT, BaseController, View, ModalView, CommonView, ReqCmd, KefuEntity, CommonEntity) {
        // body...
        "use strict";
        var KfController = BaseController.extend({
            initialize: function() {

                this.layoutView = this.getKfPageLayoutView();
                this.appInstance = require('app');

                //data for select list
                this.hospitalList = CommonEntity.API.getSelectCollection({}, 'hospital');
                this.skillList = CommonEntity.API.getSelectCollection({}, 'skill');
                this.departmentList = CommonEntity.API.getSelectCollection({}, 'department');



                this.show(this.layoutView, {
                    name: "kefuPageLayoutView",
                    //as bindAll this,so don't need that
                    instance: this
                });

                //instance is this controller instance
                ReqCmd.commands.setHandler("kefuPageLayoutView:attached", Lodash.bind(function(instance) {
                    console.log("kefuPageLayoutView attached end");
                    this.layoutView.attachEndHandler();
                    this.diagnoseModel = KefuEntity.API.getDiagnoseWithAmount();
                    this.doctorAuditModel = KefuEntity.API.getDoctorAuditWithAmount();
                    this.gratitudeAuditModel = KefuEntity.API.getGratitudeAuditWithAmount();
                    this.sharingAuditModel = KefuEntity.API.getSharingAuditWithAmount();


                }, this));

                //for diagnose audit view
                ReqCmd.reqres.setHandler("kefuEntity:getDiagnoseWithAmount:fetch", Lodash.bind(function(instance) {
                    if (this.diagnoseCollection) {
                        this.diagnoseCollection.reset(this.diagnoseModel.get('list'));
                        // this.diagnoseListView.render();

                    } else {
                        this.diagnoseCollection = new KefuEntity.DiagnoseCollection(this.diagnoseModel.get('list'));
                        this.diagnoseListView = this.getDiagnoseListView(this.diagnoseModel, this.diagnoseCollection);
                        this.show(this.diagnoseListView, {
                            client: true,
                            region: this.layoutView.diagnoseRegion
                        });
                    }

                }, this));

                //confirm pay
                ReqCmd.commands.setHandler("DiagnoseListItemView:payLinkHandler", Lodash.bind(function(diagnoseId) {
                    if (diagnoseId) {
                        var that = this;
                        var url = "/diagnose/"+ diagnoseId +"/callStatus";
                        $.ajax({
                            url: url,
                            dataType: 'json',
                            type: 'POST',
                            success: function(data) {
                                if (data.status != 0) {
                                    this.onError(data);

                                } else {
                                    Messenger().post({
                                        message: '成功完成联系',
                                        type: 'success',
                                        showCloseButton: true
                                    });
                                    var params = {};
                                    KefuEntity.API.getDiagnoseWithAmount(params, that.diagnoseModel);

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

                            }
                        });

                    }


                }, this));

                //delete diagnose
                ReqCmd.commands.setHandler("DiagnoseListItemView:deleteHandler", Lodash.bind(function(diagnoseId) {
                    if (diagnoseId) {
                        var that = this;
                        var ModalModel = Backbone.Model.extend({});
                        var modalModel = new ModalModel();
                        modalModel.set("content", "删除这个诊断");
                        var modalView = new ModalView.ConfirmModalView({
                            model: modalModel,
                            callback: function() {
                                var url = "/diagnose/statuschange";
                                var params = {
                                    diagnoseId: diagnoseId,
                                    //1 means delete
                                    status: 1
                                }
                                $.ajax({
                                    url: url,
                                    data: params,
                                    dataType: 'json',
                                    type: 'POST',
                                    success: function(data) {
                                        if (data.status != 0) {
                                            this.onError(data);

                                        } else {
                                            Messenger().post({
                                                message: '删除诊断成功',
                                                type: 'success',
                                                showCloseButton: true
                                            });
                                            that.appInstance.modalRegion.close();

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

                                    }
                                });
                            },
                            callbackContext: that
                        });
                        this.appInstance.modalRegion.show(modalView);


                    }


                }, this));

                //doctor audit
                ReqCmd.reqres.setHandler("kefuEntity:getDoctorAuditWithAmount:fetch", Lodash.bind(function(instance) {
                    if (this.doctorAuditCollection) {
                        this.doctorAuditCollection.reset(this.doctorAuditModel.get('list'));
                        // this.diagnoseListView.render();

                    } else {
                        this.doctorAuditCollection = new KefuEntity.DoctorAuditModelCollection(this.doctorAuditModel.get('list'));
                        this.doctorAuditListView = this.getDoctorAuditListView(this.doctorAuditModel, this.doctorAuditCollection);
                        this.show(this.doctorAuditListView, {
                            client: true,
                            region: this.layoutView.doctorAuditRegion
                        });
                    }

                }, this));


                //confirm audit
                ReqCmd.commands.setHandler("DoctorAuditListItemView:confirmHandler", Lodash.bind(function(userId) {

                    if (userId) {
                        var ModalModel = Backbone.Model.extend({});
                        var modalModel = new ModalModel();
                        modalModel.set("userId", userId);
                        var modalView = new ModalView.UpdateDoctorInfo({
                            model: modalModel
                        });
                        this.appInstance.modalRegion.show(modalView);
                    }

                }, this));

                //delete doctor audit
                ReqCmd.commands.setHandler("DoctorAuditListItemView:deleteHandler", Lodash.bind(function(userId) {
                    if (userId) {
                        var that = this;
                        var ModalModel = Backbone.Model.extend({});
                        var modalModel = new ModalModel();
                        modalModel.set("content", "删除医生注册请求");
                        var modalView = new ModalView.ConfirmModalView({
                            model: modalModel,
                            callback: function() {
                                var url = "/doctor/statuschange";
                                var params = {
                                    userId: userId,
                                    //1 means delete
                                    status: 1
                                }
                                $.ajax({
                                    url: url,
                                    data: params,
                                    dataType: 'json',
                                    type: 'POST',
                                    success: function(data) {
                                        if (data.status != 0) {
                                            this.onError(data);

                                        } else {
                                            Messenger().post({
                                                message: '删除医生注册申请成功',
                                                type: 'success',
                                                showCloseButton: true
                                            });
                                            that.appInstance.modalRegion.close();

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

                                    }
                                });
                            },
                            callbackContext: that
                        });
                        this.appInstance.modalRegion.show(modalView);


                    }


                }, this));


                //inject hospital list,skill list for update doctor modal
                ReqCmd.reqres.setHandler("UpdateDoctorInfo:onShow", Lodash.bind(function() {
                    console.log("UpdateDoctorInfo:onShow");
                    this.getSelectView(this.hospitalList, '#hospitalSelect').render();
                    this.getSelectView(this.skillList, '#skillSelect').render();
                    this.getSelectView(this.departmentList, '#departmentSelect').render();

                }, this));


                //update doctor info submit
                ReqCmd.commands.setHandler("UpdateDoctorInfo:submitHandler", Lodash.bind(function(params) {
                    if (params) {
                        var that = this;
                        var url = "/doctor/updateinfo";
                        $.ajax({
                            url: url,
                            data: params,
                            dataType: 'json',
                            type: 'POST',
                            success: function(data) {
                                if (data.status != 0) {
                                    this.onError(data);

                                } else {
                                    Messenger().post({
                                        message: '成功注册医生',
                                        type: 'success',
                                        showCloseButton: true
                                    });
                                    that.appInstance.modalRegion.close();
                                    var params = {};
                                    KefuEntity.API.getDoctorAuditWithAmount(params, that.doctorAuditModel);

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

                            }
                        });

                    }

                }, this));



                //for sharing
                ReqCmd.reqres.setHandler("kefuEntity:getSharingAuditWithAmount:fetch", Lodash.bind(function(instance) {
                    if (this.sharingAuditCollection) {
                        this.sharingAuditCollection.reset(this.sharingAuditModel.get('list'));
                        // this.diagnoseListView.render();

                    } else {
                        this.sharingAuditCollection = new KefuEntity.SharingAuditModelCollection(this.sharingAuditModel.get('list'));
                        this.sharingListView = this.getSharingAuditListView(this.sharingAuditModel, this.sharingAuditCollection);
                        this.show(this.sharingListView, {
                            client: true,
                            region: this.layoutView.sharingAuditRegion
                        });
                    }

                }, this));

                //confirm
                ReqCmd.commands.setHandler("SharingListItemView:acceptLinkHandler", Lodash.bind(function(sharingId) {
                    if (sharingId) {
                        var that = this;
                        var url = "/diagnosecomment/statuschange";
                        var params = {
                            id:sharingId,
                            status:0
                        }
                        $.ajax({
                            url: url,
                            data: params,
                            dataType: 'json',
                            type: 'POST',
                            success: function(data) {
                                if (data.status != 0) {
                                    this.onError(data);

                                } else {
                                    Messenger().post({
                                        message: '成功审核分享',
                                        type: 'success',
                                        showCloseButton: true
                                    });

                                    KefuEntity.API.getSharingAuditWithAmount({}, that.sharingAuditModel);

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

                            }
                        });

                    }


                }, this));

                //delete
                ReqCmd.commands.setHandler("SharingListItemView:deleteHandler", Lodash.bind(function(sharingId) {
                    if (sharingId) {
                        var that = this;
                        var ModalModel = Backbone.Model.extend({});
                        var modalModel = new ModalModel();
                        modalModel.set("content", "删除这个分享");
                        var modalView = new ModalView.ConfirmModalView({
                            model: modalModel,
                            callback: function() {
                                var url = "/diagnosecomment/statuschange";
                                var params = {
                                    id: sharingId,
                                    //1 means delete
                                    status: 1
                                }
                                $.ajax({
                                    url: url,
                                    data: params,
                                    dataType: 'json',
                                    type: 'POST',
                                    success: function(data) {
                                        if (data.status != 0) {
                                            this.onError(data);

                                        } else {
                                            Messenger().post({
                                                message: '删除分享成功',
                                                type: 'success',
                                                showCloseButton: true
                                            });
                                            that.appInstance.modalRegion.close();

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

                                    }
                                });
                            },
                            callbackContext: that
                        });
                        this.appInstance.modalRegion.show(modalView);


                    }


                }, this));

                //gratitude view
                ReqCmd.reqres.setHandler("kefuEntity:getGratitudeAuditWithAmount:fetch", Lodash.bind(function(instance) {
                    if (this.gratitudeAuditCollection) {
                        this.gratitudeAuditCollection.reset(this.gratitudeAuditModel.get('list'));
                        // this.diagnoseListView.render();

                    } else {
                        this.gratitudeAuditCollection = new KefuEntity.GratitudeAuditModelCollection(this.gratitudeAuditModel.get('list'));
                        this.gratitudeListView = this.getGratitudeAuditListView(this.gratitudeAuditModel, this.gratitudeAuditCollection);
                        this.show(this.gratitudeListView, {
                            client: true,
                            region: this.layoutView.gratitudeAuditRegion
                        });
                    }

                }, this));

                //confirm
                ReqCmd.commands.setHandler("GratitudeListItemView:acceptLinkHandler", Lodash.bind(function(gratitudeId) {
                    if (gratitudeId) {
                        var that = this;
                        var url = "/gratitude/changestatus";
                        var params = {
                            id:gratitudeId,
                            status:0
                        }
                        $.ajax({
                            url: url,
                            data: params,
                            dataType: 'json',
                            type: 'POST',
                            success: function(data) {
                                if (data.status != 0) {
                                    this.onError(data);

                                } else {
                                    Messenger().post({
                                        message: '成功审核感谢信',
                                        type: 'success',
                                        showCloseButton: true
                                    });

                                    KefuEntity.API.getGratitudeAuditWithAmount({}, that.gratitudeAuditModel);

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

                            }
                        });

                    }


                }, this));

                //delete
                ReqCmd.commands.setHandler("GratitudeListItemView:deleteHandler", Lodash.bind(function(gratitudeId) {
                    if (gratitudeId) {
                        var that = this;
                        var ModalModel = Backbone.Model.extend({});
                        var modalModel = new ModalModel();
                        modalModel.set("content", "删除这个感谢信");
                        var modalView = new ModalView.ConfirmModalView({
                            model: modalModel,
                            callback: function() {
                                var url = "/gratitude/changestatus";
                                var params = {
                                    id: gratitudeId,
                                    //1 means delete
                                    status: 1
                                }
                                $.ajax({
                                    url: url,
                                    data: params,
                                    dataType: 'json',
                                    type: 'POST',
                                    success: function(data) {
                                        if (data.status != 0) {
                                            this.onError(data);

                                        } else {
                                            Messenger().post({
                                                message: '删除感谢信成功',
                                                type: 'success',
                                                showCloseButton: true
                                            });
                                            that.appInstance.modalRegion.close();

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

                                    }
                                });
                            },
                            callbackContext: that
                        });
                        this.appInstance.modalRegion.show(modalView);


                    }


                }, this));

            },
            getKfPageLayoutView: function() {
                return new View.KfPageLayoutView();
            },
            getDisplayPayLinkModalView: function(model) {
                return new View.DisplayPayLinkModalView({
                    model: model
                });
            },
            getDiagnoseListView: function(model, collection) {
                var itemView = View.DiagnoseListItemView;
                return new View.DiagnoseListView({
                    model: model,
                    itemView: itemView,
                    collection: collection
                })

            },
            getDoctorAuditListView: function(model, collection) {
                var itemView = View.DoctorAuditListItemView;
                return new View.DoctorAuditListView({
                    model: model,
                    itemView: itemView,
                    collection: collection
                })
            },
            getSharingAuditListView: function(model, collection) {
                var itemView = View.SharingAuditListItemView;
                return new View.SharingAuditListView({
                    model: model,
                    itemView: itemView,
                    collection: collection
                })
            },
            getGratitudeAuditListView: function(model, collection) {
                var itemView = View.GratitudeAuditListItemView;
                return new View.GratitudeAuditListView({
                    model: model,
                    itemView: itemView,
                    collection: collection
                })
            },
            getSelectView: function(collection, el) {
                return new CommonView.SelectCollectionView({
                    collection: collection,
                    itemView: CommonView.SelectItemView,
                    el: el
                })
            }

        });

        return KfController;

    });