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
		initialize: function() {

		},
		template: "messageItem",
		ui: {
			"messageLink": ".message-link",
			"openBtn": ".open-btn",
			"closeBtn": ".close-btn",
			"messageContent":".message-content-wrapper > p"
		},
		events: {
			"click @ui.openBtn": "changeReadStatus",
			"click @ui.closeBtn": "closeMessage"
		},
		closeMessage: function(e) {
			this.ui.closeBtn.hide();
			this.ui.openBtn.show();
			this.ui.messageContent.removeClass("open");


		},
		changeReadStatus: function(e) {
			e.stopPropagation();
			e.preventDefault();
			this.ui.openBtn.hide();
			this.ui.closeBtn.show();
			this.ui.messageContent.addClass("open");
			var messageId = $(e.target).closest('li').data('id');
			var parentId = $(e.target).closest('ul').attr("id");
			//console.log(parentId);
			if (messageId && parentId == 'unread-message-region') {
				$.ajax({
					url: '/message/' + messageId + '/remark.json',
					dataType: 'json',
					type: 'POST',
					success: function(data) {
						if (data.status != 0) {
							this.onError(data);

						} else {
							Messenger().post({
								message: 'SUCCESS read message.',
								type: 'success',
								showCloseButton: true
							});

						}
					},
					onError: function(res) {
						//var error = jQuery.parseJSON(data);
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
			//$(this).trigger('click');
			//if have url , then link to , if not , use type to send event
			// var href = $(e.target).closest('a').attr('href');
			// var $sidelink = $("li").find('a[name="' + href + '"]');
			// $sidelink.click();

			// ReqCmd.commands.execute('doctorHomePageLayoutView:changeContentView','diagnoseLink');


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
		MessageListView: MessageListView,
		MessageItemView: MessageItemView
	}
});