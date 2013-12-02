/**
 * @author migrsoft.com
 * 
 */

/**
 * 普通ajax表单提交
 * @param {Object} form
 * @param {Object} callback
 */
function validateCallback(form, callback) {
	var $form = $(form);
	if (!$form.valid()) {
		return false;
	}
	callback = callback ||Bird.ajaxDone,
	
	$.ajax({
		type: form.method || 'POST',
		url:$form.attr("action"),
		data:$form.serializeArray(),
		dataType:"json",
		cache: false,
		success: function(data){
			callback(data,form);
		},
		error: Bird.ajaxError
	});
	return false;
}
//根据指定的dialogId刷新dialog
function reloadDialog(dialogId){
	var data = {};
	if(dialogId){
		data["dialogId"] = dialogId;
		var dialog = $("body").data(dialogId);
		if(!dialog){
			$.pdialog.reload();
		}else{
			var cUrl = dialog.data("url");
			$.pdialog.reload(cUrl,data);
		}
	}else{
		$.pdialog.reload();
	}
}
/**
 * 带文件上传的ajax表单提交
 * @param {Object} form
 * @param {Object} callback
 */
function iframeCallback(form, callback){
	var $form = $(form), $iframe = $("#callbackframe");
	if(!$form.valid()) {return false;}

	if ($iframe.size() == 0) {
		$iframe = $("<iframe id='callbackframe' name='callbackframe' src='about:blank' style='display:none'></iframe>").appendTo("body");
	}
	if(!form.ajax) {
		$form.append('<input type="hidden" name="ajax" value="1" />');
	}
	form.target = "callbackframe";
	
	_iframeResponse($iframe[0], callback || Bird.ajaxDone);
}
function _iframeResponse(iframe, callback){
	var $iframe = $(iframe), $document = $(document);
	
	$document.trigger("ajaxStart");
	
	$iframe.bind("load", function(event){
		$iframe.unbind("load");
		$document.trigger("ajaxStop");
		
		if (iframe.src == "javascript:'%3Chtml%3E%3C/html%3E';" || // For Safari
			iframe.src == "javascript:'<html></html>';") { // For FF, IE
			return;
		}

		var doc = iframe.contentDocument || iframe.document;

		// fixing Opera 9.26,10.00
		if (doc.readyState && doc.readyState != 'complete') return; 
		// fixing Opera 9.64
		if (doc.body && doc.body.innerHTML == "false") return;
	   
		var response;
		
		if (doc.XMLDocument) {
			// response is a xml document Internet Explorer property
			response = doc.XMLDocument;
		} else if (doc.body){
			try{
				response = $iframe.contents().find("body").html();
				response = jQuery.parseJSON(response);
			} catch (e){ // response is html document or plain text
				response = doc.body.innerHTML;
			}
		} else {
			// response is a xml document
			response = doc;
		}
		
		callback(response);
	});
}

/**
 * navTabAjaxDone是Bird框架中预定义的表单提交回调函数．
 * 服务器转回navTabId可以把那个navTab标记为reloadFlag=1, 下次切换到那个navTab时会重新载入内容. 
 * callbackType如果是closeCurrent就会关闭当前tab
 * 只有callbackType="forward"时需要forwardUrl值
 * navTabAjaxDone这个回调函数基本可以通用了，如果还有特殊需要也可以自定义回调函数.
 * 如果表单提交只提示操作是否成功, 就可以不指定回调函数. 框架会默认调用Bird.ajaxDone()
 * <form action="/user.do?method=save" onsubmit="return validateCallback(this, navTabAjaxDone)">
 * 
 * form提交后返回json数据结构statusCode=Bird.statusCode.ok表示操作成功, 做页面跳转等操作. statusCode=Bird.statusCode.error表示操作失败, 提示错误原因. 
 * statusCode=Bird.statusCode.timeout表示session超时，下次点击时跳转到Bird.loginUrl
 * {"statusCode":"200", "message":"操作成功", "navTabId":"navNewsLi", "forwardUrl":"", "callbackType":"closeCurrent"}
 * {"statusCode":"300", "message":"操作失败"}
 * {"statusCode":"301", "message":"会话超时"}
 * 
 */
