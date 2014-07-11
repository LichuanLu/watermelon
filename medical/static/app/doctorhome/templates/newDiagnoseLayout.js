(function(){dust.register("newDiagnoseLayout",body_0);function body_0(chk,ctx){return chk.write("<div id=\"new-diagnose-wrapper\"><div class=\"row header\"><div class=\"\"><span class=\"title\">编辑诊断报告</span><span>诊断日期：").reference(ctx.get(["date"], false),ctx,"h").write("</span><!-- <span>就诊者：").reference(ctx.get(["patientName"], false),ctx,"h").write("</span><span>部位：").reference(ctx.get(["section"], false),ctx,"h").write("</span> --><div class=\"right\"><a id=\"rollback-link\" href=\"#\">打回诊断<span class=\"fui-alert\"></span></a><a href=\"#\">下载DICOM软件<span class=\"fui-alert\"></span></a><a href=\"#\" class=\"close-link\">关闭</a></div></div><!-- <div class=\"alert alert-warning\"><button type=\"button\" class=\"close fui-cross\" data-dismiss=\"alert\"></button><h4>未保存的数据将会丢失，确定关闭？</h4><a href=\"#\" class=\"btn btn-primary\"><span class=\"fui-check-inverted\"></span>确定关闭</a><a href=\"#\" class=\"btn btn-default btn-info\">取消</a></div>--></div><div class=\"row content\"><div id=\"\" class=\"col-md-4\"><div class=\"patient-info\"><span class=\"side-title\">就诊人档案</span><div><span class=\"head\">姓名：</span><span>").reference(ctx.get(["patientName"], false),ctx,"h").write("</span></div><div><span class=\"head\">性别：</span><span>").reference(ctx.get(["gender"], false),ctx,"h").write("</span></div><div><span class=\"head\">出生日期：</span><span>").reference(ctx.get(["birthDate"], false),ctx,"h").write("</span></div><div><span class=\"head\">诊断部位：</span><p>").reference(ctx.get(["positionName"], false),ctx,"h").write("</p></div><div><span class=\"head\">诊断类型：</span><span>").reference(ctx.get(["diagnoseType"], false),ctx,"h").write("</span></div><div><span class=\"head\">DICOM文件：</span><a href=\"").reference(ctx.get(["dicomUrl"], false),ctx,"h").write("\" target=\"_blank\">点击下载</a></div><div><span class=\"head\">曾就诊医院：</span><a href=\"/hospital/").reference(ctx.get(["hospitalId"], false),ctx,"h").write("\">").reference(ctx.get(["hospitalHistory"], false),ctx,"h").write("</a></div><div><span class=\"head\">病史：</span><p>").reference(ctx.get(["caseHistory"], false),ctx,"h").write("</p></div><div><span class=\"head\">诊断相关文件：</span>").section(ctx.get(["docUrl"], false),ctx,{"block":body_1},null).write("</div></div><div class=\"tree-top\"><span class=\"tree-title\">影像诊断模版：</span><a class=\"btn btn-info btn-xs load-template-btn load-btn\">载入模版</a><a class=\"btn btn-default btn-xs load-template-btn loading-btn\" disabled=\"true\" style=\"display:none;\">载入中...</a></div><div id=\"tree\"></div></div><div class=\"col-md-8 form-wrapper\"><span class=\"side-title\">诊断结果：</span><form class=\"form-horizontal\" role=\"form\" id=\"new-diagnose-form\" data-report-id=\"").reference(ctx.get(["reportId"], false),ctx,"h").write("\"><div class=\"form-group\"><label for=\"techDes\" class=\"col-md-3 control-label\">检查技术描述：</label><div class=\"col-md-9 form-body\"><textarea id=\"techDes\" name=\"techDesc\" class=\"form-control\">").reference(ctx.get(["techDes"], false),ctx,"h").write("</textarea></div></div><div class=\"form-group\"><label for=\"imageDes\" class=\"col-md-3 control-label\">影像描述：</label><div class=\"col-md-9 form-body\"><textarea id=\"imageDes\" name=\"imageDesc\" class=\"form-control\">").reference(ctx.get(["imageDes"], false),ctx,"h").write("</textarea></div></div><div class=\"form-group\"><label for=\"diagnoseResult\" class=\"col-md-3 control-label\">诊断意见：</label><div class=\"col-md-9 form-body\"><textarea id=\"diagnoseResult\" name=\"diagnoseDesc\" class=\"form-control\">").reference(ctx.get(["diagnoseResult"], false),ctx,"h").write("</textarea></div></div><div class=\"form-group\"><div class=\"col-md-offset-3 col-md-9\"><button id=\"saveDiagnoseBtn\" type=\"submit\" class=\"btn btn-primary btn-sm submit-btn\">保存草稿</button><button id=\"previewDiagnoseBtn\" type=\"submit\" class=\"btn btn-primary btn-sm submit-btn\">预览诊断书</button><button id=\"submitDiagnoseBtn\" type=\"submit\" class=\"btn btn-primary btn-sm submit-btn\">提交诊断书</button></div></div></form></div></div></div>");}function body_1(chk,ctx){return chk.write("<a href=\"").reference(ctx.getPath(true, []),ctx,"h").write("\" target=\"_blank\">文件下载</a>\n");}return body_0;})();