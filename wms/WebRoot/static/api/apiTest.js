function apiTest () {
	var headers = arguments[0] || {};
	var action = $('#action').val();
	var method = $('#method').val();
	
	//alert(action);
	//alert(method);
	
	
	var keys = new Array();
	var vals = new Array();
	var data = '';
	$('input[name=paramKey]').each(function(){
		var key = $.trim($(this).val());
		keys.push(encodeURIComponent(key));
	});
	$('input[name=paramVal]').each(function(){
		var val = $.trim($(this).val());
		vals.push(encodeURIComponent(val));
	});
	for(var i=0; i<keys.length; i++){
		data += keys[i] + '=' + vals[i] + '&';
	}
	//alert(data);
	
	$.ajax({
		'headers' : headers,
		'type' : method,
		'url' : action,
		'data' : data,
		'dataType':'text',
		'success' : function(msg){
			$('#result').val(formatJson(msg));
		}	
	});
}
function login(){
	var headers = arguments[0] || {};
	var action = $('#action').val();
	var method = $('#method').val();
	
	//alert(action);
	//alert(method);
	
	
	var keys = new Array();
	var vals = new Array();
	var data = '';
	$('input[name=paramKey]').each(function(){
		var key = $.trim($(this).val());
		keys.push(encodeURIComponent(key));
	});
	$('input[name=paramVal]').each(function(){
		var val = $.trim($(this).val());
		vals.push(encodeURIComponent(val));
	});
	for(var i=0; i<keys.length; i++){
		data += keys[i] + '=' + vals[i] + '&';
	}
	//alert(data);
	
	$.ajax({
		'headers' : headers,
		'type' : method,
		'url' : action,
		'data' : data,
		'dataType':'text',
		'success' : function(msg){
			var msgObj =  $.parseJSON(msg);
			if(msgObj.code == 10000){
				//登录成功，记录cookie
				$.cookie("loginKey",msgObj.result["LoginUser"].loginKey);
				$.cookie("loginName",msgObj.result["LoginUser"].loginName);
				$(".doTest").parent().find(".u").remove();
				$(".doTest").after("<p class='u'><b>当前登录用户：</b>"+msgObj.result["LoginUser"].loginName+"</p>");
			}
			$('#result').val(formatJson(msg));
		}	
	});
}
function logout(){
	var headers = arguments[0] || {};
	var action = $('#action').val();
	var method = $('#method').val();
	
	//alert(action);
	//alert(method);
	
	
	var keys = new Array();
	var vals = new Array();
	var data = '';
	$('input[name=paramKey]').each(function(){
		var key = $.trim($(this).val());
		keys.push(encodeURIComponent(key));
	});
	$('input[name=paramVal]').each(function(){
		var val = $.trim($(this).val());
		vals.push(encodeURIComponent(val));
	});
	for(var i=0; i<keys.length; i++){
		data += keys[i] + '=' + vals[i] + '&';
	}
	//alert(data);
	
	$.ajax({
		'headers' : headers,
		'type' : method,
		'url' : action,
		'data' : data,
		'dataType':'text',
		'success' : function(msg){
			$('#result').val(formatJson(msg));
			$.cookie("loginKey",null);
			$.cookie("loginName",null);
			$(".doTest").parent().find(".u").remove();
		}	
	});
	return false;
}
function uploadifyUserImgComplete(event, data){
	if (data) {
		$('#result').val(formatJson(msg));
	}
	uploadifyAllComplete(event,data);
}
$().ready(function(){
	//每次打开获取cookie中的登录key
	var loginKey = $.cookie("loginKey");
	var keyForm = $("#loginKey");
	if(keyForm && loginKey){
		keyForm.val(loginKey);
	}
	var loginName = $.cookie("loginName");
	if(loginName){
		$(".doTest").after("<p class='u'><b>当前登录用户：</b>"+loginName+"</p>");
	}
});