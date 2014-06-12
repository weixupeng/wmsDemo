(function(){
	this.migr = {
		test:function(args,$p){
			alert('code:'+$("[name='branchCode']",$p).val());
			alert('name:'+$("[name='branchStr']",$p).val());
			alert('addValue:'+$(".add",$p).text());
			alert(args);
			alert($p);
		},
		//弃审 统一调用方法
		commDisApprove:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			alertMsg.confirm("确认放弃审核?此操作将使该单据还原至未审核状态.", {
	    		okCall: function(){
	    			var url = $("#disApproveUrl",$p).val();
	    			jQuery.ajax({
		        		type:"POST",
		        		url: url,
		        		dataType: "json",
		        		async: false,
		        		success: function(data) {
		        			if(data.statusCode=="300"){
		        				alertMsg.error(data.message);
		        			}else{
		        				alertMsg.info(data.message);
		        				migr.commRefreshOrder(obj);
		        			}
		        		}
		        	});
	    		}
	    	});
		},
		//扫描调用方法
		goodCodeScan:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var $goodCode = $("#goodCode",$p);
			var $amout = $("#amout",$p);
			var $type=$("#type",$p);
			if($type.val()!='0'){//假如不是按商品编码来扫描  需要处理下
				url=$("#remoteUrl",$p).val();
				jQuery.ajax({
	        		type:"POST",
	        		url: url,
	        		data:$(obj).serialize(),
	        		dataType: "json",
	        		async: false,
	        		success: function(data) {
	        			var gcValue = data.message;//消息存放的是商品编码
	    				var amoutValue = $amout.val();
	    				if(gcValue){
	    					if(!amoutValue || !amoutValue.trim().isNumber()){
	    						amoutValue = 1;
	    					}
	    					$.bringBack($(obj),{goodCode:gcValue,goodNum:amoutValue},false);
	    				}
	        		}
	        	});
			}else{
				var gcValue = $goodCode.val();
				var amoutValue = $amout.val();
				if(gcValue){
					if(!amoutValue || !amoutValue.trim().isNumber()){
						amoutValue = 1;
					}
					$.bringBack($(obj),{goodCode:gcValue,goodNum:amoutValue},false);
				}
			}
			 $goodCode.val("");//清空商品编号
			 $goodCode.focus();//聚焦
			return false;
		}
		,commClearInput:function(obj,attrName){
			var $p = $(obj).parents(".unitBox:first");
			if($(obj).val()==""){
				$("input[name='"+attrName+"']",$p).val("");
			}
		},
		/*********通用方法  orderType 必须用ID标识 orderNo必须用id标识 form ID必须为 orderForm ************/
		commValidateDetailSize:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			if($("#detailSize",$p).val()<1){
				alertMsg.error('明细不能为空');
				return false;
			}else{
				return true;
			}
		},
		//打开单据  打开标志为 newOrder=2
		//list页面 href="javascript:jQuery.bringBack({orderNo:'$!c.orderNo',orderNoName:'specorder.orderNo'})"
		commOpenOrder:function(args,$p){
			var orderNo = args['orderNo'];
			var orderNoName = args['orderNoName'];
			var str=orderNoName+"="+orderNo+"&newOrder=2";
			if($("#orderType",$p)&&$("#orderType",$p).size()>0)
			{
				str = str +"&"+ $("#orderType",$p).attr("name")+"="+$("#orderType",$p).val();
			}
//			alert(str);
			jQuery.pdialog.reload($("#refreshUrl",$p).val(),{dialogId:$("#dialogId",$p).val(),data:str});
		},
		//新建单据 orderType 必须用ID标识 新建标识为 newOrder=1
		commNewOrder:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var url=$("#refreshUrl",$p).val();
			var str = "newOrder=1";
