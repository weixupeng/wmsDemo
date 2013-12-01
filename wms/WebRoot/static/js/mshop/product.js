/**
 * 商品属性动态组件product_attribute_input使用
 */
(function($){
	$.extend($,{
		// 增加选项内容输入框
		addProductAtrributTypeRow:function(obj){
			var $this = $(obj);
			var $p = $this.parents(".unitBox:first");
			var attributeOptionTrHtml = '<dl class="attributeOptionTr"><dt>选项内容:</dt><dt><input type="text" name="attributeOptionList" class="textInput attributeOption  required" /></dt><dt><img style="margin-left:20px;margin-top:5px;cursor:pointer;" src="'+Bird.homePath+'/images/mshop/input_delete_icon.gif" class="deleteImage" onclick="$.deleteProductAtrributeTypeRow(this);" alt="删除" /></dt></dl>';
			if($(".attributeOptionTr",$p).length > 0) {
				$(".attributeOptionTr:last",$p).after(attributeOptionTrHtml);
			} else {
				$("#productAttributeTypeTr",$p).after(attributeOptionTrHtml);
			}
			//绑定delete事件
			$(".deleteImage",$p).click(function() {
				if($(".attributeOptionTr",$p).length > 1) {
					$(this).parent().parent().remove();
				} else {
					alertMsg.error("请至少保留一个选项!");
				}
			});
		},
		removeProductArributeTypeRow:function(obj){
			var $this = $(obj);
			var $p = $this.parents(".unitBox:first");
			// 减少选项内容输入框
			if($(".attributeOptionTr",$p).length > 1) {
				$(".attributeOptionTr:last",$p).remove();
			} else {
				alertMsg.error("请至少保留一个选项!");
			}
		},
		deleteProductAtrributeTypeRow:function(obj){
			var $this = $(obj);
			var $p = $this.parents(".unitBox:first");
			// 删除本行
			if($(".attributeOptionTr",$p).length > 1) {
				$this.parent().parent().remove();
			} else {
				alertMsg.error("请至少保留一个选项!");
			}
		}
	});
	$.fn.extend({
		//动态增加属性
		productAttributeTypeSelect: function($p){
			return this.each(function(){
				var $this = $(this);
				
				var $productAttributeType = $this;
				var $productAttributeTypeTr = $("#productAttributeTypeTr",$p);
				var $addAndRemoveTr = $("#addAndRemoveTr",$p);

				// 显示选项内容
				$productAttributeType.change(function() {
					$addAndRemoveTr.hide();
					$(".attributeOptionTr",$p).remove();
					if($productAttributeType.val() == "select" || $productAttributeType.val() == "checkbox") {
						var attributeOptionTrHtml = '<dl class="attributeOptionTr"><dt>选项内容:</dt><dt><input type="text" name="attributeOptionList" class="textInput attributeOption  required" /></dt><dt><img style="margin-left:20px;margin-top:5px;cursor:pointer;" src="'+Bird.homePath+'/images/mshop/input_delete_icon.gif" class="deleteImage" onclick="$.deleteProductAtrributeTypeRow(this);" alt="删除" /></dt></dl>';
						if($(".attributeOptionTr",$p).length > 0) {
							$(".attributeOptionTr:last",$p).after(attributeOptionTrHtml);
						} else {
							$productAttributeTypeTr.after(attributeOptionTrHtml);
						}
						$addAndRemoveTr.show();
						// 删除选项内容输入框
						bindDeleteImgClick();
					}
				});
			});
		},
		//选择属性类型，查询属性，进行填写
		productTypeSelect:function($p){
			return this.each(function(){
				var $this = $(this);
				$this.change( function() {
					$(".productAttributeContentTr",$p).remove();
					var productTypeId = $this.val();
					$.ajax({
						url: Bird.homePath+"/mshop/product_attribute!ajaxProductAttribute.do",
						dataType: "json",
						data:{productTypeId: productTypeId},
						async: false,
						error:Bird.ajaxError,
						success: function(json) {
							var productAttributeTrHtml = "";
							$.each(json, function(i) {
								if(json[i]["attributeType"] == "text") {
									productAttributeTrHtml += '<dl class="productAttributeContentTr"><dt>' + json[i].name + ':</dt><dd><input type="text" name="' + json[i].id + '"' + ((json[i].isRequired == true) ? ' class="required"' : ' class=""') + ' />' + '</dd></dl>';
								} else if(json[i]["attributeType"] == "number") {
									productAttributeTrHtml += '<dl class="productAttributeContentTr"><dt>' + json[i].name + ':</dt><dd><input type="text" name="' + json[i].id + '"' + ((json[i].isRequired == true) ? ' class="required {number: true}"' : ' class="{number: true}"') + ' />' + '</dd></dl>';
								} else if(json[i]["attributeType"] == "alphaint"){
									productAttributeTrHtml += '<dl class="productAttributeContentTr"><dt>' + json[i].name + ':</dt><dd><input type="text" name="' + json[i].id + '"' + ((json[i].isRequired == true) ? ' class="required {lettersonly: true}"' : ' class="{lettersonly: true}"') + ' />' + '</dd></dl>';
								} else if(json[i]["attributeType"] == "select") {
									var productAttributeOption = '<option value="">请选择...</option>';
									for(var key in json[i]["attributeOptionList"]) {
										productAttributeOption += ('<option value="' + json[i]["attributeOptionList"][key] + '">' + json[i]["attributeOptionList"][key] + '</option>');
									}
									productAttributeTrHtml += '<dl class="productAttributeContentTr"><dt>' + json[i].name + ':</dt><dd><select name="' + json[i].id + '" class="combox '+((json[i].isRequired == true) ? 'required': '')+ '">' + productAttributeOption + '</select>' + '</dd></dl>';
								} else if(json[i]["attributeType"] == "checkbox") {
									var productAttributeOption = "";
									for(var key in json[i]["attributeOptionList"]) {
										productAttributeOption += ('<label style="width:60px;"><input type="checkbox" name="' + json[i].id + '" value="' + json[i]["attributeOptionList"][key] + '"' + ((json[i].isRequired == true) ? ' class="required"' : '') +' />&nbsp;&nbsp;' + json[i]["attributeOptionList"][key] + '</label>');
									}
									productAttributeTrHtml += '<dl class="productAttributeContentTr"><dt>' + json[i].name + ':</dt><dd>' + productAttributeOption + '</dd></dl>';
								} else if(json[i]["attributeType"] == "date") {
									productAttributeTrHtml += '<dl class="productAttributeContentTr"><dt>' + json[i].name + ':</dt><dd><input type="text" name="' + json[i].id + '"' + ((json[i].isRequired == true) ? ' class="required date"' : ' class="date"') + ' /></dd></dl>';
								}
							})
							$("#productTypeTr",$p).after(productAttributeTrHtml);
							
							if ($.fn.datepicker){
								$('input.date', $p).each(function(){
									var $this = $(this);
									var opts = {};
									if ($this.attr("format")) opts.pattern = $this.attr("format");
									if ($this.attr("yearstart")) opts.yearstart = $this.attr("yearstart");
									if ($this.attr("yearend")) opts.yearend = $this.attr("yearend");
									$this.datepicker(opts);
								});
							}
							if ($.fn.combox) $("select.combox",$p).combox();
						}
					});
				});
			});
		}
	});
})(jQuery);