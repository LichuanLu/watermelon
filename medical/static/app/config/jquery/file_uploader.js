define([], function() {
	"use strict";
	var uploadTemplateStr = "{% for (var i=0, file; file=o.files[i]; i++) { %}" +
		"<tr class=\"template-upload fade\"><td><span class=\"preview\"></span></td><td>" +
		"<p class=\"name\">{%=file.name%}</p>" +
		"<strong class=\"error text-danger\"></strong>" +
		"</td>" +
		"<td>" +
		"<p class=\"size\">处理中...</p>" +
		"<div class=\"progress progress-striped active\" role=\"progressbar\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"0\"><div class=\"progress-bar progress-bar-success\" style=\"width:0%;\"></div></div>" +
		"</td>" +
		"<td>" +
		"{% if (!i && !o.options.autoUpload) { %}" +
		"<button class=\"btn btn-primary start\" disabled>" +
		"<i class=\"glyphicon glyphicon-upload\"></i>" +
		"<span>开始</span>" +
		"</button>" +
		"{% } %}" +
		"{% if (!i) { %}" +
		"<button class=\"btn btn-warning cancel\">" +
		"<i class=\"glyphicon glyphicon-ban-circle\"></i>" +
		"<span>取消</span>" +
		"</button>" +
		"{% } %}" +
		"</td>" +
		"</tr>" +
		"{% } %} ";
	var downloadTemplateStr = "{% for (var i=0, file; file=o.files[i]; i++) { %}" +
		"<tr class=\"template-download fade\">" +
		"<td>" +
		"<span class=\"preview\" id=\"downloadPreview\">" +
		"{% if (file.thumbnailUrl) { %}" +
		"<a href=\"{%=file.url%}\" title=\"{%=file.name%}\" download=\"{%=file.name%}\" data-gallery>" +
		"{% } %}" +
		"</span>" +
		"</td>" +
		"<td>" +
		"<p class=\"name\" id=\"downloadFile\">" +
		"{% if (file.url) { %}" +
		"<a href=\"{%=file.url%}\" class=\"downloadFileLink\" data-fileid=\"{%=file.id%}\" title=\"{%=file.name%}\" download=\"{%=file.name%}\" {%=file.thumbnailUrl?'data-gallery':''%}>{%=file.name%}</a>" +
		"{% } else { %}" +
		"<span>{%=file.name%}</span>" +
		"{% } %}" +
		"</p>" +
		"{% if (file.error) { %}" +
		"<div><span class=\"label label-danger\">Error</span> {%=file.error%}</div>" +
		"{% } %}" +
		"</td>" +
		"<td>" +
		"<span class=\"size\">{%=o.formatFileSize(file.size)%}</span>" +
		"</td>" +
		"<td>" +
		"{% if (file.deleteUrl && deleteURLMatch(file.deleteUrl)) { %}" +
		"<button class=\"btn btn-danger delete\" data-type=\"{%=file.deleteType%}\" data-url=\"{%=file.deleteUrl%}\"{% if (file.deleteWithCredentials) { %} data-xhr-fields='{\"withCredentials\":true}'{% } %}>" +
		"<i class=\"glyphicon glyphicon-trash\"></i>" +
		"<span>删除</span>" +
		"</button>" +
		"{% } else { %}" +
		"<button class=\"btn btn-warning cancel\">" +
		"<i class=\"glyphicon glyphicon-ban-circle\"></i>" +
		"<span>取消</span>" +
		"</button>" +
		"{% } %}" +
		"</td>" +
		"</tr>" +
		"{% } %}";

		var zhCNLocale = {
			'File is too big': '上传文件太大超过限制',
		    'File is too small': '上传文件太小',
		    'Filetype not allowed': '上传文件类型不符合要求'
		}

		return {
			uploadTemplateStr:uploadTemplateStr,
			downloadTemplateStr:downloadTemplateStr,
			zhCNLocale:zhCNLocale
		}


});