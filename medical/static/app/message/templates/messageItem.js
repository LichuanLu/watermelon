(function(){dust.register("messageItem",body_0);function body_0(chk,ctx){return chk.write("<li class=\"message-item\" data-id=\"").reference(ctx.get(["id"], false),ctx,"h").write("\"><div class=\"message-link\"><div class=\"icon\"><img alt=\"\" src=\"/static/assets/Icons/PNG/clipboard.png\"></div><div class=\"top-wrapper\"><span class=\"title\">").reference(ctx.get(["title"], false),ctx,"h").write("</span><div class=\"right-content\"><span class=\"date\">").reference(ctx.get(["createTime"], false),ctx,"h").write("</span></div></div><div class=\"message-content-wrapper\"><p>").reference(ctx.get(["content"], false),ctx,"h").helper("if",ctx,{"block":body_1},{"cond":body_2}).write("</p><button class=\"btn btn-info btn-xs open-btn\">展开</button><button class=\"btn btn-info btn-xs close-btn\" style=\"display:none;\">收起</button></div></div></li>");}function body_1(chk,ctx){return chk.write("<a href=\"").reference(ctx.get(["url"], false),ctx,"h").write("\" target=\"_blank\" class=\"ml20\">支付宝支付链接</a>");}function body_2(chk,ctx){return chk.write("'").reference(ctx.get(["url"], false),ctx,"h").write("' != ''");}return body_0;})();