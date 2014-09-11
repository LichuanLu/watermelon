define(function(require) {
	"use strict";
	return {
		// _localeView: require('project_setup/templates/localeItem'),
		// localesView: require('project_setup/templates/locales'),
		// productItem: require('project_manage/templates/productItem'),
		// activedProducts: require('project_manage/templates/activedProducts'),
		// retiredProducts: require('project_manage/templates/retiredProducts'),
		// manageProductDetail: require('project_manage/templates/manageProductDetail'),
		// manageProductMain: require('project_manage/templates/manageProductMain'),
		// stringlistItem: require('translate/templates/stringListItem'),
		// stringDetail: require('translate/templates/stringDetail'),
		// suggestionList:require('translate/templates/suggestionList'),
		// suggestionListItem:require('translate/templates/suggestionListItem'),
		// userActivityItem:require('userhome/templates/userActivityItem')
		diagnoseItem:require('patienthome/templates/diagnoseItem'),
		diagnoseLayout:require('patienthome/templates/diagnoseLayout'),
		patientAccountManageLayout:require('patienthome/templates/patientAccountManageLayout'),
		patientMessageLayout:require('patienthome/templates/patientMessageLayout'),
		sharingModal:require('patienthome/templates/sharingModal'),
		favoriteLayout:require('patienthome/templates/favoriteLayout'),
		favoriteItem:require('patienthome/templates/favoriteItem'),
		cancelFavoriteModalView:require('patienthome/templates/cancelFavoriteModalView'),
		detailTrackLayout:require('patienthome/templates/detailTrackLayout'),
		deleteDiagnoseModal:require('patienthome/templates/deleteDiagnoseModal'),




		selectDoctorItem:require('diagnose/templates/selectDoctorItem'),
		selectDoctorList:require('diagnose/templates/selectDoctorList'),
		patientProfile:require('diagnose/templates/patientProfile'),
		dicomInfo:require('diagnose/templates/dicomInfo'),
		pathologyItem:require('diagnose/templates/pathologyItem'),
		successSubmitDiagnoseModal:require('diagnose/templates/successSubmitDiagnoseModal'),

		//template for fenzhen
		allDiagnoseItem:require('admin/fenzhen/templates/allDiagnoseItem'),
		myDiagnoseItem:require('admin/fenzhen/templates/myDiagnoseItem'),
		rollbackDiagnoseModal:require('admin/fenzhen/templates/rollbackDiagnoseModal'),


		displayPayLinkModal:require('admin/kefu/templates/displayPayLinkModal'),



		doctorAccountManageLayout:require('doctorhome/templates/doctorAccountManageLayout'),
		doctorDiagnoseItem:require('doctorhome/templates/doctorDiagnoseItem'),
		doctorDiagnoseLayout:require('doctorhome/templates/doctorDiagnoseLayout'),
		newDiagnoseLayout:require('doctorhome/templates/newDiagnoseLayout'),
		newAuditLayout:require('doctorhome/templates/newAuditLayout'),
		doctorMessageLayout:require('doctorhome/templates/doctorMessageLayout'),

		doctorConsultLayout:require('doctorhome/templates/doctorConsultLayout'),

		consultListView:require('doctorhome/templates/consultListView'),
		consultListItemView:require('doctorhome/templates/consultListItemView'),
		consultDetailLayout:require('doctorhome/templates/consultDetailLayout'),
		consultDetailList:require('doctorhome/templates/consultDetailList'),
		consultDetailItem:require('doctorhome/templates/consultDetailItem'),
		consultDiagnose:require('doctorhome/templates/consultDiagnose'),

		doctorDetailItem:require('doctorList/templates/doctorDetailItem'),
		doctorDetailList:require('doctorList/templates/doctorDetailList'),


		hospitalUserDignoseItem:require('hospitalUserPage/templates/hospitalUserDiagnoseItem'),
		hospitalUserSubmittedDignoseItem:require('hospitalUserPage/templates/hospitalUserSubmittedDiagnoseItem'),
		hospitalUserFileUpload:require('hospitalUserPage/templates/hospitalUserFileUpload'),


		messageItem:require('message/templates/messageItem'),

		//model view
		mobileBindModal:require('modal/templates/mobileBindModal'),
		confirmModal:require('modal/templates/confirmModal'),
		createConsultViewModal:require("modal/templates/createConsultViewModal"),


		//kefu view
		kfDiagnoseListView:require('admin/kefu/templates/diagnoseListView'),
		kfDiagnoseListItemView:require('admin/kefu/templates/diagnoseListItemView'),
		doctorAuditListItemView:require('admin/kefu/templates/doctorAuditListItemView'),
		doctorAuditListView:require('admin/kefu/templates/doctorAuditListView'),

		sharingListView:require('admin/kefu/templates/sharingListView'),
		sharingListItemView:require('admin/kefu/templates/sharingListItemView'),
		gratitudeListView:require('admin/kefu/templates/gratitudeListView'),
		gratitudeListItemView:require('admin/kefu/templates/gratitudeListItemView'),

		updateDoctorInfoModal:require('modal/templates/updateDoctorInfoModal'),

		//common view
		selectItemView:require('common/templates/selectItemView'),
		diagnoseSelectItemView:require('common/templates/diagnoseSelectItemView')

		




	};
});
