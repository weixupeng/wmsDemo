/*
 * 此js文件需要放置在migr.js之后
 */
(function($,migr){
	$.extend(migr,{
		//这里写自己定义的方法，方法之间用逗号分割，如lxf:function(){},lxf2:function(){}
		//调用时：migr.test();migr.test2();
		promRuleClick:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var val=$(obj).val();
			//直接特价 和 直接折扣 不显示 otherdiv
			if(val=="00" || val=="10"){
				$("#otherdiv",$p).hide();
			}else{
				$("#otherdiv",$p).show();
			}
			if(val=="20"){
				$("#giftdiv",$p).show();
			}else{
				$("#giftdiv",$p).hide();
			}
			//03阶梯折扣  10直接特价  11买满件数特价
			if(val=="03" || val=="10" || val=="11"){
				//只允许针对单个商品
				$("input[name=schemeorder.promScope][value=3]",$p).attr("checked",true);
				$("input[name=schemeorder.promScope][value=2]",$p).attr("disabled",true);
				$("input[name=schemeorder.promScope][value=1]",$p).attr("disabled",true);
				$("input[name=schemeorder.promScope][value=0]",$p).attr("disabled",true);
			}else{
				$("input[name=schemeorder.promScope][value=2]",$p).attr("disabled",false);
				$("input[name=schemeorder.promScope][value=1]",$p).attr("disabled",false);
				$("input[name=schemeorder.promScope][value=0]",$p).attr("disabled",false);
			}
		},
		schemeorderTrDblick:function(obj,orderNo){
			var $p = $(obj).parents(".unitBox:first");
			$("a[name='"+orderNo+"']",$p).trigger("click");
		},
		toSchemerule:function(obj,val,rule){
			var $p = $(obj).parents(".unitBox:first");
			if(val==0){
				$("#zkdiv",$p).show();
				$("#tjdiv",$p).hide();
				$("#mmsdiv",$p).hide();
			}
			if(val==1){
				$("#tjdiv",$p).show();
				$("#zkdiv",$p).hide();
				$("#mmsdiv",$p).hide();
			}
			if(val==2){
				$("#mmsdiv",$p).show();
				$("#tjdiv",$p).hide();
				$("#zkdiv",$p).hide();
			}
			if(rule!="00" && rule!="10" && rule!=""){
				$("#otherdiv",$p).show();
			}else{
				$("#otherdiv",$p).hide();
			}
			if(rule=="20"){
				$("#giftdiv",$p).show();
			}else{
				$("#giftdiv",$p).hide();
			}
			if(rule=="03"){
				$("input[name=schemeorder.promScope][value=3]",$p).attr("checked",true);
				$("input[name=schemeorder.promScope][value=2]",$p).attr("disabled",true);
				$("input[name=schemeorder.promScope][value=1]",$p).attr("disabled",true);
				$("input[name=schemeorder.promScope][value=0]",$p).attr("disabled",true);
			}
		},
		saveSchemeorder:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			//校验必填项
			if(migr.checkForschemeorder(obj)){
				var url = $("#orderForm",$p).attr("action");
				jQuery.ajax({
					type:"POST",
					url: url,
					dataType: "json",
					data:$("#orderForm",$p).serialize(),
					async: false,
					success: function(data) {
						if(data.statusCode=="300"){
		    				alertMsg.error(data.message);
		    			}else{
		    				alertMsg.correct(data.message);
		    				//刷新本
		    				var url=$("#refreshUrl",$p).val();
		    				jQuery.pdialog.reload(url+"&schemeorder.orderNo="+data.data.orderNo,{dialogId:$("#dialogId",$p).val()});
		    			}
					}
				});
			}
		},
		updateSchemeGift:function (obj,goodCode){
			var $p = $(obj).parents(".unitBox:first");
			//校验数字格式
			if(!$(obj).val().isNumber()){
				alertMsg.error("请输入合法的数字！");
				$(obj).focus();
				$(obj).addClass("error");
				return;
			}
			$(obj).removeClass("error");
			var url=$("#updateGiftUrl",$p).val();
			jQuery.ajax({
				type:"POST",
				url: url,
				data:"schemegift.goodCode="+goodCode+"&schemegift."+$(obj).attr("name")+"="+$(obj).val(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
    					$(obj).val(setScale($(obj).val(), 2, "roundhalfup"));
	    			}
				}
			});
		},
		deleteSchemeGift:function (obj){
			var $p = $(obj).parents(".unitBox:first");
			$ids = $("input[name='giftIds']:checked",$p);
			if($ids.length<1){
				alertMsg.error('请选择再删除');
				return ;
			}
			alertMsg.confirm("确认删除？", {
				okCall: function(){
					var url=$("#dropGiftUrl",$p).val();
		        	jQuery.ajax({
		        		type:"POST",
		        		url: url,
		        		data:$ids.serialize(),
		        		dataType: "json",
		        		async: false,
		        		success: function(data) {
		        			if(data.statusCode=="300"){
		        				alertMsg.error(data.message);
		        			}else{
		        				alertMsg.correct(data.message);
		        				migr.toSchemedetail(obj);
		        			}
		        		}
		        	});
				}
			});
		},
		addSchemeGiftByCode:function(args,$p){
			var codes = args['goodCode'];
			var url=$("#addGiftUrl",$p).val()+"?codeStr="+codes;
			jQuery.ajax({
	    		type:"POST",
	    		url: url,
	    		dataType: "json",
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
	    				migr.toSchemedetail($("#addGiftUrl",$p));
	    			}
	    		}
	    	});
		},
		addSchemeDetailByCode:function(args,$p){
			var codes = "";
			if(args['categoryCode']){
				codes = args['categoryCode'];
			}
			if(args['goodCode']){
				codes = args['goodCode'];
			}
			if(args['brandCode']){
				codes = args['brandCode'];
			}
			var url=$("#addDetailUrl",$p).val()+"?codeStr="+codes;
			jQuery.ajax({
	    		type:"POST",
	    		url: url,
	    		dataType: "json",
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
	    				migr.toSchemedetail($("#addDetailUrl",$p));
	    			}
	    		}
	    	});
		},
		updateSchemeDetail:function (obj,porder){
			var $p = $(obj).parents(".unitBox:first");
			//校验数字格式
			if(!$(obj).val().isNumber()){
				alertMsg.error("请输入合法的数字！");
				$(obj).focus();
				$(obj).addClass("error");
				return;
			}
			$(obj).removeClass("error");
			var url=$("#updateDetailUrl",$p).val();
			jQuery.ajax({
				type:"POST",
				url: url,
				data:"schemedetail.porder="+porder+"&schemedetail."+$(obj).attr("name")+"="+$(obj).val(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
    					$(obj).val(setScale($(obj).val(), 2, "roundhalfup"));
	    			}
				}
			});
		},
		deleteSchemeDetail:function (obj){
			var $p = $(obj).parents(".unitBox:first");
			$ids = $("input[name='ids']:checked",$p);
			if($ids.length<1){
				alertMsg.error('请选择再删除');
				return ;
			}
			alertMsg.confirm("确认删除？", {
				okCall: function(){
					var url=$("#dropDetailUrl",$p).val();
		        	jQuery.ajax({
		        		type:"POST",
		        		url: url,
		        		data:$ids.serialize(),
		        		dataType: "json",
		        		async: false,
		        		success: function(data) {
		        			if(data.statusCode=="300"){
		        				alertMsg.error(data.message);
		        			}else{
		        				alertMsg.correct(data.message);
		        				migr.toSchemedetail(obj);
		        			}
		        		}
		        	});
				}
			});
		},
		addSchemeDetail:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var url=$("#addDetailUrl",$p).val();
			jQuery.ajax({
	    		type:"POST",
	    		url: url,
	    		dataType: "json",
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="300"){
	    				alertMsg.warn(data.message);
	    			}else{
	    				migr.toSchemedetail(obj);
	    			}
	    		}
	    	});
		},
		toSchemedetail:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			$("#schemeDetailDiv",$p).loadUrl($("#toSchemedetailUrl",$p).val(),$("#orderForm",$p).serialize(),function(){
				$("#schemeDetailDiv",$p).find("[layoutH]").layoutH();
			});
		},
		checkForschemeorder:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			if(!$("input[name=schemeorder.memo]",$p).val()){
				alertMsg.warn("促销方案名称不能为空");
				return false;
			}
			if(!$("#searchDate1",$p).val()){
				alertMsg.warn("促销开始时间不能为空");
				return false;
			}
			if(!$("#searchDate2",$p).val()){
				alertMsg.warn("促销结束时间不能为空");
				return false;
			}
			if(!$("input[name=branchCodeStr]",$p).val()){
				alertMsg.warn("促销分店不能为空");
				return false;
			}
			return true;
		},
		schemeModeChoose:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var val=$(obj).val();
			if(val==0){
				$("#zkdiv",$p).show();
				$("input[name=schemeorder.promRule][value=00]",$p).attr("checked",true);
				//防止选过特价促销  把失效的打开
				$("input[name=schemeorder.promScope][value=2]",$p).attr("disabled",false);
				$("input[name=schemeorder.promScope][value=1]",$p).attr("disabled",false);
				$("input[name=schemeorder.promScope][value=0]",$p).attr("disabled",false);
				$("input[name=schemeorder.promScope][value=0]",$p).attr("checked",true);
				$("#tjdiv",$p).hide();
				$("#mmsdiv",$p).hide();
				$("#giftdiv",$p).hide();
			}
			if(val==1){
				$("#tjdiv",$p).show();
				$("input[name=schemeorder.promRule][value=10]",$p).attr("checked",true);
				//选择特价 范围只能选择商品 其他的失效 不让选
				$("input[name=schemeorder.promScope][value=3]",$p).attr("checked",true);
				$("input[name=schemeorder.promScope][value=2]",$p).attr("disabled",true);
				$("input[name=schemeorder.promScope][value=1]",$p).attr("disabled",true);
				$("input[name=schemeorder.promScope][value=0]",$p).attr("disabled",true);
				$("#zkdiv",$p).hide();
				$("#mmsdiv",$p).hide();
				$("#giftdiv",$p).hide();
			}
			if(val==2){
				$("#mmsdiv",$p).show();
				$("#otherdiv",$p).show();
				$("#giftdiv",$p).show();
				$("input[name=schemeorder.promRule][value=20]",$p).attr("checked",true);
				//防止选过特价促销  把失效的打开 默认选择全场
				$("input[name=schemeorder.promScope][value=2]",$p).attr("disabled",false);
				$("input[name=schemeorder.promScope][value=1]",$p).attr("disabled",false);
				$("input[name=schemeorder.promScope][value=0]",$p).attr("disabled",false);
				$("input[name=schemeorder.promScope][value=0]",$p).attr("checked",true);
				$("#tjdiv",$p).hide();
				$("#zkdiv",$p).hide();
				
			}
		},
		modifyShortcut:function(obj,id){
			var $p = $(obj).parents(".unitBox:first");
			if(!$(obj).val().isNumber()){
				alertMsg.error("请输入合法的数字！");
				$(obj).val($(obj).attr("orvalue"));
				return;
			}
			var url=$("#modifyShortcutUrl",$p).val()+"?shortcut.id="+id;
			jQuery.ajax({
				type:"POST",
				url: url,
				data:"shortcut.porder="+$(obj).val(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.status=="error"){
						alertMsg.error('修改失败！');
					}else{
						$(obj).attr("orvalue",$(obj).val());
						alertMsg.correct('修改成功！');
					}
				}
			});
		},
		addShortcut:function(args,$p,lookupBtn){
			var source = args['source'];
			var url=$("#addShortcutUrl",$p).val()+"?shortcut.tname="+source;
			$.ajax({
	    		type:"POST",
	    		url: url,
	    		dataType: "json",
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
	    				migr.commonNavTabRefresh(lookupBtn);
	    			}
	    		}
	    	});
		},
		getNoReadMessageCount:function(url){
			var i=0;
			jQuery.ajax({
				type:"POST",
				url: url,
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.statusCode=="300"){
						alertMsg.error(data.message);
					}else{
						if(data && data.data){
//							alert(i);
							i=data.data.count;
						}
					}
				}
			});
			return i;
		},
		updateMessagecenter:function(obj,hadRead){
			var $p = $(obj).parents(".unitBox:first");
			$ids = $("input[name='ids']:checked",$p);
			if($ids.length<1){
				alertMsg.error('请选择再操作');
				return ;
			}
			var url=$("#messagecenterUpdateUrl",$p).val()+"?messagecenter.hadRead="+hadRead;
        	jQuery.ajax({
        		type:"POST",
        		url: url,
        		data:$ids.serialize(),
        		dataType: "json",
        		async: false,
        		success: function(data) {
        			if(data.statusCode=="300"){
        				alertMsg.error(data.message);
        			}else{
        				alertMsg.correct("操作成功");
        				migr.commonRefresh(obj);
        			}
        		}
        	});
		},
		refreshMessagecenter:function(obj,type){
			var $p = $(obj).parents(".unitBox:first");
			$("input[name='searchBean.messageType']",$p).val(type);
			migr.commonRefresh(obj);
		},
		changeRecFlag:function(obj){
			var $p = $(obj).parents(".unitBox:first");
//			alert($(obj).val());
			if($(obj).val()==0){
				$("#receiverDiv",$p).hide();
			}else{
				$("#receiverDiv",$p).show();
			}
		},
		saveParameterValue:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var condition="";
			if($(obj).attr("type")=="checkbox"){
				if($(obj).attr("checked")==true){
					$(obj).val(1);
				}else{
					$(obj).val(0);
				}
				condition = "sysparameter.pcode="+$(obj).attr("name")+"&sysparameter.pflag="+$(obj).val();
			}else{
				condition = "sysparameter.pcode="+$(obj).attr("name")+"&sysparameter.pvalue="+$(obj).val();
			}
			alertMsg.confirm("确认修改？", {
				okCall: function(){
					var url=$("#updateParameterSetUrl",$p).val();
		        	jQuery.ajax({
		        		type:"POST",
		        		url:url,
		        		data:condition,
		        		dataType: "json",
		        		async: false,
		        		success: function(data) {
		        			if(data.statusCode=="300"){
		        				alertMsg.error(data.message);
		        			}else{
		        				alertMsg.correct("修改成功");
		        			}
		        		}
		        	});
				},
				cancelCall:function(){
					$(obj).val($(obj).attr("oldValue"));
				}
			});
		},
		getValuesByType:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var url=$("#getValuesUrl",$p).val();
			jQuery.ajax({
				type:"POST",
				url: url,
				data:"giftcertificate.type="+$(obj).val(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.statusCode=="300"){
						alertMsg.error(data.message);
					}else{
						var hl="";
						if(data && data.data){
							for(var i=0;i<data.data.length;i++){
								hl+="<option value="+data.data[i].gvalue+">"+data.data[i].gvalue+"</option>";
							}
						}
						$("#giftPrice",$p).html(hl);
					}
				}
			});
		},
		jydQuery:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var currVipCode = $("input[name='searchBean.currVipCode']",$p).val();
			if(currVipCode==""){
				alertMsg.warn("请填写会员ID再查询");
				return false;
			}
			var id = $(obj).attr("id");
			if(id!="refresh"){
				$("input[name='searchBean.tname']",$p).val(id);
			}
			$("#pagerForm",$p).submit();
		},
		jydSubmitPush:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var currVipCode = $("input[name='searchBean.currVipCode']",$p).val();
			if(currVipCode==""){
				alertMsg.warn("请填写会员ID");
				return false;
			}
			var cardCode = $("input[name='searchBean.cardCode']",$p).val();
			if(cardCode==""){
				alertMsg.warn("请填写赠礼卡号码");
				return false;
			}
			var password = $("input[name='searchBean.password']",$p).val();
			if(password==""){
				alertMsg.warn("请填写赠礼卡密码");
				return false;
			}
			alertMsg.confirm("确认提交排队？", {
				okCall: function(){
					var url=$("#pushtoqueueUrl",$p).val();
		        	jQuery.ajax({
		        		type:"POST",
		        		url: url,
		        		data:$("#pagerForm",$p).serialize(),
		        		dataType: "json",
		        		async: false,
		        		success: function(data) {
		        			if(data.statusCode=="300"){
		        				alertMsg.error(data.message);
		        			}else{
		        				alertMsg.correct("操作成功");
		        			}
		        		}
		        	});
				}
			});
		},
		goodstockToDetail:function(obj,branchCode,goodCode){
			var $p = $(obj).parents(".unitBox:first");
			if(goodCode!=undefined){
				$("input[name='searchBean.goodCode']",$p).val(goodCode);
				$("input[name='searchBean.branchCode']",$p).val(branchCode);
				var selectButton=$("#depot_goodstock_query2");
				selectButton.trigger("click");
			}
		},
		savePurview:function(obj,username){
			var $p = $(obj).parents(".unitBox:first");
			$ids = $("input[name='codes']:checked",$p);
			alertMsg.confirm("确认修改？", {
				okCall: function(){
					var url=$("#savePurviewUrl",$p).val();
		        	jQuery.ajax({
		        		type:"POST",
		        		url: url,
		        		data:$ids.serialize(),
		        		dataType: "json",
		        		async: false,
		        		success: function(data) {
		        			if(data.statusCode=="300"){
		        				alertMsg.error("操作失败");
		        			}else{
		        				alertMsg.correct("操作成功");
		        			}
		        		}
		        	});
				}
			});
		},
		viewPurview:function(obj,username){
			$("#viewPurview").loadUrl($("#viewPurviewUrl").val()+'?userinfo.username='+username,'','');
		},
		modifycheckdiffer:function(obj,code){
			if($(obj).attr("type")=="checkbox"){
				//$(obj).attr("checked") && $(obj).attr("checked")!="false"
				if($(obj).attr("checked")==true){
					$(obj).val(1);
				}else{
					$(obj).val(0);
				}
			}
			var $p = $(obj).parents(".unitBox:first");
			var url=$("#updateDetailUrl",$p).val();
//			alert(url+"?"+"checkdiffer.goodCode="+code+"&checkdiffer."+$(obj).attr("name")+"="+$(obj).val());
			$.ajax({
				type:"POST",
				url: url,
				data:"checkdiffer.goodCode="+code+"&checkdiffer."+$(obj).attr("name")+"="+$(obj).val(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}
				}
			});
		},
		beforeChooseChecktask:function(btn){
			var $lookBtn = $(btn);
			var $p = $lookBtn.parents(".unitBox:first");
			var checkNo = $("input[name='checkorder.checkNo']",$p).val();
			var detailSize = $("#detailSize",$p).val();
			if(checkNo!='' &&detailSize>0 ){
				alertMsg.error("请删除明细再更改盘点任务号！");
				return false;
			}
			return true;
		},
		modifycheckdetail:function(obj,code,defaultscale,numscale,moneyscale){
			//校验数字格式
			if(!$(obj).val().isNumber()){
				alertMsg.error("请输入合法的数字！");
				$(obj).focus();
				$(obj).addClass("error");
				return;
			}
			$(obj).removeClass("error");
			var $p = $(obj).parents(".unitBox:first");
			var url=$("#updateDetailUrl",$p).val();
			var $tr = $(obj).parents("tr:first");
			$.ajax({
				type:"POST",
				url: url,
				data:"checkdetail.goodCode="+code+"&checkdetail."+$(obj).attr("name")+"="+$(obj).val(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
	    				if(data.data){
	    					$("input[name='differNumber']",$tr).val(setScale(data.data.differNumber,numscale, "roundhalfup"));
	    					$(obj).val(setScale($(obj).val(),defaultscale, "roundhalfup"));
	    				}
	    			}
				}
			});
		},
		beforecheckorderDetailChoose:function(btn){
			var $lookBtn = $(btn);
			var $p = $lookBtn.parents(".unitBox:first");
			var checkNo = $("input[name='checkorder.checkNo']",$p).val();
			if(checkNo==''){
				alertMsg.error("请选择盘点任务号！");
				return false;
			}
			return true;
		},
		chooseChecktask:function(args,$p){
			var temporderNo = args['orderNo'];
			//生成单据的类型
			var tempurl=$("#chooseChecktaskUrl",$p).val()+"?checkorder.checkNo="+temporderNo;
			var checkOrderNo=$("#orderNo",$p).val();
			var refreshUrl=$("#refreshUrl").val()+"?checkorder.orderNo="+checkOrderNo;
			jQuery.ajax({
	    		type:"POST",
	    		url: tempurl,
	    		dataType: "json",
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
	    				jQuery.pdialog.reload(refreshUrl,{dialogId:$("#dialogId",$p).val()});
	    			}
	    		}
	    	});
		},
		chooseChecktaskReloadDiv:function(args,$p){
			var orderNo = args['orderNo'];
			//生成单据的类型
			var url=$("#chooseChecktaskUrl",$p).val()+"?checkorder.checkNo="+orderNo;
			var checkOrderNo=$("#orderNo",$p).val();
			var refreshUrl=$("#refreshUrl").val()+"?checkorder.orderNo="+checkOrderNo+"&type="+$("input[name='type']",$p).val();
			jQuery.ajax({
	    		type:"POST",
	    		url: url,
	    		dataType: "json",
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
	    				jQuery("#headDiv").loadUrl(refreshUrl);
	    			}
	    		}
	    	});
		},
		submitCheckTaskAdd:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var type= $("select[name='checktask.type']",$p).val();
			if(1==type){
				if($("input[name='checktask.categoryCode']",$p).val()==""){
					alertMsg.error("类别不能为空！");
					return false;
				}
			}
			if(2==type){
				if($("input[name='checktask.brandCode']",$p).val()==""){
					alertMsg.error("品牌不能为空！");
					return false;
				}
			}
			if(0==type){
				if($("input[name='checktask.goodCode']",$p).val()==""){
					alertMsg.error("商品不能为空！");
					return false;
				}
			}
			$("#orderForm",$p).submit();
		},
		changeCheckType:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			if(1==$(obj).val()){
				$("#brandTr",$p).hide();
				$("#goodTr",$p).hide();
				$("#categoryTr",$p).show();
			}else if(2==$(obj).val()){
				$("#categoryTr",$p).hide();
				$("#goodTr",$p).hide();
				$("#brandTr",$p).show();
			}else if(0==$(obj).val()){
				$("#categoryTr",$p).hide();
				$("#brandTr",$p).hide();
				$("#goodTr",$p).show();
			}else{
				$("#brandTr",$p).hide();
				$("#categoryTr",$p).hide();
				$("#goodTr",$p).hide();
			}
		},
		/***************************************************/
		commSubmitQueryNew:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var startDate = $("input[name='searchBean.startDate']",$p);
			var endDate = $("input[name='searchBean.endDate']",$p);
			var orderNo = $("input[name='searchBean.checktask.orderNo']",$p);
			var sumDate = $("input[name='searchBean.sumDate']",$p);
			if(sumDate!=undefined && sumDate.val()==""){
				alertMsg.error("查询日期不能为空！");
				return false;
			}
			if(orderNo!=undefined && orderNo.val()==""){
				alertMsg.error("盘点批次号不能为空！");
				return false;
			}
			if(startDate !=undefined && (startDate.val()=="" || endDate.val()=="")){
				alertMsg.error("搜索日期不能为空！");
				return false;
			}
			var tname= $("input[name='searchBean.tname']",$p).val();
			// 库存查询 商品流动汇总 商品流动明细 查询条件分店仓库不能为空
			if(tname=="depot_goodstock_query1" ||tname=="depot_goodstock_query2"||tname=="depot_goodstock_query3"||tname=="depot_goodstock_query6"){
				var branchCode = $("input[name='searchBean.branchCode']",$p).val();
				if(branchCode==""){
					alertMsg.error("分店仓库不能为空！");
					return false;
				}
			}
			var objTab=$("#"+tname,$p);
			$("#"+objTab.attr("divId"),$p).loadUrl(objTab.attr("objUrl"),$("#pagerForm",$p).serialize(),function(){
				$("#"+objTab.attr("divId"),$p).find("[layoutH]").layoutH();
			});
		},
		changePageHeadNew:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var objUrl=$("#headUrl",$p).val();
			$("input[name='searchBean.tname']",$p).val($(obj).attr("id"));
			
			$setColumn=$("#setColumn",$p);
			if($setColumn){
				$setColumn.attr("tname",$(obj).attr("id"));
				//$setColumn.attr("rel",$(obj).attr("id"));
			}
			$("#"+$("#headDivId").val(),$p).loadUrl(objUrl,$("#pagerForm",$p).serialize());
			return true;
		},
		/**************************************/
		updateCert:function(obj,id){
			if($(obj).attr("name")=='gvalue'){
				//校验数字格式
				if(!$(obj).val().isNumber()){
					alertMsg.error("请输入合法的数字！");
					$(obj).focus();
					$(obj).addClass("error");
					return;
				}
				$(obj).removeClass("error");
			}
			if(id == undefined){
				id = $(obj).attr("certid");
			}
			var $p = $(obj).parents(".unitBox:first");
			var url=$("#updateUrl",$p).val();
			jQuery.ajax({
				type:"POST",
				url: url,
				data:"giftcertificate.id="+id+"&giftcertificate."+$(obj).attr("name")+"="+$(obj).val(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
    					if($(obj).attr("name")=='gvalue'){
    						$(obj).val(setScale($(obj).val(), 2, "roundhalfup"));
    					}
    					alertMsg.info(data.message);
    					if($(obj).attr("name")=='state'){
    						migr.commRefreshOrder(obj);
    					}
	    			}
				}
			});
		},
		/******************************************************************/
		checkPromBranchChange:function(args,$p,$lookupBtn){
			//与原值对比  两个值一样 返回true  两个值都包含"," 表示都是多个生效分店  也返回true
			var b=true;
			var branchCodes = args['branchCode'];
			var branchNames = args['branchName'];
			var orbranchCodes = $("input[name='branchCodeStr']",$p).val();
			var orbranchNames = $("textarea[name='branchNameStr']",$p).val();
			if(branchCodes == orbranchCodes){
				return true;
			}
			if(orbranchCodes!="" && branchCodes.indexOf(",")>0 && orbranchCodes.indexOf(",")>0){
				return true;
			}
			if($("#detailSize",$p).val()>0){
//				alert("更新明细原价");
				alertMsg.confirm("更改生效分店,明细进价原价将被更改,确定？", {
					okCall: function(){
						var url=$("#updateDetailsUrl",$p).val();
						jQuery.ajax({
							type:"POST",
							url: url,
							data:"branchCodeStr="+branchCodes+"&"+$("#orderType",$p).attr("name")+"="+$("#orderType",$p).val(),
							dataType: "json",
							async: false,
							success: function(data) {
								if(data.statusCode=="300"){
									alertMsg.error(data.message);
									b=false;
								}else{
									b=true;
									$("input[name='branchCodeStr']",$p).val(branchCodes);
									$("textarea[name='branchNameStr']",$p).val(branchNames);
									migr.commRefreshOrder($lookupBtn);
								}
							}
						});
					},
					cancelCall:function(){
						$("input[name='branchCodeStr']",$p).val(orbranchCodes);
						$("textarea[name='branchNameStr']",$p).val(orbranchNames);
					}
				});
			}
			return b;
		},
		modifyGift:function(obj,code){
			//校验数字格式
			if(!$(obj).val().isNumber()){
				alertMsg.error("请输入合法的数字！");
				$(obj).focus();
				$(obj).addClass("error");
				return;
			}
			$(obj).removeClass("error");
			var $p = $(obj).parents(".unitBox:first");
			var url=$("#updateGiftUrl",$p).val();
			jQuery.ajax({
				type:"POST",
				url: url,
				data:"gift.giftCode="+code+"&gift."+$(obj).attr("name")+"="+$(obj).val()+"&gift.goodCode="+$("input[name='gift.goodCode']").val(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
    					$(obj).val(setScale($(obj).val(), 2, "roundhalfup"));
	    			}
				}
			});
		},
		modifyGiftdetail:function(obj,code){
			if($(obj).attr("name")!='startTime' && $(obj).attr("name")!='endTime'){
				//校验数字格式
				if(!$(obj).val().isNumber()){
					alertMsg.error("请输入合法的数字！");
					$(obj).focus();
					$(obj).addClass("error");
					return;
				}
				$(obj).removeClass("error");
			}
			if(code == undefined){
				code = $(obj).attr("goodCode");
			}
			var $p = $(obj).parents(".unitBox:first");
			var url=$("#updateDetailUrl",$p).val();
			jQuery.ajax({
				type:"POST",
				url: url,
				data:"giftdetail.goodCode="+code+"&giftdetail."+$(obj).attr("name")+"="+$(obj).val(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
    					if($(obj).attr("name")!='startTime' && $(obj).attr("name")!='endTime'){
    						$(obj).val(setScale($(obj).val(), 2, "roundhalfup"));
    					}
	    			}
				}
			});
		},
		commDeleteGift:function (obj){
			var $p = $(obj).parents(".unitBox:first");
			alertMsg.confirm("确认删除？", {
				okCall: function(){
					var url=$("#dropGiftUrl",$p).val()+"&gift.goodCode="+$("input[name='gift.goodCode']").val();
					var refreshUrl=$("#viewGiftsUrl").val()+"&gift.goodCode="+$("input[name='gift.goodCode']").val();
		        	$ids = $("input[name='giftids']:checked",$p);
		        	jQuery.ajax({
		        		type:"POST",
		        		url: url,
		        		data:$ids.serialize(),
		        		dataType: "json",
		        		async: false,
		        		success: function(data) {
		        			if(data.statusCode=="300"){
		        				alertMsg.error(data.message);
		        			}else{
		        				$("#giftList",$p).loadUrl(refreshUrl);
		        			}
		        		}
		        	});
				}
			});
		},
		commAddGift:function(args,$p){
			var codes = args['goodCode'];
			var url=$("#addGiftUrl",$p).val()+"&gift.goodCode="+$("input[name='gift.goodCode']").val()+"&goodCodes="+codes+"&branchCodeStr="+$("input[name='branchCodeStr']").val();
			var refreshUrl=$("#viewGiftsUrl").val()+"&gift.goodCode="+$("input[name='gift.goodCode']").val();
//			alert(url);
			jQuery.ajax({
	    		type:"POST",
	    		url: url,
	    		dataType: "json",
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
	    				$("#giftList",$p).loadUrl(refreshUrl);
	    			}
	    		}
	    	});
		},
		viewGifts:function(goodCode){
			var url=$("#viewGiftsUrl").val()+"&gift.goodCode="+goodCode;
			$("input[name='gift.goodCode']").val(goodCode);
			$("#giftList").loadUrl(url);
		},
		beforeAddGift:function(btn){
			var $lookBtn = $(btn);
			var $p = $lookBtn.parents(".unitBox:first");
			var chooseGood = $("input[name='gift.goodCode']",$p).val();
			if(chooseGood==''){
				alertMsg.error("请先选择商品！");
				return false;
			}
			return true;
		},
		/*****************************************/
		changeOverValue:function(obj){
			$(obj).val(setScale($(obj).val(), 2, "roundhalfup"));
		},
		modifyAwarddetail:function(obj,goodCode){
			if($(obj).attr("name")!='startTime' && $(obj).attr("name")!='endTime'){
				//校验数字格式
				if(!$(obj).val().isNumber()){
					alertMsg.error("请输入合法的数字！");
					$(obj).focus();
					$(obj).addClass("error");
					return;
				}
				$(obj).removeClass("error");
			}
			if(goodCode == undefined){
				goodCode = $(obj).attr("goodCode");
			}
			var $p = $(obj).parents(".unitBox:first");
			var url=$("#updateDetailUrl",$p).val();
			var $tr = $(obj).parents("tr:first");
			jQuery.ajax({
				type:"POST",
				url: url,
				data:"awarddetail.goodCode="+goodCode+"&awarddetail."+$(obj).attr("name")+"="+$(obj).val(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
    					if($(obj).attr("name")!='startTime' && $(obj).attr("name")!='endTime'){
    						$(obj).val(setScale($(obj).val(), 2, "roundhalfup"));
    					}
	    			}
				}
			});
		},
		changeConType:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			$("input[name='awardorder.code']").val("");
			$("input[name='awardorder.name']").val("");
			var url = $("#clearDetailUrl",$p).val();
			if($(obj).val()=="0"){
				$("#hiddenDetailDiv",$p).hide();
				//选择任意  隐藏DIV
				$("#hiddenDiv",$p).hide();
				$("input[name='awardorder.code']").removeClass("required {messages:{required:'请填写完整促销条件！'}}");
				jQuery.ajax({url: url,dataType: "json",success: function(data) {if(data.statusCode!="200") alertMsg.error(data.message);}});
			}else if($(obj).val()=="1"){
				//选择类别
				$("#hiddenDetailDiv",$p).hide();
				$("#hiddenDiv",$p).show();
				$("input[name='awardorder.code']").attr("id","bird.brandChoose.categoryCode");
				$("input[name='awardorder.name']").attr("id","bird.brandChoose.categoryName");
				$("#chooseUrl").attr("rel","goodcategory_choose_lookup");
				$("#chooseUrl").attr("href",$("#chooseCategoryUrl").val());
				$("#chooseUrl").html("选择品类");
				$("input[name='awardorder.code']").addClass("required {messages:{required:'请填写完整促销条件！'}}");
				jQuery.ajax({url: url,dataType: "json",success: function(data) {if(data.statusCode!="200") alertMsg.error(data.message);}});
			}else if($(obj).val()=="2"){
				//选择品牌
				$("#hiddenDetailDiv",$p).hide();
				$("#hiddenDiv",$p).show();
				$("input[name='awardorder.code']").attr("id","bird.brandChoose.brandCode");
				$("input[name='awardorder.name']").attr("id","bird.brandChoose.brandName");
				$("#chooseUrl").attr("rel","brand_choose_lookup");
				$("#chooseUrl").attr("href",$("#chooseBrandUrl").val());
				$("#chooseUrl").html("选择品牌");
				$("input[name='awardorder.code']").addClass("required {messages:{required:'请填写完整促销条件！'}}");
				jQuery.ajax({url: url,dataType: "json",success: function(data) {if(data.statusCode!="200") alertMsg.error(data.message);}});
			}else if($(obj).val()=="3"){
				//刷新整个页面
				migr.commRefreshOrder(obj);
			}
		},
		/***************************************/
		modifyBranddetail:function(obj,code){
			if($(obj).attr("name")!='startTime' && $(obj).attr("name")!='endTime'){
				//校验数字格式
				if(!$(obj).val().isNumber()){
					alertMsg.error("请输入合法的数字！");
					$(obj).focus();
					$(obj).addClass("error");
					return;
				}
				$(obj).removeClass("error");
			}
			if(code == undefined){
				code = $(obj).attr("code");
			}
			var $p = $(obj).parents(".unitBox:first");
			var url=$("#updateDetailUrl",$p).val();
			var $tr = $(obj).parents("tr:first");
			jQuery.ajax({
				type:"POST",
				url: url,
				data:"keyCode="+code+"&branddetail."+$(obj).attr("name")+"="+$(obj).val(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
    					if($(obj).attr("name")!='startTime' && $(obj).attr("name")!='endTime' && $(obj).attr("name")!="rebate"){
    						$(obj).val(setScale($(obj).val(), 2, "roundhalfup"));
    					}
    					if($(obj).attr("name")=="rebate"){
    						$(obj).val(setScale($(obj).val(), 2, "roundhalfup"));
	    					$("input[name='specPrice']",$tr).val(setScale(data.data.specPrice, 2, "roundhalfup"));
    					}
	    			}
				}
			});
		},
		addSortDetail:function(args,$p){
			var codes = args['categoryCode'];
			var url=$("#addDetailUrl",$p).val()+"?codes="+codes+"&flag=b";
			var refreshUrl=$("#refreshUrl").val();
			//alert(codes);
			jQuery.ajax({
	    		type:"POST",
	    		url: url,
	    		dataType: "json",
	    		data:$("#orderForm",$p).serialize(),
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
	    				var dialog = jQuery.pdialog.reload(refreshUrl,{dialogId:$("#dialogId",$p).val(),data:$("#orderForm",$p).serialize()});
	    				if(dialog){
	    					var box = dialog.find(".dialogContent");
	    					$.setLookupBox(box);
	    				}
	    			}
	    		}
	    	});
		},
		addBrandDetail:function(args,$p){
			var codes = args['brandCode'];
			var url=$("#addDetailUrl",$p).val()+"?codes="+codes+"&flag=a";
			var refreshUrl=$("#refreshUrl").val();
			//alert(codes);
			jQuery.ajax({
	    		type:"POST",
	    		url: url,
	    		dataType: "json",
	    		data:$("#orderForm",$p).serialize(),
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
	    				var dialog = jQuery.pdialog.reload(refreshUrl,{dialogId:$("#dialogId",$p).val(),data:$("#orderForm",$p).serialize()});
	    				if(dialog){
	    					var box = dialog.find(".dialogContent");
	    					$.setLookupBox(box);
	    				}
	    			}
	    		}
	    	});
		},
		/******************************************************/
		modifySpecdetail:function(obj,goodCode){
			if($(obj).attr("name")!='startTime' && $(obj).attr("name")!='endTime'){
				//校验数字格式
				if(!$(obj).val().isNumber()){
					alertMsg.error("请输入合法的数字！");
					$(obj).focus();
					$(obj).addClass("error");
					return;
				}
				$(obj).removeClass("error");
			}
			if(goodCode == undefined){
				goodCode = $(obj).attr("goodCode");
			}
			var $p = $(obj).parents(".unitBox:first");
			var url=$("#updateDetailUrl",$p).val();
			var $tr = $(obj).parents("tr:first");
			jQuery.ajax({
				type:"POST",
				url: url,
				data:"specdetail.goodCode="+goodCode+"&specdetail."+$(obj).attr("name")+"="+$(obj).val(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
    					if($(obj).attr("name")!='startTime' && $(obj).attr("name")!='endTime' && $(obj).attr("name")!="rebate"){
    						$(obj).val(setScale($(obj).val(), 2, "roundhalfup"));
    					}
    					if($(obj).attr("name")=="rebate"){
    						$(obj).val(setScale($(obj).val(), 2, "roundhalfup"));
	    					$("input[name='specPrice']",$tr).val(setScale(data.data.specPrice, 2, "roundhalfup"));
    					}
	    			}
				}
			});
		},
		beforeSpecorderDetailChoose:function(btn){
			var $lookBtn = $(btn);
			var $p = $lookBtn.parents(".unitBox:first");
			var inBranchCode = $("input[name='branchCodeStr']",$p).val();
			if(inBranchCode==''){
				alertMsg.error("请选择参与促销分店！");
				return false;
			}
			return true;
		},
		modifyweekFlag:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var weekFlag="";
			var check;
			var prcs = $("input[name='prc']",$p);
			prcs.each(function(){
				if($(this).attr("checked")){
					check=1;
		    	}else{
		    		check=0;
		    	}
		    	weekFlag = weekFlag+check;
			})