function navTabAjaxDone(json){
	Bird.ajaxDone(json);
	if (json.statusCode == Bird.statusCode.ok){
		if (json.navTabId){ //把指定navTab页面标记为需要“重新载入”。注意navTabId不能是当前navTab页面的
			navTab.reloadFlag(json.navTabId);
		} else { //重新载入当前navTab页面
			navTabPageBreak({}, json.rel);
		}
		if ("closeCurrent" == json.callbackType) {
			setTimeout(function(){navTab.closeCurrentTab();}, 100);
		} else if ("forward" == json.callbackType) {
			navTab.reload(json.forwardUrl);
		}
	}
}


/**
 * dialog上的表单提交回调函数
 * 服务器转回navTabId，可以重新载入指定的navTab. statusCode=Bird.statusCode.ok表示操作成功, 自动关闭当前dialog
 * 
 * form提交后返回json数据结构,json格式和navTabAjaxDone一致
 */
function dialogAjaxDone(json){
	Bird.ajaxDone(json);
	if (json.statusCode == Bird.statusCode.ok){
		if (json.navTabId){
			navTab.reload(json.forwardUrl, {navTabId: json.navTabId});
		} else if (json.rel) {
			navTabPageBreak({}, json.rel);
		}
		$.pdialog.closeCurrent();
	}
}
/**
 * 关闭当前的dialog,刷新父的dialog
 * @param form
 */
function closeSelfDialogAndRefreshParentDialog(form){
	var $p = $(form).parents(".unitBox:first");
	var dialogId=$("#dialogId",$p).val();
	var parentDialogId=$("#parentDialog",$p).val();
	var dialog = $("body").data(dialogId);
	$.pdialog.close(dialog);//关当前dialog
	if(parentDialogId){//刷新父dialog
		var parentDialog=$("body").data(parentDialogId);
		var pagerForm=$("#pagerForm",parentDialog);
		var refreshUrl=pagerForm.attr("action");
		if($("#refreshUrl",parentDialog)!=undefined&&$("#refreshUrl",parentDialog).val()!=''){
			refreshUrl=$("#refreshUrl",parentDialog).val();
		}
		$.pdialog.reload(refreshUrl,{dialogId:parentDialogId,data:pagerForm.serialize()});
	}
}

var reloadModel = {
	page:undefined,
	reloadCurrentDialogAfterParent:function (){//专为dialogAjaxReloadParentDone调用
		if(reloadModel.page){
			//本页面dialogId
			var dialogId = $("#dialogId",reloadModel.page).val();
			var data = {};
			if(dialogId){
				data["dialogId"] = dialogId;
				var dialog = $("body").data(dialogId);
				if(!dialog){
					alert("dialog不存在，可能是因为本页面的dialogId和实际dialogId不符！");
				}else{
					var cUrl = dialog.data("url");
					$.pdialog.reload(cUrl,data);
				}
			}else{
				$.pdialog.closeCurrent();
			}
			reloadModel.page = undefined;
		}else{
			alert("您没有设置page变量！");
		}
	}
};
//父页面是dialog的回调，刷新父dialog
function dialogAjaxReloadParentDone(json,form){
	Bird.ajaxDone(json);
	if(json.statusCode == Bird.statusCode.ok){
		var $p = $(form).parents(".unitBox:first");
		if(!json.navTabId){
			var parentDialogId = $("#parentDialog",$p).val();
			json.navTabId = parentDialogId;
		}
		if (json.navTabId){ //刷新父dialog
			var parentDialog=$("body").data(json.navTabId);
			if(!parentDialog){
				alert("父dialog不存在，可能是因为父页面的dialogId和实际dialogId不符！");
			}else{
				var $pagerForm=$("#pagerForm",parentDialog);
				var pData = $pagerForm.serialize();
				var pUrl = $pagerForm.attr("action");
				if(pUrl){
					if(json.callbackType == "closeCurrent"){
						var dialogId = $("#dialogId",$p).val();
						var dialog = $("body").data(dialogId);
						$.pdialog.close(dialog);
						$.pdialog.reload(pUrl,{dialogId:json.navTabId,data:pData});
					}else{
						reloadModel.page = $p;
						$.pdialog.reload(pUrl,{dialogId:json.navTabId,data:pData,callback:reloadModel.reloadCurrentDialogAfterParent});
					}
				}
			}
		}else{
			alert("没有在Action设置json.navTabId，且没有在页面设置parentDialog，请设置!");
		}
	}
}
/**
 * 仅仅刷新本页面,只用于dialog
 * @param data
 * @param form
 */
