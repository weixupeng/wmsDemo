/**
 * @author migrsoft.com
 * 使用说明：
 * 1、在页面增加隐藏域
 *   <input id="approveUrl" type="hidden" value="$!link.contextPath/base/approveinfo!add.do?approveinfo.orderNo=$!purchorder.orderNo&className=Purchorder"/>
 *   其中id必须为approveUrl，url必须为$!link.contextPath/base/approveinfo!add.do?approveinfo.orderNo={orderNo}&className={className}
 *   请将{orderNo}填充为您的模块的orderNo，将{className}填充为您的模块的类名
 * 2、在弹出审批组件的按钮上标记target="checkDialog"
 * 3、在弹出审批组件的按钮上填写callback="{yourFunctionName}"，如callback="migr.purchCheckCallback"
 * @param callback的param 当callback的参数有两个(btn,state),btn就是打开审核的那个按钮，state是审核的状态1、通过 0、拒绝
 * 
 * 4、notifyCheckDialog被migr.lxf.js中的migr.checkPurchFormDialogDone方法调用来通知审核情况
 */
(function($){
	var $target = null;
	$.extend({
		notifyCheckDialog:function(state){
			//关闭
			$.pdialog.closeCurrent();
			//callback
			var callback = $target.attr('callback');
			if(callback){
				if (! $.isFunction(callback)) callback = eval('(' + callback + ')');
				callback($target,state);
			}
		}
	});
	$.fn.extend({
		checkDialog:function(){
			return this.each(function(){
				var $this = $(this)
				$this.click(function(event){
					$target = $this;
					var $p = $this.parents(".unitBox:first");
					
					//beforeCall
					var beforeCall = $target.attr('beforeCall');
					var beforeCallStr=beforeCall;//审核操作的特殊处理
					if(beforeCall){
						if (! $.isFunction(beforeCall)) beforeCall = eval('(' + beforeCall + ')');
						if(!beforeCall(this)){
							return false;
						}
					}
					var title = $this.attr("title") || $this.text();
					var rel = $this.attr("rel") || "_blank";
					var options = {};
					var w = $this.attr("width");
					var h = $this.attr("height");
					if (w){
						options.width = w;
					}else{
						options.width = 450;
					}
					if (h){
						options.height = h;
					}else{
						options.height = 250;
					}
					options.max = eval($this.attr("max") || "false");
					options.mask = eval($this.attr("mask") || "true");
					options.maxable = eval($this.attr("maxable") || "true");
					options.minable = eval($this.attr("minable") || "false");
					options.fresh = eval($this.attr("fresh") || "true");
					options.resizable = eval($this.attr("resizable") || "true");
					options.drawable = eval($this.attr("drawable") || "true");
					options.close = eval($this.attr("close") || "");
					options.param = $this.attr("param") || "";

					var url = $this.attr("url") || $("#approveUrl",$p).val();
					Bird.debug(url);
					if (!url.isFinishedTm()) {
						alertMsg.error($this.attr("warn") || Bird.msg("alertSelectMsg"));
						return false;
					}
					if(beforeCallStr=='migr.beforApprove')//假如是审核操作的话需要进行特殊处理
					{
						alertMsg.confirm("确定已保存单据?修改数据后未保存单据会导致数据更新无效", {
				    		okCall: function(){
				    			$.pdialog.open(url, rel, title, options);
				    		}
				    	});
					}else{
						$.pdialog.open(url, rel, title, options);
					}
					return false;
				});
			});
		},
		dblCheckDialog:function(){
			return this.each(function(){
				$(this).dblclick(function(event){
					var $this = $(this);
					$target = $this;
					var $p = $this.parents(".unitBox:first");
					
					//beforeCall
					var beforeCall = $target.attr('beforeCall');
					if(beforeCall){
						if (! $.isFunction(beforeCall)) beforeCall = eval('(' + beforeCall + ')');
						if(!beforeCall(this)){
							return false;
						}
					}
					
					var title = $this.attr("title") || $this.text();
					var rel = $this.attr("rel") || "_blank";
					var options = {};
					var w = $this.attr("width");
					var h = $this.attr("height");
					if (w){
						options.width = w;
					}else{
						options.width = 450;
					}
					if (h){
						options.height = h;
					}else{
						var dh = $this.attr("Dheight");
						if(dh){
							options.height = dh;
						}else{
							options.height = 250;
						}
					}
					options.max = eval($this.attr("max") || "true");
					options.mask = eval($this.attr("mask") || "false");
					options.maxable = eval($this.attr("maxable") || "true");
					options.minable = eval($this.attr("minable") || "true");
					options.fresh = eval($this.attr("fresh") || "true");
					options.resizable = eval($this.attr("resizable") || "true");
					options.drawable = eval($this.attr("drawable") || "true");
					options.close = eval($this.attr("close") || "");
					options.restore = eval($this.attr("restore") || "false");
					options.param = $this.attr("param") || "";

					var url = $this.attr("url") || $("#approveUrl",$p).val();
					Bird.debug(url);
					if (!url.isFinishedTm()) {
						alertMsg.error($this.attr("warn") || Bird.msg("alertSelectMsg"));
						return false;
					}
					$.pdialog.open(url, rel, title, options);
					return false;
				});
			});
		}
	});
	
})(jQuery);