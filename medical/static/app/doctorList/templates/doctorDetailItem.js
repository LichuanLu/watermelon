(function(){dust.register("doctorDetailItem",body_0);function body_0(chk,ctx){return chk.write("<li><div class=\"col-md-6 doctor-detail-preview\" data-user-id=\"").reference(ctx.get(["userId"], false),ctx,"h").write("\"><div class=\"image-preview\"><a href=\"/doctor/site/").reference(ctx.get(["userId"], false),ctx,"h").write("\" target=\"_blank\"><img id=\"\" src=\"").reference(ctx.get(["avatarUrl"], false),ctx,"h").write("\"></a></div><div class=\"doctor-preview-des\"><h6><a href=\"/doctor/site/").reference(ctx.get(["userId"], false),ctx,"h").write("\" target=\"_blank\">").reference(ctx.get(["doctorname"], false),ctx,"h").write("</a><span>").reference(ctx.get(["doctortitle"], false),ctx,"h").write("</span></h6><div class=\"des-wrapper\"><span>医院：</span><a href=\"#\">").reference(ctx.get(["hospitalname"], false),ctx,"h").write("</a></div><div class=\"skill-wrapper\"><span>擅长：</span><span>").reference(ctx.get(["skill"], false),ctx,"h").write("</span></div></div></div><div class=\"col-md-4 doctor-statinfo\"><div class=\"exp-comment\"><p class=\"number\">").reference(ctx.get(["sharingNumber"], false),ctx,"h").write("</p><p>经验分享</p></div><img alt=\"\" src=\"/static/assets/Icons/SVG/retina.svg\"></img><div class=\"feedback-comment\"><p>诊断：").reference(ctx.get(["diagnoseNumber"], false),ctx,"h").write("</p><p>好评：").reference(ctx.get(["goodFeedbackNumber"], false),ctx,"h").write("</p></div></div><div class=\"col-md-2 doctor-action\"><a class=\"btn btn-primary btn-sm apply-btn\" href=\"/applyDiagnose?doctorid=").reference(ctx.get(["id"], false),ctx,"h").write("\" target=\"_blank\">请求诊断</a></div></li>");}return body_0;})();