//			alert(weekFlag);
			$("#weekFlag",$p).val(weekFlag);
		},
		/*****************************************/
		copyDeliverOrder:function(args,$p){
			var orderNo = args['orderNo'];
			//生成单据的类型
//			var outBranchCode=$("input[name='deliverorder.outBranchCode']",$p).val();
//			if(outBranchCode==''){
//				$("input[name='deliverorder.srcNo']",$p).val('');
//				alertMsg.warn("请选择调入调出仓库");
//			}
			var orderType=$("input[name='deliverorder.orderType']",$p).val();
			var srcType=$("input[name='deliverorder.srcType']",$p).val();
			var url=$("#copyOrderUrl",$p).val()+"?deliverorder.orderNo="+orderNo+"&deliverorder.orderType="+orderType+"&deliverorder.srcType="+srcType;
			var refreshUrl=$("#refreshUrl").val();
			jQuery.ajax({
	    		type:"POST",
	    		url: url,
	    		dataType: "json",
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
	    				jQuery.pdialog.reload(refreshUrl,{dialogId:$("#dialogId",$p).val(),data:'deliverorder.orderType='+orderType});
	    			}
	    		}
	    	});
		},
		changeSrcOrderType:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			$("input[name='deliverorder.srcType']",$p).val($(obj).val());
			//店间直调单
			if($(obj).val()=="0"){
				$("#selectUrl",$p).attr("href",$("#selectUrl1",$p).val());
				$("#selectUrl",$p).attr("rel",$("#selectUrl1",$p).attr("rel"));
			}
			//调拨申请单
			if($(obj).val()=="1"){
				$("#selectUrl",$p).attr("href",$("#selectUrl2",$p).val());
				$("#selectUrl",$p).attr("rel",$("#selectUrl2",$p).attr("rel"));
			}
			//采购收货单
			if($(obj).val()=="3"){
				$("#selectUrl",$p).attr("href",$("#selectUrl3",$p).val());
				$("#selectUrl",$p).attr("rel",$("#selectUrl3",$p).attr("rel"));
			}
		},
		beforeDeliverdetailChoose:function(btn){
			var $lookBtn = $(btn);
			var $p = $lookBtn.parents(".unitBox:first");
			var organCode = $("input[name='deliverorder.organCode']",$p).val();
			if(organCode==''){
				alertMsg.error("请选择相应机构！");
				return false;
			}
			return true;
		},
		beforeTransferorderDetailChoose:function(btn){
			var $lookBtn = $(btn);
			var $p = $lookBtn.parents(".unitBox:first");
			
			var inBranchCode = $("input[name='transferorder.inBranchCode']",$p).val();
			if(inBranchCode==''){
				alertMsg.error("请选择调入仓库！");
				return false;
			}
			var outBranchCode = $("input[name='transferorder.outBranchCode']",$p).val();
			if(outBranchCode==''){
				alertMsg.error("请选择调出仓库！");
				return false;
			}
			return true;
		},
		beforeDeliverorderDetailChoose:function(btn){
			var $lookBtn = $(btn);
			var $p = $lookBtn.parents(".unitBox:first");
			
			var inBranchCode = $("input[name='deliverorder.inBranchCode']",$p).val();
			if(inBranchCode==''){
				alertMsg.error("请选择调入仓库！");
				return false;
			}
			var outBranchCode = $("input[name='deliverorder.outBranchCode']",$p).val();
			if(outBranchCode==''){
				alertMsg.error("请选择调出仓库！");
				return false;
			}
			return true;
		},
		modifyDeliverdetail:function(obj,goodCode,defaultscale,numscale,moneyscale){
			if($(obj).attr("name")!='memo'){
				//校验数字格式
				if(!$(obj).val().isNumber()){
					alertMsg.error("请输入合法的数字！");
					$(obj).focus();
					$(obj).addClass("error");
					return;
				}
				$(obj).removeClass("error");
			}
			var $p = $(obj).parents(".unitBox:first");
			var url=$("#updateDetailUrl",$p).val();
			var $tr = $(obj).parents("tr:first");
			jQuery.ajax({
				type:"POST",
				url: url,
				data:"deliverdetail.goodCode="+goodCode+"&deliverdetail."+$(obj).attr("name")+"="+$(obj).val(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
	    				if(data.data){
	    					$("input[name='boxNum']",$tr).val(setScale(data.data.boxNum,defaultscale, "roundhalfup"));
	    					$("input[name='amount']",$tr).val(setScale(data.data.amount,numscale, "roundhalfup"));
	    					$("input[name='purchasePrice']",$tr).val(setScale(data.data.purchasePrice,moneyscale, "roundhalfup"));
	    					$("td[rname='totalSum']",$tr).text(setScale(data.data.totalSum,moneyscale, "roundhalfup"));
	    					$("#totalSumId",$p).text(setScale(data.data.orderMoney,moneyscale, "roundhalfup"));
	    					$("#orderNum",$p).text(setScale(data.data.orderNum,numscale, "roundhalfup"));
	    				}
	    			}
				}
			});
		},
		checkConsumerCodeSame:function(args,$p,$lookupBtn){
			var chooseCode=args['code'];
			var code=$("input[name='consumer.code']",$p).val();
			if(chooseCode==code){
				alertMsg.error('上级编码不能与本客户编码相同');
				return false;
			}else{
				return true;
			}
		},
		//校验调入调出分店编号不能一致
		checkBranchSame:function(args,$p,$lookupBtn){
			var branchCode=args['branchCode'];
			var orinbranchCode=$("input[name='deliverorder.inBranchCode']",$p).val();
			var orinBranchName=$("input[name='inBranchName']",$p).val();
			$outbranchCode=$("input[name='deliverorder.outBranchCode']",$p);
			if(branchCode==$outbranchCode.val()){
				$("input[name='deliverorder.inBranchCode']",$p).val(orinbranchCode);
				$("input[name='inBranchName']",$p).val(orinBranchName);
				alertMsg.error('调入调出分店仓库不能相同');
				return false;
			}else{
				return true;
			}
		},
		checkDeliverBranchChange:function(args,$p,$lookupBtn){
			var b=true;
			var branchCode = args['branchCode'];
			var branchName = args['branchName'];
			var orbranchCode = $("input[name='deliverorder.outBranchCode']",$p).val();
			var orbranchName = $("input[name='outBranchName']",$p).val();
			//校验是否和调入的分店一样
			var inbranchCode=$("input[name='deliverorder.inBranchCode']",$p).val();
			if(branchCode==inbranchCode){
				$("input[name='deliverorder.outBranchCode']",$p).val(orbranchCode);
				$("input[name='outBranchName']",$p).val(orbranchName);
				alertMsg.error('调入调出分店仓库不能相同');
				return false;
			}
			
			if(branchCode == orbranchCode){
				return true;
			}
			if($("#detailSize",$p).val()>0){
//				alert("更新明细原价");
				alertMsg.confirm("调入分店仓库变更,明细单价将被更改,确定？", {
					okCall: function(){
						var url=$("#updateDetailsUrl",$p).val();
						jQuery.ajax({
							type:"POST",
							url: url,
							data:$("#orderForm",$p).serialize(),
							dataType: "json",
							async: false,
							success: function(data) {
								if(data.statusCode=="300"){
									alertMsg.error(data.message);
									b=false;
								}else{
									b=true;
									$("input[name='deliverorder.outBranchCode']",$p).val(branchCode);
									$("input[name='outBranchName']",$p).val(branchName);
									migr.commRefreshOrder($lookupBtn);
								}
							}
						});
					},
					cancelCall:function(){
						$("input[name='deliverorder.outBranchCode']",$p).val(orbranchCode);
						$("input[name='outBranchName']",$p).val(orbranchName);
					}
				});
			}
			return b;
		},
		/*****************************************/
		checkBranchChange:function(args,$p,$lookupBtn){
			//与原值对比  两个值一样 返回true  两个值都包含"," 表示都是多个生效分店  也返回true
			var b=true;
			var branchCodes = args['branchCode'];
			var branchNames = args['branchName'];
			var orbranchCodes = $("input[name='branchCodeStr']",$p).val();
			var orbranchNames = $("textarea[name='branchNameStr']",$p).val();
			if(branchCodes == orbranchCodes){
				return true;
			}
			if(orbranchCodes!="" && branchCodes.indexOf(",")>0 && orbranchCodes.indexOf(",")>0){
				return true;
			}
			if($("#detailSize",$p).val()>0){
//				alert("更新明细原价");
				alertMsg.confirm("更改生效分店,明细原价将被更改,确定？", {
					okCall: function(){
						var url=$("#updateDetailsUrl",$p).val();
						jQuery.ajax({
							type:"POST",
							url: url,
							data:"branchCodeStr="+branchCodes,
							dataType: "json",
							async: false,
							success: function(data) {
								if(data.statusCode=="300"){
									alertMsg.error(data.message);
									b=false;
								}else{
									b=true;
									$("input[name='branchCodeStr']",$p).val(branchCodes);
									$("textarea[name='branchNameStr']",$p).val(branchNames);
									migr.commRefreshOrder($lookupBtn);
								}
							}
						});
					},
					cancelCall:function(){
						$("input[name='branchCodeStr']",$p).val(orbranchCodes);
						$("textarea[name='branchNameStr']",$p).val(orbranchNames);
					}
				});
			}
			return b;
		},
		//添加商品时 检查有没选择生效分店
		checkBranchData:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			if($("[name='branchCodeStr']",$p).val()=="")
			{
				alertMsg.warn('请先选择生效分店');
				return false;
			}else{
				return true;
			}
		},
		modifyAdjustDetail:function(obj,goodCode,defaultScale,numScale,moneyScale){
			if($(obj).attr("name")!='memo'){
				//校验数字格式
				if(!$(obj).val().isNumber()){
					alertMsg.error("请输入合法的数字！");
					$(obj).focus();
					$(obj).addClass("error");
					return;
				}
				$(obj).removeClass("error");
			}
			var $p = $(obj).parents(".unitBox:first");
			var url=$("#updateDetailUrl",$p).val();
			jQuery.ajax({
				type:"POST",
				url: url,
				data:"adjustdetail.goodCode="+goodCode+"&adjustdetail."+$(obj).attr("name")+"="+$(obj).val(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.statusCode=="300"){
						alertMsg.error(data.message);
					}else{
						$(obj).val(setScale($(obj).val(),moneyScale,"roundhalfup"));
					}
				}
			});
		},
		modifyChangPrice:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var changePrice="";
			var check;
			var prcs = $("input[name='prc']",$p);
			prcs.each(function(){
				if($(this).attr("checked")){
					check=1;
		    	}else{
		    		check=0;
		    	}
		    	changePrice = changePrice+check;
			})
