/**
 * @author migrsoft.com
 */
$.setRegional("alertMsg", {
	title:{error:"Error", info:"Information", warn:"Warning", correct:"Successful", confirm:"Confirmation"},
	butMsg:{ok:"OK", yes:"Yes", no:"No", cancel:"Cancel"}
});
//ESC全局键盘，关闭对话框
$(document).keydown(function(event){
	if(event.keyCode == Bird.keyCode.ESC){
		$("#alertMsgBox").animate({top:-$("#alertMsgBox").height()}, 500, function(){
			$("#alertMsgBox").remove();
		});
		$("#alertBackground").hide();
	}
});
var alertMsg = {
	_boxId: "#alertMsgBox",
	_bgId: "#alertBackground",
	_closeTimer: null,

	_types: {error:"error", info:"info", warn:"warn", correct:"correct", confirm:"confirm"},

	_getTitle: function(key){
		return $.regional.alertMsg.title[key];
	},

	/**
	 * 
	 * @param {Object} type
	 * @param {Object} msg
	 * @param {Object} buttons [button1, button2]
	 */
	_open: function(type, msg, buttons){
		$(this._boxId).remove();
		var butsHtml = "";
		if (buttons) {
			for (var i = 0; i < buttons.length; i++) {
				if(buttons[i].name){
					var sRel = buttons[i].call ? "callback" : "";
					butsHtml += Bird.frag["alertButFrag"].replace("#butMsg#", buttons[i].name).replace("#callback#", sRel);
				}
			}
		}
		var boxHtml = Bird.frag["alertBoxFrag"].replace("#type#", type).replace("#title#", this._getTitle(type)).replace("#message#", msg).replace("#butFragment#", butsHtml);
		$(boxHtml).appendTo("body").css({top:-$(this._boxId).height()+"px"}).animate({top:"0px"}, 500);
				
		if (this._closeTimer) {
			clearTimeout(this._closeTimer);
			this._closeTimer = null;
		}
		if (this._types.info == type || this._types.correct == type){
			this._closeTimer = setTimeout(function(){alertMsg.close()}, 2000);
		} else {
			$(this._bgId).show();
		}
		var jCallButs = $(this._boxId).find("[rel=callback]");
		for (var i = 0; i < buttons.length; i++) {
			if (buttons[i].call) jCallButs.eq(i).click(buttons[i].call);
		}
	},
	close: function(){
		$(this._boxId).animate({top:-$(this._boxId).height()}, 500, function(){
			$(this).remove();
		});
		$(this._bgId).hide();
	},
	error: function(msg, options) {
		this._alert(this._types.error, msg, options);
	},
	info: function(msg, options) {
		this._alert(this._types.info, msg, options);
	},
	warn: function(msg, options) {
		this._alert(this._types.warn, msg, options);
	},
	correct: function(msg, options) {
		var options = {okName:null, okCall:null};
		this._alert(this._types.correct, msg, options);
	},
	_alert: function(type, msg, options) {
		var op = {okName:$.regional.alertMsg.butMsg.ok, okCall:null};
		$.extend(op, options);
		var buttons = [
			{name:op.okName, call: op.okCall}
		];
		this._open(type, msg, buttons);
	},
	/**
	 * 
	 * @param {Object} msg
	 * @param {Object} options {okName, okCal, cancelName, cancelCall}
	 */
	confirm: function(msg, options) {
		var op = {okName:$.regional.alertMsg.butMsg.ok, okCall:null, cancelName:$.regional.alertMsg.butMsg.cancel, cancelCall:null};
		$.extend(op, options);
		var buttons = [
			{name:op.okName, call: op.okCall},
			{name:op.cancelName, call: op.cancelCall}
		];
		this._open(this._types.confirm, msg, buttons);
	}
};

