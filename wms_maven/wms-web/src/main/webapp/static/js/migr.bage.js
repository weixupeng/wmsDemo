/*
 * 此js文件需要放置在migr.js之后
 */
(function($,migr){
	$.extend(migr,{
		//这里写自己定义的方法，方法之间用逗号分割，如bage:function(){},bage:function(){}
		//调用时：migr.test();migr.test2();
		bage:function(){
			
		},
		bage2:function(){
			
		},
		//-----------------双屏设置
		dealPosChooseForSetup:function(args,$p,lookupBtn){
			$("#selectPossetup",$p).trigger("click");
		},
		saveOrClearPossetup:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var posCode=$("input[name='possetup.posCode']",$p).val();
			if(posCode==""){
				alertMsg.error("请选择pos机!", {okCall: function(){$("input[name='possetup.posCode']",$p).focus();}});
				return;
			}
			alertMsg.confirm($(obj).attr("title"),{
				okCall: function(){
					jQuery.ajax({
		        		type:"POST",
		        		url: $(obj).attr("objUrl")+"?possetup.posCode="+$("input[name='possetup.posCode']",$p).val(),
		        		data:null,
		        		dataType:"json",
		        		async: false,
		        		success: function(data){
							if(data.statusCode=='300')
							{
								alertMsg.error(data.message);
							}else{
								alertMsg.correct(data.message);
								var dialogId=$("#dialogId",$p).val();
								navTab.reload($("#pagerForm",navTab.getCurrentPanel()).attr("action")+"?isSubmit=1",{navTabId:dialogId,fresh:true,data:$("#pagerForm",navTab.getCurrentPanel()).serialize()});
							}
		        		}
		        	});
				}
			});
		},
		removerAdver:function(obj){//父亲页面是navTab,自己页面是dialog(关闭自己页面,刷新父亲页面)
			var $p = $(obj).parents(".unitBox:first");
			alertMsg.confirm($(obj).attr("title"),{
				okCall: function(){
					jQuery.ajax({
		        		type:"POST",
		        		url: $(obj).attr("objUrl"),
		        		data:null,
		        		dataType:"json",
		        		async: false,
		        		success: function(data){
							if(data.statusCode=='300')
							{
								alertMsg.error(data.message);
							}else{
								var dialogId=$("#dialogId",$p).val();
								navTab.reload($("#pagerForm",navTab.getCurrentPanel()).attr("action")+"?isSubmit=1",{navTabId:dialogId,fresh:true,data:$("#pagerForm",navTab.getCurrentPanel()).serialize()});
							}
		        		}
		        	});
				}
			});
		},
		chooseAdverFinish:function(parentNavTab,obj){//父亲页面是navTab,自己页面是dialog(关闭自己页面,刷新父亲页面)
			var $p = $(obj).parents(".unitBox:first");
			var dialogId=$("#dialogId",$p).val();
			var dialog= $("body").data(dialogId);
			alertMsg.confirm($(obj).attr("title"),{
				okCall: function(){
					jQuery.ajax({
		        		type:"POST",
		        		url: $(obj).attr("objUrl")+"?possetup.posCode="+$("input[name='possetup.posCode']",navTab.getCurrentPanel()).val(),
		        		data:null,
		        		dataType:"json",
		        		async: false,
		        		success: function(data){
							if(data.statusCode=='300')
							{
								alertMsg.error(data.message);
							}else{
								alertMsg.correct(data.message);
								$.pdialog.close(dialog);
								navTab.reload($("#pagerForm",navTab.getCurrentPanel()).attr("action")+"?isSubmit=1",{navTabId:parentNavTab,fresh:true,data:$("#pagerForm",navTab.getCurrentPanel()).serialize()});
							}
		        		}
		        	});
				}
			});
		},
		changePictureStatus:function(obj,imgCode){
			var $p = $(obj).parents(".unitBox:first");
			var status=$(obj).attr("status");
			var $trueImageDiv=$("#true"+imgCode,$p);
			var $falseImageDiv=$("#false"+imgCode,$p);
			if(status!='1'){
				$(obj).attr("status",'1');
				$trueImageDiv.attr("style","display:block");
				$falseImageDiv.attr("style","display:none");
			}else{
				$(obj).attr("status",'0');
				$trueImageDiv.attr("style","display:none");
				$falseImageDiv.attr("style","display:block");
			}
			var updateDetailUrl=$("#updateDetailUrl",$p).val();
			jQuery.ajax({
        		type:"POST",
        		url: updateDetailUrl,
        		data:"code="+imgCode+"&type="+$("#type",$p).val()+"&flag="+$(obj).attr("status"),
        		dataType:"json",
        		async: false,
        		success: function(data){
					if(data.statusCode=='300')
					{
						alertMsg.error(data.message);
					}
        		}
        	});
		},
		dealRollmessageStatus:function(obj,imgCode){
			var $p = $(obj).parents(".unitBox:first");
			var status=$(obj).attr("status");
			if(status!='1'){
				$(obj).attr("status",'1');
				$(obj).attr("src",$("#trueImageUrl",$p).val());
			}else{
				$(obj).attr("status",'0');
				$(obj).attr("src",$("#falseImageUrl",$p).val());
			}
			var updateDetailUrl=$("#updateDetailUrl",$p).val();
			jQuery.ajax({
        		type:"POST",
        		url: updateDetailUrl,
        		data:"code="+imgCode+"&type="+$("#type",$p).val()+"&flag="+$(obj).attr("status"),
        		dataType:"json",
        		async: false,
        		success: function(data){
					if(data.statusCode=='300')
					{
						alertMsg.error(data.message);
					}
        		}
        	});
		},
		//-----------------短信模块的开始
		//短信成员管理
		finshChooseMember:function(obj){
			alertMsg.confirm($(obj).attr("title"),{
				okCall: function(){
					jQuery.ajax({
		        		type:"POST",
		        		url: $(obj).attr("objUrl"),
		        		data:$(obj).serialize(),
		        		dataType:"json",
		        		async: false,
		        		success: function(data){
							if(data.statusCode=='300')
							{
								alertMsg.error(data.message);
							}else{
								closeSelfDialogAndRefreshParentDialog($(obj));
								alertMsg.correct(data.message);
							}
		        		}
		        	});
				}
			});
		},
		//群发短信
		changeMessageGroup:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var changeMessageGroupUrl=$("#changeMessageGroupUrl",$p).val();
			alertMsg.confirm($(obj).attr("title"),{
				okCall: function(){
					jQuery.ajax({
		        		type:"POST",
		        		url: changeMessageGroupUrl,
		        		data:$(obj).serialize(),
		        		dataType:"json",
		        		async: false,
		        		success: function(data){
							if(data.statusCode=='300')
							{
								alertMsg.error(data.message);
							
							}else{
								alertMsg.correct(data.message);
								migr.commRefreshOtherOrder(obj,"pagerForm");
							}
		        		}
		        	});
				}
			});
		},
		refreshMessagegroupForDelete:function(data,btn){//刷新adcostorderForm页面
			var $p = $(btn).parents(".unitBox:first");
			var refreshUrl=$("#refreshUrl",$p).val();
			var dialogId = $("#dialogId",$p).val();
			$.pdialog.reload(refreshUrl,{dialogId:dialogId,data:$("#pagerForm",$p).serialize()});
		}
		,
		//短信查看
		dealDbclickForshortmessage:function(obj,messageId,messageType){
			var $p = $(obj).parents(".unitBox:first");
			var objclickName=messageId;
			if(messageType==0){
				objclickName="single"+objclickName;
			}else{
				objclickName="bulk"+objclickName;
			}
			$("a[name='"+objclickName+"']",$p).trigger("click");
		},
		//短信单发
		countHaveInputStrSize:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var size= $(obj).val().len();
			var oldSize=$(obj).attr("oldValue").len();
			if(floatSub(size,253)>0){
				$(obj).val($(obj).attr("oldValue"));
				$("#contentSize",$p).val(oldSize);
				alertMsg.error("消息内容最大不能超过253个字符",{okCall: function(){$(obj).focus();}});
			}else{
				$(obj).attr("oldValue",$(obj).val());
				$("#contentSize",$p).val(size);
			}
		}
		,
		//-----------------操作日志配置
		saveLogConfig:function(obj){
			alertMsg.confirm($(obj).attr("title"),{
				okCall: function(){
					jQuery.ajax({
		        		type:"POST",
		        		url: $(obj).attr("objurl"),
		        		data:null,
		        		dataType:"json",
		        		async: false,
		        		success: function(data){
							if(data.statusCode=='300')
							{
								alertMsg.error(data.message);
							
							}else{
								alertMsg.correct(data.message);
							}
		        		}
		        	});
				}
			});
		}
		,
		dealLogConfig:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var dealLogConfigUrl=$("#dealLogConfigUrl",$p).val();//要处理checkbox的url
			var tname=$(obj).val();//module表的tname
			if($(obj).attr("checked")){
				flag="1";
			}else{
				flag="";
			}
			dealLogConfigUrl=dealLogConfigUrl+"?m.tname="+tname+"&m.flag="+flag;
			jQuery.ajax({
        		type:"POST",
        		url: dealLogConfigUrl,
        		data:null,
        		dataType:"json",
        		async: false,
        		success: function(data){
					if(data.statusCode=='300')
					{
						alertMsg.error(data.message);
					}else{
						$ids=$("input[name='ids']",$p);
						var flag=true;
						$ids.each(function(){
							var $this = $(this);
							if(!$this.attr("checked")){
								flag=false;
							}
						});
						$("#topCheckbox",$p).attr("checked",flag);
					}
        		}
        	});
			
		},
		dealReturnOrder:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var $returnOrderChoose=$("#returnOrderChoose",$p);
			$("#objLabel",$p).text($(obj).attr("objLabel"));
			$returnOrderChoose.attr("title",$(obj).attr("title"));
			$returnOrderChoose.attr("href",$(obj).attr("objurl"));
		}
		,
		dealassocaiteorder:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			$orderForm=$("#orderForm",$p);
			var objectOrderNo=$("input[name='purchorder.recOrderNo']",$p).val();
			if(!objectOrderNo){
				objectOrderNo=$("input[name='wsaleorder.orOrderNo']",$p).val();
			}
			if(!objectOrderNo){
				objectOrderNo=$("input[name='deliverorder.srcNo']",$p).val();
			}
			var confirmMessage=$(obj).attr("confirm");
			if(objectOrderNo=''){
				confirmMessage=$(obj).attr("error");
			}
			alertMsg.confirm(confirmMessage,{
				okCall: function(){
					$orderForm.submit();
				}
			});
		},
		associateorder:function(btn){
			var $this = $(btn);
			var $p = $(btn).parents(".unitBox:first");
			var error=$this.attr("error");
			var $idsChecked = $("input:checkbox[name='ids']:checked:enabled",$p);
			if($idsChecked.size() == 0){
				alertMsg.error(error);
				return false;
			}
			if($idsChecked.size() >1){
				alertMsg.error("只能选择一条！");
				return false;
			}
			$(btn).attr("href",$(btn).attr("backhref")+"?id="+$idsChecked.val());
			return true;
		},
		commAssociateorderRefresh:function(data,form){
			var $p = $(form).parents(".unitBox:first");
			var url=$("#refreshUrl",$p).val();
			//var dialogId = $("#dialogId",$p).val();不刷新本页面
			var parentDiaglog= $("#parentDiaglog",$p).val();
			var associateorderButton=$("#associateorderButtonId",$p);
			associateorderButton.attr("style","display:none");
			Bird.ajaxDone(data);
			var dialog = $("body").data(parentDiaglog);
			if(dialog){//刷新父页面
				var $pagerForm=$("#pagerForm",dialog);
				$.pdialog.reload($pagerForm.attr("action"),{dialogId:parentDiaglog,data:$pagerForm.serialize()});
			}
			//$.pdialog.reload(url,{dialogId:dialogId,data:null});//刷新本页面
		}
		,
		dealAreaInit:function(obj){
			var dealareainitUrl=$(obj).attr("dealareainitUrl");
			jQuery.ajax({
        		type:"POST",
        		url: dealareainitUrl,
        		data:$(obj).serialize(),
        		dataType: "json",
        		async: false,
        		success: function(data){
    				if(data.statusCode=='300')
					{
    					alertMsg.error(data.message);
    				
					}else{
						alertMsg.correct(data.message);
					}
        		}
        	});
		}
		,
		dealExcelimportForCommonOrder:function(args,$p,lookupBtn){
			var url=$("#refreshUrl",$p).val();
			jQuery.pdialog.reload(url,{dialogId:$("#dialogId",$p).val(),data:$("#orderForm",$p).serialize()});
		},
		dealExcelimportForPurchOrder:function(args,$p,lookupBtn){
			var url=$("#refreshUrl",$p).val();
			var dialogNum=$("#dialogId",$p).val();
			var $payDate=$("input[name='purchorder.payDate']",$p);
			if($payDate!=undefined){
				var payDateUrl=$payDate.attr("payDateUrl");
				payDateUrl=payDateUrl+"?supplier.code="+args['supplierCode'];
				jQuery.ajax({
	        		type:"POST",
	        		url:payDateUrl,
	        		data:null,
	        		dataType: "json",
	        		async: false,
	        		success: function(data){
	    				if(data.payDate!=undefined)
						{
	    					$payDate.val(data.payDate);
						}else{
							$payDate.val("");
						}
	        		}
	        	});
			}
			jQuery.pdialog.reload(url,{dialogId:dialogNum,data:$("#orderForm",$p).serialize()});
		}
		,
		dealExcelimportForWsaleOrder:function(args,$p,lookupBtn){
			var url=$("#refreshWsaleorderUrl",$p).val();
			var dialogNum=$("#dialogId",$p).val();
			var lookup=$(lookupBtn).attr("lookupGroup");
			if("consumer"==lookup){
				var $payDate=$("input[name='wsaleorder.payDate']",$p);
				var $bizMan=$("input[name='wsaleorder.bizMan']",$p);
				var payDateUrl=$("#payDateUrl",$p).val();
				payDateUrl=payDateUrl+"?consumer.code="+args['code'];
				jQuery.ajax({
	        		type:"POST",
	        		url:payDateUrl,
	        		data:null,
	        		dataType: "json",
	        		async: false,
	        		success: function(data){
	    				if(data.payDate!=undefined)
						{
	    					$payDate.val(data.payDate);
						}else{
							$payDate.val("");
						}
	    				if(data.bizMan!=undefined)
						{
	    					$bizMan.val(data.bizMan);
						}else{
							$bizMan.val("");
						}
	        		}
	        	});
			}
			//}
			jQuery.pdialog.reload(url,{dialogId:dialogNum,data:$("#orderForm",$p).serialize()});
		},
		 dealPayDateForConcost:function(args,$p,lookupBtn){
			var $payDate=$("input[name='concostorder.payDate']",$p);
			if($payDate!=undefined){
				var payDateUrl=$payDate.attr("payDateUrl");
				payDateUrl=payDateUrl+"?consumer.code="+args['code'];
				jQuery.ajax({
	        		type:"POST",
	        		url:payDateUrl,
	        		data:null,
	        		dataType: "json",
	        		async: false,
	        		success: function(data){
	    				if(data.payDate!=undefined)
						{
	    					$payDate.val(data.payDate);
						}else{
							$payDate.val("");
						}
	        		}
	        	});
			}
		 }
		,dealPayDateForSupcost:function(args,$p,lookupBtn){
			var $payDate=$("input[name='supcostorder.payDate']",$p);
			if($payDate!=undefined){
				var payDateUrl=$payDate.attr("payDateUrl");
				payDateUrl=payDateUrl+"?supplier.code="+args['supplierCode'];
				jQuery.ajax({
	        		type:"POST",
	        		url:payDateUrl,
	        		data:null,
	        		dataType: "json",
	        		async: false,
	        		success: function(data){
	    				if(data.payDate!=undefined)
						{
	    					$payDate.val(data.payDate);
						}else{
							$payDate.val("");
						}
	        		}
	        	});
			}
		 },
		 dealPayDateForAssociatecost:function(args,$p,lookupBtn){
				var $payDate=$("input[name='associatesorder.payDate']",$p);
				if($payDate!=undefined){
					var payDateUrl=$payDate.attr("payDateUrl");
					payDateUrl=payDateUrl+"?supplier.code="+args['supplierCode'];
					jQuery.ajax({
		        		type:"POST",
		        		url:payDateUrl,
		        		data:null,
		        		dataType: "json",
		        		async: false,
		        		success: function(data){
		    				if(data.payDate!=undefined)
							{
		    					$payDate.val(data.payDate);
							}else{
								$payDate.val("");
							}
		        		}
		        	});
				}
			 }
		 ,
		dealExcelimportForAdcostorderForm:function(args,$p,lookupBtn){
			var url=$("#refreshAdcostOrderUrl",$p).val();
			var dialogNum=$("#dialogId",$p).val();
			jQuery.pdialog.reload(url,{dialogId:dialogNum,data:$("#adcostorderForm",$p).serialize()});
		}	
		,
		uploadifyFileComplete:function(event, queueId, fileObj, response, data){
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
					var $orderForm=$("#orderForm",dialog);
					var $adcostorderForm=$("#adcostorderForm",dialog);
					var data ="";
					var url="";
					if($pagerForm&&$pagerForm.attr("action")){
						data=$pagerForm.serialize();
						url=$pagerForm.attr("action");
					}else if($orderForm&&$orderForm.attr("action")){
						data=$orderForm.serialize();
						url=$("#refreshUrl",dialog).val();
					}else if($adcostorderForm&&$adcostorderForm.attr("action")){//成本调价单的form比较特殊
						data=$adcostorderForm.serialize();
						url=$("#refreshAdcostOrderUrl",dialog).val();
					}
					if(url){
						jQuery.pdialog.reload(url,{dialogId:json.navTabId,data:data});
					}
				}
			}
		},
		//基本档案的商品模块开始
		dealTypeForExcelClass:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var isLegalTypeUrl=$(obj).attr("isLegalTypeUrl");
			jQuery.ajax({
        		type:"POST",
        		url: isLegalTypeUrl,
        		data:$(obj).serialize(),
        		dataType: "json",
        		async: false,
        		success: function(data){
    				if(data.statusCode=='300')
					{
    					alertMsg.error(data.message);
    					$(obj).val($(obj).attr("oldValue"));
					}else{
						$(obj).attr("oldValue",$(obj).val());
					}
        		}
        	});
		}
		,
		dealGrossRate:function(obj,bitNum){
			var $p = $(obj).parents(".unitBox:first");
			var purchasePrice=$("input[name='goods.purchasePrice']",$p).val();
			var salePrice=$("input[name='goods.salePrice']",$p).val();
			var oldValue=$(obj).attr("oldValue");
			var flag=migr.commonFormatNumber($(obj),bitNum);//先去校验 输入的是否合法
			if(flag==0)
			{
				return;//如果0的失败
			}
			if($(obj).attr("name")=="goods.salePrice")
			{
				if(floatSub(purchasePrice,salePrice)>0)//校验进货价格是否大于零售价格
				{
					$(obj).focus();
					$(obj).addClass("error");
					alertMsg.error("零售价小于进货价,请输入合理的零售价");
					flag=0;
				}
				if(flag==0){
					window.setTimeout(function(){$(obj).removeClass("error");}, 2000);
					if(oldValue!=undefined)
						$(obj).val(setScale(oldValue,bitNum, "roundhalfup"));
					return;
				}
				$(obj).val(setScale($(obj).val(),bitNum, "roundhalfup"));
				if(oldValue!=undefined)
					$(obj).attr("oldValue",$(obj).val());
			}
			var $grossRate=$("input[name='goods.grossRate']",$p);
			if(salePrice==0)
				$grossRate.val(0);
			else
				$grossRate.val(setScale(100*(floatSub(salePrice,purchasePrice)/salePrice),2, "roundhalfup"));
		},
		dealChargeType:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var chargeType=$("select[name='goods.chargeType']",$p).val();
			var chargeRateLabel=$("#chargeRateLabel",$p);
			if(chargeType==0)
				chargeRateLabel.text("提成比率：");
			else
				chargeRateLabel.text("提成金额：");
		},
		frontOrNext:function(obj,type,goodCode){
			var $p = $(obj).parents(".unitBox:first");
			var url=$(obj).attr("url");
			var validateUrl=$(obj).attr("validateUrl");
			validateUrl=validateUrl+"?id="+goodCode+"&type="+type;
			url=url+"?id="+goodCode;
			var dialogId=$("#dialogId",$p).val();
			var flag=0;
			jQuery.ajax({
        		type:"POST",
        		url: validateUrl,
        		dataType: "json",
        		async: false,
        		success: function(data){
    				if(data)
					{
    					$.pdialog.reload(url,{dialogId:dialogId,data:null});
					}else{
						if(type==0)
							alertMsg.warn("已经是第一条");
						else
							alertMsg.warn("已经是最后一条");
						return;
					}
        		}
        	});
		},
		copyGoods:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var url=$(obj).attr("url");
			var dialogId=$("#dialogId",$p).val();
			$.pdialog.reload(url,{dialogId:dialogId,data:null});
		}
		,
		saveGoodsForBranch:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var $ids = $("input[name='ids']:checked",$p);
			if($ids.val()==undefined||$ids.val()==''){
				alertMsg.error("商品必须至少属于一个门店");
				return;
			}
			var parentDialog=$("#parentDialog",$p).val();
			var parentDialogBody=$("body").data(parentDialog);
			var refreshUrl=$("#refreshUrl",$p).val();
			alertMsg.confirm("确认保存生效分店？", {
				okCall: function(){
					var url=$("#saveUrl",$p).val();
		        	jQuery.ajax({
		        		type:"POST",
		        		url: url,
		        		data:$ids.serialize(),
		        		dataType: "json",
		        		async: false,
		        		success: function(data) {
		        			if(data.status=="300"){
		        				alertMsg.error(data.message);
		        			}else{
		        				alertMsg.correct(data.message);
		        				var $parentDialogBody=$("body").data(parentDialog);
//		        				alert($parentDialogBody.html());
		        				if(!parentDialogBody){
		        					alert("dialog不存在，可能是因为本页面的dialogId和实际dialogId不符！");
		        				}else{
		        					var $pagerForm=$("#pagerForm",$parentDialogBody);
		        					var gooddata = $pagerForm.serialize();
		        					jQuery.pdialog.reload(refreshUrl,{dialogId:parentDialog,data:gooddata});
		        				}
		        			}
		        		}
		        	});
				}
			});
		}
		,
		commonRefresh:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var $form=$("#pagerForm",$p);
			var url=$form.attr("action");
			var dialogId=$("#dialogId",$p).val();
			$.pdialog.reload(url,{dialogId:dialogId,data:$form.serialize()});
		},
		settleOrderFormRefresh:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var $form=$("#settleOrderForm",$p);
			var dialogId=$("#dialogId",$p).val();
			var refreshUrl=$("#refreshUrl",$p).val();
			$.pdialog.reload(refreshUrl,{dialogId:dialogId,data:$form.serialize()});
		},
		commonNavTabRefresh:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var $form=$("#pagerForm",$p);
			var url=$form.attr("action");
			var dialogId=$("#dialogId",$p).val();
			navTab.reload(url,{navTabId:dialogId,data:$form.serialize()});
		},
		
		deliverPrice:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var value=$(obj).val();
			var $pricerate=$("a[name='branch.deliverPrice']",$p);
			if(value=='10503'){
				$pricerate.attr("value","10703");
				$pricerate.html("配送价");
			}else{
				$pricerate.attr("value","10705");
				$pricerate.html("成本价");
			}
		}
		,
		//基本档案的商品模块结束
		//批量修改商品属性开始
		codeTypeChangeForBatch:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var $oldCode=$("input[name='coderecord.oldCode']",$p);
			$oldCode.val("");
			var url=$("#refreshUrl",$p).val();
			jQuery.pdialog.reload(url,{dialogId:$("#dialogId",$p).val(),data:$("#pagerForm",$p).serialize()});
		},
		commonForRemoteValidate:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var remoteUrl=$(obj).attr("remoteUrl");
			var $pagerForm=$("#pagerForm",$p);
			jQuery.ajax({
        		type:"POST",
        		url: remoteUrl,
        		dataType: "json",
        		data:$pagerForm.serialize(),
        		async: false,
        		success: function(data){
    				if(data.statusCode=="300"){
    					alertMsg.error(data.message);
    					$(obj).val($(obj).attr("oldValue"));
    				}else{
    					$(obj).attr("oldValue",$(obj).val());
    				}
        		}
        	});
		},
		codeTypeBatchSumbit:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var dialogId=$("#dialogId",$p).val();
			var refreshUrl=$("#refreshUrl",$p).val();
			var $pagerForm=$("#pagerForm",$p);
			var $oldValue=$("input[name='coderecord.oldCode']",$p);
			var $codeValue=$("input[name='coderecord.code']",$p);
			var $memo=$("input[name='memo']",$p);
			alertMsg.confirm("确认要批量修改对应的编号记录么？", {
				okCall: function(){
		        	jQuery.ajax({
		        		type:"POST",
		        		url: $pagerForm.attr("action"),
		        		data:$pagerForm.serialize(),
		        		dataType: "json",
		        		async: false,
		        		success: function(data) {
		        			if(data.statusCode=="300"){
		        				alertMsg.error(data.message);
		        			}else{
		        				alertMsg.correct("批量修改"+$oldValue.val()+"编号记录成功");
		        				$oldValue.val("");//清空原编码
		        				$codeValue.val("");//清空新编码
		        				$memo.val("");//清空备注
	        					jQuery.pdialog.reload(refreshUrl,{dialogId:dialogId,data:$pagerForm.serialize()});
		        			}
		        		}
		        	});
				}
			});
		},
		resetBatchAttribute:function(obj){//重置修改范围
			var $p = $(obj).parents(".unitBox:first");
			var $branchCode=  $("input[name='searchBean.branchCode']",$p);
			var $categoryCode=$("input[name='searchBean.categoryCode']",$p);  
			var $supplierCode=$("input[name='searchBean.supplierCode']",$p); 
			var $brandCode=$("input[name='searchBean.brandCode']",$p); 
			var $branchName=  $("input[name='branchName']",$p);
			var $categoryName=$("input[name='categoryName']",$p);  
			var $supplierName=$("input[name='supplierName']",$p); 
			var $brandName=$("input[name='brandName']",$p); 
			$branchCode.val("");
			$categoryCode.val("");
			$supplierCode.val("");
			$brandCode.val("");
			$branchName.val("");
			$categoryName.val("");
			$supplierName.val("");
			$brandName.val("");
		},
		batchAttributeSumbit:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var dialogId=$("#dialogId",$p).val();
			var refreshUrl=$("#refreshUrl",$p).val();
			var $pagerForm=$("#pagerForm",$p);
			var $branchCode=  $("input[name='searchBean.branchCode']",$p);
			var $categoryCode=$("input[name='searchBean.categoryCode']",$p);  
			var $supplierCode=$("input[name='searchBean.supplierCode']",$p); 
			var $brandCode=$("input[name='searchBean.brandCode']",$p); 
			if($branchCode.val()==""&&$categoryCode.val()==""&&$supplierCode.val()==""&&$brandCode.val()==""){
				alertMsg.error("请指定修改范围");
				return ;
			}
			alertMsg.confirm("确认要批量修改指定范围的商品对应属性值？", {
				okCall: function(){
		        	jQuery.ajax({
		        		type:"POST",
		        		url: $pagerForm.attr("action"),
		        		data:$pagerForm.serialize(),
		        		dataType: "json",
		        		async: false,
		        		success: function(data) {
		        			if(data.statusCode=="200"){
		        				alertMsg.correct("批量指定修改范围的商品属性成功");
		        				$branchCode.val("");//清空条件
		        				$categoryCode.val("");//清空条件
		        				$supplierCode.val("");//清空条件
		        				$brandCode.val("");//清空条件
	        					jQuery.pdialog.reload(refreshUrl,{dialogId:dialogId,data:$pagerForm.serialize()});
		        			}else{
		        				alertMsg.error(data.message);
		        			}
		        		}
		        	});
				}
			});
		},
		//批量修改商品属性开始
		//基本档案模块-------------------------------
		 commonTreeAddClick:function($this){
			//判断是那个树否选中
			   	var $p = $this.parents(".unitBox:first");
				var temptree=$("ul[name='treeName']",$p);
				var id=temptree.attr("id");
				var idKey = temptree.attr("idKey");
				var warnInfo=temptree.attr("info");
				var treeNodeName=temptree.attr("pName");
				var level=temptree.attr("level");
				var zTree = $.fn.zTree.getZTreeObj(id);
				nodes = zTree.getSelectedNodes();
				if(nodes == undefined){
					alertMsg.error("程序内部错误，找不到tree！");
					return false;
				}
				if(nodes.length == 0&&warnInfo!=undefined){
					alertMsg.warn(warnInfo);//alertMsg有三个方法:error,warn,correct|错误,警告,成功
					return false;
				}
				var selectNode = nodes[0];
				if(level){
					if(selectNode.level < level){
						alertMsg.warn(warnInfo);
						return false;
					}
				}
				var url = $this.attr("url");
				if(url.indexOf("?") == -1){
					if(selectNode!=undefined)
						url = url + "?"+treeNodeName+"="+ selectNode[idKey];
					else
						url = url + "?"+treeNodeName+"=";
				}else{
					if(selectNode!=undefined)
						url = url + "&"+treeNodeName+"="+ selectNode[idKey];
					else
						url = url + "&"+treeNodeName+"=";
				}
				$this.attr("href",url);
				return true;
		},
		//公用控件开始---------------------------------
		setColumn:function(obj)//列设置(用于报表)
		{
			$tname=$(obj).attr("tname");
			if($tname!=undefined&&$tname!=''){
				var objhref=$(obj).attr("hrefurl")+"&sysTablemx.tableName="+$tname;
				$(obj).attr("href",objhref);
				$(obj).attr("rel",$tname);
			}
			/*$tname=$(obj).attr("tname");
			if($tname!=undefined&&$tname!=''){
				var url=$(obj).attr("hrefurl")+"&sysTablemx.tableName="+$tname;
				$.pdialog.open(url,$tname,'表头设置',{restore:false,max:true});(这种方式好像不能展开)
			}*/
			/*var dialogId = 't_po_master';
			//根据orderNo打开相应单据
			*/
		},
		changeColumnSet:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			$setColumn=$("#setColumn",$p);
			if($setColumn){
				$setColumn.attr("tname",$(obj).attr("id"));
				//$setColumn.attr("rel",$(obj).attr("id"));
			}
			
		}
		,
		validateInteger:function(obj){
			if(!RegExp(/^\d+$/).test($(obj).val()))
			{
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("请输入合法的整数！");
				$(obj).val($(obj).attr('oldValue'));
				window.setTimeout(function(){$(obj).removeClass("error");}, 2000);
			}else{
				$(obj).attr('oldValue',$(obj).val());
			}
		}
		,
		//会员模块开始------------------------------
		memberSelectOfcardconsume:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var branchCode=$("input[name='cardConsumerBean.branchCode']",$p);
			var branchBtnLook=$("#branchBtnLook",$p);
			if($(obj).attr("flag")=='1'){
				branchCode.val("");
				branchBtnLook.attr("href","#");
				branchBtnLook.removeClass("btnLook");
				branchCode.attr("readonly",true);
			}else{
				branchCode.attr("readonly",false);
				branchBtnLook.addClass("btnLook");
				branchBtnLook.attr("href",branchBtnLook.attr("hrefurl"));
			}
			return true;
		},
		vipDialogReloadDone:function(data,form){
			Bird.ajaxDone(data);
			var $p = $(form).parents(".unitBox:first");
			var url=$("#refreshUrl",$p).val();
			var dialogId=$("#dialogId",$p).val();
			if(data.statusCode== Bird.statusCode.ok){
				$.pdialog.reload(url,{dialogId:dialogId,data:$("#pagerForm",$p).serialize()});
			}
		},
		operatorBatchcard:function(obj,type){
			var $p = $(obj).parents(".unitBox:first");
			var url=$(obj).attr("url");
			var refreshUrl=$("#refreshUrl",$p).val();
		    var $form=$("#pagerForm",$p);
		    var dialogId=$("#dialogId",$p).val();
		    if(type==1){//点击生成按钮的时候
		    	$form.attr("action",url);
			    $form.submit();
		    }
		    if(type==3){//点击删除按钮的时候
		    	alertMsg.confirm("确认删除？", {
					okCall: function(){
						var $ids = $("input[name='ids']:checked",$p);//只用于删除的时候
				    	if($ids.val()==undefined||$ids.val()==''){
							alertMsg.error("还没选中要删除会员卡");
							return;
						}
				    	jQuery.ajax({
			        		type:"POST",
			        		url: url,
			        		data:$form.serialize()+"&"+$ids.serialize(),
			        		dataType: "json",
			        		async: false,
			        		success: function(data){
		        				if(data.statusCode&&data.statusCode==200)
		    					{
		    						alertMsg.correct(data.message);
		    					}else{
		    						alertMsg.error(data.message);
		    						return;
		    					}
			        			jQuery.pdialog.reload(refreshUrl,{dialogId:dialogId,data:$form.serialize()});
			        		}
			        	});
					}
				});
		    	return;
		    }
		    if(type==2){//点击保存按钮的时候
		    	
		    	alertMsg.confirm("确认保存当前生成的批量会员卡号？,保存成功后不能修改！", {
					okCall: function(){
						jQuery.ajax({
			        		type:"POST",
			        		url: url,
			        		data:$form.serialize(),
			        		dataType: "json",
			        		async: false,
			        		success: function(data){
		        				if(data.statusCode&&data.statusCode==200)
		    					{
		    						alertMsg.correct(data.message);
		    					}else{
		    						alertMsg.error(data.message);
		    						return ;
		    					}
			        			jQuery.pdialog.reload(refreshUrl,{dialogId:dialogId,data:$form.serialize()});
			        		}
			        	});
				    	return;
					}
				});
		    }
		},
		modifyBatchcard:function(obj,id){
			//校验数字格式
			var flag=0;
			if($(obj).attr("name")=='totalintegral'||$(obj).attr("name")=='czamount'||$(obj).attr("name")=='limitnum'){
				if(!$(obj).val().isNumber()){
					$(obj).focus();
					$(obj).addClass("error");
					alertMsg.error("请输入合法的数字！");
					flag=1;
				}
				window.setTimeout(function(){$(obj).removeClass("error");}, 2000);
			}else if($(obj).attr("name")=='cardid'||$(obj).attr("name")=='cardno'){
				if(!$(obj).val())
					{
						$(obj).focus();
						$(obj).addClass("error");
						alertMsg.error("会员ID或者会员卡号,不能为空！");
						flag=1;
					}
				window.setTimeout(function(){$(obj).removeClass("error");}, 2000);
			}
			if(flag==1){
				$(obj).val($(obj).attr("oldValue"));
				return ;
			}
			var $p = $(obj).parents(".unitBox:first");
		 	var $tr = $(obj).parents("tr:first");
			var url=$("#updateUrl",$p).val();
			jQuery.ajax({
				type:"POST",
				url: url,
				data:"vipinfo."+$(obj).attr("name")+"="+$(obj).val()+"&id="+id,
				dataType: "json",
				async: false,
				success: function(data) {
					$(obj).attr("oldValue",$(obj).val());
					if($(obj).attr("name")=='totalintegral'||$(obj).attr("name")=='czamount'){
						$(obj).val(setScale($(obj).val(),2, "roundhalfup"));
					}
				}
			});
		}
		,
		//基本档案模块开始
		operatorAffixCode:function(obj,type){
			var $p = $(obj).parents(".unitBox:first");
			var dialogNum=$("#dialogId",$p).val();
			var refreshUrl=$("#refreshUrl",$p).val();
			var executeUrl="";
			if(type==1)
			{
				executeUrl=$("#addUrl",$p).val();
			}
			if(type==2){
				executeUrl=$("#modifyUrl",$p).val();//这里key传到了id变量里
				executeUrl=executeUrl+"?affixCodeItem="+$(obj).val()+"&id="+$(obj).attr("key");
				var validateUrl=$(obj).attr("validateUrl");
				validateUrl=validateUrl+"?affixCodeItem="+$(obj).val()+"&id="+$(obj).attr("key");
				var flag=0;
				jQuery.ajax({
	        		type:"POST",
	        		url: validateUrl,
	        		dataType: "json",
	        		async: false,
	        		success: function(data){
        				if(data.statusCode=="300"){//失败的时候  把旧的值还原
        					$(obj).val("");
        					alertMsg.error(data.message);
        					flag=1;
        				}else{//成功的时候把旧的值变成新的值
        					//$(obj).atrr("oldValue",$(obj).val());
        				}
	        		}
	        	});
				if(flag==1)
					return;
			}
			var $ids = $("input[name='ids']:checked",$p);//只用于删除的时候
			if(type==3){
				executeUrl=$("#deleteUrl",$p).val();
				if($ids.val()==undefined||$ids.val()==''){
					alertMsg.error("还没选中要删除的条码");
					return;
				}
			}
			if(type==4){
				executeUrl=$("#saveUrl",$p).val();
			}
        	jQuery.ajax({
        		type:"POST",
        		url: executeUrl,
        		data:$("#affixCodeForm",$p).serialize()+"&"+$ids.serialize(),
        		dataType: "json",
        		async: false,
        		success: function(data){
        			if(type==4){
        				if(data.status!=undefined&&data.status=="success")
    					{
    						alertMsg.correct(data.message);
    					}else{
    						alertMsg.error(data.message);
    					}
        			}
        			jQuery.pdialog.reload(refreshUrl,{dialogId:dialogNum,data:$("#affixCodeForm",$p).serialize()});
        		}
        	});
		},
		baseMoudleDblick:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var objHref=$(".edit",$p);
			objHref.trigger("click");
		},
		baseMoudleDblickForMore:function(obj,id){
			var $p = $(obj).parents(".unitBox:first");
			var objHref=$("#"+id,$p);
			objHref.trigger("click");
		},
		
		//基本档案模块结束
		//-------------------------结算模块开始
		//----------往来帐款的开始
		commonConsumerChange:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			jQuery.ajax({
				type:"POST",
				url: $(obj).attr("consumerUrl"),
				data:$(obj).serialize(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.status=="error"){
						if($(obj).val()!=''){
							alertMsg.warn("你输入的客户编码不存在");
						}
						$("input[name=consumerName]",$p).val("");
					}else{
						$("input[name=consumerName]",$p).val(data.consumerName);
					}
				}
			});
		}
		,
		commonSupplierChange:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			jQuery.ajax({
				type:"POST",
				url: $(obj).attr("supplierUrl"),
				data:$(obj).serialize(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.status=="error"){
						if($(obj).val()!=''){
							alertMsg.warn("你输入的供应商编码不存在");
						}
						$("input[name=supplierName]",$p).val("");
					}else{
						$("input[name=supplierName]",$p).val(data.supplierName);
					}
				}
			});
		},
		commonBOrganCodeChange:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			jQuery.ajax({
				type:"POST",
				url: $(obj).attr("organUrl"),
				data:$(obj).serialize(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.status=="error"){
						if($(obj).val()!=''){
							alertMsg.warn("你输入的机构编码不存在");
						}
						$("input[name=borganName]",$p).val("");
					}else{
						$("input[name=borganName]",$p).val(data.borganName);
					}
				}
			});
		},
		toReallyReceiveDetail:function(obj,code,type){
			var $p = $(obj).parents(".unitBox:first");
			var objHref=$("#settleTab6",$p);
			if(type=='1')
				objHref.attr("consumer",code);
			if(type=='2')
				objHref.attr("supplier",code);
			if(type=='3')
				objHref.attr("borganCode",code);
			objHref.trigger("click");
		},
		toShouldReceiveDetail:function(obj,code,type){
			var $p = $(obj).parents(".unitBox:first");
			var objHref=$("#settleTab2",$p);
			if(type=='1')
				objHref.attr("consumer",code);
			if(type=='2')
				objHref.attr("supplier",code);
			if(type=='3')
				objHref.attr("borganCode",code);
			objHref.trigger("click");
		},
		toCostAccountDetail:function(obj,code,type){
			var $p = $(obj).parents(".unitBox:first");
			var objHref=$("#settleTab4",$p);
			if(type=='1')
				objHref.attr("consumer",code);
			if(type=='2')
				objHref.attr("supplier",code);
			if(type=='3')
				objHref.attr("borganCode",code);
			objHref.trigger("click");
		},
		commSettleExchangeTabSelect:function(obj,settleType){
			var $p = $(obj).parents(".unitBox:first");
			var startTimeDate=$("#startTimeDate",$p).val();
			var endTimeDate=$("#endTimeDate",$p).val();
			var settleTabs= $("a[name='settleTab']",$p);
			var type=$("#type",$p).val();
			var objTab=undefined;
			settleTabs.each(function(){
				if(type==$(this).attr("flag")){
					objTab=$(this);
				}else{
					$("#"+$(this).attr("divId"),$p).empty();
				}
			})
			var objUrl=objTab.attr("objUrl");
			if(settleType=="1"){
				var consumerCode=$("input[name='consumerCode']",$p).val();
				objUrl=objUrl+''+'&startTimeDate='+startTimeDate+'&endTimeDate='+endTimeDate+'&consumerCode='+consumerCode;
			}
			if(settleType=="2"){
				var supplierCode=$("input[name='supplierCode']",$p).val();
				objUrl=objUrl+''+'&startTimeDate='+startTimeDate+'&endTimeDate='+endTimeDate+'&supplierCode='+supplierCode;
			}
			if(settleType=="3"){
				var borganCode=$("input[name='borganCode']",$p).val();
				objUrl=objUrl+''+'&startTimeDate='+startTimeDate+'&endTimeDate='+endTimeDate+'&borganCode='+borganCode;
			}
			$("#"+objTab.attr("divId"),$p).loadUrl(objUrl);
		},
		commSettleExchangeTab:function(obj,settleType){
			var $p = $(obj).parents(".unitBox:first");
			var startTimeDate=$("#startTimeDate",$p).val();
			var endTimeDate=$("#endTimeDate",$p).val();
			var objUrl=$(obj).attr("objUrl");
			if(settleType=="1"){
				var consumerCode;
				if(($(obj).attr("flag")=='2'||$(obj).attr("flag")=='4'||$(obj).attr("flag")=='6')&&$(obj).attr("consumer")!='')
					{
						consumerCode=$(obj).attr("consumer");//判断点击的来源（是来自双击事件）
					}
				else{
					consumerCode=$("input[name='consumerCode']",$p).val();
				}
					
				objUrl=objUrl+''+'&startTimeDate='+startTimeDate+'&endTimeDate='+endTimeDate+'&consumerCode='+consumerCode;
				if($(obj).attr("flag")=='2'||$(obj).attr("flag")=='6'||$(obj).attr("flag")=='4'){//把值清空下
					$(obj).attr("consumer","");
				}
			}
			if(settleType=="2"){
				var supplierCode;
				if(($(obj).attr("flag")=='2'||$(obj).attr("flag")=='4'||$(obj).attr("flag")=='6')&&$(obj).attr("supplier")!='')
					{
						supplierCode=$(obj).attr("supplier");//判断点击的来源（是来自双击事件）
					}
				else{
						supplierCode=$("input[name='supplierCode']",$p).val();
				}
					
				objUrl=objUrl+''+'&startTimeDate='+startTimeDate+'&endTimeDate='+endTimeDate+'&supplierCode='+supplierCode;
				if($(obj).attr("flag")=='2'||$(obj).attr("flag")=='6'||$(obj).attr("flag")=='4'){//把值清空下
					$(obj).attr("supplier","");
				}
			}
			if(settleType=="3"){
				var borganCode;
				if(($(obj).attr("flag")=='2'||$(obj).attr("flag")=='4'||$(obj).attr("flag")=='6')&&$(obj).attr("borganCode")!='')
					{
					borganCode=$(obj).attr("borganCode");//判断点击的来源（是来自双击事件）
					}
				else{
					borganCode=$("input[name='borganCode']",$p).val();
				}
					
				objUrl=objUrl+''+'&startTimeDate='+startTimeDate+'&endTimeDate='+endTimeDate+'&borganCode='+borganCode;
				if($(obj).attr("flag")=='2'||$(obj).attr("flag")=='6'||$(obj).attr("flag")=='4'){//把值清空下
					$(obj).attr("borganCode","");
				}
			}
//			$("[id*^$='detailContentDiv']",$p).each(function(){这段代码不能删掉 (做参考的)
//				$(this).empty();
//			});
			$("#type",$p).val($(obj).attr("flag"));//把type赋值
			$("#"+$(obj).attr("divId"),$p).loadUrl(objUrl);
		},
		//----------往来帐款的结束
		
		//----------机构结算的开始
		modifyOrgsettleDetail:function(obj,orderNo,payType,moneyscale){//修改供应商 结算单时候  要做的逻辑
			//校验数字格式
		var flag=0;
		if(!$(obj).val().isNumber()){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("请输入合法的数字！");
				flag=1;
		}
		var $tr = $(obj).parents("tr:first");
		var name=$(obj).attr("name");
		var recMoney=$("input[name='recMoney']",$tr).val();
		var preMoney=$("input[name='preMoney']",$tr).val();
		var unrecMoney=$("td[rname='unrecMoney']",$tr).attr("value");
		if(flag!=1&&(payType=='3'||payType=='5')){
			if(recMoney>0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("本张单据总额应向加盟店付款(这时输入实际金额应该为负数),请输入正确的实际金额");
				flag=1;
			}else if(preMoney>0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("本张单据总额应向加盟店付款(这时输入优惠金额应该为负数),请输入正确的优惠金额");
				flag=1;
			}else if(floatSub(recMoney,unrecMoney)<0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("实际金额小于未收金额,请输入正确实收金额");
				flag=1;
			}else if(floatSub(preMoney,unrecMoney)<0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("优惠金额小于未收金额,请输入正确优惠金额");
				flag=1;
			}else if(floatSub(floatAdd(recMoney,preMoney),unrecMoney)<0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("实际金额加优惠金额小于未收金额,请确认输入!");
				flag=1;
			}
		}else if(flag!=1&&(payType=='2'||payType=='4')){
			if(recMoney<0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("本张单据总额应向加盟店收款(这时输入实际金额应该为正数),请输入正确的实际金额");
				flag=1;
			}else if(preMoney<0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("本张单据总额应向加盟店收款(这时输入优惠金额应该为正数),请输入正确的优惠金额");
				flag=1;
			}else if(floatSub(recMoney,unrecMoney)>0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("实际金额大于未收金额,请输入正确实收金额");
				flag=1;
			}else if(floatSub(preMoney,unrecMoney)>0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("优惠金额大于未收金额,请输入正确优惠金额");
				flag=1;
			}else if(floatSub(floatAdd(recMoney,preMoney),unrecMoney)>0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("实际金额加优惠金额大于未收金额,请确认输入!");
				flag=1;
			}
		}
		window.setTimeout(function(){$(obj).removeClass("error");}, 2000);
		if(flag==1){
			$(obj).val($(obj).attr("oldValue"));
			return ;
		}
		var $p = $(obj).parents(".unitBox:first");
	 	var $tr = $(obj).parents("tr:first");
		var url=$("#updateDetailUrl",$p).val();
		jQuery.ajax({
			type:"POST",
			url: url,
			data:$("#settleOrderForm",$p).serialize()+"&orgsettledetail.costOrderNo="+orderNo+"&orgsettledetail."+name+"="+$(obj).val(),
			dataType: "json",
			async: false,
			success: function(data){
				if(data.status=="error"){
					alertMsg.error(data.message);
				}else{
					var newVal=$(obj).val();
					var newVal=setScale(newVal,2, "roundhalfup");
					$(obj).val(newVal);
					$(obj).attr("oldValue",newVal);
					if(name=='recMoney'){//当类型为来往费用时候
						$("td[rname='recMoneySum']",$p).text(setScale(data.recMoneySum,2, "roundhalfup"));
						$("input[name='orgsettleorder.orderMoney']",$p).val(setScale(data.recMoneySum,2, "roundhalfup"));
					}
					if(name=='preMoney'){
						$("td[rname='preMoneySum']",$p).text(setScale(data.preMoneySum,2, "roundhalfup"));
					}
				   }
				}
			});
		},
		checkSettleOrganData:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			if($("input[name='branchName']",$p).val()=="")
			{
				alertMsg.error('请先选要结算加盟店');
				return false;
			}
			var bcode=$("input[name='"+$("#entityName",$p).val()+".bcode']").val();
			var hrefurl=$(obj).attr("backhref");
			hrefurl=hrefurl+"?"+$("#entityName",$p).val()+".bcode="+bcode;
			$(obj).attr("href",hrefurl);
			return true;
		},
		//----------机构结算的结束
		//----------供应商结算的开始
		checkSettleSupplierData:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			if($("input[name='supplierName']",$p).val()=="")
			{
				alertMsg.error('请先选供应商');
				return false;
			}
			var supplierCode=$("input[name='"+$("#entityName",$p).val()+".supplierCode']").val();
			var hrefurl=$(obj).attr("backhref");
			hrefurl=hrefurl+"?"+$("#entityName",$p).val()+".supplierCode="+supplierCode;
			$(obj).attr("href",hrefurl);
			return true;
		},	
		modifySupsettleDetail:function(obj,orderNo,bizOrderType,moneyscale) {//修改供应商 结算单时候  要做的逻辑
			//校验数字格式
		var flag=0;
		if(!$(obj).val().isNumber()){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("请输入合法的数字！");
				flag=1;
		}
		var $tr = $(obj).parents("tr:first");
		var name=$(obj).attr("name");
		var recMoney=$("input[name='recMoney']",$tr).val();
		var preMoney=$("input[name='preMoney']",$tr).val();
		var unrecMoney=$("td[rname='unrecMoney']",$tr).attr("value");
		if(flag!=1&&(bizOrderType==1||bizOrderType==2||bizOrderType==4)){
			if(recMoney>0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("本张单据总额应向供应商收款(这时输入实际金额应该为负数),请输入正确的实际金额");
				flag=1;
			}else if(preMoney>0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("本张单据总额应向供应商收款(这时输入优惠金额应该为负数),请输入正确的优惠金额");
				flag=1;
			}else if(floatSub(recMoney,unrecMoney)<0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("实付金额小于未付金额,请输入正确实付金额");
				flag=1;
			}else if(floatSub(preMoney,unrecMoney)<0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("优惠金额小于未付金额,请输入正确优惠金额");
				flag=1;
			}else if(floatSub(floatAdd(recMoney,preMoney),unrecMoney)<0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("实付金额加优惠金额小于未付金额,请确认输入!");
				flag=1;
			}
		}else if(flag!=1||bizOrderType==5){
			if(recMoney<0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("本张单据总额应向供应商付款(这时输入实付金额应该为正数),请输入正确的实付金额");
				flag=1;
			}else if(preMoney<0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("本张单据总额应向供应商付款(这时输入优惠金额应该为正数),请输入正确的优惠金额");
				flag=1;
			}else if(floatSub(recMoney,unrecMoney)>0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("实付金额大于未付金额,请输入正确实付金额");
				flag=1;
			}else if(floatSub(preMoney,unrecMoney)>0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("优惠金额大于未付金额,请输入正确优惠金额");
				flag=1;
			}else if(floatSub(floatAdd(recMoney,preMoney),unrecMoney)>0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("实付金额加优惠金额大于未付金额,请确认输入!");
				flag=1;
			}
		}
		window.setTimeout(function(){$(obj).removeClass("error");}, 2000);
		if(flag==1){
			$(obj).val($(obj).attr("oldValue"));
			return ;
		}
		var $p = $(obj).parents(".unitBox:first");
	 	var $tr = $(obj).parents("tr:first");
		var url=$("#updateDetailUrl",$p).val();
		jQuery.ajax({
			type:"POST",
			url: url,
			data:$("#settleOrderForm",$p).serialize()+"&supsettledetail.costOrderNo="+orderNo+"&supsettledetail."+name+"="+$(obj).val(),
			dataType: "json",
			async: false,
			success: function(data){
				if(data.status=="error"){
					alertMsg.error(data.message);
				}else{
					var newVal=$(obj).val();
					var newVal=setScale(newVal,2, "roundhalfup");
					$(obj).val(newVal);
					$(obj).attr("oldValue",newVal);
					if(name=='recMoney'){//当类型为来往费用时候
						$("td[rname='recMoneySum']",$p).text(setScale(data.recMoneySum,moneyscale, "roundhalfup"));
						$("input[name='supsettleorder.orderMoney']",$p).val(setScale(data.recMoneySum,moneyscale, "roundhalfup"));
					}
					if(name=='preMoney'){
						$("td[rname='preMoneySum']",$p).text(setScale(data.preMoneySum,moneyscale, "roundhalfup"));
					}
				   }
				}
			});
		},
		//----------供应商结算的结束
		
		//----------客户结算的开始
		modifyConsettleDetail:function(obj,orderNo,bizOrderType,moneyscale) {//修改客户结算单时候  要做的逻辑
			//校验数字格式
		var flag=0;
		if(!$(obj).val().isNumber()){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("请输入合法的数字！");
				flag=1;
		}
		var $tr = $(obj).parents("tr:first");
		var name=$(obj).attr("name");
		var recMoney=$("input[name='recMoney']",$tr).val();
		var preMoney=$("input[name='preMoney']",$tr).val();
		var unrecMoney=$("td[rname='unrecMoney']",$tr).attr("value");
		if(flag!=1&&(bizOrderType==1||bizOrderType==2||bizOrderType==4)){
			if(recMoney>0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("本张单据总额应向客户付款(这时输入实际金额应该为负数),请输入正确的实际金额");
				flag=1;
			}else if(preMoney>0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("本张单据总额应向客户付款(这时输入优惠金额应该为负数),请输入正确的优惠金额");
				flag=1;
			}else if(floatSub(recMoney,unrecMoney)<0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("实际金额小于未收金额,请输入正确实收金额");
				flag=1;
			}else if(floatSub(preMoney,unrecMoney)<0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("优惠金额小于未收金额,请输入正确优惠金额");
				flag=1;
			}else if(floatSub(floatAdd(recMoney,preMoney),unrecMoney)<0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("实际金额加优惠金额小于未收金额,请确认输入!");
				flag=1;
			}
		}else if(flag!=1){
			if(recMoney<0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("本张单据总额应向客户收款(这时输入实际金额应该为正数),请输入正确的实际金额");
				flag=1;
			}else if(preMoney<0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("本张单据总额应向客户收款(这时输入优惠金额应该为正数),请输入正确的优惠金额");
				flag=1;
			}else if(floatSub(recMoney,unrecMoney)>0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("实际金额大于未收金额,请输入正确实收金额");
				flag=1;
			}else if(floatSub(preMoney,unrecMoney)>0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("优惠金额大于未收金额,请输入正确优惠金额");
				flag=1;
			}else if(floatSub(floatAdd(recMoney,preMoney),unrecMoney)>0){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("实际金额加优惠金额大于未收金额,请确认输入!");
				flag=1;
			}
		}
		window.setTimeout(function(){$(obj).removeClass("error");}, 2000);
		if(flag==1){
			$(obj).val($(obj).attr("oldValue"));
			return ;
		}
		var $p = $(obj).parents(".unitBox:first");
	 	var $tr = $(obj).parents("tr:first");
		var url=$("#updateDetailUrl",$p).val();
		jQuery.ajax({
			type:"POST",
			url: url,
			data:$("#settleOrderForm",$p).serialize()+"&consettledetail.costOrderNo="+orderNo+"&consettledetail."+name+"="+$(obj).val(),
			dataType: "json",
			async: false,
			success: function(data){
				if(data.status=="error"){
					alertMsg.error(data.message);
				}else{
					var newVal=$(obj).val();
					var newVal=setScale(newVal,moneyscale, "roundhalfup");
					$(obj).val(newVal);
					$(obj).attr("oldValue",newVal);
					if(name=='recMoney'){//当类型为来往费用时候
						$("td[rname='recMoneySum']",$p).text(setScale(data.recMoneySum,moneyscale, "roundhalfup"));
						$("input[name='consettleorder.orderMoney']",$p).val(setScale(data.recMoneySum,moneyscale, "roundhalfup"));
					}
					if(name=='preMoney'){
						$("td[rname='preMoneySum']",$p).text(setScale(data.preMoneySum,moneyscale, "roundhalfup"));
					}
				   }
				}
			});
		},
		//----------客户结算的结束
		//----------机构费用的开始
		modifyOrgcostDetail:function(obj,id,moneyscale) {
			//校验数字格式
			var flag=0;
			if($(obj).attr("name")!='memo'&&$(obj).attr("name")!='name'&&$(obj).attr("name")!='code'){
				if(!$(obj).val().isNumber()){
					$(obj).focus();
					$(obj).addClass("error");
					alertMsg.error("请输入合法的数字！");
					flag=1;
				}
				window.setTimeout(function(){$(obj).removeClass("error");}, 2000);
			}
			if(flag==1){
				$(obj).val($(obj).attr("oldValue"));
				return ;
			}
			var $p = $(obj).parents(".unitBox:first");
		 	var $tr = $(obj).parents("tr:first");
			var url=$("#updateDetailUrl",$p).val();
			var orderType=$("#orderType",$p).val();
			jQuery.ajax({
				type:"POST",
				url: url,
				data:$("#settleOrderForm",$p).serialize()+"&orgcostdetail.id="+id+"&orgcostdetail."+$(obj).attr("name")+"="+$(obj).val(),
				dataType: "json",
				async: false,
				success: function(data) {
					$(obj).attr("oldValue",$(obj).val());
					if(data.data){
						$("input[name='totalSum']",$tr).val(setScale(data.data.totalSum,moneyscale, "roundhalfup"));
						$("td[rname='totalMoney']",$p).text(setScale(data.totalMoney,moneyscale, "roundhalfup"));
						if($(obj).attr("name")=='code'){//当类型为来往费用时候
							$("input[name='name']",$tr).val(data.data.name);
						}
					}
					if(data.status=="error"){
						alertMsg.error(data.message);
					}else{
						
					}
				}
			});
		},
		//----------机构费用的结束
		//----------供应商费用的开始
		modifySupcostDetail:function(obj,id,moneyscale) {
				//校验数字格式
			var flag=0;
			if($(obj).attr("name")!='memo'&&$(obj).attr("name")!='name'&&$(obj).attr("name")!='code'){
				if(!$(obj).val().isNumber()){
					$(obj).focus();
					$(obj).addClass("error");
					alertMsg.error("请输入合法的数字！");
					flag=1;
				}
				window.setTimeout(function(){$(obj).removeClass("error");}, 2000);
			}
			if(flag==1){
				$(obj).val($(obj).attr("oldValue"));
				return ;
			}
			var $p = $(obj).parents(".unitBox:first");
		 	var $tr = $(obj).parents("tr:first");
			var url=$("#updateDetailUrl",$p).val();
			var orderType=$("#orderType",$p).val();
			jQuery.ajax({
				type:"POST",
				url: url,
				data:$("#settleOrderForm",$p).serialize()+"&supcostdetail.id="+id+"&supcostdetail."+$(obj).attr("name")+"="+$(obj).val(),
				dataType: "json",
				async: false,
				success: function(data) {
					$(obj).attr("oldValue",$(obj).val());
					if(data.data){
						$("input[name='totalSum']",$tr).val(setScale(data.data.totalSum,moneyscale, "roundhalfup"));
						$("td[rname='totalMoney']",$p).text(setScale(data.totalMoney,moneyscale, "roundhalfup"));
						if(orderType=="1"&&$(obj).attr("name")=='code'){//当类型为来往费用时候
							$("input[name='name']",$tr).val(data.data.name);
						}
					}
					if(data.status=="error"){
						alertMsg.error(data.message);
					}else{
						
					}
				}
			});
		},
		//----------供应商费用的结束
		//----------客户费用的开始
		modifyConcostDetail:function(obj,id,moneyscale) {
				//校验数字格式
			var flag=0;
			if($(obj).attr("name")!='memo'&&$(obj).attr("name")!='name'&&$(obj).attr("name")!='code'){
				if(!$(obj).val().isNumber()){
					$(obj).focus();
					$(obj).addClass("error");
					alertMsg.error("请输入合法的数字！");
					flag=1;
				}
				window.setTimeout(function(){$(obj).removeClass("error");}, 2000);
			}
			if(flag==1){
				$(obj).val($(obj).attr("oldValue"));
				return ;
			}
			var $p = $(obj).parents(".unitBox:first");
		 	var $tr = $(obj).parents("tr:first");
			var url=$("#updateDetailUrl",$p).val();
			var orderType=$("#orderType",$p).val();
			jQuery.ajax({
				type:"POST",
				url: url,
				data:$("#settleOrderForm",$p).serialize()+"&concostdetail.id="+id+"&concostdetail."+$(obj).attr("name")+"="+$(obj).val(),
				dataType: "json",
				async: false,
				success: function(data) {
					$(obj).attr("oldValue",$(obj).val());
					if(data.data){
						$("input[name='totalSum']",$tr).val(setScale(data.data.totalSum,moneyscale, "roundhalfup"));
						$("td[rname='totalMoney']",$p).text(setScale(data.totalMoney,moneyscale, "roundhalfup"));
						if(orderType=="1"&&$(obj).attr("name")=='code'){//当类型为来往费用时候
							$("input[name='name']",$tr).val(data.data.name);
						}
					}
					if(data.status=="error"){
						alertMsg.error(data.message);
					}else{
						
					}
				}
			});
		},
		//----------客户费用的结束
		//----------联营结算开始
		geneatorAssociateorderDetail:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			if($("input[name='supplierName']",$p).val()=="")
			{
				alertMsg.error('请先选供应商');
				return false;
			}
			var dialogId=$("#dialogId",$p).val();
			var refreshUrl=$("#refreshUrl",$p).val();
			var generatorDetailUrl=$("#addDetailUrl",$p).val();
			jQuery.ajax({
				type:"POST",
				url: generatorDetailUrl,
				data:$("#settleOrderForm",$p).serialize(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.statusCode=="300"){
						alertMsg.error(data.message);
					}else{
						jQuery.pdialog.reload(refreshUrl,{dialogId:dialogId,data:$("#settleOrderForm",$p).serialize()});
					}
				}
			});
		},
		asscoiatesOtherMoney:function(obj,moneyscale){
			var flag=0;
			if(!$(obj).val().isNumber()){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("请输入合法的数字！");
				flag=1;
				window.setTimeout(function(){$(obj).removeClass("error");}, 2000);
			}
			if(flag==1){
				$(obj).val($(obj).attr("oldValue"));
				return ;
			}
			$(obj).val(setScale($(obj).val(),moneyscale, "roundhalfup"));
			$(obj).attr("oldValue",$(obj).val());
			var $p = $(obj).parents(".unitBox:first");
			$orderMoney=$("input[name='associatesorder.orderMoney']",$p);
			var initOrderMoney=$("#initOrderMoney",$p).val();
			$orderMoney.val(setScale(floatSub(initOrderMoney,$(obj).val()),moneyscale,"roundhalfup"));
		}
		,
		//----------联营结算结束
		//----------结算模板的公用的开始
		//--------------------用于三个结算的模板开始
		submitConsettleOrderChoose:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var name=$(obj).attr("name");
			if(name=='startTimeDate'||name=='endTimeDate'){
				var startTimeDate=$("input[name='startTimeDate']",$p).val();
				var endTimeDate=$("input[name='endTimeDate']",$p).val();
				if(startTimeDate==''||endTimeDate=='')
					return ;
			}
			$("#pagerForm",$p).submit();
		},
		//添加结算单明细时  检查有没选择客户
		addSettleOrderDetail:function(args,$p){
			var orderNos = args['orderNo'];
			var payTypes= args['payType'];
			var dialogNum=$("#dialogId",$p).val();
			var url=$("#addDetailUrl",$p).val()+"?orderNos="+orderNos+"&payTypes="+payTypes;
			var refreshUrl=$("#refreshUrl",$p).val();
			if($("input[name='consumerName']",$p).val()==''){
				alert("请选择客户");
				return false;
			}
			jQuery.ajax({
	    		type:"POST",
	    		url: url,
	    		dataType: "json",
	    		data:jQuery("#settleOrderForm",$p).serialize(),
	    		async: false,
	    		success: function(data) {
	    			if(data.status=="error"){
	    				alertMsg.error(data.message);
	    			}else{
	    				jQuery.pdialog.reload(refreshUrl,{dialogId:dialogNum,data:$("#settleOrderForm",$p).serialize()});
	    			}
	    		}
	    	});
		},
		checkboxSettleDetail:function(obj,orderNo,type){//点多选框的时候   处理的逻辑(这个需要改下精度)
			var $p = $(obj).parents(".unitBox:first");
			var $tr = $(obj).parents("tr:first");
			var preMoney;
			if(type=='2')
				preMoney=$("td[rname='cheapedMoney']",$tr).attr("value");
			else
				preMoney=$("input[name='preMoney']",$tr).val();
			var unrecMoney=$("td[rname='unrecMoney']",$tr).attr("value");
			var recMoneyInput=$("input[name='recMoney']",$tr);
			if($(obj).is(":checked")){
				recMoneyInput.val(setScale(floatSub(unrecMoney,preMoney),2,"roundhalfup"));
			}else{
				recMoneyInput.val(setScale(0,2,"roundhalfup"));
			}
			var url=$("#updateDetailUrl",$p).val();
			jQuery.ajax({
				type:"POST",
				url: url,
				data:$("#settleOrderForm",$p).serialize()+"&"+$("#entityDetailName",$p).val()+".costOrderNo="+orderNo+"&"+$("#entityDetailName",$p).val()+".recMoney="+recMoneyInput.val(),
				dataType: "json",
				async: false,
				success: function(data){
					if(data.status=="error"){
						alertMsg.error(data.message);
					}else{
							$("td[rname='recMoneySum']",$p).text(setScale(data.recMoneySum,2, "roundhalfup"));
							$("input[name='"+$("#entityName",$p).val()+".orderMoney']",$p).val(setScale(data.recMoneySum,2, "roundhalfup"));
					   }
					}
			});
		},
		//--------------------用于三个结算的模板结束
		//--------------------用于非三个结算的模板开始
		addSettleDetail:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var dialogNum=$("#dialogId",$p).val();
			var refreshUrl=$("#refreshUrl",$p).val();
			var addDetailUrl=$("#addDetailUrl",$p).val();
        	jQuery.ajax({
        		type:"POST",
        		url: addDetailUrl,
        		dataType: "json",
        		async: false,
        		success: function(data) {
        			jQuery.pdialog.reload(refreshUrl,{dialogId:dialogNum,data:$("#settleOrderForm",$p).serialize()});
        		}
        	});
		},
		//--------------------用于非三个结算的模板结束
		checkSettleConsumerData:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			if($("input[name='consumerName']",$p).val()=="")
			{
				alertMsg.error('请先选客户');
				return false;
			}
			var consumerCode=$("input[name='"+$("#entityName",$p).val()+".consumerCode']").val();
			var hrefurl=$(obj).attr("backhref");
			hrefurl=hrefurl+"?"+$("#entityName",$p).val()+".consumerCode="+consumerCode;
			$(obj).attr("href",hrefurl);
			return true;
		},
		toOpenSettleOrder:function(args,$p){
			var orderNo=args['orderNo'];
			var dialogNum=$("#dialogId",$p).val();
			var refreshUrl=$("#refreshUrl",$p).val();
			if(refreshUrl.indexOf("?") == -1){
				refreshUrl=refreshUrl+"?"+$("#entityName",$p).val()+".orderNo="+orderNo+"&orderType="+$("#orderType",$p).val()+"&newOrder=2";
			}else{
				refreshUrl=refreshUrl+"&"+$("#entityName",$p).val()+".orderNo="+orderNo+"&orderType="+$("#orderType",$p).val()+"&newOrder=2";
			}
			jQuery.pdialog.reload(refreshUrl,{dialogId:dialogNum});
		},
		dialogSettleorder:function (data,obj){
			var $p = $(obj).parents(".unitBox:first");
			var url=$("#refreshUrl",$p).val();
			var dialogNum=$("#dialogId",$p).val();
			Bird.ajaxDone(data);
			if(url.indexOf("?") == -1){
				url=url+"?orderType="+$("#orderType",$p).val();
			}else{
				url=url+"&orderType="+$("#orderType",$p).val();
			}
			if(data.orderNo!=undefined&&data.orderNo!='none'){
				$.pdialog.reload(url,{dialogId:dialogNum,data:$("#entityName",$p).val()+'.orderNo='+data.orderNo});
			}else{	
				$.pdialog.reload(url,{dialogId:dialogNum});
			}
		}
		,
		deleteSettleDetail:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var dialogNum=$("#dialogId",$p).val();
			var $ids = $("input[name='ids']:checked",$p);
			if($ids.val()==undefined||$ids.val()==''){
				alertMsg.error("还没选中要删除的明细");
				return;
			}
			alertMsg.confirm("确认删除？", {
				okCall: function(){
					var url=$("#dropDetailUrl",$p).val();
					var refreshUrl=$("#refreshUrl",$p).val();
		        	jQuery.ajax({
		        		type:"POST",
		        		url: url,
		        		data:$ids.serialize(),
		        		dataType: "json",
		        		async: false,
		        		success: function(data) {
		        			if(data.status=="error"){
		        				alertMsg.error(data.message);
		        			}else{
		        				jQuery.pdialog.reload(refreshUrl,{dialogId:dialogNum,data:$("#settleOrderForm",$p).serialize()});
		        			}
		        		}
		        	});
				}
			});
		},
		newSettleOrder:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var url=$("#refreshUrl",$p).val();
			if(url.indexOf("?") == -1){
				url=url+"?orderType="+$("#orderType",$p).val()+"&newOrder=1";
			}else{
				url=url+"&orderType="+$("#orderType",$p).val()+"&newOrder=1";
			}
			//新建单据 跳转到初始的新增页面
			var dialogNum=$("#dialogId",$p).val();
			$.pdialog.reload(url,{dialogId:dialogNum});
		},
		saveCostorder:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			if(!migr.commonOrderMoneyAndAmountValidateNotNegativeFloat("totalSum",$p)){
				return ;
			}
			migr.saveSettleorder($(obj));
		},
		saveSettleorder:function (obj){
			var $p = $(obj).parents(".unitBox:first");
			var orderType=$("#orderType",$p);
			if($("#state",$p).val()!="0" && $("#state",$p).val()!=""){
				alertMsg.error('该单据不能修改和保存');
				return ;	
			}
			if($("#settleDetailSize",$p).val()<1){
				alertMsg.error('明细不能为空');
				return ;
			}
			var consumerName=$("input[name='consumerName']",$p).val();
			var supplierName=$("input[name='supplierName']",$p).val();
			var borganName=$("input[name='borganName']",$p).val();
			if(consumerName!=undefined&&consumerName==""){
				alertMsg.error('客户不能为空.');
				return ;
			}
			if(supplierName!=undefined&&supplierName==""){
				alertMsg.error('供应商不能为空.');
				return ;
			}
			if(borganName!=undefined&&borganName==""){
				alertMsg.error('对方机构不能为空.');
				return ;
			}
			$orderNos =$("input[name=orderNoForSettle]",$p);
			if($orderNos!=undefined){
				var flag=0;
				$orderNos.each(function(){
					 var orderNo=$(this).val();
					 var recMoneyValue=parseInt($("#recMoney"+orderNo,$p).val());
					 var preMoneyValue=parseInt($("#preMoney"+orderNo,$p).val());
						if(recMoneyValue+preMoneyValue==0){
							flag=1;
						}
				});
				if(flag==1){
					alertMsg.error('优惠金额和实收金额不能都为0');
					return;
				}
			}
			alertMsg.confirm("确认保存？", {
				okCall: function(){
					$("#settleOrderForm",$p).submit();
				}
			});
		},
		deleteSettleorder:function(obj){
			var $p = $(obj).parents(".unitBox:first");
		    var id=$("#id",$p).val();
		    var drop=$("#drop",$p).val();
			if($("#state",$p).val()=="0"&&id!=''){
				alertMsg.confirm("确认删除？", {
		    		okCall: function(){
		    			$("#settleOrderForm",$p).attr("action",drop);
						$("#settleOrderForm",$p).submit();
		    		}
		    	});
			}else{
				alertMsg.error('无法删除单据.');
			}
		}
		,	
		refreshSettleOrder:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var url=$("#refreshUrl",$p).val();
			var dialogNum=$("#dialogId",$p).val();
			jQuery.pdialog.reload(url,{dialogId:dialogNum,data:$("#settleOrderForm",$p).serialize()});
		},
		//----------结算模板的公用的结束
		//------------------------结算模块结束
		//----------------单据数量和金额必须大于的的校验
		commonOrderMoneyAndAmountValidatePositiveFloat:function(objattr,p){
			$objattres =$("input[name="+objattr+"]",p);
			var flag=true;
			$objattres.each(function(){
				 if(!migr.commonPositiveFloat($(this))){//校验正数
					 flag=false;
				}
			});
			return flag;
		},
		commonOrderMoneyAndAmountValidateNotNegativeFloat:function(objattr,p){
			$objattres =$("input[name="+objattr+"]",p);
			var flag=true;
			$objattres.each(function(){
				 if(!migr.commonNotNegativeFloat($(this))){//校验大于等于0
					 flag=false;
				}
			});
			return flag;
		},
		//-------------------------批发模块开始
		orderStop:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			if($("input:checkbox[name=ids]:checked",$p).val()==undefined){
				alertMsg.warn("没有选择要终止的订单");
				return ;
			}
			var url=$(obj).attr("orderStopUrl");
			alertMsg.confirm("你确定将选择的单据修改为【终止状态】？", {
				okCall: function(){
					jQuery.ajax({
						type:"POST",
						url: url,
						data:$("#pagerForm",$p).serialize(),
						dataType: "json",
						async: false,
						success: function(data) {
							if(data.statusCode=="200"){
								alertMsg.correct(data.message);
								var refreshUrl=$("refreshUrl").val();
								var dialogNum=$("#dialogId",$p).val();
								jQuery.pdialog.reload(refreshUrl,{dialogId:dialogNum,data:$("#pagerForm",$p).serialize()});
							}
							else{
								alertMsg.error(data.message);
							}
						}
					});
				}
			});
		},
		//return true 表示通过校验 继续执行
		validateForWsaleorder:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			if($("input[name='wsaleorder.orderNo']",$p).val()==""){
				alertMsg.error('单据尚未保存,不支持审核操作');
				return false;
			}
			if($("#state",$p).val()!="0"){
				alertMsg.error('该单据不支持审核操作');
				return false;
			}
			return true;
		}
		,
		aduitWsaleorder:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var auditUrl=$(obj).attr("auditUrl");
			alert(auditUrl);
			alertMsg.confirm("确认审核本单据？", {
				okCall: function(){
					$("#orderForm",$p).attr("action",auditUrl);
					$("#orderForm",$p).submit();
				}
			});
		},
		refreshWsaleorder:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var url=$("#refreshWsaleorderUrl",$p).val();
			var dialogNum=$("#dialogId",$p).val();
			jQuery.pdialog.reload(url,{dialogId:dialogNum,data:$("#orderForm",$p).serialize()});
		},
		modifyWsaleDetail:function(obj,goodCode,defaultscale,numscale,moneyscale) {//$(obj).attr("oldValue",$(obj).val());(还没完成)
			if($(obj).attr("name")!='memo'){
				//校验数字格式
				if(!$(obj).val().isNumber()){
					$(obj).focus();
					$(obj).addClass("error");
					alertMsg.error("请输入合法的数字！");
				}
				window.setTimeout(function(){$(obj).removeClass("error");}, 2000);
			}
			var $p = $(obj).parents(".unitBox:first");
		 	var $tr = $(obj).parents("tr:first");
			var url=$("#updateWsaleOrderDetailUrl",$p).val();
			jQuery.ajax({
				type:"POST",
				url: url,
				data:$("#orderForm",$p).serialize()+"&wsaledetail.goodCode="+goodCode+"&wsaledetail."+$(obj).attr("name")+"="+$(obj).val(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.data){
						$("input[name='amount']",$tr).val(setScale(data.data.amount,numscale, "roundhalfup"));
						$("input[name='boxNum']",$tr).val(setScale(data.data.boxNum,defaultscale, "roundhalfup"));
						$("input[name='discount']",$tr).val(setScale(data.data.discount,moneyscale, "roundhalfup"));
						$("td[rname='discountSum']",$tr).text(setScale(data.data.discountSum,moneyscale, "roundhalfup"));
						$("td[rname='orPriceSum']",$tr).text(setScale(data.data.orPriceSum,moneyscale, "roundhalfup"));
						$("input[name='presentNum']",$tr).val(setScale(data.data.presentNum,numscale, "roundhalfup"));
						$("td[rname='presentRate']",$tr).text(setScale(data.data.presentRate,moneyscale, "roundhalfup"));
						$("td[rname='presentSum']",$tr).text(setScale(data.data.presentSum,moneyscale, "roundhalfup"));
						$("input[name='price']",$tr).val(setScale(data.data.price,moneyscale, "roundhalfup"));
						$("td[rname='sumNum']",$tr).text(setScale(data.data.sumNum,numscale, "roundhalfup"));
						$("td[rname='totalSum']",$tr).text(setScale(data.data.totalSum,moneyscale, "roundhalfup"));
						$("td[rname='orderMoney']",$p).text(setScale(data.orderMoney,moneyscale, "roundhalfup"));
    					$("td[rname='discountSumCount']",$p).text(setScale(data.discountSumCount,moneyscale, "roundhalfup"));
    					$("td[rname='presentSumCount']",$p).text(setScale(data.presentSumCount,moneyscale, "roundhalfup"));
    					$("td[rname='orPriceSumCount']",$p).text(setScale(data.orPriceSumCount,moneyscale, "roundhalfup"));
					}
					if(data.status=="error"){
						alertMsg.error(data.message);
					}else{
					}
				}
			});
		},
		newWsaleOrder:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var url=$("#refreshWsaleorderUrl",$p).val();
			url=url+"?orderType="+$("#orderType",$p).val()+"&newOrder=1";
			//新建单据 跳转到初始的新增页面
			var dialogNum=$("#dialogId",$p).val();
			$.pdialog.reload(url,{dialogId:dialogNum});
		},
		//添加商品时 检查有没选择生效分店
		checkWsaleorderBranchData:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			if($("input[name='wsaleorder.consumerCode']",$p).val()=="")
			{
				alertMsg.error('请先选择客户');
				return false;
			}
			if($(".branchName",$p).val()=="")
			{
				alertMsg.error('请先选择分店仓库');
				return false;
			}
			var branchCode=$("input[name='wsaleorder.branchCode']").val();
			var hrefurl=$(obj).attr("href");
			hrefurl=hrefurl+"&branchcode="+branchCode;
			$(obj).attr("href",hrefurl);
			return true;
		},
		saveWsaleorder:function (obj){
			var $p = $(obj).parents(".unitBox:first");
			var orderType=$("#orderType",$p);
			if($("#state",$p).val()!="0" && $("#state",$p).val()!=""){
				alertMsg.error('该单据不能修改保存');
				return ;	
			}
			if($("#wsaleDetailSize",$p).val()<1){
				alertMsg.error('明细不能为空');
				return ;
			}
			if($("input[name='consumerName']",$p).val()==""){
				alertMsg.error('客户不能为空.');
				return ;
			}
			if($("input[name='wsaleorder.branchName']",$p).val()==""){
				alertMsg.error('生效分店不能为空.');
				return ;
			}
			if($("#wsaleorderValidDate",$p).val()==""&&orderType=='0'){
				alertMsg.error('生效日期不能为空.');
				return ;
			}
			if(!migr.commonOrderMoneyAndAmountValidatePositiveFloat("amount",$p)){
				return ;
			}else if(!migr.commonOrderMoneyAndAmountValidatePositiveFloat("boxNum",$p)){
				return ;
			}else if(!migr.commonOrderMoneyAndAmountValidateNotNegativeFloat("price",$p)){
				return ;
			}else if(!migr.commonOrderMoneyAndAmountValidateNotNegativeFloat("discount",$p)){
				return ;
			}else if(!migr.commonOrderMoneyAndAmountValidateNotNegativeFloat("presentNum",$p)){
				return ;
			}else{
				alertMsg.confirm("确认保存？", {
					okCall: function(){
						$("#orderForm",$p).submit();
					}
				});
			}
		},
		 deleteWsaleorder:function(obj){
			var $p = $(obj).parents(".unitBox:first");
		    var id=$("#id",$p).val();
		    var drop=$("#drop",$p).val();
			if($("#state",$p).val()=="0"&&id!=''){
				alertMsg.confirm("确认删除？", {
		    		okCall: function(){
		    			$("#orderForm",$p).attr("action",drop);
						$("#orderForm",$p).submit();
		    		}
		    	});
			}else{
				alertMsg.error('无法删除单据.');
			}
		},
		dialogWsaleorder:function (data,obj){
			var $p = $(obj).parents(".unitBox:first");
			var url=$("#refreshWsaleorderUrl",$p).val();
			var dialogNum=$("#dialogId",$p).val();
			Bird.ajaxDone(data);
			url=url+"?orderType="+$("#orderType",$p).val();
			if(data.orderNo!=undefined&&data.orderNo!='none'){
				$.pdialog.reload(url,{dialogId:dialogNum,data:'wsaleorder.orderNo='+data.orderNo});
			}else{	
				$.pdialog.reload(url,{dialogId:dialogNum});
			}
		},
		deleteWsaleDetail:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var $ids = $("input[name='ids']:checked",$p);
			if($ids.val()==undefined||$ids.val()==''){
				alertMsg.error("还没选中要删除的明细");
				return;
			}
			var dialogNum=$("#dialogId",$p).val();
			alertMsg.confirm("确认删除？", {
				okCall: function(){
					var url=$("#dropDetailUrl",$p).val();
					var refreshWsaleorderUrl=$("#refreshWsaleorderUrl",$p).val();
		        	jQuery.ajax({
		        		type:"POST",
		        		url: url,
		        		data:$ids.serialize(),
		        		dataType: "json",
		        		async: false,
		        		success: function(data) {
		        			if(data.status=="error"){
		        				alertMsg.error(data.message);
		        			}else{
		        				jQuery.pdialog.reload(refreshWsaleorderUrl,{dialogId:dialogNum,data:$("#orderForm",$p).serialize()});
		        			}
		        		}
		        	});
				}
			});
		},
		//打开单据时 返回回调此方法
		toOpenWsaleOrder:function(args,$p){
			var orderNo = args['orderNo'];
			var dialogNum=$("#dialogId",$p).val();
			var refreshUrl=$("#refreshWsaleorderUrl",$p).val()+"?wsaleorder.orderNo="+orderNo+"&orderType="+$("#orderType",$p).val()+"&newOrder=2";
			jQuery.pdialog.reload(refreshUrl,{dialogId:dialogNum});
		},
		toValidateCopyWsaleOrder:function(obj){
				var $p = $(obj).parents(".unitBox:first");
				var orderNo=$("input[name='wsaleorder.orderNo']",$p).val();
				if(orderNo!="")
				{
					alertMsg.error('单号已经存在，操作禁用,请新建单据');
					return false;
				}
				
				return true;
		},
		toCopyWsaleOrderDetail:function(args,$p){
			var orOrderNo = args['orderNo'];
			if(orOrderNo=='')
				alertMsg.error('请选择要用到的批发单号');
			var validateReturnOrderUrl=$("#validateReturnOrderUrl",$p).val();
			if(validateReturnOrderUrl){
				validateReturnOrderUrl=validateReturnOrderUrl+"?wsaleorder.orOrderNo="+orOrderNo;
				var flag=0;
				jQuery.ajax({
		    		type:"POST",
		    		url: validateReturnOrderUrl,
		    		dataType: "json",
		    		async: false,
		    		success: function(data) {
		    			var dialogNum=$("#dialogId",$p).val();
	    				var refreshUrl=$("#refreshWsaleorderUrl",$p).val()+"?newOrder=3";
		    			if(data){
		    				alertMsg.confirm("该单已经退过货，还继续退货？",{
		    					okCall: function(){
		    						jQuery.pdialog.reload(refreshUrl,{dialogId:dialogNum,data:$("#orderForm",$p).serialize()});
		    					},cancelCall: function(){
		    						$("input[name='wsaleorder.orOrderNo']",$p).val("");
		    					}
		    				})
		    			}else{
		    				jQuery.pdialog.reload(refreshUrl,{dialogId:dialogNum,data:$("#orderForm",$p).serialize()});
		    			}
		    		}
		    	});
			}else{
				var dialogNum=$("#dialogId",$p).val();
				var refreshUrl=$("#refreshWsaleorderUrl",$p).val()+"?newOrder=3";
				jQuery.pdialog.reload(refreshUrl,{dialogId:dialogNum,data:$("#orderForm",$p).serialize()});
			}
			//var refreshUrl=$("#refreshWsaleorderUrl",$p).val()+"?orderType="+$("#orderType",$p).val()+"&newOrder=3&orOrderType="+orOrderNo;
			/*alert()
			alert(dialogNum);*/
			//jQuery.pdialog.reload(refreshUrl,{dialogId:dialogNum});
		},
		addWsalePurchaseOrderDetail:function(args,$p,lookupBtn){
			var codes = args['goodCode'];
			var dialogNum=$("#dialogId",$p).val();
			var amount = args['goodNum'];
			if(amount==undefined){
				amount=0;
			}
			var url=$("#addDetailUrl",$p).val()+"?goodCodes="+codes+"&amount="+amount;
			var refreshUrl=$("#refreshWsaleorderUrl",$p).val();
			if(jQuery(".branchName",$p).val()==''){
				alert("请选择仓库");
				return false;
			}
			jQuery.ajax({
	    		type:"POST",
	    		url: url,
	    		dataType: "json",
	    		data:jQuery("#orderForm",$p).serialize(),
	    		async: false,
	    		success: function(data) {
	    			if(data.status=="error"){
	    				alertMsg.error(data.message);
	    			}else{
	    				var dialog=jQuery.pdialog.reload(refreshUrl,{dialogId:dialogNum,data:$("#orderForm",$p).serialize()});
	    				if(dialog){
	    					var box = dialog.find(".dialogContent");
	    					$.setLookupBox(box);
	    				}
	    			}
	    		}
	    	});
		},
		commDataTabSelect:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var settleTabs= $("a[name='commDataTab']",$p);
			var type=$("#type",$p).val();
			var objTab=undefined;
			settleTabs.each(function(){
				if(type==$(this).attr("flag")){
					objTab=$(this);
				}else{
					$("#"+$(this).attr("divId"),$p).empty();
				}
			})
			var objUrl=objTab.attr("objUrl");
			$("#"+objTab.attr("divId"),$p).loadUrl(objUrl,$("#pagerForm",$p).serialize(),function(){
				$("#"+objTab.attr("divId"),$p).find("[layoutH]").layoutH();
			});
		},
		commDataTab:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var objUrl=$(obj).attr("objUrl");
			var beforeCall=$(obj).attr("beforeCall");
			if(beforeCall){
				if (! $.isFunction(beforeCall)) beforeCall = eval('(' + beforeCall + ')');
				if(!beforeCall($(obj))){
					return false;
				}
			}
			$("#type",$p).val($(obj).attr("flag"));//把type赋值
			$("#"+$(obj).attr("divId"),$p).loadUrl(objUrl,$("#pagerForm",$p).serialize(),function(){
				$("#"+$(obj).attr("divId"),$p).find("[layoutH]").layoutH();
			});
		},
		commDataTabNew:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var objUrl=$(obj).attr("objUrl");
			var beforeCall=$(obj).attr("beforeCall");
			if(beforeCall){
				if (! $.isFunction(beforeCall)) beforeCall = eval('(' + beforeCall + ')');
				if(!beforeCall($(obj))){
					return false;
				}
			}
			$("#"+$(obj).attr("divId"),$p).loadUrl(objUrl,$("#pagerForm",$p).serialize(),function(){
				$("#"+$(obj).attr("divId"),$p).find("[layoutH]").layoutH();
			});
		},
		commDataTabSelectNew:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var tname= $("input[name='searchBean.tname']",$p).val();
			var objTab=$("#"+tname,$p);
			$("#"+objTab.attr("divId"),$p).loadUrl(objTab.attr("objUrl"),$("#pagerForm",$p).serialize(),function(){
				$("#"+objTab.attr("divId"),$p).find("[layoutH]").layoutH();
			});
		}
		,wsaleSelectByCategory:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var goodCode=$("input[name='selectCondition.goodCode']",$p);
			if($(obj).attr("flag")=='1'){
				goodCode.val("");
				goodCode.attr("readonly",true);
			}
			else
				goodCode.attr("readonly",false);
			return true;
		},
		changeCheckedValueForCheckbox:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			if($(obj).attr("checked"))
				$(obj).val("1");
			else
				$(obj).val("");
		},
	//-------------------------批发模块结束
	//-------------------------电子商务
	modifyOrderItem:function(obj,orderSn,productSn,formcatBit){
		//校验数字格式
		var flag=0;
		if(!$(obj).val().isNumber()){
			$(obj).focus();
			$(obj).addClass("error");
			alertMsg.error("请输入合法的数字！");
			flag=1;
		}
		window.setTimeout(function(){$(obj).removeClass("error");}, 2000);
		if(flag==1){
			$(obj).val($(obj).attr("oldValue"));
			return ;
		}
		var $p = $(obj).parents(".unitBox:first");
	 	var $tr = $(obj).parents("tr:first");
		var url=$(obj).attr("modifyurl");
		jQuery.ajax({
			type:"POST",
			url: url,
			data:"orderItem."+$(obj).attr("name")+"="+$(obj).val()+"&orderItem.productSn="+productSn+"&order.id="+orderSn,
			dataType: "json",
			async: false,
			success: function(data) {
				$(obj).val(setScale($(obj).val(),formcatBit, "roundhalfup"));
				$(obj).attr("oldValue",$(obj).val());
				var url=$("#refreshUrl",$p).val();
				jQuery.pdialog.reload(url,{dialogId:$("#dialogId",$p).val(),data:$("#orderForm",$p).serialize()});
			}
		});
	}
	,
	mshopOrderEdit:function(obj){
		var $p = $(obj).parents(".unitBox:first");
		var objUrl=$(obj).attr("objUrl");
		var beforeCall=$(obj).attr("beforeCall");
		if(beforeCall){
			if (! $.isFunction(beforeCall)) beforeCall = eval('(' + beforeCall + ')');
			if(!beforeCall($(obj))){
				return false;
			}
		}
		$Tabs= $("a[name='tabs']",$p);
		var currentDivId=$(obj).attr("divId");
		$Tabs.each(function(){
			if(currentDivId!=$(this).attr("divId")){
				$("#"+$(this).attr("divId"),$p).empty();
			}
		})
		$("#"+$(obj).attr("divId"),$p).loadUrl(objUrl,null,function(){
			$("#"+$(obj).attr("divId"),$p).find("[layoutH]").layoutH();
		});
	}
	,
	//导入商品
	addOrderItemDetail:function(args,$p){
		var codes = args['goodCode'];
		var addOrderItemUrl=$("#addOrderItemUrl",$p).val();
		addOrderItemUrl=addOrderItemUrl+"?id="+codes;
		jQuery.ajax({
    		type:"POST",
    		url: addOrderItemUrl,
    		dataType: "json",
    		async: false,
    		success: function(data) {
    			if(data.statusCode=="300"){
    				alertMsg.error(data.message);
    			}else{
    				var divId=$("#"+$("#tname",$p).val(),$p);
    				divId.trigger("click");
    			}
    		}
    	});
		},
		
	deleteOrderItemDetail:function(obj){
		var $p = $(obj).parents(".unitBox:first");
		var $ids = $("input[name='ids']:checked",$p);
		if($ids.val()==undefined||$ids.val()==''){
			alertMsg.error("还没选中要删除的明细");
			return;
		}
		var deleteOrderItemUrl=$("#deleteOrderItemUrl",$p).val();
		alertMsg.confirm("确认删除？", {
			okCall: function(){
	        	jQuery.ajax({
	        		type:"POST",
	        		url: deleteOrderItemUrl,
	        		data:$ids.serialize(),
	        		dataType: "json",
	        		async: false,
	        		success: function(data) {
	        			if(data.statusCode=="300"){
	        				alertMsg.error(data.message);
	        			}else{
	        				var divId=$("#"+$("#tname",$p).val(),$p);
	        				divId.trigger("click");
	        			}
	        		}
	        	});
			}
		});
	}
	,
	changeTabBarDiv:function(obj){
		var $p = $(obj).parents(".unitBox:first");
		var $panelBar=$("#panelBar",$p);
		var barUrl=$("#barUrl",$p).val();
		$("#tname",$p).val($(obj).attr("id"));
		if(barUrl.indexOf("?") == -1){
			barUrl=barUrl+"?tname="+$(obj).attr("id");
		}else{
			barUrl=barUrl+"&tname="+$(obj).attr("id");
		}
		$panelBar.loadUrl(barUrl,null,null);
		return true;
	},
	orderFormSumbit:function(obj){
		var $p = $(obj).parents(".unitBox:first");
		$pagerForm=$("#pagerForm",$p);
		var actionUrl=$("#"+$(obj).attr("actionId")).val();
		$pagerForm.attr("action",actionUrl);
		$pagerForm.submit();
	},
	orderFormCallback:function(data,form){
		var $p = $(form).parents(".unitBox:first");
		if(data&&data.flag=="1")//如果返货的状态不需要刷页面 就不刷页面
			return false;
		else{
			var divId=$("#"+$("#tname",$p).val(),$p);
			divId.trigger("click");
		}
	},
	commonTabFormCallback:function(json,form){
			var $p = $(form).parents(".unitBox:first");
			if(!json.navTabId){
				var parentDialogId = $("#parentDialog",$p).val();
				json.navTabId = parentDialogId;
			}
			if (json.navTabId){ //刷新父dialog
				var parentDialog=$("body").data(json.navTabId);
				var divId=$("#"+$("#tname",parentDialog).val(),parentDialog);
				divId.trigger("click");
			}
	}
	,
	commonFormFalseSubmit:function(obj,actionId){
		var $p = $(obj).parents(".unitBox:first");
		$pagerForm=$("#pagerForm",$p);
		var actionUrl=$("#"+actionId).val();
		$pagerForm.attr("action",actionUrl);
		$pagerForm.submit();
	},
	commonTabTrigger:function(obj){
		var $p = $(obj).parents(".unitBox:first");
		var divId=$("#"+$(obj).attr("tname"),$p);
		divId.trigger("click");
	},
	loadDefaultObject:function(obj){
		var $p = $(obj).parents(".unitBox:first");
		var loadObjectUrl=$(obj).attr("loadObjectUrl");
		var loadObjectDiv=$(obj).attr("loadObjectDiv");
		$("#"+loadObjectDiv,$p).loadUrl(loadObjectUrl,$(obj).serialize());
	}
	,
	modifyOrderAttribute:function(obj){
		var $p = $(obj).parents(".unitBox:first");
		var modifyUrl=$("#modifyAttributeUrl",$p).val();
		jQuery.ajax({
			type:"POST",
			url: modifyUrl,
			data:$(obj).serialize(),
			dataType: "json",
			async: false,
			success: function(data) {
				
			}
		});
	},
	commDeleteOrderForNoState:function(obj){
		var $p = $(obj).parents(".unitBox:first");
		alertMsg.confirm("确认删除？", {
    		okCall: function(){
    			$("#orderForm",$p).attr("action",$("#dropUrl",$p).val());
				$("#orderForm",$p).submit();
    		}
    	});
	}
	,
	//导入商品(所有的信息都在一个页面)
	addOrderItemDetail:function(args,$p){
			var codes = args['goodCode'];
			var addOrderItemUrl=$("#addOrderItemUrl",$p).val();
			addOrderItemUrl=addOrderItemUrl+"?id="+codes;
			jQuery.ajax({
	    		type:"POST",
	    		url: addOrderItemUrl,
	    		dataType: "json",
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
	    				var divId=$("#"+$("#tname",$p).val(),$p);
	    				divId.trigger("click");
	    			}
	    		}
	    	});
		},
		saveMshopAuditOrder:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var title=$(obj).attr("title");
			alertMsg.confirm(title, {
				okCall: function(){
					var $p = $(obj).parents(".unitBox:first");
					$orderForm=$("#orderForm",$p);
					$orderForm.submit();
				}
			});
		}
		,
	//处理发货拆单的联动业务
		dealMshopOrderDetail:function(obj,productSn){
			var $p = $(obj).parents(".unitBox:first");
			var flag=0;
			var productTotal=$("#productQuantity"+productSn,$p).val();
			var haveDeliveryQuantity=$("#haveDeliveryQuantity"+productSn,$p).val();
			if(!$(obj).val().isNumber()){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("请输入合法的数字！");
				flag=1;
				window.setTimeout(function(){$(obj).removeClass("error");}, 2000);
			}else if($(obj).val()>(productTotal-haveDeliveryQuantity)){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("本次发货数量大于未发货的数量");
				flag=1;
				window.setTimeout(function(){$(obj).removeClass("error");}, 2000);
			}
			if(flag==1){
				$(obj).val($(obj).attr("oldValue"));
				return ;
			}
			$(obj).attr("oldValue",$(obj).val());
		},
		saveMshopOrderDetail:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var flag=0;
			 $deliveryQuantityList =$("input[name$=deliveryQuantity]",$p);
			 $deliveryQuantityList.each(function(){
					var temp=$(this).val();
					if(temp!=0){
						flag=1;
					}
				})
			if(flag==0){
				alertMsg.error("本次发货数量不能全部为0");
				return;
			}
			 flag=0;
			 var stock=0;
			 var message="";
			 $productSnes =$("input[id^=productSn]",$p);
			 $productSnes.each(function(){
				 var productSn=$(this).val();
				 var haveDeliveryQuantity=$("#haveDeliveryQuantity"+productSn,$p).val();
				 var deliveryQuantity=$("#deliveryQuantity"+productSn,$p).val();
				 var productQuantity=$("#productQuantity"+productSn,$p).val();
				 var stockQuantity=$("#goodstock"+productSn,$p).val();
				 if(stockQuantity==""){
					 message="该门店没有商品编号为"+productSn+"的商品,没有对应的库存";
					 return;
				 }
				 var result=haveDeliveryQuantity+deliveryQuantity-productQuantity;
					if(result!=0){
						flag=1;
					}
					if(floatSub(deliveryQuantity,stockQuantity)>0){
						stock=1;
					}
			})
			if(message!=""){
				 alertMsg.error(message);
				 return;
			}
			var stockSet=$("#stockSet",$p).val();
			if(stock==1&&stockSet==0){
				alertMsg.error("库数量不足");
				return;
			}
			var $p = $(obj).parents(".unitBox:first");
			$orderForm=$("#orderForm",$p);
			if(flag==1){
				alertMsg.confirm("确定本次只部分发货", {
					okCall: function(){
						$orderForm.submit();
					}
				});
			}else{
				var title=$(obj).attr("title");
				alertMsg.confirm(title, {
					okCall: function(){
						$orderForm.submit();
					}
				});
			}
			
		},//处理退货校验和收货校验
		dealMshopOrderValidateForReshipAndReceipt:function(obj,productSn,standard,type){
			var $p = $(obj).parents(".unitBox:first");
			var flag=0;
			var standardDeliveryQuantity=$("#"+standard+productSn,$p).val();
			if(!$(obj).val().isInteger()){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("请输入合法的整数！");
				flag=1;
				window.setTimeout(function(){$(obj).removeClass("error");}, 2000);
			}else if(floatSub($(obj).val(),standardDeliveryQuantity)>0){
				var message="";
				if(type=="receipt"){
					message="收货数量大于对应发货单的发货数量";
				}
				if(type=="reship"){
					message="本次退货数量大于对应的未退数量";
				}
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error(message);
				flag=1;
				window.setTimeout(function(){$(obj).removeClass("error");}, 2000);
			}
			if(flag==1){
				$(obj).val($(obj).attr("oldValue"));
				return ;
			}
			$(obj).attr("oldValue",$(obj).val());
		},
		saveReshipOrder:function(obj,standard,objQuantity){
			alertMsg.confirm($(obj).attr("title"), {
				okCall: function(){
					var $p = $(obj).parents(".unitBox:first");
					var flag=0;//判断是否全部收货(0表示全部收货)
					var flag2=0;//判断是否全部拒收（0表示全部拒收）
					$productSnes =$("input[id^=productSn]",$p);
					$productSnes.each(function(){
						 var productSn=$(this).val();
						 var standardQuantityValue=parseInt($("#"+standard+productSn,$p).val());
						 var objQuantityValue=parseInt($("#"+objQuantity+productSn,$p).val());
							if(standardQuantityValue-objQuantityValue!=0){
								flag=1;
							}
					})
					$objQuantityList =$("input[id^="+objQuantity+"]",$p);
					$objQuantityList.each(function(){
							var temp=$(this).val();
							if(temp!=0){
								flag2=1;
							}
					})
					$orderForm=$("#orderForm",$p);
					if(flag2==0){
						alertMsg.error("退货数量不能全部为0");
						return ;
					}else if(flag==1){
						alertMsg.confirm("收货数量和发货数量不一致,如果是将会产生部分退货记录", {
							okCall: function(){
								//alert("部分退货")
								$orderForm.submit();
							}
						});
					
					}else{
						//alert("全部退货");
						$orderForm.submit();
					}
				}
			});
		},
		saveRefundInfo:function(obj){
			alertMsg.confirm($(obj).attr("title"),{
				okCall: function(){
					var $p = $(obj).parents(".unitBox:first");
					var orderForm=$("#orderForm",$p);
					orderForm.submit();
				}
			});
		},
		dealOrderStatus:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var $pagerForm=$("#pagerForm",$p);
			alertMsg.confirm($(obj).attr("title"),{
				okCall: function(){
					jQuery.ajax({
			    		type:"POST",
			    		url: $(obj).attr("url"),
			    		dataType: "json",
			    		async: false,
			    		success: function(data) {
			    			if(data.statusCode=="300"){
			    				alertMsg.error(data.message);
			    			}else{
			    				$pagerForm.submit();
		    					alertMsg.correct(data.message);
			    			}
			    		}
			    	});
				}
			});
		},
		//保存单据
		commSaveShopOrder:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var title=$(obj).attr("title");
			if(title==undefined||title==''){
				title="确认保存?";
			}
			alertMsg.confirm(title, {
				okCall: function(){
					$("#orderForm",$p).submit();
				}
			});
		},
		commCallbackForShopOrder:function(data,form){
			Bird.ajaxDone(data);
			var $p = $(form).parents(".unitBox:first");
			var dialogId=$("#parentDialog",$p).val();
			var $saveOrderDiv=$("#saveOrderDiv",$p);
			$saveOrderDiv.attr("style","display:none");
				navTab.reloadFlag(dialogId);
				if(data.statusCode== Bird.statusCode.ok){
			}
		},
		saveReceiptAndReshipOrder:function(obj,standard,objQuantity,type){
			alertMsg.confirm($(obj).attr("title"), {
				okCall: function(){
					var $p = $(obj).parents(".unitBox:first");
					var flag=0;//判断是否全部收货(0表示全部收货)
					var flag2=0;//判断是否全部拒收（0表示全部拒收）
					$productSnes =$("input[id^=productSn]",$p);
					$productSnes.each(function(){
						 var productSn=$(this).val();
						 var standardQuantityValue=parseInt($("#"+standard+productSn,$p).val());
						 var objQuantityValue=parseInt($("#"+objQuantity+productSn,$p).val());
							if(standardQuantityValue-objQuantityValue!=0){
								flag=1;
							}
					})
					$objQuantityList =$("input[id^="+objQuantity+"]",$p);
					$objQuantityList.each(function(){
							var temp=$(this).val();
							if(temp!=0){
								flag2=1;
							}
					})
					var $p = $(obj).parents(".unitBox:first");
					$orderForm=$("#orderForm",$p);
					if(flag2==0){
						alertMsg.confirm("确定要全部拒收本次的发货,如果是将会产生全部拒收的退货记录", {
							okCall: function(){
								$orderForm.submit();
							}
						});
					}else if(flag==1){
						alertMsg.confirm("收货数量和发货数量不一致,如果是将会产生部分拒收的退货记录", {
							okCall: function(){
								$orderForm.submit();
							}
						});
					
					}else{
						$orderForm.submit();
					}
				}
			});
			
		}
	})
	//--------------------------电子商务结束
})(jQuery,migr);