function onlyCurrentDialogReloadDone(data,form){
	Bird.ajaxDone(data);
	var $p = $(form).parents(".unitBox:first");
	var url=$("#refreshUrl",$p).val();
	var dialogId=$("#dialogId",$p).val();
	if(data.statusCode== Bird.statusCode.ok){
		$.pdialog.reload(url,{dialogId:dialogId,data:$("#pagerForm",$p).serialize()});
	}
}
/**
 * 删除调用，刷新本页。
 * 注意：仅用于Dialog中，navTab中的删除不能使用此回调函数
 */
function dialogDeleteDone(json){
	Bird.ajaxDone(json);
	if(json.statusCode == Bird.statusCode.ok){
		if (json.navTabId){ //把指定navTab页面标记为需要“重新载入”。注意navTabId不能是当前navTab页面的
			var dialog=$("body").data(json.navTabId);
			if(!dialog){
				alert("dialog不存在，可能是因为本页面的dialogId和实际dialogId不符！");
			}else{
				var $pagerForm=$("#pagerForm",dialog);
				var data = $pagerForm.serialize();
				var url = $pagerForm.attr("action");
				jQuery.pdialog.reload(url,{dialogId:json.navTabId,data:data});
			}
			
		}
	}
}

/**
 * 重置dialog,用于增加数据且不关闭窗口
 * 注意：仅用于父页面是navTab，本页面是dialog的情况
 */
function dialogResetDone(json,form){
	Bird.ajaxDone(json);
	if(json.statusCode == Bird.statusCode.ok){
		var $p = $(form).parents(".unitBox:first");
		//本页面dialogId
		var dialogId = $("#dialogId",$p).val();
		var data = {};
		if(dialogId){
			data["dialogId"] = dialogId;
			var dialog = $("body").data(dialogId);
			if(!dialog){
				alert("dialog不存在，可能是因为本页面的dialogId和实际dialogId不符！");
			}else{
				var cUrl = dialog.data("url");
				$.pdialog.reload(cUrl,data);
			}
		}else{
			$.pdialog.closeCurrent();
		}
		//重新加载付父navTab
		if (json.navTabId){
			navTab.reload(json.forwardUrl, {navTabId: json.navTabId});
		} else if (json.rel) {
			navTabPageBreak({}, json.rel);
		}else{
			navTab.reload();
		}
	}
}

/**
 * 重置NavTab下面的某项tab项,用于增加数据且不关闭窗口(在tab页面里面必须要有id为curTab这个标签)
 * 注意：仅用于父页面是navTab，本页面是dialog的情况
 */
function dialogResetDoneForMultTab(json,form){
	Bird.ajaxDone(json);
	if(json.statusCode == Bird.statusCode.ok){
		var $p = $(form).parents(".unitBox:first");
		//本页面dialogId
		var dialogId = $("#dialogId",$p).val();
		var data = {};
		if(dialogId){
			data["dialogId"] = dialogId;
			var dialog = $("body").data(dialogId);
			if(!dialog){
				alert("dialog不存在，可能是因为本页面的dialogId和实际dialogId不符！");
			}else{
				var cUrl = dialog.data("url");
				$.pdialog.reload(cUrl,data);
			}
		}else{
			$.pdialog.closeCurrent();
		}
		var curTab=$("#curTab",navTab.getCurrentPanel()).val();
		$("#"+curTab,navTab.getCurrentPanel()).trigger("click");
	}
}

/**
 * 重置dialog下面的某项tab项,用于增加，修改数据且不关闭窗口(在tab页面里面必须要有id为curTab这个标签)
 * 注意：仅用于父页面是dialog，本页面是dialog的情况
 */
