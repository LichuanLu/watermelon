(function(){dust.register("myDiagnoseItem",body_0);function body_0(chk,ctx){return chk.write("<tr><td>").reference(ctx.get(["diagnosenumber"], false),ctx,"h").write("</td><td>").reference(ctx.get(["date"], false),ctx,"h").write("</td><td>").reference(ctx.get(["doctorName"], false),ctx,"h").write("</td><td>").reference(ctx.get(["doctorHispital"], false),ctx,"h").write("</td><td>").reference(ctx.get(["patientName"], false),ctx,"h").write("</td><td>").reference(ctx.get(["positionName"], false),ctx,"h").write("</td><td>").reference(ctx.get(["status"], false),ctx,"h").write("</td><td class=\"action-group\">").helper("if",ctx,{"block":body_1},{"cond":body_2}).write("</td></tr>");}function body_1(chk,ctx){return chk.write("<a id=\"start-diagnose-link\" href=\"#\" class=\"\">初诊断</a><a href=\"").reference(ctx.get(["dicomUrl"], false),ctx,"h").write("\" target=\"_blank\" class=\"\">下载DICOM</a>");}function body_2(chk,ctx){return chk.write("'").reference(ctx.get(["statusId"], false),ctx,"h").write("' == '4'");}return body_0;})();