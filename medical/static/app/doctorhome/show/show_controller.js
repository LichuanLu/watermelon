define(['lodash', 'config/base/constant', 'config/controllers/_base_controller',
		'doctorhome/show/show_view', 'utils/reqcmd', 'entities/diagnoseEntity',
		'entities/messageEntity', 'entities/consultEntity', 'entities/userInfoEntity','entities/incomeEntity',
		'message/show/show_view', 'common/common_view', 'modal/modal_view', 'stats/income/income_view'
	],
	function(Lodash, CONSTANT, BaseController, View, ReqCmd, DiagnoseEntity, MessageEntity, ConsultEntity,
		UserInfoEntity,IncomeEntity , MessageView, CommonView, ModalView, IncomeView) {
		// body...
		"use strict";
		var ShowController = BaseController.extend({
			initialize: function() {

				this.layoutView = this.getDoctorHomePageLayoutView();
				this.appInstance = require('app');

				this.show(this.layoutView, {
					name: "doctorHomePageLayoutView",
					//as bindAll this,so don't need that
					instance: this
				});

				//instance is this controller instance
				ReqCmd.commands.setHandler("doctorHomePageLayoutView:attached", Lodash.bind(function(instance) {
					console.log("attached end");
					this.doctorId = $('#doctorhome-content').data('doctorid');
					this.layoutView.attachEndHandler();
				}, this));



				//click left menu , change view , send from view 
				ReqCmd.commands.setHandler("doctorHomePageLayoutView:changeContentView", Lodash.bind(function(viewName) {
					console.log("doctorHomePageLayoutView changeContentView");
					this.changeContentView(viewName);
				}, this));

				//diagnose list , change type , click search, send from view
				ReqCmd.commands.setHandler("DiagnoseListView:searchDiagnose", Lodash.bind(function(params) {
					console.log("DiagnoseListView searchDiagnose");
					// var params = {
					// 	type: type
					// };
					console.dir(params);
					if (this.diagnoseCollection) {
						DiagnoseEntity.API.getDiagnoseList(params, this.diagnoseCollection);

					} else {
						this.diagnoseCollection = DiagnoseEntity.API.getDiagnoseList(params);
					}
				}, this));

				//doctor click the action link , e.g. add diagnose
				ReqCmd.commands.setHandler("DiagnoseTableItemView:actionHandler", Lodash.bind(function(model) {
					console.log("DiagnoseTableItemView actionHandler");
					var statusId = model.get('statusId');
					if (statusId == 5) {
						this.detailModel = DiagnoseEntity.API.getDiagnoseDetail({
							diagnoseId: model.get('id')
						});
						if (typeof this.diagnoseActionView !== 'undefined') {
							this.diagnoseActionView.close();
						}
						this.diagnoseActionView = this.getNewDiagnoseLayoutView(this.detailModel);

					} else if (statusId == '审核') {
						if (typeof this.diagnoseActionView !== 'undefined') {
							this.diagnoseActionView.close();
						}
						var auditModel = DiagnoseEntity.API.getExistsDiagnose({
							diagnoseId: model.get('id')
						});
						this.diagnoseActionView = this.getNewAuditLayoutView(auditModel);
					}

					this.show(this.diagnoseActionView, {
						region: this.layoutView.newDiagnoseRegion,
						client: true
					});


				}, this));


				//close diagnose region
				ReqCmd.reqres.setHandler("NewDiagnoseLayoutView:closeRegion", Lodash.bind(function() {
					this.layoutView.newDiagnoseRegion.close();
					this.contentView.initDiagnoseListView();

				}, this));



				//show message list after layout show
				ReqCmd.reqres.setHandler("showMessageList:MessageLayoutView", Lodash.bind(function() {

					this.unreadMessageCollection = MessageEntity.API.getMessageList({
						status: 0
					});
					this.unreadMessageCollectionView = this.getMessageListView(this.unreadMessageCollection);
					this.show(this.unreadMessageCollectionView, {
						region: this.contentView.unReadMessageRegion,
						client: true
					});

					this.readMessageCollection = MessageEntity.API.getMessageList({
						status: 2
					});
					this.readMessageCollectionView = this.getMessageListView(this.readMessageCollection);
					this.show(this.readMessageCollectionView, {
						region: this.contentView.readMessageRegion,
						client: true
					});


				}, this));


				//close the bind mobile modal
				ReqCmd.reqres.setHandler("MobileBindModalView:submit:success", Lodash.bind(function() {
					this.appInstance.modalRegion.close();

				}, this));


				//Consult layout on show
				ReqCmd.reqres.setHandler("ConsultLayoutView:onshow", Lodash.bind(function() {
					var Model = Backbone.Model.extend({});
					this.consultFilterModel = new Model();

					var params = {
						status: 0
					};
					this.consultFilterModel.set("filter", 0);
					this.getConsultCollection(params);
				}, this));

				//consult collection fetch
				ReqCmd.reqres.setHandler("consultEntity:getConsultCollection:fetch", Lodash.bind(function() {
					console.log("consultEntity:getConsultCollection:fetch");
					this.showConsultListView();
				}, this));
				//search consult
				ReqCmd.commands.setHandler("ConsultListView:searchConsult", Lodash.bind(function(params, filterValue) {
					this.consultFilterModel.set("filter", filterValue);
					this.getConsultCollection(params);
				}, this));

				//click 查看 from consult list item
				ReqCmd.commands.setHandler("ConsultListItemView:checkDetail", Lodash.bind(function(model) {
					var consultId = model.get("id");
					var changeReadStatusUrl = "/consut/" + consultId + "/read"
					$.ajax({
						url: changeReadStatusUrl,
						dataType: 'json',
						type: 'POST',
						success: function(data) {
							if (data.status != 0) {
								this.onError(data);

							} else {
								Messenger().post({
									message: '咨询已阅读',
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


					this.consultDetailModel = model;

					this.consultDetailLayoutView = this.getConsultDetailLayoutView(this.consultDetailModel);
					if (this.contentView.contentRegion) {
						this.show(this.consultDetailLayoutView, {
							region: this.contentView.contentRegion,
							client: true
						});
					}



				}, this));

				//consult detail collection fetch
				ReqCmd.reqres.setHandler("consultEntity:getConsultDetailCollection:fetch", Lodash.bind(function() {
					console.log("consultEntity:getConsultDetailCollection:fetch");
					//this.consultDetailView.render();
					this.consultDetailListView = this.getConsultDetailListView(this.consultDetailModel, this.consultDetailCollection);
					if (this.consultDetailLayoutView.consultListRegion) {
						this.show(this.consultDetailListView, {
							region: this.consultDetailLayoutView.consultListRegion,
							client: true
						});
					}

				}, this));

				//consult detail layout onshow
				ReqCmd.reqres.setHandler("consultDetailLayoutView:onshow", Lodash.bind(function() {
					console.log("consultDetailLayoutView:onshow");
					//this.consultDetailView.render();
					var params = {
						source_id: this.consultDetailModel.get("id")
					};
					if (this.consultDetailCollection) {
						ConsultEntity.API.getConsultDetailCollection(params, this.consultDetailCollection, "doctor", this.doctorId);

					} else {
						this.consultDetailCollection = ConsultEntity.API.getConsultDetailCollection(params, "", "doctor", this.doctorId);
					}


					//show diagnose detail if related to diagnose
					var diagnoseId = this.consultDetailModel.get("diagnoseId");
					if (diagnoseId) {
						this.diagnoseDetailModel = DiagnoseEntity.API.getDiagnoseDetail({
							diagnoseId: diagnoseId
						});
						this.consultDiagnoseView = this.getConsultDiagnoseView(this.diagnoseDetailModel);
						this.show(this.consultDiagnoseView, {
							region: this.consultDetailLayoutView.diagnoseRegion,
							client: true
						});
					}

				}, this));

				console.log('follow controller init end');

				//consult detail back to consult list
				ReqCmd.reqres.setHandler("ConsultDetailListView:backToList", Lodash.bind(function() {
					console.log("ConsultDetailListView:backToList");
					var params = {
						status: 0
					};
					this.consultFilterModel.set("filter", 0);
					this.getConsultCollection(params);
				}, this));

				//add level two consult comments
				ReqCmd.commands.setHandler("ConsultDetailListView:addComments", Lodash.bind(function(params) {
					console.log("ConsultDetailListView:addComments");
					//type 1 means doctor , 0 means patient
					params.type = 1;
					ConsultEntity.API.addConsult(params, function() {
						//refetch the detail collection
						var params = {
							source_id: this.consultDetailModel.get("id")
						}
						ConsultEntity.API.getConsultDetailCollection(params, this.consultDetailCollection, "doctor", this.doctorId);
					}, this);

				}, this));


				//create consult view on show
				ReqCmd.commands.setHandler("CreateConsultView:onShow", Lodash.bind(function($el) {
					console.log("ConsultDetailListView:addComments");
					var that = this;
					if ($el) {
						var params = {
							type: 6
						}
						var isDoctor = true;
						this.selectData = new DiagnoseEntity.DiagnoseCollection();
						$.when(DiagnoseEntity.API.getDiagnoseListDefer(params, isDoctor, this.selectData)).done(function() {
							that.getSelectView(that.selectData, $el).render();
						});
					}

				}, this));

				//create consult view submit
				ReqCmd.commands.setHandler("CreateConsultView:submitHandler", Lodash.bind(function(params) {
					console.log("CreateConsultView:submitHandler");
					var that = this;
					console.log(params);
					//1 means doctor start, 0 means patient start
					params += "&type=1";
					var url = "/consult/add";
					$.ajax({
						url: url,
						dataType: 'json',
						type: 'POST',
						data: params,
						success: function(data) {
							if (data.status != 0) {
								this.onError(data);

							} else {
								Messenger().post({
									message: '添加咨询成功',
									type: 'success',
									showCloseButton: true
								});
								//refresh the consult list
								var params = {
									status: 0
								};
								that.consultFilterModel.set("filter", 0);
								that.getConsultCollection(params);
								that.appInstance.modalRegion.close();
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

				}, this));

				//click add consult
				ReqCmd.commands.setHandler("ConsultDetailListView:addConsult", Lodash.bind(function() {
					console.log("ConsultDetailListView:addConsult");
					var ModalModel = Backbone.Model.extend({});
					var modalModel = new ModalModel();
					modalModel.set("hasDiagnose", true);
					var modalView = new ModalView.CreateConsultView({
						model: modalModel
					});
					this.appInstance.modalRegion.show(modalView);
				}, this));


				//for doctor roll back
				ReqCmd.commands.setHandler("rollbackDiagnose:NewDiagnoseLayoutView", Lodash.bind(function(model) {
					console.log("rollbackDiagnose");

					var rollbackModalView = this.getRollbackModalView(model);
					this.appInstance.modalRegion.show(rollbackModalView);

				}, this));

				//click submit on roll back diagnose modal
				ReqCmd.commands.setHandler("rollbackDiagnose:RollbackModalView", Lodash.bind(function(diagnoseId, params) {
					console.log("rollbackDiagnose RollbackModalView");
					var that = this;
					if (diagnoseId) {
						$.ajax({
							url: '/diagnose/rollback/' + diagnoseId,
							data: params,
							dataType: 'json',
							type: 'POST',
							success: function(data) {
								if (data.status != 0) {
									this.onError(data);

								} else {
									that.appInstance.modalRegion.close();
									Messenger().post({
										message: '诊断已经成功打回',
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


				}, this));


				//FOR STATS INCOME FEATURE
				ReqCmd.reqres.setHandler("IncomeLayoutView:onshow", Lodash.bind(function(diagnoseId, params) {
					if(this.contentView.summaryRegion){
						this.incomeSummaryModel = IncomeEntity.API.getIncomeSummary();
						var view = new IncomeView.SummaryView({
							model:this.incomeSummaryModel
						})
						this.show(view,{
							region:this.contentView.summaryRegion,
							client:true
						});
					}
				}, this));



			},

			getRollbackModalView: function(model) {
				var view = new View.RollbackModalView({
					model: model
				});
				return view;
			},
			showConsultListView: function() {
				if (this.contentView.contentRegion) {

					var view = this.getConsultListView(this.consultFilterModel, this.consultCollection);
					this.show(view, {
						region: this.contentView.contentRegion,
						client: true
					});
				}

			},
			getConsultCollection: function(params) {
				if (this.consultCollection) {
					ConsultEntity.API.getConsultCollection(params, this.consultCollection, "doctor", this.doctorId);

				} else {
					this.consultCollection = ConsultEntity.API.getConsultCollection(params, "", "doctor", this.doctorId);
				}
			},

			changeContentView: function(viewName) {
				if (typeof this.diagnoseActionView !== 'undefined') {
					this.diagnoseActionView.close();
				}
				if (viewName === 'diagnoseLink') {
					this.diagnoseCollection = DiagnoseEntity.API.getDiagnoseList({
						type: 5
					});
					this.contentView = this.getDiagnoseListView(this.diagnoseCollection);

				} else if (viewName === 'accountLink') {
					//type = 2 means patient , type =1 means doctor
					var params = {
						type: 1
					}
					this.userInfoModel = UserInfoEntity.API.getUserInfo(params);
					this.contentView = this.getAccountManageLayoutView(this.userInfoModel);
				} else if (viewName === 'messageLink') {
					this.contentView = this.getMessageLayoutView();
				} else if (viewName === 'consultLink') {
					this.contentView = this.getConsultLayoutView();
				} else if (viewName === 'statisticLink') {
					this.contentView = this.getIncomeLayoutView();
				}

				// var that = this;
				this.show(this.contentView, {
					region: this.layoutView.contentRegion,
					client: true
				});
			},
			getDoctorHomePageLayoutView: function() {
				return new View.DoctorHomePageLayoutView();
			},
			getDiagnoseListView: function(collection) {
				var view = new View.DiagnoseListView({
					collection: collection,
					itemView: View.DiagnoseTableItemView
				});
				return view;
			},
			getAccountManageLayoutView: function(model) {
				return new View.AccountManageLayoutView({
					model: model
				});
			},
			getNewDiagnoseLayoutView: function(model) {
				return new View.NewDiagnoseLayoutView({
					model: model,
					typeID: 1
				});
			},
			getNewAuditLayoutView: function(model) {
				return new View.NewAuditLayoutView({
					model: model
				});
			},
			getMessageLayoutView: function() {
				return new View.MessageLayoutView();
			},
			getMessageListView: function(collection) {
				return new MessageView.MessageListView({
					collection: collection,
					itemView: MessageView.MessageItemView
				});
			},
			getConsultLayoutView: function() {
				return new View.ConsultLayoutView();

			},
			getConsultListView: function(model, collection) {
				return new View.ConsultListView({
					model: model,
					collection: collection,
					itemView: View.ConsultListItemView
				})
			},
			getConsultDetailListView: function(model, collection) {
				return new View.ConsultDetailListView({
					model: model,
					collection: collection,
					itemView: View.ConsultDetailItemView
				})
			},
			getConsultDetailLayoutView: function(model) {
				return new View.ConsultDetailLayoutView({
					model: model
				})
			},
			getConsultDiagnoseView: function(model) {
				return new View.ConsultDiagnoseView({
					model: model
				})
			},
			getSelectView: function(collection, el) {
				return new CommonView.SelectCollectionView({
					collection: collection,
					itemView: CommonView.DiagnoseSelectItemView,
					el: el
				})
			},
			getIncomeLayoutView: function() {
				return new IncomeView.IncomeLayoutView({

				});
			}

		});

		return ShowController;

	});