function dialogResetDoneForMultTabOfCurrentDialog(json,form){
	Bird.ajaxDone(json);
	if(json.statusCode == Bird.statusCode.ok){
		var $p = $(form).parents(".unitBox:first");
		//本页面dialogId
		var dialogId = $("#dialogId",$p).val();
		var data = {};
		if(dialogId){
			data["dialogId"] = dialogId;
			var dialog = $("body").data(dialogId);
			if(!dialog){
				alert("dialog不存在，可能是因为本页面的dialogId和实际dialogId不符！");
			}else{
				var cUrl = dialog.data("url");
				$.pdialog.reload(cUrl,data);
			}
		}else{
			$.pdialog.closeCurrent();
		}
		var parentdialogId = $("#parentDiaglog",$p).val();
		if(parentdialogId){
			var parentdialog = $("body").data(parentdialogId);
			var curTab=$("#curTab",parentdialog).val();
			$("#"+curTab,parentdialog).trigger("click");
		}
	}
}
/**
 * 重置dialogMultTab下面的某项tab项(在dialog页面里面必须要有id为curTab这个标签)
 */
function dialogRloadDoneForMultTabOfCurrentDialog(json,form){
	Bird.ajaxDone(json);
	if(json.statusCode == Bird.statusCode.ok){
		if(json.navTabId){
			var multTabdialog = $("body").data(json.navTabId);
			var curTab=$("#curTab",multTabdialog).val();
			$("#"+curTab,multTabdialog).trigger("click");
		}
	}
}


/**
 * 重置NavTab下面的某项tab项(在tab页面里面必须要有id为curTab这个标签)
 */
function navTabResetDoneForMultTab(json,form){
	Bird.ajaxDone(json);
	if(json.statusCode == Bird.statusCode.ok){
		var curTab=$("#curTab",navTab.getCurrentPanel()).val();
		$("#"+curTab,navTab.getCurrentPanel()).trigger("click");
	}
}

function dialogResetOnlyDone(json,form){
	Bird.ajaxDone(json);
	if(json.statusCode == Bird.statusCode.ok){
		var $p = $(form).parents(".unitBox:first");
		//本页面dialogId
		var dialogId = $("#dialogId",$p).val();
		var data = {};
		if(dialogId){
			data["dialogId"] = dialogId;
			var dialog = $("body").data(dialogId);
			if(!dialog){
				alert("dialog不存在，可能是因为本页面的dialogId和实际dialogId不符！");
			}else{
				var cUrl = dialog.data("url");
				$.pdialog.reload(cUrl,data);
			}
		}else{
			$.pdialog.closeCurrent();
		}
	}
}

//刷新父窗口，要求，父窗口dialogId：#parentDialog，查询表单：#pagerForm
function reloadParentDialog($p){
	var parentDialogId=$("#parentDialog",$p).val();
	if(parentDialogId){
		var parentDialog=$("body").data(parentDialogId);
		var pagerForm=$("#pagerForm",parentDialog);
		$.pdialog.reload(pagerForm.attr("action"),{dialogId:parentDialogId,data:pagerForm.serialize()});
	}
}

/**
 *  窗口登录后的处理
 */
function dialogLoginAjaxDone(json){
	Bird.ajaxDone(json);
	if (json.statusCode == Bird.statusCode.ok){
		if (json.navTabId){
			navTab.reload(json.forwardUrl, {navTabId: json.navTabId});
		} else if (json.rel) {
			navTabPageBreak({}, json.rel);
		}
		$.pdialog.closeCurrent();
		//设置登录用户的名称
		$("#loginName").html(json.realname);
	}
}

/**
 * 处理navTab上的查询, 会重新载入当前navTab
 * @param {Object} form
 */
function navTabSearch(form, navTabId){
	var $form = $(form);
	if (form[Bird.pageInfo.pageNum]) form[Bird.pageInfo.pageNum].value = 1;
	navTab.reload($form.attr('action'), {data: $form.serializeArray(), navTabId:navTabId});
	return false;
}


/**
 * 以制定的方式提交表单
 * 例：onenter="return submitForm(obj,'form.pageForm');"
 * @param obj 触发事件的对象,一般传this
 * @param formStr JQuery格式的要提交的form
 */
function submitForm(obj,formStr){
	var $p = obj.parents(".unitBox:first");
	var $form = $(formStr,$p);
	var $submitBtn = $(":submit",$form);
	if($submitBtn.size() > 0){
		$submitBtn.click();
	}else{
		$(formStr,$p).submit();
	}
}


//TODO 刷新当前navTab
function reloadCurrentNavTab(){
	navTab.reload();
}
/**
 * 处理dialog弹出层上的查询, 会重新载入当前dialog
 * @param {Object} form
 */
