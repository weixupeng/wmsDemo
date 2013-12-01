/**
 * @author migrsoft.com
 * reference:bird.drag.js, bird.dialogDrag.js, bird.resize.js, bird.taskBar.js
 * 注意：有mask属性时自动就没有了minable，想有minable就必须将minable设成true并且将mask设置成false
 */
(function($){
	$.pdialog = {
		_op:{height:300, width:580, minH:40, minW:50, total:20, max:false, mask:true, resizable:true, drawable:true, maxable:false,minable:false,fresh:true,restore:false},
		_current:null,
		_zIndex:42,
		_maskZIndexStack:[],//遮罩管理栈
		getCurrent:function(){
			return this._current;
		},
		reload:function(url, options){
			var op = $.extend({dialogId:"", mask:true, callback:null}, options);
			var dialog = (op.dialogId && $("body").data(op.dialogId)) || this._current;
			//增加默认url和data的参数 update2011-12-02
			url = url || dialog.data("url");
			var qData = op.data || dialog.data("data") || {};
			//end update2011-12-02
			if (dialog){
				var jDContent = dialog.find(".dialogContent");
				jDContent.ajaxUrl({
					type:"POST", url:url, data:qData, callback:function(response){
						jDContent.find("[layoutH]").layoutH(jDContent);
						
						$("button.close",dialog).click(function(){
							var callback = $(this).attr("callback");
							if(callback){
								if (!$.isFunction(callback)) callback = eval('(' + callback + ')');
								callback(dialog);
							}
							$.pdialog.close(dialog);
							return false;
						});
						if ($.isFunction(op.callback)) op.callback(response);
					} , viewType:"dialog"
				});
			}
			//TODO 增加了对dialog对象的返回
			return dialog;
		},
		//打开一个层
		open:function(url, dlgid, title, options) {
			var op = $.extend({},$.pdialog._op, options);
			var dialog = $("body").data(dlgid);
			//重复打开一个层
			if(dialog) {
				if(dialog.is(":hidden")) {
					dialog.show();
				}
				if(op.fresh || url != $(dialog).data("url")){
					dialog.data("url",url);
					//TODO 缓存请求数据update2011-12-02 by lzy
					dialog.data("data",op.data||{});
					//end2011-12-02
					dialog.find(".dialogHeader").find("h1").html(title);
					this.switchDialog(dialog);
					var jDContent = dialog.find(".dialogContent");
					//TODO 增加了请求data update2011-12-02 by lzy
					jDContent.loadUrl(url, op.data||{}, function(){
						jDContent.find("[layoutH]").layoutH(jDContent);
						
						$("button.close").click(function(){
							var callback = $(this).attr("callback");
							if(callback){
								if (!$.isFunction(callback)) callback = eval('(' + callback + ')');
								callback(dialog);
							}
							$.pdialog.close(dialog);
							return false;
						});
					},'POST', "dialog");
				}
			
			} else { //打开一个全新的层
			
				$("body").append(Bird.frag["dialogFrag"]);
				dialog = $(">.dialog:last-child", "body");
				dialog.data("id",dlgid);
				dialog.data("url",url);
				//TODO 缓存请求数据update2011-12-02 by lzy
				dialog.data("data",op.data||{});
				//end2011-12-02
				if(op.close) dialog.data("close",op.close);
				if(op.close) dialog.data("param",op.param);
				($.fn.bgiframe && dialog.bgiframe());
				
				dialog.find(".dialogHeader").find("h1").html(title);
				$(dialog).css("zIndex", ($.pdialog._zIndex+=3));
				$("div.shadow").css("zIndex", $.pdialog._zIndex - 1).show();
				$.pdialog._init(dialog, op);
				$(dialog).click(function(){
					$.pdialog.switchDialog(dialog);
				});
				
				if(op.resizable)
					dialog.jresize();
				if(op.drawable)
				 	dialog.dialogDrag();
				if (op.maxable) {
					$("a.maximize", dialog).show().click(function(event){
						$.pdialog.switchDialog(dialog);
						$.pdialog.maxsize(dialog);
						dialog.jresize("destroy").dialogDrag("destroy");
						return false;
					});
				} else {
					$("a.maximize", dialog).remove();
				}
				 //TODO 扩展支持最大化后禁止恢复
				if (op.restore) {
					$("a.restore", dialog).click(function(event){
						$.pdialog.restore(dialog);
						dialog.jresize().dialogDrag();
						return false;
					});
				}else{
					$("a.restore", dialog).remove();
					$("a.maximize",dialog).remove();
					if(op.minable){
						$("a.minimize", dialog).css({"right":"22px"});
					}
				}
				/*原来的实现
				$("a.restore", dialog).click(function(event){
					$.pdialog.restore(dialog);
					dialog.jresize().dialogDrag();
					return false;
				});
				*/
				if (op.minable) {
					$("a.minimize", dialog).show().click(function(event){
						$.pdialog.minimize(dialog);
						return false;
					});
				} else {
					$("a.minimize", dialog).hide();
				}
				$("div.dialogHeader a", dialog).mousedown(function(){
					return false;
				});
				$("div.dialogHeader", dialog).dblclick(function(){
					if($("a.restore",dialog).is(":hidden"))
						$("a.maximize",dialog).trigger("click");
					else
						$("a.restore",dialog).trigger("click");
				});
				if(op.max) {
//					$.pdialog.switchDialog(dialog);
					$.pdialog.maxsize(dialog);
					dialog.jresize("destroy").dialogDrag("destroy");
				}
				$("body").data(dlgid, dialog);
				$.pdialog._current = dialog;
				$.pdialog.attachShadow(dialog);
				//load data
				var jDContent = $(".dialogContent",dialog);
				//TODO 增加了请求data update2011-12-02 by lzy
				jDContent.loadUrl(url, op.data||{}, function(){
					jDContent.find("[layoutH]").layoutH(jDContent);			
					$("a.close,button.close",dialog).click(function(){
						var callback = $(this).attr("callback");
						if(callback){
							if (!$.isFunction(callback)) callback = eval('(' + callback + ')');
							callback(dialog);
						}
						$.pdialog.close(dialog);
						return false;
					});
				},'POST','dialog');
			}
			if (op.mask) {
				/*
				$(dialog).css("zIndex", 1000);
				$("a.minimize",dialog).hide();
				$(dialog).data("mask", true);
				$("#dialogBackground").show();
				*/
				$("a.minimize",dialog).hide();
				$(dialog).data("mask", true);
				//TODO 遮罩管理
				var maskZIndex = $.pdialog._zIndex-2;
				$("#dialogBackground").css("zIndex", (maskZIndex));
				$.pdialog._maskZIndexStack.push(maskZIndex);
				$("#dialogBackground").show();
			}else {
				//add a task to task bar
				if(op.minable) $.taskBar.addDialog(dlgid,title);
			}
			//TODO 增加了对dialog对象的返回
			return dialog;
		},
		/**
		 * 切换当前层
		 * @param {Object} dialog
		 */
		switchDialog:function(dialog) {
			/*	switchDialog在关闭dialog后会导致currentDialog的不准确，我们要求每一个非最大化的窗口必须使用mask
			var index = $(dialog).css("zIndex");
			$.pdialog.attachShadow(dialog);
			if($.pdialog._current) {
				var cindex = $($.pdialog._current).css("zIndex");
				$($.pdialog._current).css("zIndex", index);
				$(dialog).css("zIndex", cindex);
				$("div.shadow").css("zIndex", cindex - 1);
				$.pdialog._current = dialog;
			}
			$.taskBar.switchTask(dialog.data("id"));*/
		},
		/**
		 * 给当前层附上阴隐层
		 * @param {Object} dialog
		 */
		attachShadow:function(dialog) {
			var shadow = $("div.shadow");
			if(shadow.is(":hidden")) shadow.show();
			shadow.css({
				top: parseInt($(dialog)[0].style.top) - 2,
				left: parseInt($(dialog)[0].style.left) - 4,
				height: parseInt($(dialog).height()) + 8,
				width: parseInt($(dialog).width()) + 8,
				zIndex:parseInt($(dialog).css("zIndex")) - 1
			});
			$(".shadow_c", shadow).children().andSelf().each(function(){
				$(this).css("height", $(dialog).outerHeight() - 4);
			});
		},
		_init:function(dialog, options) {
			var op = $.extend({}, this._op, options);
			var height = op.height>op.minH?op.height:op.minH;
			var width = op.width>op.minW?op.width:op.minW;
			if(isNaN(dialog.height()) || dialog.height() < height){
				$(dialog).height(height+"px");
				$(".dialogContent",dialog).height(height - $(".dialogHeader", dialog).outerHeight() - $(".dialogFooter", dialog).outerHeight() - 6);
			}
			if(isNaN(dialog.css("width")) || dialog.width() < width) {
				$(dialog).width(width+"px");
			}
			
			var iTop = ($(window).height()-dialog.height())/2;
			dialog.css({
				left: ($(window).width()-dialog.width())/2,
				top: iTop > 0 ? iTop : 0
			});
		},
		/**
		 * 初始化半透明层
		 * @param {Object} resizable
		 * @param {Object} dialog
		 * @param {Object} target
		 */
		initResize:function(resizable, dialog,target) {
			$("body").css("cursor", target + "-resize");
			resizable.css({
				top: $(dialog).css("top"),
				left: $(dialog).css("left"),
				height:$(dialog).css("height"),
				width:$(dialog).css("width")
			});
			resizable.show();
		},
		/**
		 * 改变阴隐层
		 * @param {Object} target
		 * @param {Object} options
		 */
		repaint:function(target,options){
			var shadow = $("div.shadow");
			if(target != "w" && target != "e") {
				shadow.css("height", shadow.outerHeight() + options.tmove);
				$(".shadow_c", shadow).children().andSelf().each(function(){
					$(this).css("height", $(this).outerHeight() + options.tmove);
				});
			}
			if(target == "n" || target =="nw" || target == "ne") {
				shadow.css("top", options.otop - 2);
			}
			if(options.owidth && (target != "n" || target != "s")) {
				shadow.css("width", options.owidth + 8);
			}
			if(target.indexOf("w") >= 0) {
				shadow.css("left", options.oleft - 4);
			}
		},
		/**
		 * 改变左右拖动层的高度
		 * @param {Object} target
		 * @param {Object} tmove
		 * @param {Object} dialog
		 */
		resizeTool:function(target, tmove, dialog) {
			$("div[class^='resizable']", dialog).filter(function(){
				return $(this).attr("tar") == 'w' || $(this).attr("tar") == 'e';
			}).each(function(){
				$(this).css("height", $(this).outerHeight() + tmove);
			});
		},
		/**
		 * 改变原始层的大小
		 * @param {Object} obj
		 * @param {Object} dialog
		 * @param {Object} target
		 */
		resizeDialog:function(obj, dialog, target) {
			var oleft = parseInt(obj.style.left);
			var otop = parseInt(obj.style.top);
			var height = parseInt(obj.style.height);
			var width = parseInt(obj.style.width);
			if(target == "n" || target == "nw") {
				tmove = parseInt($(dialog).css("top")) - otop;
			} else {
				tmove = height - parseInt($(dialog).css("height"));
			}
			$(dialog).css({left:oleft,width:width,top:otop,height:height});
			$(".dialogContent", dialog).css("width", (width-12) + "px");
			
			if (target != "w" && target != "e") {
				var content = $(".dialogContent", dialog);
				content.css({height:height - $(".dialogHeader", dialog).outerHeight() - $(".dialogFooter", dialog).outerHeight() - 6});
				content.find("[layoutH]").layoutH(content);
				$.pdialog.resizeTool(target, tmove, dialog);
			}
			$.pdialog.repaint(target, {oleft:oleft,otop: otop,tmove: tmove,owidth:width});
			
			$(window).trigger("resizeGrid");
		},
		close:function(dialog) {
			if(typeof dialog == 'string') dialog = $("body").data(dialog);
			var close = dialog.data("close");
			var go = true;
			if(close && $.isFunction(close)) {
				var param = dialog.data("param");
				if(param && param != ""){
					param = Bird.jsonEval(param);
					go = close(param);
				} else {
					go = close();
				}
				if(!go) return;
			}
			if ($.fn.xheditor) {
				$("textarea.editor", dialog).xheditor(false);
			}
			$(dialog).unbind("click").hide();
			$("div.dialogContent", dialog).html("");
			$("div.shadow").hide();
			$.pdialog._zIndex -= 3;
			if($(dialog).data("mask")){
				//TODO 遮罩管理
				$.pdialog._maskZIndexStack.pop();//取出当前遮罩
				var maskZIndex = $.pdialog._maskZIndexStack.pop();//取出下一个遮罩
				if(maskZIndex){
					$("#dialogBackground").css("zIndex",maskZIndex);
					//如果还有遮罩就把下一个遮罩设置成当前的遮罩
					$.pdialog._maskZIndexStack.push(maskZIndex)
				}else{
					$("#dialogBackground").hide();
				}
			} else{
				$.taskBar.closeDialog($(dialog).data("id"));
			}
			$("body").removeData($(dialog).data("id"));
			$(dialog).remove();
		},
		closeCurrent:function(){
			this.close($.pdialog._current);
		},
		checkTimeout:function(){
			var $conetnt = $(".dialogContent", $.pdialog._current);
			var json = Bird.jsonEval($conetnt.html());
			if (json && json.statusCode == Bird.statusCode.timeout) this.closeCurrent();
		},
		maxsize:function(dialog) {
			$(dialog).data("original",{
				top:$(dialog).css("top"),
				left:$(dialog).css("left"),
				width:$(dialog).css("width"),
				height:$(dialog).css("height")
			});
			$("a.maximize",dialog).hide();
			$("a.restore",dialog).show();
			var iContentW = $(window).width();
			var iContentH = $(window).height() - 34;
			$(dialog).css({top:"0px",left:"0px",width:iContentW+"px",height:iContentH+"px"});
			$.pdialog._resizeContent(dialog,iContentW,iContentH);
		},
		restore:function(dialog) {
			var original = $(dialog).data("original");
			var dwidth = parseInt(original.width);
			var dheight = parseInt(original.height);
			$(dialog).css({
				top:original.top,
				left:original.left,
				width:dwidth,
				height:dheight
			});
			$.pdialog._resizeContent(dialog,dwidth,dheight);
			$("a.maximize",dialog).show();
			$("a.restore",dialog).hide();
			$.pdialog.attachShadow(dialog);
		},
		minimize:function(dialog){
			$(dialog).hide();
			$("div.shadow").hide();
			var task = $.taskBar.getTask($(dialog).data("id"));
			$(".resizable").css({
				top: $(dialog).css("top"),
				left: $(dialog).css("left"),
				height:$(dialog).css("height"),
				width:$(dialog).css("width")
			}).show().animate({top:$(window).height()-60,left:task.position().left,width:task.outerWidth(),height:task.outerHeight()},250,function(){
				$(this).hide();
				$.taskBar.inactive($(dialog).data("id"));
			});
		},
		_resizeContent:function(dialog,width,height) {
			var content = $(".dialogContent", dialog);
			content.css({width:(width-12) + "px",height:height - $(".dialogHeader", dialog).outerHeight() - $(".dialogFooter", dialog).outerHeight() - 6});
			content.find("[layoutH]").layoutH(content);
			
			
			$(window).trigger("resizeGrid");
		}
	};
})(jQuery);