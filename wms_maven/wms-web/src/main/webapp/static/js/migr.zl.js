/*
 * 此js文件需要放置在migr.js之后
 */
(function($,migr){
	$.extend(migr,{
		//这里写自己定义的方法，方法之间用逗号分割，如bage:function(){},bage:function(){}
		//调用时：migr.test();migr.test2();
		example_zl:function(args,$p,lookupBtn){
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
		dealDeliverorderForSomeBranchAllStock:function(btn){
			var $lookBtn = $(btn);
			var $p = $lookBtn.parents(".unitBox:first");
			var inBranchCode = $("input[name='deliverorder.inBranchCode']",$p).val();
			if(inBranchCode==''){
				alertMsg.error("请选择调入仓库！");
				return ;
			}
			var outBranchCode = $("input[name='deliverorder.outBranchCode']",$p).val();
			if(outBranchCode==''){
				alertMsg.error("请选择调出仓库！");
				return ;
			}
			var refreshUrl=$("#refreshUrl",$p).val();
			var url=$("#dealAllStockFromDeliverorderUrl",$p).val();
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
			return true;
		},
		batchCheckLogConfig:function(obj){//checkbox序列化的时候 只提交已选中的（所有没办法）
			var $p = $(obj).parents(".unitBox:first");
			var flag="";
			var tname="";
			$ids=$("input[name='ids']",$p);
			if($(obj).attr("checked")){
				flag=1;
				$ids.each(function(){
					var $this = $(this);
					tname=tname+$this.val()+":";
					$this.attr("checked",true);
				});
			}else{
				$ids.each(function(){
					var $this = $(this);
					tname=tname+$this.val()+":";
					$this.attr("checked",false);
				});
			}
			jQuery.ajax({
	    		type:"POST",
	    		url: $("#dealBatchLogConfigUrl",$p).val(),
	    		dataType: "json",
	    		data:"checked="+flag+"&tname="+tname,
	    		async: false,
	    		success: function(data) {
	    		}
	    	});
		},
		//添加到缓存 
		addAdver:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var $posId=$("#posId",$p).val();
			var message=$("#message",$p).val();
			var $tnameList=$("input[for='out']:checked",$p);
			var $datapart="";
			$tnameList.each(function(){
				var $this = $(this);
				$datapart=$datapart+"&ids="+$this.val();
			});
			jQuery.ajax({
	    		type:"POST",
	    		url:$("#addUrl",$p).val(),
	    		dataType: "json",
	    		data:"posId="+$posId+$datapart,
	    		async: false,
	    		success: function(data) {
	    			var url=$("#refreshUrl",$p).val();
	    			url=url+"?messageType="+message+"&posId="+$posId;
	    			$.pdialog.reload(url,{dialogId:"adver_rollingnews"});
	    		}
	    	});
		},
		//清除缓存
		remoAdver:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var $posId=$("#posId",$p).val();
			var message=$("#message",$p).val();
			var $tnameList=$("input[for='in']:checked",$p);
			var $datapart="";
			$tnameList.each(function(){
				var $this = $(this);
				$datapart=$datapart+"&ids="+$this.val();
			});
			jQuery.ajax({
	    		type:"POST",
	    		url:$("#removeUrl",$p).val(),
	    		dataType: "json",
	    		data:"posId="+$posId+$datapart,
	    		async: false,
	    		success: function(data) {
	    			var url=$("#refreshUrl",$p).val();
	    			url=url+"?messageType="+message+"&posId="+$posId;
	    			$.pdialog.reload(url,{dialogId:"adver_rollingnews"});
	    		}
	    	});
		},
		//校验编码，添加成员时加限制
		commonMessagegroupCode:function(obj){
			var flag=true;
			if($(obj).val()=='12101' || $(obj).val()=='12102'){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("编码不能是:"+$(obj).val(),{okCall: function(){$(obj).focus();}});
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
		//校验编码
		screenCode:function(obj){
			var flag=true;
			if(!new RegExp(/^[A-Za-z0-9\-\_]*$/).test($(obj).val())){
				$(obj).focus();
				$(obj).addClass("error");
				alertMsg.error("编码只能由数字,字母,_,-,组成的字符串",{okCall: function(){$(obj).focus();}});
				flag=false;
			}
			migr.commonDealOldValueAndNewValue(obj,flag);
			return flag;
		},
		//批量添加自定义组成员是，判断是否选中自定义组成员
		beforememberChoose:function(btn){
			var $lookBtn = $(btn);
			var $p = $lookBtn.parents(".unitBox:first");
			
			var inMessagememberCode = $("input[name='type']",$p).val();
			if(inMessagememberCode==''){
				alertMsg.error("请选择自定义组成员！");
				return false;
			}
			if(inMessagememberCode=='12102'){
				alertMsg.error("请选择自定义组成员！");
				return false;
			}
			return true;
		},
		//短信成员自定义组批量添加时，点击单个checkbox时，选中的数据存入Session()
		messagememberdatail:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var flag="";
			var type=$("#messagememberType",$p).val();
			if($(obj).attr("checked")){
				flag=1;	
			}else{
				flag=0;
			}
			var code=$(obj).val();
			var url=$("#addmemberUrl",$p).val();
			jQuery.ajax({
	    		type:"POST",
	    		url: url+"?flag="+flag+"&type="+type+"&codes="+code,
	    		dataType: "json",
	    		data:null,
	    		async: false,
	    		success: function(data) {
	    		}
	    	});
		},
		//短信成员自定义组批量添加时，点击全选按钮时，所有选中的数据存入Session()
		messagememberdatailCtrl:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var flag="";
			var type=$("#messagememberType",$p).val();
			if($(obj).attr("checked")){
				flag=1;	
			}else{
				flag=0;
			}	
			var $tnameList=$("input[name='in']",$p);
			var $datapart="";
			$tnameList.each(function(){
				var $this = $(this);
				if(flag==1){
					$this.attr("checked",true);
				}else{
					$this.attr("checked",false);
				}
				$datapart=$datapart+"&codes="+$this.val();
			});
			var url=$("#addmemberUrl",$p).val();
			jQuery.ajax({
	    		type:"POST",
	    		url: url+"?flag="+flag+"&type="+type+$datapart,
	    		dataType: "json",
	    		data:null,
	    		async: false,
	    		success: function(data) {
	    		}
	    	});
		},

		automaticsending:function(obj){ 
			var $p = $(obj).parents(".unitBox:first");
			var $vipcategoryDiv = $("#vipcategory",$p);
			$("#curTab",$p).val("vipcategoryTab");
			$vipcategoryDiv.loadUrl($(obj).attr("objUrl"),'',function(){$vipcategoryDiv.find("[layoutH]").layoutH();});//展示控件初始化},'POST');
		},
		
		//批量删除短信自定义组成员
		commDeleteMember:function(obj){ 
			var $p = $(obj).parents(".unitBox:first");
			$ids = $("input[name='ids']:checked",$p);
			if($ids.length<1){
				alertMsg.error('请选择信息成员');
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
		        				migr.commonRefresh($(obj));
		        			}
		        		}
		        	});
				}
			});
		},
		//添加联系人
		addChooseMember:function(obj){
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
	})
})(jQuery,migr);