//			alert(changePrice);
			$("#changePrice",$p).val(changePrice);
			migr.commRefreshOrder(obj);
		},
		/*******************************/
		modifybranchgood_by_select:function(obj,id){
			var url=$("#updateUrl").val();
			url = url +"?branchgoods.id="+id;
			jQuery.ajax({
				type:"POST",
				url: url,
				data:"branchgoods."+$(obj).attr("name")+"="+$(obj).val(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.status=="error"){
						alertMsg.error(data.message);
					}else{
						alertMsg.correct(data.message);
					}
				}
			});
		},
		modifybranchgood_by_checkbox:function(obj,id){
			var check;
			if($(obj).attr("checked")){
				check=1;
			}else{
				check=0;
			}
			if($(obj).attr("flag")=="select"){
				check=$(obj).val();
			}
			var url=$("#updateUrl").val();
			url = url +"?branchgoods.id="+id;
			jQuery.ajax({
				type:"POST",
				url: url,
				data:"branchgoods."+$(obj).attr("name")+"="+check,
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.status=="error"){
						alertMsg.error(data.message);
					}else{
						alertMsg.correct(data.message);
					}
				}
			});
		},
		changePageHeadNew:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var objUrl=$("#headUrl",$p).val();
			$("input[name='searchBean.tname']",$p).val($(obj).attr("id"));
			
			$setColumn=$("#setColumn",$p);
			if($setColumn){
				$setColumn.attr("tname",$(obj).attr("id"));
				//$setColumn.attr("rel",$(obj).attr("id"));
			}
			$("#"+$("#headDivId").val(),$p).loadUrl(objUrl,$("#pagerForm",$p).serialize());
			return true;
		},
		deliverorderSubmit:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			if(!migr.commonOrderMoneyAndAmountValidatePositiveFloat("boxNum",$p)){
				return false;
			}else if(!migr.commonOrderMoneyAndAmountValidatePositiveFloat("amount",$p)){
				return ;
			}else{
				migr.commSaveOrder($(obj));
			}
		}
		,
		adjustpriceSubmit:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			if(!migr.commonOrderMoneyAndAmountValidateNotNegativeFloat("newPurchasePrice",$p)){
				return ;
			}else if(!migr.commonOrderMoneyAndAmountValidateNotNegativeFloat("newPrice",$p)){
				return ;
			}else if(!migr.commonOrderMoneyAndAmountValidateNotNegativeFloat("newBatchPrice",$p)){
				return ;
			}else if(!migr.commonOrderMoneyAndAmountValidateNotNegativeFloat("newDeliverPrice",$p)){
				return ;
			}else if(!migr.commonOrderMoneyAndAmountValidateNotNegativeFloat("newVipPrice",$p)){
				return ;
			}else if(!migr.commonOrderMoneyAndAmountValidateNotNegativeFloat("newVipPrice1",$p)){
				return ;
			}else if(!migr.commonOrderMoneyAndAmountValidateNotNegativeFloat("newVipPrice2",$p)){
				return ;
			}else if(!migr.commonOrderMoneyAndAmountValidateNotNegativeFloat("newVipPrice3",$p)){
				return ;
			}else if(!migr.commonOrderMoneyAndAmountValidateNotNegativeFloat("newVipPrice4",$p)){
				return ;
			}else if(!migr.commonOrderMoneyAndAmountValidateNotNegativeFloat("newVipPrice5",$p)){
				return ;
			}else{
				migr.commSaveOrder($(obj));
			}
		}
		,
	});
})(jQuery,migr);