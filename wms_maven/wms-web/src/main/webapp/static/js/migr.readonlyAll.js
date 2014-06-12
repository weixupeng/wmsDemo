/**
 * readonly页面样式插件
 * @author migrsoft.com
 * 使用说明：
 * 1、此插件已经在*.ui.js中注册
 * 		只需要在任一组件的class上标记 readonlyAll，并且在增加属性readonlyAll="true"，在页面加载时将进行渲染
 * 2、例外，a、单个指定：在不需要readonly的控件上增加属性noReadonly
			b、批量指定：请在标记class="readonlyAll"的组件上增加属性exept=""
 * 			except的格式支持jQuery的selector格式，如"#id,.class,[name='a']"多个用","进行分割
 * 3、特殊处理：detail明细中的input进行了特殊处理，需要在input上加上 isDetail="true"
 */
(function($){
	$.fn.extend({
		readonlyAll:function(){
			return this.each(function(){
				var $marker = $(this);
				var $p = $marker.parents(".unitBox:first");
				//获取readonlyAll属性
				var roAll = $marker.attr("readonlyAll");
				var selector = $marker.attr("except");
				if(selector){
					$(selector).each(function(){
						$(this).attr("noReadonly","ture");
					});
				}
				if(roAll){//如果属性存在则将所有例外以外的input:text/textarea/button/a.button进行只读样式
					//1.input:text,textarea
					$("input:text:not([noReadonly]),textarea:not([noReadonly])",$p).each(function(){
						var $text = $(this);
						$text.attr("readonly","readonly").removeClass().addClass("textInput line_border");
						//删除text的事件
						$text.removeAttr("onclick").removeAttr("ondblclick").removeAttr("lookupGroup")
							.removeAttr("onchange").removeAttr("target");
						$text.unbind("click").unbind("dblclick").unbind("focus").unbind("change");
						//判断是不是明细
						var isDetail = $text.attr("isDetail");
						if(isDetail){
							$text.after($text.val());
							$text.remove();
						}
					});
					$("input:checkbox:not([noReadonly]),select:not([noReadonly]),input:radio:not([noReadonly])",$p).each(function(){
						var $text = $(this);
						$text.attr("disabled","disabled");
						//删除text的事件
						$text.removeAttr("onclick").removeAttr("ondblclick").removeAttr("lookupGroup")
							.removeAttr("onchange").removeAttr("target");
						$text.unbind("click").unbind("dblclick").unbind("focus").unbind("change");
						//判断是不是明细
						var isDetail = $text.attr("isDetail");
						if(isDetail){
							$text.remove();
						}
					});
					//3.a.button
					$("a.button:not([noReadonly])",$p).each(function(){
						var $button = $(this);
						//删除可能引发事件的属性
						$button.removeAttr("onclick").removeAttr("ondblclick").removeAttr("lookupGroup").removeAttr("target");
						$button.unbind("click").unbind("dblclick");
						$button.attr("href","javascript:void(0);");
						$button.removeClass("button").addClass("buttonDisabled");
					});
					//4.div:button
					$("div.button:not([noReadonly])",$p).each(function(){
						var $buttonArea = $(this);
						$buttonArea.removeClass("button").addClass("buttonDisabled");
						$("button,input:button",$buttonArea)
							.removeAttr("onclick").removeAttr("ondblclick")
							.removeAttr("lookupGroup").removeAttr("target")
							.unbind("click").unbind("dblclick").bind("click",function(){return false;});
					});
					//5.inputDateButton日期选择按钮直接删除,lookuBtn直接删除掉
					$("a.inputDateButton:not([noReadonly]),a.btnLook:not([noReadonly])",$p).each(function(){
						$(this).remove();
					});
					
					//6.将toolbar中的按钮去掉换成lable文字
					$(".toolBar",$p).each(function(){
						var $toolBar = $(this);
						var text = $toolBar.attr("text");
						$toolBar.empty();
						$toolBar.append('<span style="line-height:23px;font-weight:bold;color:#183152;margin-left:-10px"></span>');
						var $lable = $("span",$toolBar);
						$lable.html(text);
					});
				}
			});
		}
	});
})(jQuery);