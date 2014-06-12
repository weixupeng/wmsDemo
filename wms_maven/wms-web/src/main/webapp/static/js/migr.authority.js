/**
 * 权限插件，存在属性noAuth的进行无权访问提示
 * @auth lzy@bjsxsoft.com
 */
(function($){
	$.fn.extend({
		/**
		 * authority树插件，
		 * @returns
		 */
		authority:function($p){
			return this.each(function(){
				var $this = $(this);
				if($this.attr("noAuth") == "false"){
					return;
				}
				//删除text的事件
				$this.removeAttr("onclick").removeAttr("ondblclick").removeAttr("lookupGroup")
					.removeAttr("onchange").removeAttr("target");
				$this.unbind("click").unbind("dblclick").unbind("focus").unbind("change");
				
				$this.click(function(event){
					alertMsg.error("您无此访问权限！");
					event.preventDefault();
					return false;
				});
			});
		}
	});
})(jQuery);