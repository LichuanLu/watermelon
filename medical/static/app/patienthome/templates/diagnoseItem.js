(function(){dust.register("diagnoseItem",body_0);function body_0(chk,ctx){return chk.write("<tr><td>").reference(ctx.get(["diagnosenumber"], false),ctx,"h").write("</td><td>").reference(ctx.get(["date"], false),ctx,"h").write("</td><td>").reference(ctx.get(["doctorName"], false),ctx,"h").write("</td><td>").reference(ctx.get(["patientName"], false),ctx,"h").write("</td><!-- \t<td>").reference(ctx.get(["section"], false),ctx,"h").write("</td>-->\t").helper("if",ctx,{"else":body_1,"block":body_2},{"cond":body_3}).write("<td class=\"action-group\">").helper("if",ctx,{"block":body_4},{"cond":body_5}).helper("if",ctx,{"block":body_6},{"cond":body_7}).helper("if",ctx,{"block":body_8},{"cond":body_9}).helper("if",ctx,{"block":body_10},{"cond":body_14}).write("</td><td class=\"detail-wrapper\">").helper("if",ctx,{"block":body_15},{"cond":body_16}).write("</td></tr>");}function body_1(chk,ctx){return chk.write("<td>").reference(ctx.get(["status"], false),ctx,"h").write("</td>");}function body_2(chk,ctx){return chk.write("<td>").reference(ctx.get(["status"], false),ctx,"h").write("  <a href=\"#").reference(ctx.get(["id"], false),ctx,"h").write("\" class=\"warning\"><span class=\"fui-question\"></span></a></td>");}function body_3(chk,ctx){return chk.write("'").reference(ctx.get(["statusId"], false),ctx,"h").write("' == '7'");}function body_4(chk,ctx){return chk.write("<a href=\"/applyDiagnose?diagnoseid=").reference(ctx.get(["id"], false),ctx,"h").write("\" target=\"_blank\">修改</a><a class=\"rm-diagnose-link action-link\" href=\"#\">删除</a>");}function body_5(chk,ctx){return chk.write("'").reference(ctx.get(["statusId"], false),ctx,"h").write("' == '0'");}function body_6(chk,ctx){return chk.write("<a class=\"detail-link\" href=\"#\">查看原因</a>");}function body_7(chk,ctx){return chk.write("'").reference(ctx.get(["statusId"], false),ctx,"h").write("' == '7'");}function body_8(chk,ctx){return chk.write("<a href=\"/help/center\" target=\"_blank\">联系客服</a><a class=\"rm-diagnose-link action-link\" href=\"#\">撤销</a>");}function body_9(chk,ctx){return chk.write("'").reference(ctx.get(["statusId"], false),ctx,"h").write("' == '2'");}function body_10(chk,ctx){return chk.write("<a href=\"/diagnose/").reference(ctx.get(["id"], false),ctx,"h").write("/pdf\" target=\"_blank\">查看报告</a><a href=\"").reference(ctx.get(["reportUrl"], false),ctx,"h").write("\" target=\"_blank\">下载</a>").helper("if",ctx,{"else":body_11,"block":body_12},{"cond":body_13});}function body_11(chk,ctx){return chk.write("<a href=\"#\" class=\"sharing-link action-link\">评价</a>");}function body_12(chk,ctx){return chk;}function body_13(chk,ctx){return chk.reference(ctx.get(["isFeedback"], false),ctx,"h");}function body_14(chk,ctx){return chk.write("'").reference(ctx.get(["statusId"], false),ctx,"h").write("' == '6'");}function body_15(chk,ctx){return chk.write("<a class=\"detail-link\" href=\"#\">详细<span class=\"fui-arrow-right\"></span></a>");}function body_16(chk,ctx){return chk.write("'").reference(ctx.get(["statusId"], false),ctx,"h").write("' != '0'");}return body_0;})();