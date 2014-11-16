define(['lodash', 'config/base/constant', 'config/controllers/_base_controller',
		'patienthome/show/show_view', 'utils/reqcmd', 'entities/diagnoseEntity',
		'entities/messageEntity', 'message/show/show_view',
		 'entities/favoriteEntity', 'entities/userInfoEntity','entities/consultEntity',
		 'common/common_view','modal/modal_view','doctorhome/show/show_view'
	],
	function(Lodash, CONSTANT, BaseController, View, ReqCmd,
		DiagnoseEntity, MessageEntity, MessageView, FavoriteEntity, UserInfoEntity,ConsultEntity,
		CommonView,ModalView,DoctorView) {
		"use strict";
		var ShowController = BaseController.extend({
			initialize: function() {

				this.layoutView = this.getPatientHomePageLayoutView();
				this.appInstance = require('app');

				this.show(this.layoutView, {
					name: "patientHomePageLayoutView",
					//as bindAll this,so don't need that
					instance: this
				});

				//instance is this controller instance
				ReqCmd.commands.setHandler("patientHomePageLayoutView:attached", Lodash.bind(function(instance) {
					console.log("attached end");
					this.userId = $('#patienthome-content').data('userid');
					this.layoutView.attachEndHandler();

				}, this));


				//click left menu , change view , send from view 
				ReqCmd.commands.setHandler("patientHomePageLayoutView:changeContentView", Lodash.bind(function(viewName) {
					console.log("patientHomePageLayoutView changeContentView");
					this.changeContentView(viewName);
				}, this));

				//diagnose list , change type , click search, send from view
				ReqCmd.commands.setHandler("DiagnoseListView:searchDiagnose", Lodash.bind(function(type) {
					console.log("DiagnoseListView searchDiagnose");
					var params = {
						type: type
					};
					console.dir(params);
					if (this.diagnoseCollection) {
						DiagnoseEntity.API.getPatientDiagnoseList(params, this.diagnoseCollection);

					} else {
						this.diagnoseCollection = DiagnoseEntity.API.getPatientDiagnoseList(params);
					}
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


				//提交sharing
				ReqCmd.commands.setHandler("submitSharing:SharingModalView", Lodash.bind(function(data) {
					var that = this;
					$.ajax({
						url: '/addDiagnoseComment.json',
						data: data,
						dataType: 'json',
						type: 'POST',
						success: function(data) {
							if (data.status != 0) {
								this.onError(data);

							} else {
								that.appInstance.modalRegion.close();
								Messenger().post({
									message: 'SUCCESS.Submit sharing.',
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

				}, this));

				//after favorite layout show, init favorite list
				ReqCmd.reqres.setHandler("onShow:FavoriteLayoutView", Lodash.bind(function() {
					var userId = $('#patienthome-content').data('userid');
					if (userId) {
						this.favoriteDoctorCollection = FavoriteEntity.API.getFavoriteList({
							type: 0
						}, userId);

						this.favoriteDoctorCollectionView = this.getFavoriteListView(this.favoriteDoctorCollection);
						this.show(this.favoriteDoctorCollectionView, {
							region: this.contentView.doctorListRegion,
							client: true
						});

					}

				}, this));


				//confirm remove favorite
				ReqCmd.commands.setHandler("removeFavorite:CancelFavoriteModalView", Lodash.bind(function(model) {
					var that = this;
					var favoriteId = model.get('id');
					if (favoriteId) {
						$.ajax({
							url: '/userFavorties/' + favoriteId + '/cancel',
							dataType: 'json',
							type: 'POST',
							success: function(data) {
								if (data.status != 0) {
									this.onError(data);

								} else {
									that.appInstance.modalRegion.close();
									//delete the view from collection
									that.favoriteDoctorCollection.remove(model);
									Messenger().post({
										message: 'SUCCESS.remove favorite.',
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

				//click detail at diagnose list item
				ReqCmd.commands.setHandler("detailLinksHandler:DiagnoseTableItemView", Lodash.bind(function(model) {
					this.contentView.hideView();
					// $('#diagnose-detail-track-wrapper').show();
					var params = "diagnoseId=" + model.get('id');
					var diagnosePatientDetailModel = DiagnoseEntity.API.getDiagnosePatientDetail(params);

					this.diagnoseDetailTrackLayoutView = this.getDetailTrackLayoutView(diagnosePatientDetailModel);
					this.show(this.diagnoseDetailTrackLayoutView, {
						region: this.layoutView.diagnoseDetailTrackRegion,
						client: true
					});


				}, this));

				//click back link ,back to diagnose list from detail page
				ReqCmd.reqres.setHandler("backLinkHandler:DetailTrackLayoutView", Lodash.bind(function() {
					this.layoutView.diagnoseDetailTrackRegion.close();
					this.contentView.showAndRefreshView();

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
						ConsultEntity.API.getConsultDetailCollection(params, this.consultDetailCollection, "user", this.userId);

					} else {
						this.consultDetailCollection = ConsultEntity.API.getConsultDetailCollection(params, "", "user", this.userId);
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
					params.type = 0;
					ConsultEntity.API.addConsult(params, function() {
						//refetch the detail collection
						var params = {
							source_id: this.consultDetailModel.get("id")
						}
						ConsultEntity.API.getConsultDetailCollection(params, this.consultDetailCollection, "user", this.userId);
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
						var isDoctor = false;
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
					params+="&type=0";
					var url = "/consult/add";
					$.ajax({
						url: url,
						dataType: 'json',
						type: 'POST',
						data:params,
						success: function(data) {
							if (data.status != 0) {
								this.onError(data);

							} else {
								Messenger().post({
									message: '添加咨询成功',
									type: 'success',
									showCloseButton: true
								});
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



				console.log('show controller init end');

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
					ConsultEntity.API.getConsultCollection(params, this.consultCollection, "user", this.userId);

				} else {
					this.consultCollection = ConsultEntity.API.getConsultCollection(params, "", "user", this.userId);
				}
			},
			changeContentView: function(viewName) {
				this.layoutView.diagnoseDetailTrackRegion.close();

				if (viewName === 'diagnoseLink') {
					this.diagnoseCollection = DiagnoseEntity.API.getPatientDiagnoseList();
					this.contentView = this.getDiagnoseListView(this.diagnoseCollection);

				} else if (viewName === 'accountLink') {
					//type = 2 means patient , type =1 means doctor
					var params = {
						type: 2
					}
					this.userInfoModel = UserInfoEntity.API.getUserInfo(params);
					this.contentView = this.getAccountManageLayoutView(this.userInfoModel);


				} else if (viewName === 'messageLink') {
					this.contentView = this.getMessageLayoutView();
				} else if (viewName === 'favoritesLink') {
					this.contentView = this.getFavoriteLayoutView();
				}else if (viewName === 'consultLink') {
					this.contentView = this.getConsultLayoutView();
				}
				// var that = this;
				this.show(this.contentView, {
					region: this.layoutView.contentRegion,
					client: true
				});
			},
			getPatientHomePageLayoutView: function() {
				return new View.PatientHomePageLayoutView();
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
			getMessageLayoutView: function() {
				return new View.MessageLayoutView();
			},
			getMessageListView: function(collection) {
				return new MessageView.MessageListView({
					collection: collection,
					itemView: MessageView.MessageItemView
				});
			},
			getFavoriteLayoutView: function() {
				return new View.FavoriteLayoutView();
			},
			getFavoriteListView: function(collection) {
				var view = new View.FavoriteCollectionView({
					collection: collection,
					itemView: View.FavoriteItemView
				});
				return view;
			},
			getDetailTrackLayoutView: function(model) {
				return new View.DetailTrackLayoutView({
					model: model
				});

			},
			getConsultLayoutView: function() {
				return new View.ConsultLayoutView();

			},
			getConsultListView: function(model, collection) {
				return new DoctorView.ConsultListView({
					model: model,
					collection: collection,
					itemView: DoctorView.ConsultListItemView
				})
			},
			getConsultDetailListView: function(model, collection) {
				return new DoctorView.ConsultDetailListView({
					model: model,
					collection: collection,
					itemView: DoctorView.ConsultDetailItemView
				})
			},
			getConsultDetailLayoutView: function(model) {
				return new DoctorView.ConsultDetailLayoutView({
					model: model
				})
			},
			getConsultDiagnoseView: function(model) {
				return new DoctorView.ConsultDiagnoseView({
					model: model
				})
			},
			getSelectView: function(collection, el) {
				return new CommonView.SelectCollectionView({
					collection: collection,
					itemView: CommonView.DiagnoseSelectItemView,
					el: el
				})
			}

		});

		return ShowController;

	});