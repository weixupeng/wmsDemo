/**
 * @author migrsoft.com
 */
(function($){
	$.extend(migr,{
		ptryto:function(btn){
			var $this = $(btn);
			var $p = $this.parents(".unitBox:first");
			var $form = $(".pageForm",$p);
			$("input[name='serKey']",$p).val("01234567890123456789012345");
			$form.attr("action",$form.attr("trytoUrl"));
		},beforeGoodsChoose:function(btn){
			var $lookBtn = $(btn);
			var $p = $lookBtn.parents(".unitBox:first");
			//获取供应商，送货地址，判断是否已经填写
			var supplierCode = $("input[name='purchorder.supplierCode']",$p).val();
			if(supplierCode == ''){
				alertMsg.error("请选择供应商！");
				return false;
			}
			var branchCode = $("input[name='purchorder.branchCode']",$p).val();
			if(branchCode == ''){
				alertMsg.error("请选择送货地址！");
				return false;
			}
			$lookBtn.attr("href",$lookBtn.attr("hrefback")+"&supplierCode="+supplierCode+"&branchcode="+branchCode);
			//修改href进行相应请求
			//$lookBtn.attr("href",$lookBtn.attr("href").replaceAll('&supplierCode=[A-Za-z0-9_]*','')+"&supplierCode="+supplierCode);
			return true;
		},
		addPurchDetail:function(args,$p,lookupBtn){
			var codes = args['goodCode'];
			var amount = args['goodNum'];
			var url=$("#saveDetailUrl",$p).val();
			var refreshUrl=$("#refreshUrl",$p).val();
			var dialogId = $("#dialogId",$p).val();
			$.ajax({
	    		type:"POST",
	    		url: url,
	    		dataType: "json",
	    		data:"goodCodes="+codes+"&amount="+amount+"&purchorder.branchCode="+$("input[name='purchorder.branchCode']",$p).val(),
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
	    				var dialog = $.pdialog.reload(refreshUrl,{dialogId:dialogId,data:$("#orderForm",$p).serialize()});
	    				if(dialog){
	    					var box = dialog.find(".dialogContent");
	    					$.setLookupBox(box);
	    				}
	    			}
	    		}
	    	});
		},
		newPurch:function(btn){//新建单据
			var $p = $(btn).parents(".unitBox:first");
			if($("#noSave",$p).val() == 1){
				alertMsg.confirm("尚未保存单据，是否放弃单据进行新增？",{
					okCall:function(){
						var refreshUrl=$("#refreshUrl",$p).val();
						var dialogId = $("#dialogId",$p).val();
						$.pdialog.reload(refreshUrl,{dialogId:dialogId,data:'newOrder=1'});
					}
				});
			}else{
				var refreshUrl=$("#refreshUrl",$p).val();
				var dialogId = $("#dialogId",$p).val();
				$.pdialog.reload(refreshUrl,{dialogId:dialogId,data:'newOrder=1'});
			}
		},
		refreshPurch:function(data,btn){//刷新purchForm页面
			var $p = $(btn).parents(".unitBox:first");
			var refreshUrl=$("#refreshUrl",$p).val();
			var dialogId = $("#dialogId",$p).val();
			$.pdialog.reload(refreshUrl,{dialogId:dialogId,data:$("#orderForm",$p).serialize()});
		},
		dialogPurchFormDone:function(data,form){//form提交后的回调函数
			var $p = $(form).parents(".unitBox:first");
			var url=$("#refreshUrl",$p).val();
			var dialogId = $("#dialogId",$p).val();
			Bird.ajaxDone(data);
			//有单据则根据orderNo进行加载，无则新增页面 
			$.pdialog.reload(url,{dialogId:dialogId,data:'newOrder=1&purchorder.orderNo='+data.orderNo});
		},
		checkPurchDetail:function(btn){
			var $p = $(btn).parents(".unitBox:first");
			var detailSize = $("#detailSize",$p).val();
			if(!detailSize || detailSize < 1){
				alertMsg.error("没有输入单据的明细内容，不能保存！如果你想不保存退出请关闭本窗口！");
				return false;
			}
			var isHavePriceAuth=$("#purchaseAuthFlag",$p).val();
			if(!migr.commonOrderMoneyAndAmountValidatePositiveFloat("amount",$p)){
				return false;
			}else if(!migr.commonOrderMoneyAndAmountValidatePositiveFloat("boxNum",$p)){
				return false;
			}else if(!migr.commonOrderMoneyAndAmountValidateNotNegativeFloat("presentNum",$p)){
				return false;
			}else if(isHavePriceAuth==1){//有权限得话，得校验数据的准确性
			   if(!migr.commonOrderMoneyAndAmountValidateNotNegativeFloat("purchasePrice",$p)){
					return false;
				}
			   if(!migr.commonOrderMoneyAndAmountValidateNotNegativeFloat("totalSum",$p)){
					return false;
				}
			}
			return true;
		},
		updatePurchDetail:function(input,goodCode,defaultScale,numScale,moneyScale){
			if(!goodCode){
				goodCode = $(input).attr("goodCode");
			}
			if($(input).attr("name").indexOf('memo') == -1 && $(input).attr("name").indexOf('produceDate') == -1){
				//校验数字格式
				if(!$(input).val().isNumber()){
					alertMsg.error("请输入合法的数字！");
					$(input).focus();
					$(input).addClass("error");
					return;
				}
				$(input).removeClass("error");
			}
			if($(input).attr("name").indexOf('produceDate') > -1){
				numScale=$(input).attr("numScale");
				moneyScale=$(input).attr("moneyScale");
				defaultScale=$(input).attr("defaultScale");
			}
			var $p = $(input).parents(".unitBox:first");
			var updateDetailUrl = $("#updateDetailUrl",$p).val();
			var $tr = $(input).parents("tr:first");
			var flag=$("#purchaseAuthFlag",$p).val();
			$.ajax({
	    		type:"POST",
	    		url: updateDetailUrl,
	    		dataType: "json",
	    		data:"purchdetail.goodCode="+goodCode+"&"+$(input).serialize(),
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
	    				if(data.data){
	    					$("input[name='boxNum']",$tr).val(setScale(data.data.boxNum, numScale, "roundhalfup"));
	    					$("input[name='amount']",$tr).val(setScale(data.data.amount, numScale, "roundhalfup"));
	    					$("input[name='presentNum']",$tr).val(setScale(data.data.presentNum,numScale, "roundhalfup"));
	    					$("td[rname='orderNum']",$p).text(setScale(data.data.orderNum,numScale, "roundhalfup"));
	    					if(flag==1){
	    						$("input[name='totalSum']",$tr).val(setScale(data.data.totalSum,moneyScale, "roundhalfup"));
		    					$("input[name='purchasePrice']",$tr).val(setScale(data.data.purchasePrice,moneyScale, "roundhalfup"));
		    					$("td[rname='orderMoney']",$p).text(setScale(data.data.orderMoney,moneyScale, "roundhalfup"));
	    					}
	    				}
	    			}
	    		}
	    	});
		},
		//打开选择purch后的回调方法
		choosePurchCallback:function(args,$p,obj,type){
			//选择purch后，获取传来的orderNo
			var orderNo = args["orderNo"];
			if(!$p){
				$p = $(obj).parents(".unitBox:first");
				//根据orderNo打开相应的明细单据
				var url=$("#openCertUrl",$p).val();
				var dialogId = 't_po_master';
				//根据orderNo打开相应单据
				$.pdialog.open(url,dialogId,'单据明细',{restore:false,max:true,data:'show=0&newOrder=1&purchorder.orderNo='+orderNo+"&purchorder.orderType="+type});
			}else{
				//根据orderNo打开相应的明细单据
				var url=$("#refreshUrl",$p).val();
				var dialogId = $("#dialogId",$p).val();
				//根据orderNo打开相应单据
				$.pdialog.reload(url,{dialogId:dialogId,data:'newOrder=1&purchorder.orderNo='+orderNo});
			}
		},
		//删除当前单据，在没有审核时可以删除
		dropPuch:function(btn){
			var $p = $(btn).parents(".unitBox:first");
			//获取purch的状态，如果是未审核状态就可以删除，否则不可以删除
			var state = $("[name='purchorder.state']",$p).val();
			if(state && state == '0'){
				alertMsg.confirm("确认删除单据？",{
					okCall:function(){
						var dropPurchUrl = $("#dropPurchUrl",$p).val();
						//获取Id进行删除
						$.ajax({
				    		type:"POST",
				    		url: dropPurchUrl,
				    		dataType: "json",
				    		data:$("input[name='purchorder.orderNo']",$p).serialize(),
				    		async: false,
				    		success: function(data) {
				    			if(data.statusCode=="200"){
				    				alertMsg.correct(data.message);
				    				//继续打开新增页面
				    				var refreshUrl=$("#refreshUrl",$p).val();
				    				var dialogId = $("#dialogId",$p).val();
				    				$.pdialog.reload(refreshUrl,{dialogId:dialogId,data:'newOrder=1'});
				    			}else{
				    				alertMsg.error(data.message);
				    			}
				    		}
				    	});
					}
				});
			}else{
				alertMsg.error("单据当前状态不可删除！");
			}
		},
		//审核后的回调
		purchCheckCallback:function(btn,data){
			var $p = $(btn).parents(".unitBox:first");
			var refreshUrl=$("#refreshUrl",$p).val();
			var dialogId = $("#dialogId",$p).val();
			$.pdialog.reload(refreshUrl,{dialogId:dialogId,data:$("#orderForm",$p).serialize()});
		},
		checkOrderNoIsExist:function(btn){
			var $p = $(btn).parents(".unitBox:first");
			var orderNo = $("input[name='purchorder.orderNo']").val();
			if(orderNo && orderNo != ''){
				alertMsg.error("单号已经存在，操作禁止！请新建单据！");
				return false
			}
			return true;
		},
		//选择采购单
		toCopyPurchOrderDetail:function(args,$p){
			var orOrderNo = args['orderNo'];
			if(orOrderNo=='')
				alertMsg.error('请选择要引用的单号');
			var validateReturnOrderUrl=$("#validateReturnOrderUrl",$p).val();
			if(validateReturnOrderUrl){
				validateReturnOrderUrl=validateReturnOrderUrl+"&purchorder.recOrderNo="+orOrderNo;
				jQuery.ajax({
		    		type:"POST",
		    		url: validateReturnOrderUrl,
		    		dataType: "json",
		    		async: false,
		    		success: function(data) {
		    			var dialogNum=$("#dialogId",$p).val();
	    				var refreshUrl=$("#refreshUrl",$p).val()+"&newOrder=3";
		    			if(data){
		    				alertMsg.confirm("该单已经退过货，还继续退货？",{
		    					okCall: function(){
		    						jQuery.pdialog.reload(refreshUrl,{dialogId:dialogNum,data:$("#orderForm",$p).serialize()});
		    					},cancelCall: function(){
		    						$("input[name='purchorder.orOrderNo']",$p).val("");
		    					}
		    				})
		    			}else{
		    				jQuery.pdialog.reload(refreshUrl,{dialogId:dialogNum,data:$("#orderForm",$p).serialize()});
		    			}
		    		}
		    	});
			}else{
				var dialogNum=$("#dialogId",$p).val();
				var refreshUrl=$("#refreshUrl",$p).val()+"?newOrder=3";
				jQuery.pdialog.reload(refreshUrl,{dialogId:dialogNum,data:$("#orderForm",$p).serialize()});
			}
		}
		,
		chooseOrderAddRecive:function(args,$p){
			//选择purch后，获取传来的orderNo
			var orderNo = args["orderNo"];
			var url=$("#saveDetailByOrderNo",$p).val();
			var refreshUrl=$("#refreshUrl",$p).val();
			var dialogId = $("#dialogId",$p).val();
			$.ajax({
	    		type:"POST",
	    		url: url,
	    		dataType: "json",
	    		data:'purchorder.recOrderNo='+orderNo,
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="300"){
	    				alertMsg.confirm(data.message,{
	    					okCall:function(){
	    						//设置一些值吧
	    	    				$("input[name='purchorder.supplierCode']",$p).val(data.data.supplierCode);
	    	    				$("input[name='purchorder.supplierName']",$p).val(data.data.supplierName);
	    	    				$("input[name='purchorder.branchCode']",$p).val(data.data.branchCode);
	    	    				$("input[name='purchorder.branchName']",$p).val(data.data.branchName);
	    	    				$("input[name='purchorder.buyer']",$p).val(data.data.buyer);
	    	    				//TODO error
	    	    				var payDate = new Date();
	    	    				if(data.data.payDate){
	    	    					payDate.setTime(data.data.payDate.time);
	    	    				}
	    	    				$("input[name='purchorder.payDate']",$p).val(payDate.formatDate("yyyy-MM-dd"));
	    	    				$.pdialog.reload(refreshUrl,{dialogId:dialogId,data:$("#orderForm",$p).serialize()});
	    					},
	    					cancelCall:function(){
	    						$.ajax({
	    							type:"POST",
	    				    		url: $("#clearOrderDetailUrl",$p).val(),
	    				    		dataType: "json",
	    				    		async: false
	    						});
	    						$("input[name='purchorder.recOrderNo']",$p).val("");
	    						$("input[name='purchorder.supplierCode']",$p).val("");
	    	    				$("input[name='purchorder.supplierName']",$p).val("");
	    	    				$("input[name='superlierStr']",$p).val("");
	    	    				$("input[name='purchorder.branchCode']",$p).val("");
	    	    				$("input[name='purchorder.branchName']",$p).val("");
	    	    				$("input[name='branchStr']",$p).val("");
	    	    				$("input[name='purchorder.buyer']",$p).val("");
	    	    				$("input[name='realname']",$p).val("");
	    	    				$("input[name='purchorder.payDate']",$p).val("");
	    	    				$(".gridTbody",$p).empty();
	    					}
	    				});
	    			}else{
	    				//设置一些值吧
	    				$("input[name='purchorder.supplierCode']",$p).val(data.data.supplierCode);
	    				$("input[name='purchorder.supplierName']",$p).val(data.data.supplierName);
	    				$("input[name='purchorder.branchCode']",$p).val(data.data.branchCode);
	    				$("input[name='purchorder.branchName']",$p).val(data.data.branchName);
	    				$("input[name='purchorder.buyer']",$p).val(data.data.buyer);
	    				//TODO error
	    				var payDate = new Date();
	    				if(data.data.payDate){
	    					payDate.setTime(data.data.payDate.time);
	    				}
	    				$("input[name='purchorder.payDate']",$p).val(payDate.formatDate("yyyy-MM-dd"));
	    				$.pdialog.reload(refreshUrl,{dialogId:dialogId,data:$("#orderForm",$p).serialize()});
	    			}
	    		}
	    	});
			
		},
		endPurchorder:function(btn){
			var $this = $(btn);
			var $p = $(btn).parents(".unitBox:first");
			var url=$this.attr("url");
			var error=$this.attr("error");
			var dialogId = $("#dialogId",$p).val();
			var $idsChecked = $("input:checkbox[name='ids']:checked:enabled",$p);
			if($idsChecked.size() == 0){
				alertMsg.error(error);
				return false;
			}
			var confirm = $this.attr("confirm");
			alertMsg.confirm(confirm,{
				okCall:function(){
					$.ajax({
			    		type:"POST",
			    		url: url,
			    		dataType: "json",
			    		data:$idsChecked.serialize(),
			    		async: false,
			    		success: function(data) {
			    			if(data.statusCode=="300"){
			    				alertMsg.error(data.message);
			    			}else{
			    				alertMsg.correct(data.message);
			    				$("#pagerForm",$p).submit();
			    			}
			    		}
					});
				}
			});
			return true;
		},
		roleAdd:function(obj){//角色新增、角色加载
			var $this = $(obj);
			var $p = $this.parents(".unitBox:first");
			var $form = $("#roleEditForm",$p);
			var addUrl = $this.attr("href");
			
			//继续打开新增页面
			var dialogId = $("#dialogId",$p).val();
			
			//判断是否正在编辑没有保存
			var noSave = $("#noSave",$form).val();
			if(noSave == 1){
				alertMsg.confirm("正在编辑的角色尚未保存是否放弃？",{
					okCall:function(){
						//重新load右侧页面
						navTab.reload(addUrl, {navTabId: dialogId,data:'id='+$this.attr("rel")});
					}
				});
			}else{
				navTab.reload(addUrl, {navTabId: dialogId,data:'id='+$this.attr("rel")});
			}
			return false;
		},
		roleSave:function(obj){//保存角色
			var $this = $(obj);
			var $p = $this.parents(".unitBox:first");
			alertMsg.confirm("确认要保存吗？",{okCall:function(){
				var $form = $("#roleEditForm",$p);
				var $id = $("input[name='role.id']").val();
				var $tbody = $(".grid .gridTbody table tbody",$p);
				//数据校验
				var nameInput = $("input[name='role.name']",$form).val();
				if(nameInput == undefined || nameInput == ''){
					alertMsg.error("角色名称不可为空！");
					return false;
				}
				var auths = '';
				var submitUrl = $form.attr("action");
				//ajax保存
				$.ajax({
		    		type:"POST",
		    		url: submitUrl,
		    		dataType: "json",
		    		data:$form.serialize()+auths,
		    		async: false,
		    		success: function(data) {
		    			if(data.statusCode=="200"){
		    				alertMsg.correct(data.message);
		    				if(!$id){
		    					//继续打开新增页面
			    				var refreshUrl=$("#refreshUrl",$p).val();
			    				var dialogId = $("#dialogId",$p).val();
			    				navTab.reload(refreshUrl, {navTabId: dialogId,data:'id='+data.data.id});
		    				}
		    			}else{
		    				alertMsg.error(data.message);
		    			}
		    		}
		    	});
			}});
			return false;
		},
		//角色全选权限
		roleCheckAll:function(obj){
			var $this = $(obj);
			var $p = $this.parents(".unitBox:first");
			var $form = $("#roleEditForm",$p);
			var roleGrantUrl = $("#roleGrantUrl",$p).val();
			
			var data = "a=1";
			$("input:checkbox",$form).each(function(){
				$(this).attr("checked","true");
				if($(this).attr("opType")){
					data = data + "&auths="+$(this).parents("tr:first").attr("rel")+"##"+$(this).attr("opType")+"##true";
				}
			});
			
			//设置单据的未保存状态
			$("#noSave",$p).val("1");
			
			var userNameV = $("#username",$p).val();
			if(userNameV){
				data += "&userinfo.username="+userNameV;
			}
			//ajax保存
			migr.ajaxNoAlert(roleGrantUrl,data);
			return false;
		},
		//角色取消全选权限
		roleUnCheckAll:function(obj){
			var $this = $(obj);
			var $p = $this.parents(".unitBox:first");
			var $form = $("#roleEditForm",$p);
			var roleGrantUrl = $("#roleGrantUrl",$p).val();
			
			var data = "a=1";
			$("input:checkbox",$form).each(function(){
					$(this).removeAttr("checked");
					if($(this).attr("opType")){
						data = data + "&auths="+$(this).parents("tr:first").attr("rel")+"##"+$(this).attr("opType")+"##false";
					}
			});
			
			//设置单据的未保存状态
			$("#noSave",$p).val("1");
			
			var userNameV = $("#username",$p).val();
			if(userNameV){
				data += "&userinfo.username="+userNameV;
			}
			//ajax保存
			migr.ajaxNoAlert(roleGrantUrl,data);
			return false;
		},
		//关闭展开子moudle
		gridTreeCloseChildren:function(obj){
			var $this = $(obj);
			var $p = $this.parents(".unitBox:first");
			var $form = $("#roleEditForm",$p);
			if($this.attr("open") == 'true'){
				$("tr[parent='"+$this.attr("id")+"']",$form).hide();
				$this.attr("open",'false').removeClass("tg_collapsable").addClass("tg_expandable");
			}else{
				$("tr[parent='"+$this.attr("id")+"']",$form).show();
				$this.attr("open",'true').removeClass("tg_expandable").addClass("tg_collapsable");
			}
			return fasle;
		},
		//gridTree选择本行checkbox
		gridTreeRowCheck:function(obj){
			var $this = $(obj);
			var $p = $this.parents(".unitBox:first");
			var $tr = $this.parents("tr:first");
			
			var roleGrantUrl = $("#roleGrantUrl",$p).val();
			
			var data = "a=1";
			if ($this.attr("checked") == true) {
				$("input:checkbox[opType]",$tr).each(function(){
					$(this).attr("checked","true");
					data = data + "&auths="+$tr.attr("rel")+"##"+$(this).attr("opType")+"##true";
				});
			} else {
				$("input:checkbox[opType]",$tr).each(function(){
					$(this).removeAttr("checked");
					data = data + "&auths="+$tr.attr("rel")+"##"+$(this).attr("opType")+"##false";
				});
			}
			
			//设置单据的未保存状态
			$("#noSave",$p).val("1");
			
			var userNameV = $("#username",$p).val();
			if(userNameV){
				data += "&userinfo.username="+userNameV;
			}
			//ajax保存
			migr.ajaxNoAlert(roleGrantUrl,data);
			return false;
		},
		//gridTree选择本列子moudle的功能
		gridTreeColCheck:function(obj){
			var $this = $(obj);
			var $p = $this.parents(".unitBox:first");
			var $form = $this.parents("form:first");
			
			var roleGrantUrl = $("#roleGrantUrl",$p).val();
			
			var data = "";
			//子列
			if ($this.attr("checked") == true) {
				data = data + "auths="+$this.parents("tr:first").attr("rel")+"##"+$this.attr("opType")+"##true";
				$("tr[parent='"+$this.parents("tr:first").attr("rel")+"'] input:checkbox[opType='"+$this.attr("opType")+"']",$form).each(function(){
					$(this).attr("checked",true);
					data = data + "&auths="+$(this).parents("tr:first").attr("rel")+"##"+$(this).attr("opType")+"##true";
				});
			} else {
				data = data + "&auths="+$this.parents("tr:first").attr("rel")+"##"+$this.attr("opType")+"##false";
				$("tr[parent='"+$this.parents("tr:first").attr("rel")+"'] input:checkbox[opType='"+$this.attr("opType")+"']",$form).each(function(){
					$(this).removeAttr("checked");
					data = data + "&auths="+$(this).parents("tr:first").attr("rel")+"##"+$(this).attr("opType")+"##false";
				});
			}
			
			//设置单据的未保存状态
			$("#noSave",$p).val("1");
			
			var userNameV = $("#username",$p).val();
			if(userNameV){
				data += "&userinfo.username="+userNameV;
			}
			//ajax保存
			migr.ajaxNoAlert(roleGrantUrl,data);
			return false;
		},
		//选择子moudle
		gridTreeChildrenCheck:function(obj){
			var $this = $(obj);
			var $p = $this.parents(".unitBox:first");
			var $form = $this.parents("form:first");
			var $tr = $this.parents("tr:first");
			
			var roleGrantUrl = $("#roleGrantUrl",$p).val();
			
			var data = "";
			
			if ($this.attr("checked") == true) {
				//本行
				$("input:checkbox[opType]",$tr).each(function(){
					$(this).attr("checked","true");
					data = data + "&auths="+$tr.attr("rel")+"##"+$(this).attr("opType")+"##true";
				});
				//子行
				$("tr[parent='"+$this.parents("tr:first").attr("rel")+"'] input:checkbox",$form).each(function(){
					$(this).attr("checked","true");
					if($(this).attr("opType")){
						data = data + "&auths="+$(this).parents("tr:first").attr("rel")+"##"+$(this).attr("opType")+"##true";
					}
				});
			} else {
				//本行
				$("input:checkbox[opType]",$tr).each(function(){
					$(this).removeAttr("checked");
					data = data + "&auths="+$tr.attr("rel")+"##"+$(this).attr("opType")+"##false";
				});
				//子行
				$("tr[parent='"+$this.parents("tr:first").attr("rel")+"'] input:checkbox",$form).each(function(){
					$(this).removeAttr("checked");
					if($(this).attr("opType")){
						data = data + "&auths="+$(this).parents("tr:first").attr("rel")+"##"+$(this).attr("opType")+"##false";
					}
				});
			}
			
			//设置单据的未保存状态
			$("#noSave",$p).val("1");
			
			var userNameV = $("#username",$p).val();
			if(userNameV){
				data += "&userinfo.username="+userNameV;
			}
			//ajax保存
			migr.ajaxNoAlert(roleGrantUrl,data);
			return false;
		},
		//角色授权ajax，选一个时，暂存session
		roleGrantSave:function(obj){
			var $this = $(obj);
			var $p = $this.parents(".unitBox:first");
			var roleGrantUrl = $("#roleGrantUrl",$p).val();
			var $isCheck = true;
			if($this.attr("checked") == true){
				$isCheck = true;
			}else{
				$isCheck = false;
			}
			var data = "&auths="+$this.parents("tr:first").attr("rel")+"##"+$this.attr("opType")+"##"+$isCheck;
			var userNameV = $("#username",$p).val();
			if(userNameV){
				data += "&userinfo.username="+userNameV;
			}
			migr.ajaxNoAlert(roleGrantUrl,data);
			return false;
		},
		//ajax保存权限
		ajaxNoAlert:function(url,data){
			//ajax保存
			$.ajax({
	    		type:"POST",
	    		url: url,
	    		dataType: "json",
	    		data:data,
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="200"){
//	    				alertMsg.correct(data.message);
	    			}else{
	    				alertMsg.error(data.message);
	    			}
	    		}
	    	});
		},
		roleCopyChooseCallback:function(args,$p,$lookupBtn){
			//窗口id
			var dialogId = $("#dialogId",$p).val();
			var refreshUrl = $("#refreshUrl",$p).val();
			var $form = $("#roleEditForm",$p);
			
			//重新load页面
			navTab.reload(refreshUrl, {navTabId: dialogId,data:$form.serialize()+"&copy="+args["id"]});
		},getUserGrant:function(obj){
			var $this = $(obj);
			var $p = $this.parents(".unitBox:first");
			var loadUrl = $this.attr("href");
			
			//继续打开新增页面
			var dialogId = $("#dialogId",$p).val();
			//判断是否正在编辑没有保存
			var noSave = $("#noSave",$p).val();
			if(noSave == 1){
				alertMsg.confirm("正在编辑的用户尚未保存是否放弃？",{
					okCall:function(){
						//重新load右侧页面
						$.pdialog.reload(loadUrl,{dialogId:dialogId,data:$("#pagerForm",$p).serialize()});
					}
				});
			}else{
				$.pdialog.reload(loadUrl,{dialogId:dialogId,data:$("#pagerForm",$p).serialize()});
			}
			return false;
		},
		//用户授予角色，单个，暂存session
		grantRoleUser:function(obj){
			var $this = $(obj);
			var $p = $this.parents(".unitBox:first");
			
			//设置单据的未保存状态
			$("#noSave",$p).val("1");
			var roleUserGrantUrl = $("#roleUserGrantUrl",$p).val();
			var $isCheck = true;
			if($this.attr("checked") == true){
				$isCheck = true;
			}else{
				$isCheck = false;
			}
			//准备请求的数据
			var data = "userinfo.id="+$("#id",$p).val()+"&rolesOp="+$this.parents("tr:first").attr("rel")+"##"+$isCheck;
			//右侧权限栏
			var $grantBox = $("#grantBox",$p);
			//请求load新页面，在loadUrl时完成了initUI的动作但是没有今天layoutH，所以要在callBack中进行lzyoutH以控制控件的croll
			$grantBox.loadUrl(roleUserGrantUrl, data, function(){
				$grantBox.find("[layoutH]").layoutH();//展示控件初始化
			},'POST');
			return false;
		},//点击空白处后的处理
		onRoleTdClick:function(obj){
			var $this = $(obj);
			var $checkbox = $("input:checkbox",$this.parents("tr:first"));
			if($checkbox.attr("checked")){
				$checkbox.attr("checked",false).trigger("click");
				$checkbox.attr("checked",false)
			}else{
				$checkbox.attr("checked",true).trigger("click");
				$checkbox.attr("checked",true);
			}
			
			
			return false;
		},
		//保存
		grantSave:function(obj){
			var $this = $(obj);
			var $p = $this.parents(".unitBox:first");
			alertMsg.confirm("确认要保存吗？",{okCall:function(){
				var saveUrl = $this.attr("href");
				//继续打开新增页面
				var dialogId = $("#dialogId",$p).val();
				var refreshUrl=$("#refreshUrl",$p).val();
				//ajax保存
				$.ajax({
		    		type:"POST",
		    		url: saveUrl,
		    		dataType: "json",
		    		data:"userinfo.username="+$("#username",$p).val(),
		    		async: false,
		    		success: function(data) {
		    			if(data.statusCode=="200"){
		    				alertMsg.correct(data.message);
		    				//继续打开新增页面
		    				//$.pdialog.reload(refreshUrl,{dialogId:dialogId,data:'userinfo.id='+$("#id",$p).val()});
		    			}else{
		    				alertMsg.error(data.message);
		    			}
		    		}
		    	});
			}});
			return false;
		},
		//采购查询
		purchCollect:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var purchTab= $("a[name='purchTab']",$p);
			var $type=$("#type",$p);
			if(!$type.val()){//默认是商品汇总
				$type.val(0);
			}
			var objTab=undefined;
			purchTab.each(function(){
				if($type.val()==$(this).attr("flag")){
					objTab=$(this);
				}else{
					
				}
			});
			var $form = $("#pagerForm",$p);
			var $targetTab = $("#"+objTab.attr("divId"),$p);
			$targetTab.loadUrl($form.attr("action"),$form.serialize(),function(){
				$targetTab.find("[layoutH]").layoutH();
			},'POST');
		},//切换tab
		purchSearchChanageTab:function(obj){
			var $this = $(obj);
			var $p = $this.parents(".unitBox:first");
			var $type=$("#type",$p);
			$type.val($this.attr("flag"));
			var $orderTypeDiv=$("#orderTypeDiv",$p);
			if($type.val()==5){
				$orderTypeDiv.show();
			}else{
				$orderTypeDiv.hide();
			}
			var $tname=$("#tname",$p);
			$tname.val($(obj).attr("tname"));
			$setColumn=$("#setColumn",$p);
			if($setColumn){
				$setColumn.attr("tname",$(obj).attr("tname"));
				//$setColumn.attr("rel",$(obj).attr("id"));
			}
			
		},
		addChildrenMoudle:function(args,$p,lookupBtn){
			var source = args['source'];
			var target = args['target'];
			var url=$("#saveChildrenMoudlesUrl",$p).val();
			var $form = $("form#pagerForm",$p);
			var refreshUrl=$form.attr("action");
			var dialogId = $("#dialogId",$p).val();
			$.ajax({
	    		type:"POST",
	    		url: url,
	    		dataType: "json",
	    		data:{source:source,target:target},
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
	    				navTab.reload(refreshUrl, {navTabId:dialogId,fresh:true, data:"parentCode="+target});
	    			}
	    		}
	    	});
		},
		beforeCopyChildren:function(btn){
			var $lookBtn = $(btn);
			var $p = $lookBtn.parents(".unitBox:first");
			var $tr = $("tr.selected",$p);
			if($tr.size() > 0){
				var level = $tr.attr("level");
				if(level != 1){
					alertMsg.warn("此节点不允许复制，只有一级节点允许复制！");
					return false;
				}
			}
			return true;
		},
		integralExchangeRuleFormSubmit:function(obj){
			var $this = $(obj);
			var $p = $this.parents(".unitBox:first");
			var $form = $("#integralExchangeRuleForm",$p);
			alertMsg.confirm("确认要保存吗？",{okCall:function(){
				$.ajax({
		    		type:"POST",
		    		url: $form.attr("action"),
		    		dataType: "json",
		    		data:$form.serializeArray(),
		    		async: false,
		    		success: function(data) {
		    			if(data.statusCode=="200"){
		    				alertMsg.correct(data.message);
		    			}else{
		    				alertMsg.error(data.message);
		    			}
		    		}
		    	});
			}});
			return false;
		},verify:function(obj){
			var $this = $(obj);
			var $p = $this.parents(".unitBox:first");
			var id = $("#id",$p).val();
			alertMsg.confirm("正版验证需要连接互联网，若继续验证请点击“确定”！",{okCall:function(){
//				$.ajax({
//		    		type:"POST",
//		    		url: 'http://www.migrsoft.com:16666/migrkey/verify.do',
//		    		dataType: "jsonp",
//		    		contentType: "application/json",
//		    		data:{"s":id},
//		    		async: false,
//		    		success: function(data) {
//		    			if(data.statusCode=="200"){
//		    				alertMsg.correct(data.message);
//		    			}else{
//		    				alertMsg.error(data.message);
//		    			}
//		    		},error:function(data){
//		    			
//		    			alertMsg.error('网络异常，请稍后再试！');
//		    		}
//		    	});
				$.ajax({ 
				    type: 'GET', 
				    url: 'http://www.migrsoft.com:16666/migrkey/verify.do',
					dataType: 'jsonp',
					contentType: "application/json",
					data:{"s":id},
					beforeSend: function(){
				    },success: function(response){ 
						if(response.statusCode=="200"){
							alertMsg.correct(response.message);
						}else{
							alertMsg.error(response.message);
						}	
					},error:function(xhr, ajaxOptions, thrownError){
						alert("Http status: " + xhr.status + " " + xhr.statusText + "\najaxOptions: " + ajaxOptions + "\nthrownError:"+thrownError + "\n" +xhr.responseText);
					}
		 });
			}});
		}
	});
})(jQuery);