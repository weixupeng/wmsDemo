/**
 * 商品属性动态组件product_attribute_input使用
 */
(function($){
	$.extend(migr,{
		uploadifyImageComplete : function(event, queueId, fileObj, response, data){
			var json = Bird.jsonEval(response);
			Bird.ajaxDone(json);
			if(json.statusCode == Bird.statusCode.ok){
				var $this = $(event.target);
				var $p = $this.parents(".unitBox:first");
				
				if (json.navTabId){ //把指定navTab页面标记为需要“重新载入”。注意navTabId不能是当前navTab页面的
					var dialog = $p;
					if(json.navTabId){
						dialog=$("body").data(json.navTabId);
					}
					var $pagerForm=$("#pagerForm",dialog);
					var data = $pagerForm.serialize();
					var url = $pagerForm.attr("action");
					if(url){
						jQuery.pdialog.reload(url,{dialogId:json.navTabId,data:data});
					}
				}
			}
		},
		uploadifyDeliveryImageComplete : function(event, queueId, fileObj, response, data){
			var json = Bird.jsonEval(response);
			Bird.ajaxDone(json);
			if(json.statusCode == Bird.statusCode.ok){
				var $this = $(event.target);
				var $p = $this.parents(".unitBox:first");
				var url = $("#theForm",$p).attr("action");
				var dialog = $p;
				var dialogId = $("#dialogId",$p).val();
				var ddd = {id:$("input[name='id']").val(),bgImage:json["filePath"],type:1};
				if(url){
					jQuery.pdialog.reload(url,{dialogId:dialogId,data:ddd});
				}
			}
		},
		chooseImage:function(args,$p,lookupBtn){
			//获取本页id，将图片Id设置到本图片位置，将图片显示出来。待提交后将图片与商品绑定
			var imgId = args['id'];
			var img = args['img'];
			var $productImageLi = lookupBtn.parents("li:first");
			var $productImagePreview = $productImageLi.find(".productImagePreview");
			$productImagePreview.html('<img src="' + img+'?t='+(new Date()).valueOf() + '" />');
			var $productImageIds = $productImageLi.find("input[name='productImageIds']");
			$productImageIds.val(imgId);
			//增加下一个图片框
			var productImageLiHtml = '<li><div class="productImageBox"><div class="productImagePreview">暂无图片</div><div class="productImageOperate"><a class="left" href="javascript: void(0);" alt="左移" hidefocus="true"></a><a class="right" href="javascript: void(0);" title="右移" hidefocus="true"></a><a class="delete" href="javascript: void(0);" title="删除" hidefocus="true"></a></div><a class="productImageUploadButton" href="javascript: void(0);"><input type="hidden" name="productImageIds"/><input type="button" name="productImages" hidefocus="true" width="800" height="600" href="'+Bird.homePath+'/mshop/product_image!choose.do" rel="product_image_choose"  callback="migr.chooseImage" mul="true" lookupGroup="imageChoose" title="选择图片"/><div>上传新图片</div></a></div></li>';
			if ($productImageLi.next().length == 0) {
				$productImageLi.after(productImageLiHtml);
				var $lastProductImageLi = $productImageLi.parents("ul:first").find("li:last");
				//绑定lookup事件
				if ($.fn.lookup) $("a[lookupGroup],input:button[lookupGroup]", $lastProductImageLi).lookup();
				if ($productImageScrollable.getSize() > 5) {
					$productImageScrollable.next();
				}
			}
		}
	});
	$.fn.extend({
		//商品图片管理
		productImage: function($p){
			return this.each(function(){
				var $pia = $(this);
				
				// 商品图片预览滚动栏
				if($.fn.scrollable){
					$(".productImageArea .scrollable",$pia).scrollable({
						speed: 600
					});
				}
				if($.fn.livequery){
					// 显示商品图片预览操作层
					$(".productImageArea li",$pia).livequery("mouseover", function() {
						$(this).find(".productImageOperate").show();
					});
					// 隐藏商品图片预览操作层
					$(".productImageArea li",$pia).livequery("mouseout", function() {
						$(this).find(".productImageOperate").hide();
					});
					// 商品图片左移
					$(".left",$pia).livequery("click", function() {
						var $productImageLi = $(this).parent().parent().parent();
						var $productImagePrevLi = $productImageLi.prev("li");
						if ($productImagePrevLi.length > 0) {
							$productImagePrevLi.insertAfter($productImageLi);
						}
					});
					
					// 商品图片右移
					$(".right",$pia).livequery("click", function() {
						var $productImageLi = $(this).parent().parent().parent();
						var $productImageNextLi = $productImageLi.next("li");
						if ($productImageNextLi.length > 0) {
							$productImageNextLi.insertBefore($productImageLi);
						}
					});
					
					// 商品图片删除
					$(".delete",$pia).livequery("click", function() {
						var $productImageLi = $(this).parent().parent().parent();
						var $productImagePreview = $productImageLi.find(".productImagePreview");
						var $productImageIds = $productImageLi.find("input[name='productImageIds']");
						$productImageIds.val("");
						
						$productImagePreview.html("暂无图片");
						$productImagePreview.removeAttr("title");
					});
				}
				
				// 商品图片选择预览
				if($.fn.scrollable){
					var $productImageScrollable = $(".productImageArea .scrollable",$pia).scrollable();
				}
				
				var productImageLiHtml = '<li><div class="productImageBox"><div class="productImagePreview">暂无图片</div><div class="productImageOperate"><a class="left" href="javascript: void(0);" alt="左移" hidefocus="true"></a><a class="right" href="javascript: void(0);" title="右移" hidefocus="true"></a><a class="delete" href="javascript: void(0);" title="删除" hidefocus="true"></a></div><a class="productImageUploadButton" href="javascript: void(0);"><input type="button" name="productImages" hidefocus="true" width="800" height="600" href="'+Bird.homePath+'/mshop/product_image!choose.do" rel="product_image_choose"  callback="migr.chooseImage" mul="true" lookupGroup="imageChoose" title="选择图片"/><div>上传新图片</div></a></div></li>';
				$(".productImageUploadButton input",$pia).livequery("change", function() {
					var $this = $(this);
					var $productImageLi = $this.parent().parent().parent();
					var $productImagePreview = $productImageLi.find(".productImagePreview");
					var fileName = $this.val().substr($this.val().lastIndexOf("\\") + 1);
					var uploadLimit = $("#uploadLimit",$pia).val();
					var reg = new RegExp(uploadLimit,"i");
					if (!reg.test($this.val())) {
						alertMsg.error("您选择的文件格式错误！");
						return false;
					}
					$productImagePreview.empty();
					$productImagePreview.attr("title", fileName);
					if ($.browser.msie) {
						if(!window.XMLHttpRequest) {
							$productImagePreview.html('<img src="' + $this.val() + '" />');
						} else {
							$this[0].select();
							var imgSrc = document.selection.createRange().text;
							$productImagePreview[0].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod = 'scale', src='" + imgSrc + "')";
						}
					} else if ($.browser.mozilla) {
						$productImagePreview.html('<img src="' + $this[0].files[0].getAsDataURL() + '" />');
					} else if ($.browser.chrome){
						$productImagePreview.html(fileName);
					}else {
						$productImagePreview.html(fileName);
					}
					if ($productImageLi.next().length == 0) {
						var $pIl = $productImageLi.after(productImageLiHtml);
						alert($pIl.html());
						if ($productImageScrollable.getSize() > 5) {
							$productImageScrollable.next();
						}
					}
					var $productImageIds = $productImageLi.find("input[name='productImageIds']");
					var $productImageParameterTypes = $productImageLi.find("input[name='productImageParameterTypes']");
					var $productImageUploadButton = $productImageLi.find(".productImageUploadButton");
					$productImageIds.remove();
					if ($productImageParameterTypes.length > 0) {
						$productImageParameterTypes.val("productImageFile");
					} else {
						$productImageUploadButton.append('<input type="hidden" name="productImageParameterTypes" value="productImageFile" />');
					}
				});
				
				
			});
		}
	});
})(jQuery);