(function() {
	"use strict";
	$('body').show();
	$(document).ready(function() {
		$('#about-tab a').click(function(e) {
			e.preventDefault();
			$(this).tab('show');
		});		
	});


})();