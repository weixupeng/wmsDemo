/*
 * 此js文件需要放置在migr.js之后
 */
var procc_id;
(function($,migr){
	$.extend(migr,{
		//这里写自己定义的方法，方法之间用逗号分割，如bage:function(){},bage:function(){}
		//调用时：migr.test();migr.test2();
		dealBatchForAgent:function(args,$p,lookupBtn){
			var code = args['code'];
			var name =args['name'];
			var lastBatch=args['lastBatch'];
			var maxBatch=parseInt(lastBatch);
			var $serislPrint=$("#serislPrint",$p);
			$serislPrint.empty();
			for(var i=maxBatch;i>0;i--){
				if(i==maxBatch){
					$serislPrint.append('<option value='+i+' selected=selected >第'+i+'批</option>');
				}
				else {
					$serislPrint.append('<option value='+i+'>第'+i+'批</option>');
				}
		   }
			$("#serislPrintDiv",$p).attr("style","display:block");
		},
		//在添加order_add.vm中通过JS脚本setDeliveryType2Session方法将deliveryType放入session中。
		setDeliveryType2Session:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var productTotalPrice=$("#productTotalPrice",$p).val();
			var totalWeight = $("#totalWeight",$p).val();
			var totalWeightUnit=$("#totalWeightUnit",$p).val();
			var url=$(obj).attr("myURL");
			jQuery.ajax({
				type:"POST",
				url: url,
				data:"deliveryType.id="+$(obj).val()+"&productTotalPrice="+productTotalPrice+"&totalWeight="+totalWeight+"&totalWeightUnit="+totalWeightUnit,
				dataType: "json",
				async: false,
				success: function(data) {
					$("#deliveryFee",$p).val(setScale(data.deliveryFee,2, "roundhalfup"));
					$("#totalAmount",$p).val(setScale(floatAdd(data.deliveryFee,productTotalPrice),2, "roundhalfup"));
				}
			});
		},
		//初始化物流公司和物流编号。
		initDelivery:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var deliverySn = $("#deliverySn",$p).val();
			var deliveryCorpId = $("#deliveryCorpId",$p).val();
			var url=$(obj).attr("myUrl");
					jQuery.ajax({
						type:"POST",
						url: url,
						data:"shipping.deliveryCorpId="+deliveryCorpId.replace(/^\s+|\s+$/g,"")+"&shipping.deliverySn="+deliverySn.replace(/^\s+|\s+$/g,""),
						dataType: "json",
						async: false,
					});
		},
		//密码校验
		requiredPwd:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var pwd = $("#pwd",$p).val();
			var repwd = $("#repwd",$p).val();
			if(pwd!=repwd){
				alertMsg.error("密码不一致，请重新输入", {okCall: function(){$("#repwd",$p).focus();}});
				$("#repwd",$p).val("");
				return;
			}
		},
		
		//获取手机激活码
		getActivationCode:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var $activationCodeDiv=$("#activationCodeDiv",$p);
			var $activationCode=$("#activationCode",$p);
			$activationCodeDiv.attr("style","dispaly:block");
			$(obj).attr("style","color:#8E8E8E").attr("onclick",null);
		},
		//提交导出基础数据表单
		checkPwd:function(obj,today){
			var $p = $(obj).parents(".unitBox:first");
			var $downloadPath=$("#downloadPath",$p);
			var $tnameList=$("input[name='tnameList']:checked",$p);
			var $datapart="";
			$tnameList.each(function(){
				var $this = $(this);
				$datapart=$datapart+"&tnameList="+$this.val();
			});
			var $Pwd=$("#Pwd",$p);
			if(today==$Pwd.val()&&$datapart.length!=0){
				jQuery.ajax({
					type:"POST",
					url: $(obj).attr("myurl")+"/sys/data!reportPrint.do",
					data:$datapart.substr(1),
					dataType: "json",
					async: false,
					success: function(data) {
						var url=$(obj).attr("myurl")+"/sys/data!download.do";
						window.open(url+"?fname="+data.fileName);
						jQuery.ajax({
							type:"post",
							url: url,
							data:"fname="+data.fileName,
							async: false
						});
					}
				});
			}else if(today!=$Pwd.val()){
				alertMsg.error("特殊操作密码错误，请重新输入");
				$Pwd.val("");
				$Pwd.focus();
			}else{
				alertMsg.error("未选择操作数据！");
			}
		},
		//提交导入的sql文件
		formSubmit:function(obj,today){
			var $p = $(obj).parents(".unitBox:first");
			var $uploadPathForm=$("#uploadPathForm",$p);
			var $Pwd=$("#Pwd",$p);
			if(today==$Pwd.val()){
				alertMsg.confirm("此操作会覆盖原数据,是否继续!",{
					okCall: function(){
						$("span[id^='progressBar_']",$p).attr("style","display:none;background-color:#00BB00;");
						procc_id=window.setInterval("migr.getProcc()",1000);
						$uploadPathForm.submit();
						}
					});
			}else{
				alertMsg.error("特殊操作密码错误，请重新输入");
				$Pwd.val("");
				$Pwd.focus();
			}
		},
		//清空数据
		cleanData:function(obj,today){
			var $p = $(obj).parents(".unitBox:first");
			var $Pwd=$("#Pwd",$p);
			var isPart=$("#isPart",$p).attr("checked");
			var url=$(obj).attr("myurl");
			var isPartClean;//是否是部分清除
			if(isPart)
				isPartClean=0;//保留基本档案
			else
				isPartClean=1;//全部清除
			if(today==$Pwd.val()){
				alertMsg.confirm("此操作将会"+(isPartClean==0?"保留基本档案数据":"清空所有数据")+"!是否继续?",{
					okCall: function(){
						jQuery.ajax({
							type:"post",
							url: url,
							data:"isAllClean="+isPartClean,
							async: false,
							success:function(data){
								alertMsg.correct("正在清除数据，请等待！");
								$("#proccvideoDiv",$p).attr("style","display:block");
								procc_id=window.setInterval("migr.getProcc()",1000);
							}
						});
					}
				});
			}else{
				alertMsg.error("特殊操作密码错误，请重新输入");
				$Pwd.val("");
				$Pwd.focus();
			}
		},
		//进度条
		getProcc:function(){
			 var $p = $("body").data("sys_data");
			 var strFullPath=window.document.location.href;        
			 var strPath=window.document.location.pathname;     
			 var pos=strFullPath.indexOf(strPath);                       
			 var prePath=strFullPath.substring(0,pos);                 
			 var postPath=strPath.substring(0,strPath.substr(1).indexOf('/')+1);       
			 var path = prePath+postPath;
			$.ajax({
				type:"post",
				url:path+"/sys/data!getUploadProcc.do",
				dataType: "json",
				async: false,
				success:function(data){
					var $progressBarSpans=$("span[id^='progressBar_']",$p);
					$progressBarSpans.each(function(){
						var $this = $(this);
						var t=$this.attr("id").toString().split("_")[1];
						var i=parseFloat(t);
						if(data.procc*72/100>=i){
							$this.attr("style","background-color:#00BB00;");
						}
					});
					if(data.procc>=100){
						alertMsg.correct("导入成功！");
						window.clearInterval(procc_id);
						procc_id=null;
					}
					if(data.procc==1){
						$("#proccvideoDiv",$p).attr("style","display:none");
						alertMsg.correct("清除成功！");
						window.clearInterval(procc_id);
						procc_id=null;
					}
				}
			});
		},
		//添加pos双频设置
		addPossetup:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var $addPossetup=$("a[name='addPossetup']",$p);
			var $posCode=$("input[name='possetup.posCode']",$p).val();
			var $adverType=$("input[name='possetup.adverType']:checked",$p).val();
			if($posCode==""||$posCode==null||$posCode==undefined){
				alertMsg.error("请选择pos机!", {okCall: function(){$("input[name='possetup.posCode']",$p).focus();}});
			}else if($adverType==""||$adverType==null||$adverType==undefined){
				alertMsg.error("请选择媒体类型!");
			}else{
				$addPossetup.attr("href",$addPossetup.attr("myurl")+"?possetup.posCode="+$posCode+"&possetup.adverType="+$adverType+"&isSubmit=0");
				$addPossetup.trigger("click");
			}
			
		},
		possetupFormSubmit:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var posCode=$("input[name='possetup.posCode']",$p).val();
			var adverType=$("input[name='possetup.adverType']:checked",$p).val();
			if(posCode==""||posCode==null||posCode==undefined){
				alertMsg.error("请选择pos机!", {okCall: function(){$("input[name='possetup.posCode']",$p).focus();}});
			}else if(adverType==""||adverType==null||adverType==undefined){
				alertMsg.error("请选择媒体类型!");
			}else{
				var dialogId=$("#dialogId",$p).val();
				navTab.reload($("#pagerForm",navTab.getCurrentPanel()).attr("action")+"?isSubmit=0",{navTabId:dialogId,fresh:true,data:$("#pagerForm",navTab.getCurrentPanel()).serialize()});
			}
		},
		zzFormSubmit:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var $posCode=$("input[name='possetup.posCode']",$p).val();
			var $adverType=$("input[name='possetup.adverType']:checked",$p).val();
			if($posCode==""||$posCode==null||$posCode==undefined){
				alertMsg.error("请选择pos机!", {okCall: function(){$("input[name='possetup.posCode']",$p).focus();}});
			}else if($adverType==""||$adverType==null||$adverType==undefined){
				alertMsg.error("请选择媒体类型!");
			}else{
				var dialogId=$("#dialogId",$p).val();
				navTab.reload($("#pagerForm",navTab.getCurrentPanel()).attr("action")+"?isSubmit=1",{navTabId:dialogId,fresh:true,data:$("#pagerForm",navTab.getCurrentPanel()).serialize()});
			}
		},
		timePagerFormSubmit:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var url=$(obj).attr("myurl");
			var startDate=$("#startDate",$p).val();
			var endDate=$("#endDate",$p).val();
			var startTime=$("#startTime",$p).val();
			var endTime=$("#endTime",$p).val();
			var $tnameList=$("input[name='ids']:checked",$p);
			var $datapart="";
			$tnameList.each(function(){
				var $this = $(this);
				$datapart=$datapart+"&ids="+$this.val();
			});
			if(""==$datapart){
				alertMsg.error("没有选择操作媒体!");
			}else{
				jQuery.ajax({
					type:"post",
					url: url,
					data:"possetup.startDate="+startDate+"&possetup.endDate="+endDate+"&possetup.startTime="+startTime+"&possetup.endTime="+endTime+$datapart,
					async: false,
					success:function(data){
						var $form=$("#pagerForm",$p);
						var url=$form.attr("action");
						var dialogId=$("#dialogId",$p).val();
						navTab.reload(url,{navTabId:dialogId,data:null});
					}
				});
			}

		},
		sendPosCode:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var $sendPosCode=$("a[name='sendPosCode']",$p);
			var $posCode=$("input[name='possetup.posCode']",$p).val();
			if($posCode==""||$posCode==null||$posCode==undefined){
				alertMsg.error("请选择pos机!", {okCall: function(){$("input[name='possetup.posCode']",$p).focus();}});
			}else{
				$sendPosCode.attr("href",$sendPosCode.attr("myurl")+"?possetup.posCode="+$posCode);
				$sendPosCode.trigger("click");
			}
			
		},
		copySetup:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var $posCode=$("#copyPosCode",$p).val();
			var $tnameList=$("input[name='ids']:checked",$p);
			if($tnameList==null||$tnameList.size()<1){
				alertMsg.error("至少要选中一个pos机！");
				return;
			}
			var $datapart="";
			$tnameList.each(function(){
				var $this = $(this);
				$datapart=$datapart+"&posCodes="+$this.val();
			});
			jQuery.ajax({
				type:"post",
				url: $(obj).attr("myurl"),
				data:"possetup.posCode="+$posCode+$datapart,
				dataType:"json",
				async: false,
				success:function(data){
					if(data.statusCode=='300'){
	    				alertMsg.error(data.message);
	    			}else{
	    				alertMsg.correct(data.message);
	    			}
				}
			});
		},
		//会员积分----------------------------
		brandintegralChange:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var brandintegralUrl=$("#brandintegralUrl",$p).val();
			var value=$(obj).val();
			var id=$(obj).attr("tid");
			var colName=$(obj).attr("tcolName");
			$.ajax({
				type:"post",
				url: brandintegralUrl,
				data:"id="+id+"&brandintegral."+colName+"="+value,
				dataType:"json",
				async: false,
				success:function(data){
					alertMsg.correct("修改成功！");
				}
			});
		},
		chooseIntegralFinish:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			$("#pagerForm",$p).submit();
		},
		chooseOneIntegralFinish:function(obj,code){
			var $p = $(obj).parents(".unitBox:first");
			$("#pagerForm",$p).attr("action",$("#pagerForm",$p).attr("action")+"?ids="+code);
			$("#pagerForm",$p).submit();
		},
		startUploadVideo:function(){
			var $p = $("body").data("screen_video_add");
			$("#proccvideoDiv",$p).attr("style","display:block");
			procc_id=window.setInterval("migr.getVideoProcc()",500);
		},
		getVideoProcc:function(){
			 var $p = $("body").data("screen_video_add");
			 var strFullPath=window.document.location.href;        
			 var strPath=window.document.location.pathname;     
			 var pos=strFullPath.indexOf(strPath);                       
			 var prePath=strFullPath.substring(0,pos);                 
			 var postPath=strPath.substring(0,strPath.substr(1).indexOf('/')+1);       
			 var path = prePath+postPath;
			$.ajax({
				type:"post",
				url:path+"/screen/video!getVideoProcc.do",
				data:null,
        		dataType:"json",
				async: false,
				success:function(data){
					if(data.procc==1){
						window.clearInterval(procc_id);
						procc_id=null;
						$("#proccvideoDiv",$p).attr("style","display:none");
						$.get(path+"/screen/video!clearProcc.do");
					}
				}
			});
		},
		//======短信单发========================================
		//双击主题出现界面
		chooseTheme:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			$("#chooseThemeButton",$p).trigger("click");
		},
		//============模块数据管理==============================
		checkModulePwd:function(obj,today){
			var $p = $(obj).parents(".unitBox:first");
			var $downloadPath=$("#downloadPath",$p);
			var $tnameList=$("input[name='moduleNames']:checked",$p);
			var $datapart="";
			$tnameList.each(function(){
				var $this = $(this);
				$datapart=$datapart+"&moduleName="+$this.val();
			});
			var $Pwd=$("#Pwd",$p);
			if(today==$Pwd.val()&&$datapart.length!=0){
				jQuery.ajax({
					type:"POST",
					url: $(obj).attr("myurl")+"/sys/data!getModuleSql.do",
					data:$datapart.substr(1),
					dataType: "json",
					async: false,
					success: function(data) {
						var url=$(obj).attr("myurl")+"/sys/data!download.do";
						window.open(url+"?fname="+data.fileName);
						jQuery.ajax({
							type:"post",
							url: url,
							data:"fname="+data.fileName,
							async: false
						});
					}
				});
			}else if(today!=$Pwd.val()){
				alertMsg.error("特殊操作密码错误，请重新输入");
				$Pwd.val("");
				$Pwd.focus();
			}else{
				alertMsg.error("未选择操作数据！");
			}
		},
		cleanModuleData:function(obj,today){
			var $p = $(obj).parents(".unitBox:first");
			var url=$(obj).attr("myurl");
			var $tnameList=$("input[name='moduleNames']:checked",$p);
			var $datapart="";
			$tnameList.each(function(){
				var $this = $(this);
				$datapart=$datapart+"&fname="+$this.val();
			});
			var $Pwd=$("#Pwd",$p);
			if(today==$Pwd.val()&&$datapart.length!=0){
				jQuery.ajax({
					type:"POST",
					url: url,
					data:$datapart.substr(1),
					dataType: "json",
					async: false,
					success: function(data) {
						alertMsg.correct("操作成功！正在清除数据……");
					}
				});
			}else if(today!=$Pwd.val()){
				alertMsg.error("特殊操作密码错误，请重新输入");
				$Pwd.val("");
				$Pwd.focus();
			}else{
				alertMsg.error("未选择操作数据！");
			}
		},
		cleanModuleDataForTime:function(obj,today){
			var $p = $(obj).parents(".unitBox:first");
			var url=$(obj).attr("myurl");
			var startTime=$("#startTimeDate",$p).val();
			var startHour=$("#startHour",$p).val()+":";
			var startMis=$("#startMis",$p).val();
			var endTime=$("#endTimeDate",$p).val();
			var endHour=$("#endHour",$p).val()+":";
			var endMis=$("#endMis",$p).val();
			var $tnameList=$("input[name='moduleNames']:checked",$p);
			var $datapart="";
			$tnameList.each(function(){
				var $this = $(this);
				$datapart=$datapart+"&fname="+$this.val();
			});
			var $Pwd=$("#Pwd",$p);
			if(today==$Pwd.val()&&$datapart.length!=0){
				jQuery.ajax({
					type:"POST",
					url: url,
					data:$datapart.substr(1)+"&startTime="+startTime+" "+startHour+startMis+"&endTime="+endTime+" "+endHour+endMis,
					dataType: "json",
					async: false,
					success: function(data) {
						alertMsg.correct("清除数据成功！");
					}
				});
			}else if(today!=$Pwd.val()){
				alertMsg.error("特殊操作密码错误，请重新输入");
				$Pwd.val("");
				$Pwd.focus();
			}else{
				alertMsg.error("未选择操作数据！");
			}
		},
		lookup:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			$("#lookupherf",$p).trigger("click");
		},
		removeThisImage:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var $imageUrl=$("#imageUrl",$p);
			var $imageShow=$("#imageShow",$p);
			var defaultUrl=$("#defaultUrl",$p).attr("myurl");
			$imageUrl.val("");
			$imageShow.attr("src",defaultUrl);
		}
	});
})(jQuery,migr);