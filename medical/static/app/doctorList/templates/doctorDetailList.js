(function(){dust.register("doctorDetailList",body_0);function body_0(chk,ctx){return chk.write("<div id=\"doctor-detail-list-wrapper\" class=\"\"><ul class=\"result-list stylenone\"></ul></div><ul class=\"pagination-plain\"><li class=\"previous\"><a href=\"#\">向前</a></li>").helper("pager",ctx,{},{"first":"1","current":body_1,"last":body_2}).write("<li class=\"next\"><a href=\"#\">向后</a></li></ul>");}function body_1(chk,ctx){return chk.reference(ctx.get(["currentPage"], false),ctx,"h");}function body_2(chk,ctx){return chk.reference(ctx.get(["pageNumber"], false),ctx,"h");}return body_0;})();