function dialogSearch(form, dialogId){
	var $form = $(form);
	var $p = $form.parents(".unitBox:first");
	if(!dialogId){
		dialogId = $("#dialogId",$p).val();
	}
	if(dialogId){
		var dialog = $("body").data(dialogId);
		if(!dialog){
			alert("dialog不存在，可能是因为本页面的dialogId和实际dialogId不符！");
		}else{
			if (form[Bird.pageInfo.pageNum]) form[Bird.pageInfo.pageNum].value = 1;
			$.pdialog.reload($form.attr("action"),{dialogId:dialogId,data:$form.serializeArray()});
		}
	}else{
		$.pdialog.closeCurrent();
	}
	return false;
}


function birdSearch(form, targetType){
	if (targetType == "dialog") dialogSearch(form);
	else navTabSearch(form);
	return false;
}


/**
 * 处理div上的局部查询, 会重新载入指定div
 * @param {Object} form
 */
function divSearch(form, rel){
	var $form = $(form);
	if (form[Bird.pageInfo.pageNum]) form[Bird.pageInfo.pageNum].value = 1;
	if (rel) {
		var $box = $("#" + rel);
		$box.ajaxUrl({
			type:"POST", url:$form.attr("action"), data: $form.serializeArray(), callback:function(){
				$box.find("[layoutH]").layoutH();
			}
		});
	}
	return false;
}
/**
 * 
 * @param {Object} args {pageNum:"",numPerPage:"",orderField:"",orderDirection:""}
 * @param String formId 分页表单选择器，非必填项默认值是 "pagerForm"
 */
function _getPagerForm($parent, args) {
	var form = $("#pagerForm", $parent).get(0);

	if (form) {
		if (args["pageNum"]) form[Bird.pageInfo.pageNum].value = args["pageNum"];
		if (args["numPerPage"]) form[Bird.pageInfo.numPerPage].value = args["numPerPage"];
		if (args["orderField"]) form[Bird.pageInfo.orderField].value = args["orderField"];
		if (args["orderDirection"] && form[Bird.pageInfo.orderDirection]) form[Bird.pageInfo.orderDirection].value = args["orderDirection"];
	}
	
	return form;
}


/**
 * 处理navTab中的分页和排序
 * targetType: navTab 或 dialog
 * rel: 可选 用于局部刷新div id号
 * data: pagerForm参数 {pageNum:"n", numPerPage:"n", orderField:"xxx", orderDirection:""}
 * callback: 加载完成回调函数
 */
function birdPageBreak(options,$p){
	var op = $.extend({ targetType:"navTab", rel:"", data:{pageNum:"", numPerPage:"", orderField:"", orderDirection:""}, callback:null}, options);
	var $parent = false;
	if($p && $p.size()>0){
		$parent = $p;
	}else{
		$parent = op.targetType == "dialog" ? $.pdialog.getCurrent() : navTab.getCurrentPanel();
	}
	
	
	if (op.rel) {
		var $box = $parent.find("#" + op.rel);
		var form = _getPagerForm($box, op.data);
		if (form) {
			$box.ajaxUrl({
				type:"POST", url:$(form).attr("action"), data: $(form).serializeArray(), callback:function(){
					$box.find("[layoutH]").layoutH();
				}
			});
		}
	} else {
		var form = _getPagerForm($parent, op.data);
		var params = $(form).serializeArray();
		
		if (op.targetType == "dialog") {
			var dialogId = $("#dialogId",$parent).val();
			if(dialogId){
				var dialog = $("body").data(dialogId);
				if(!dialog){
					alert("dialog不存在，可能是因为本页面的dialogId和实际dialogId不符！");
				}else{
					if (form) $.pdialog.reload($(form).attr("action"), {dialogId:dialogId,data: params, callback: op.callback});
				}
			}else{
				$.pdialog.closeCurrent();
			}
			
		} else {
			if (form) navTab.reload($(form).attr("action"), {data: params, callback: op.callback});
		}
	}
}
/**
 * 处理navTab中的分页和排序
 * @param args {pageNum:"n", numPerPage:"n", orderField:"xxx", orderDirection:""}
 * @param rel： 可选 用于局部刷新div id号
 */
function navTabPageBreak(args, rel){
	birdPageBreak({targetType:"navTab", rel:rel, data:args});
}
/**
 * 处理dialog中的分页和排序
 * 参数同 navTabPageBreak 
 */
