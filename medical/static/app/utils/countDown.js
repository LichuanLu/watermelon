define([], function() {
	"use strict";
	$.fn.countDown = function(options) {
		var defaults = {
			seconds:60,
			callback:'',
			defaultText:'重新获取'
		}
		var options = $.extend(defaults, options);
		var chain = this.each(function() {
			var $this = $(this);
			$this.html(options.defaultText);
			countDownFun($this,options.seconds,options.defaultText,options.callback);

		});
		function countDownFun ($elm,second,defaultText,callback) {
			if(second > 0){
				$elm.attr('disabled','disabled');
				var newText = second+'秒后'+defaultText;
				$elm.html(newText);
				second--;
				setTimeout(function(){countDownFun($elm,second,defaultText);},1000);
			}else{
				$elm.removeAttr('disabled');
				$elm.html(defaultText);
				if(typeof callback === 'function'){
					callback.call(this);
				}
			}	
		}		
	};

});