//			alert($("#orderType",$p).size());
			if($("#orderType",$p)&&$("#orderType",$p).size()>0)
			{
				str = str +"&"+ $("#orderType",$p).attr("name")+"="+$("#orderType",$p).val();
			}
			//新建单据 跳转到初始的新增页面
			$.pdialog.reload(url,{dialogId:$("#dialogId",$p).val(),data:str});
		},
		//刷新页面
		commRefreshOrder:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var url=$("#refreshUrl",$p).val();
			jQuery.pdialog.reload(url,{dialogId:$("#dialogId",$p).val(),data:$("#orderForm",$p).serialize()});
		},
		//刷新页面
		commRefreshOtherOrder:function(obj,formName){
			var $p = $(obj).parents(".unitBox:first");
			var url=$("#refreshUrl",$p).val();
			jQuery.pdialog.reload(url,{dialogId:$("#dialogId",$p).val(),data:$("#"+formName,$p).serialize()});
		},
		//保存单据
		commSaveOrder:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			if($("#dialogId",$p).val()!="prom_awardorder2" && $("#detailSize",$p).val()<1){
				alertMsg.error('明细不能为空');
				return ;
			}
			alertMsg.confirm("确认保存？", {
				okCall: function(){
					$("#orderForm",$p).submit();
				}
			});
		},
		//通用表单提交确认
		commomFormSaveConfirm:function(obj,formName,confirmTitle){
			var $p = $(obj).parents(".unitBox:first");
			alertMsg.confirm(confirmTitle||"确认保存？", {
				okCall: function(){
					$(formName||"#orderForm",$p).submit();
				}
			});
		},
		comSubmit:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var pagerForm=$("#pagerForm",$p);
			var orderForm=$("#orderForm",$p);
			if(pagerForm&&pagerForm.attr("action")){
				pagerForm.submit();
			}else if(orderForm&&orderForm.attr("action")){
				orderForm.submit();
			}
		}
		,
		//form 表单提交后执行的方法 orderNo必须用id标识  id="orderNo"
		commFormDone:function(data,obj){
			var $p = $(obj).parents(".unitBox:first");
			var url=$("#refreshUrl",$p).val();
			Bird.ajaxDone(data);
			//删除单据时,后台会将orderNo置为 none 
			if(data.statusCode=="200"){
				if(data.orderNo!="none"){
					var name=$("#orderNo",$p).attr("name");
					//不等于none 根据单据号加载单据
					$.pdialog.reload(url,{dialogId:$("#dialogId",$p).val(),data:name+'='+data.orderNo});
				}else{
					//跳转到新建页面
					//$.pdialog.reload(url,{dialogId:$("#dialogId",$p).val(),data:'deliverorder.orderType='+ $("input[name='deliverorder.orderType']",$p).val()});
					migr.commNewOrder(obj);
				}
			}
		},
		//删除主单据
		commDeleteOrder:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			if($("#state",$p).val()=="0"){
				alertMsg.confirm("确认删除？", {
		    		okCall: function(){
		    			$("#orderForm",$p).attr("action",$("#dropUrl",$p).val());
						$("#orderForm",$p).submit();
		    		}
		    	});
			}else{
				alertMsg.error('无法删除单据.');
			}
		},
		//删除明细
		commDeleteDetail:function (obj){
			var $p = $(obj).parents(".unitBox:first");
			$ids = $("input[name='ids']:checked",$p);
			if($ids.length<1){
				alertMsg.error('未选择明细,不能删除');
				return ;
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
		        			if(data.statusCode=="300"){
		        				alertMsg.error(data.message);
		        			}else{
		        				alertMsg.correct(data.message);
		        				jQuery.pdialog.reload(refreshUrl,{dialogId:$("#dialogId",$p).val(),data:$("#orderForm",$p).serialize()});
		        			}
		        		}
		        	});
				}
			});
		},
		//添加明细
		commAddDetail:function(args,$p){
			var codes = args['goodCode'];
			var amount = args['goodNum'];
			if(amount==undefined){
				amount=0;
			}
			if(jQuery(".inBranchName",$p).val()!=undefined&&jQuery(".inBranchName",$p).val()==''){
				alert("请选择调入仓库");
				return false;
			}
			if(jQuery(".outBranchName",$p).val()!=undefined&&jQuery(".outBranchName",$p).val()==''){
				alert("请选择调出仓库");
				return false;
			}
			var url=$("#addDetailUrl",$p).val()+"?goodCodes="+codes+"&amount="+amount;
			var refreshUrl=$("#refreshUrl",$p).val();
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
		//查询页面  昨天 今天 上月 等操作调用此方法  obj为 this  str1为搜索条件开始日期input id  str2 为截止日期 input id
		changeSearchDate:function(obj,str1,str2){
			$p = $(obj).parents(".unitBox:first");
			$("#"+str1,$p);
			if($(obj).val()=="yesterday"){
				$("#"+str1,$p).val(getYesterday());
				$("#"+str2,$p).val(getYesterday());
			}
			if($(obj).val()=="today"){
				$("#"+str1,$p).val(getToday());
				$("#"+str2,$p).val(getToday());
			}
			if($(obj).val()=="lastWeek"){
				$("#"+str1,$p).val(getLastWeekStartDate());
				$("#"+str2,$p).val(getLastWeekEndDate());
			}
			if($(obj).val()=="thisWeek"){
				$("#"+str1,$p).val(getWeekStartDate());
				$("#"+str2,$p).val(getWeekEndDate());
			}
			if($(obj).val()=="lastMonth"){
				$("#"+str1,$p).val(getLastMonthStartDate());
				$("#"+str2,$p).val(getLastMonthEndDate());
			}
			if($(obj).val()=="thisMonth"){
				$("#"+str1,$p).val(getMonthStartDate());
				$("#"+str2,$p).val(getMonthEndDate());
			}
			if($(obj).val()=="lastQuarter"){
				$("#"+str1,$p).val(getLastQuarterStartDate());
				$("#"+str2,$p).val(getLastQuarterEndDate());
			}
			if($(obj).val()=="thisQuarter"){
				$("#"+str1,$p).val(getQuarterStartDate());
				$("#"+str2,$p).val(getQuarterEndDate());
			}
		},
		/****************审核***************************/
		//return true 表示通过校验 继续执行
		validateForApprove:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			if($("input[name='adjustprice.orderNo']",$p).val()==""){
				alertMsg.error('单据尚未保存,不支持审核操作');
				return false;
			}
			if($("#state",$p).val()!="0"){
				alertMsg.error('该单据不支持审核操作');
				return false;
			}
			return true;
		},
		//提交审批页面表单
		approveOrder:function(obj,flag){
			var $p = $(obj).parents(".unitBox:first");
			if(flag=="1"){
				$("#isAgree",$p).val("1");
			}
			alertMsg.confirm("确认审批？", {
				okCall: function(){
					$("#approveForm",$p).submit();
				}
			});
		},
		//审批回调方法
		checkCallBack:function(btn,state){
			alert(state+","+$(btn).text());
		},
		checkPurchFormDialogDone:function(data,form){
			var $p = $(form).parents(".unitBox:first");
			Bird.ajaxDone(data);
			//通知
			$.notifyCheckDialog();
		},
		beforApprove:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			if($("#state",$p).val()=="0"){
				return true;
			}else{
				alertMsg.error('无法审核单据.');
				return false;
			}
		},
		// 特殊字符的校验
		commonCheckStr:function(obj){
			var flag=true;
			if(!CheckStr($(obj).val())){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("有特殊字符",{okCall: function(){$(obj).focus();}});
				flag=false;
			}
			migr.commonDealOldValueAndNewValue(obj,flag);
			return flag;
		},
		//校验编码
		commonGeneratorCode:function(obj){
			var flag=true;
			if($(obj).val()=='0'){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("编码不能是0",{okCall: function(){$(obj).focus();}});
				flag=false;
			}
			if(!new RegExp(/^[A-Za-z0-9\-\_]*$/).test($(obj).val())){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("编码只能由数字,字母,_,-,组成的字符串",{okCall: function(){$(obj).focus();}});
				flag=false;
			}
			migr.commonDealOldValueAndNewValue(obj,flag);
			return flag;
		},
		// 合法数字的校验
		commonFormatNumber:function(obj,bitNum){
			var flag=true;
			if(!$(obj).val().isNumber()){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("请输入合法的数字",{okCall: function(){$(obj).focus();}});
				flag=false;
			}
			migr.commonDealOldValueAndNewValue(obj,flag);
			return flag;
		},
		// 纯数字的校验
		commonDigital:function(obj){
			var flag=true;
			if(!new RegExp(/^[0-9]*$/).test($(obj).val())){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("只能输入纯数字",{okCall: function(){$(obj).focus();}});
				flag=false;
			}
			migr.commonDealOldValueAndNewValue(obj,flag);
			return flag;
		},
		// 纯26个英文字母（不分大小写）的校验
		commonAlphabet:function(obj){
			var flag=true;
			if(!new RegExp(/^[A-Za-z]*$/).test($(obj).val())){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("只能输入由26个英文字母组成的字符串",{okCall: function(){$(obj).focus();}});
				flag=false;
			}
			migr.commonDealOldValueAndNewValue(obj,flag);
			return flag;
		}
		,
		// 纯26个英文字母（不分大小写）和（0-9）数字的校验
		commonAlphabetAndDigital:function(obj){
			var flag=true;
			if(!new RegExp(/^[A-Za-z0-9]*$/).test($(obj).val())){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("只能输入由数字和26个英文字母组成的字符串",{okCall: function(){$(obj).focus();}});
				flag=false;
			}
			migr.commonDealOldValueAndNewValue(obj,flag);
			return flag;
		},
		// 整数的校验
		commonInteger:function(obj){
			var flag=true;
			if(!$(obj).val().isInteger()){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("请输入合法整数",{okCall: function(){$(obj).focus();}});
				flag=false;
			}
			migr.commonDealOldValueAndNewValue(obj,flag);
			return flag;
		},
		// 正整数的校验
		commonPositiveInteger:function(obj){
			var flag=true;
			if(!$(obj).val().isPositiveInteger()){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("请输入合法正整数",{okCall: function(){$(obj).focus();}});
				flag=false;
			}
			migr.commonDealOldValueAndNewValue(obj,flag);
			return flag;
		},
		// 非负整数的校验
		commonNotNegativeInteger:function(obj,errormessage){
			var flag=true;
			if(!$(obj).val().isNotNegativeInteger()){
				$(obj).focus();
				$(obj).addClass("error");
				if(errormessage==undefined||errormessage==''){
					errormessage="请输入合法非负整数";
				}
				alertMsg.error(errormessage,{okCall: function(){$(obj).focus();}});
				flag=false;
			}
			migr.commonDealOldValueAndNewValue(obj,flag);
			return flag;
		},
		// 实数的校验
		commonFloat:function(obj,errormessage){
			var flag=true;
			if(!$(obj).val().isFloat()){
				$(obj).focus();
				$(obj).addClass("error");
				if(errormessage==undefined||errormessage==''){
					errormessage="请输入合法的实数";
				}
				alertMsg.error(errormessage,{okCall: function(){$(obj).focus();}});
				flag=false;
			}
			migr.commonDealOldValueAndNewValue(obj,flag);
			return flag;
		}
		,
		// 正实数的校验
		commonPositiveFloat:function(obj,errormessage){
			var flag=true;
			if(!$(obj).val().isPositiveFloat()){
				$(obj).focus();
				$(obj).addClass("error");
				if(errormessage==undefined||errormessage==''){
					errormessage="请输入合法的正数";
				}
				alertMsg.error(errormessage,{okCall: function(){$(obj).focus();}});
				flag=false;
			}
			migr.commonDealOldValueAndNewValue(obj,flag);
			return flag;
		},
		// 非负数的校验
		commonNotNegativeFloat:function(obj,errormessage){
			var flag=true;
			if(!$(obj).val().isNotNegativeFloat()){
				$(obj).focus();
				$(obj).addClass("error");
				if(errormessage==undefined||errormessage==''){
					errormessage="请输入合法的非负数";
				}
				alertMsg.error(errormessage,{okCall: function(){$(obj).focus();}});
				flag=false;
			}
			migr.commonDealOldValueAndNewValue(obj,flag);
			return flag;
		},
		commonClear:function(obj){
			var $this = $(obj);
			var rul = $this.attr("rule");
			if(rul){
				$(rul).val("");
			}
			return false;
		},
		// 合法电子邮件的校验
		commonEmail:function(obj){
			var flag=true;
			if(!$(obj).val().isValidMail()){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("请输入合法电子邮件",{okCall: function(){$(obj).focus();}});
				flag=false;
			}
			migr.commonDealOldValueAndNewValue(obj,flag);
			return flag;
		},
		// 合法的移动电话的校验
		commonMobile:function(obj){
			var flag=true;
			if(!$(obj).val().isMobileCommon()){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("请输入合法的手机号",{okCall: function(){$(obj).focus();}});
				flag=false;
			}
			migr.commonDealOldValueAndNewValue(obj,flag);
			return flag;
		},
		// 合法的固定电话的校验
		commonTel:function(obj){
			var flag=true;
			if(!$(obj).val().isTelCommon()){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("请输入合法的固定电话",{okCall: function(){$(obj).focus();}});
				flag=false;
			}
			migr.commonDealOldValueAndNewValue(obj,flag);
			return flag;
		},
		// 合法网址的校验
		commonUrl:function(obj){
			var flag=true;
			if(!$(obj).val().isUrl()){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("输入合法网址",{okCall: function(){$(obj).focus();}});
				flag=false;
			}
			migr.commonDealOldValueAndNewValue(obj,flag);
			return flag;
		},
		//处理恢复值的功能
		commonDealOldValueAndNewValue:function(obj,flag){
			var oldValue=$(obj).attr("oldValue");
			if(!flag){
				window.setTimeout(function(){$(obj).removeClass("error");}, 2000);
				if(oldValue!=undefined)
					$(obj).val($(obj).attr("oldValue"));
				return ;
			}
			if(oldValue!=undefined)
				$(obj).attr("oldValue",$(obj).val());
		}
		,
		commonShowHideClear:function(obj,showJqObj,clearJqObj){
			var $p = $(obj).parents(".unitBox:first");
			if(clearJqObj){
				$(clearJqObj).val('');
			}
			var $hgp = $(showJqObj,$p);
			if($(obj).val()==""){
				$hgp.hide();
			}else{
				$hgp.show();
			}
		},commonShowHideCheck:function(obj,showJqObj,nocheckJqObj){
			var $p = $(obj).parents(".unitBox:first");
			if(nocheckJqObj){
				$(nocheckJqObj).removeAttr("checked");
			}
			var $hgp = $(showJqObj,$p);
			if($(obj).val()==""){
				$hgp.hide();
			}else{
				$hgp.show();
			}
		}
	};
})();
//检查特殊字符
function CheckStr(str){
    var myReg = /^[^@\/\'\\\"#$%&\^\*]+$/;
    if(myReg.test(str)) return true; 
    return false; 
}
//添加收藏夹
function addFavorite(url, title) {
	if (document.all) {
		window.external.addFavorite(url, title);
	} else if (window.sidebar) {
		window.sidebar.addPanel(title, url, "");
	}
}

// 浮点数加法运算
function floatAdd(arg1, arg2) {
	var r1, r2, m;
	try{
		r1 = arg1.toString().split(".")[1].length;
	} catch(e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch(e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2));
	return (arg1 * m + arg2 * m) / m;
}

// 浮点数减法运算
function floatSub(arg1, arg2) {
	var r1, r2, m, n;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch(e) {
		r1 = 0
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch(e) {
		r2 = 0
	}
	m = Math.pow(10, Math.max(r1, r2));
	n = (r1 >= r2) ? r1 : r2;
	return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

// 浮点数乘法运算
function floatMul(arg1, arg2) {
	var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
	try {
		m += s1.split(".")[1].length;
	} catch(e) {}
	try {
		m += s2.split(".")[1].length;
	} catch(e) {}
	return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

// 浮点数除法运算
function floatDiv(arg1, arg2) {
	var t1 = 0, t2 = 0, r1, r2;    
	try {
		t1 = arg1.toString().split(".")[1].length;
	} catch(e) {}
	try {
		t2 = arg2.toString().split(".")[1].length;
	} catch(e) {}
	with(Math) {
		r1 = Number(arg1.toString().replace(".", ""));
		r2 = Number(arg2.toString().replace(".", ""));
		return (r1 / r2) * pow(10, t2 - t1);
	}
}

// 设置数值精度
function setScale(value, scale, roundingMode) {
	if (roundingMode.toLowerCase() == "roundhalfup") {
		return (Math.round(value * Math.pow(10, scale)) / Math.pow(10, scale)).toFixed(scale);
	} else if (roundingMode.toLowerCase() == "roundup") {
		return (Math.ceil(value * Math.pow(10, scale)) / Math.pow(10, scale)).toFixed(scale);
	} else {
		return (Math.floor(value * Math.pow(10, scale)) / Math.pow(10, scale)).toFixed(scale);
	}
}