function dialogPageBreak(args, rel,obj){
	var $p = undefined;
	if(obj){
		var $p = $(obj).parents(".unitBox:first");
	}
	birdPageBreak({targetType:"dialog", rel:rel, data:args},$p);
}


function ajaxTodo(url, callback){
	var $callback = callback || navTabAjaxDone;
	if (! $.isFunction($callback)) $callback = eval('(' + callback + ')');
	$.ajax({
		type:'POST',
		url:url,
		dataType:"json",
		cache: false,
		success: $callback,
		error: Bird.ajaxError
	});
}

/**
 * A function that triggers when all file uploads have completed. There is no default event handler.
 * @param {Object} event: The event object.
 * @param {Object} data: An object containing details about the upload process:
 * 		- filesUploaded: The total number of files uploaded
 * 		- errors: The total number of errors while uploading
 * 		- allBytesLoaded: The total number of bytes uploaded
 * 		- speed: The average speed of all uploaded files	
 */
function uploadifyAllComplete(event, data){
	if (data.errors) {
		var msg = "The total number of files uploaded: "+data.filesUploaded+"\n"
			+ "The total number of errors while uploading: "+data.errors+"\n"
			+ "The total number of bytes uploaded: "+data.allBytesLoaded+"\n"
			+ "The average speed of all uploaded files: "+data.speed;
		alert("event:" + event + "\n" + msg);
	}
}
/**
 * http://www.uploadify.com/documentation/
 * @param {Object} event
 * @param {Object} queueID
 * @param {Object} fileObj
 * @param {Object} response
 * @param {Object} data
 */
function uploadifyComplete(event, queueId, fileObj, response, data){
	var json = Bird.jsonEval(response);
	if(json.statusCode == Bird.statusCode.ok){
		if(json.filePath){
			var $this = $(event.target);
			var $p = $this.parents(".unitBox:first");
			//展示
			var logoShow = $($this.attr("imgTarget"),$p);
			logoShow.attr("src","../"+json.filePath+"?t="+(new Date()).valueOf());
			//将文件路径交给目标
			var logoPathInput = $($this.attr("imgPathTarget"),$p);
			logoPathInput.val(json.filePath);
		}
	}
	Bird.ajaxDone(json);
}

/**
 * http://www.uploadify.com/documentation/
 * @param {Object} event
 * @param {Object} queueID
 * @param {Object} fileObj
 * @param {Object} errorObj
 */
function uploadifyError(event, queueId, fileObj, errorObj){
	alert("event:" + event + "\nqueueId:" + queueId + "\nfileObj.name:" 
		+ fileObj.name + "\nerrorObj.type:" + errorObj.type + "\nerrorObj.info:" + errorObj.info);
}


$.fn.extend({
	ajaxTodo:function(){
		return this.each(function(){
			var $this = $(this);
			$this.click(function(event){
				var url = unescape($this.attr("href")).replaceTmById($(event.target).parents(".unitBox:first"));
				Bird.debug(url);
				if (!url.isFinishedTm()) {
					alertMsg.error($this.attr("warn") || Bird.msg("alertSelectMsg"));
					return false;
				}
				var title = $this.attr("title");
				if (title) {
					alertMsg.confirm(title, {
						okCall: function(){
							ajaxTodo(url, $this.attr("callback"));
						}
					});
				} else {
					ajaxTodo(url, $this.attr("callback"));
				}
				event.preventDefault();
			});
		});
	},
	birdExport: function(){
		function _doExport($this,formStr) {
			var $p = $this.parents(".unitBox:first");
			var formValues = "";
			if(formStr){
				var $form = $(formStr, $p);
				if($form.size()>0){
					formValues = $form.serialize();
				}
			}
			var url = $this.attr("href");
			window.open(url+(url.indexOf('?') == -1 ? "?" : "&")+formValues,"_blank");
		}
		
		return this.each(function(){
			var $this = $(this);
			$this.click(function(event){
				var title = $this.attr("title");
				if (title) {
					alertMsg.confirm(title, {
						okCall: function(){_doExport($this,$this.attr("form"));}
					});
				} else {_doExport($this,$this.attr("form"));}
			
				event.preventDefault();
			});
		});
	}
});
