define(['utils/reqcmd', 'lodash', 'marionette', 'templates', 'dust', 'dustMarionette', "bootstrap"], function(ReqCmd, Lodash, Marionette, Templates) {
	// body...
	"use strict";
	var MessageListView = Marionette.CollectionView.extend({
		initialize: function(options) {
			console.log("initialize MessageListView")

		},
		onRender: function() {
			console.log("MessageListView render");

		},

		onCollectionRendered: function() {
			console.log("MessageListView render");
		}
	});

	var MessageItemView = Marionette.ItemView.extend({
		initialize: function() {},
		template: "messageItem",
		ui: {
		},
		events: {
		},
		onRender: function() {
			//console.log("item render");
			// get rid of that pesky wrapping-div
			// assumes 1 child element			
			this.$el = this.$el.children();
			this.setElement(this.$el);
		}
	});


	return {
		MessageListView:MessageListView,
		MessageItemView: MessageItemView
	}
});