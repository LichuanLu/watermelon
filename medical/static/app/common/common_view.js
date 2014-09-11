define(['utils/reqcmd', 'lodash', 'marionette', 'templates', 'dust',
 'dustMarionette', "bootstrap",'jquery.imgareaselect'], function(ReqCmd, Lodash, Marionette, Templates) {
	// body...
	"use strict";
	var SelectCollectionView = Marionette.CollectionView.extend({
		initialize: function() {

		},
		onRender: function() {
			console.log("SelectCollectionView render");
			//multi select
			this.$el.multiselect({
				enableFiltering: true,
				filterPlaceholder: "搜索",
				nonSelectedText: "没有选中"
				// buttonWidth: '300px'
			});
		},
		onAfterItemAdded: function(itemView) {

		},
		onDomRefresh: function() {
		},
		onShow: function() {
			console.log("SelectCollectionView onShow");
			//init the modal onshow
		},
		itemViewOptions: function() {}
	});

	var SelectItemView = Marionette.ItemView.extend({
		initialize: function() {
			console.log("init SelectItemView");
			this.listenTo(this.model, 'change', this.render, this);
		},
		template: "selectItemView",
		onRender: function() {
			console.log("item render");
			// get rid of that pesky wrapping-div
			// assumes 1 child element			
			this.$el = this.$el.children();
			this.setElement(this.$el);
		},
		ui: {},
		events: {},
		onShow: function() {
			console.log("SelectItemView onShow");
		}
	});


	var DiagnoseSelectItemView = Marionette.ItemView.extend({
		initialize: function() {
			console.log("init SelectItemView");
			this.listenTo(this.model, 'change', this.render, this);
		},
		template: "diagnoseSelectItemView",
		onRender: function() {
			console.log("item render");
			// get rid of that pesky wrapping-div
			// assumes 1 child element			
			this.$el = this.$el.children();
			this.setElement(this.$el);
		},
		ui: {},
		events: {},
		onShow: function() {
			console.log("SelectItemView onShow");
		}
	});

	return {
		
		SelectCollectionView:SelectCollectionView,
		SelectItemView:SelectItemView,
		DiagnoseSelectItemView:DiagnoseSelectItemView
	}
});