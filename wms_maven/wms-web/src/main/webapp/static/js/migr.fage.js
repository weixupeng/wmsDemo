/*
integralRuleFormDoneintegralRuleFormDone * 此js文件需要放置在migr.js之后
 */
(function($,migr){
	$.extend(migr,{
		//这里写自己定义的方法，方法之间用逗号分割，如fage:function(){},fage2:function(){}
		//添加明细
		
		batchModifyBranchPrice:function(btn){
			var $lookBtn = $(btn);
			var $p = $lookBtn.parents(".unitBox:first");
			var batchModifyBranchPriceUrl=$("#batchModifyBranchPriceUrl",$p).val();
			var goodCode = $("input[name='goods.code']",$p).val();
			batchModifyBranchPriceUrl = batchModifyBranchPriceUrl+"?goods.code="+goodCode;
			if($(btn).val()==1){
				jQuery.ajax({
		    		type:"POST",
		    		url: batchModifyBranchPriceUrl,
		    		dataType: "json",
		    		async: false,
		    		success: function(data) {
		    			if(data.statusCode=="300"){
		    				//不存在
		    				return ;
		    			}else{
		    				//存在业务
		    				alertMsg.error("该商品发生过调价业务,不允许此操作,请用调价单修改价格.");
		    				$(btn).attr("disabled",true);
		    				$(btn).val("0");
		    			}
		    		}
		    	});
			}
		},
		
		beforeChooseGift:function(btn){
			var $lookBtn = $(btn);
			var $p = $lookBtn.parents(".unitBox:first");
			var branchCode = $("input[name='branchCode']",$p).val();
			if(branchCode==""){
				alertMsg.error("请输入分店编号！");
				return false;
			}
			var chooseUrl=$("#chooseGiftUrl",$p).val();
			$(btn).attr("href",chooseUrl+"&gift.branchCode="+branchCode);
			return true;
		},
		memberDialogReloadDone:function(data,form){
			Bird.ajaxDone(data);
			var $p = $(form).parents(".unitBox:first");
			var dialogId=$("#dialogId",$p).val();
			if(data.statusCode== Bird.statusCode.ok){
				$.pdialog.reload($(form).attr("action"),{dialogId:dialogId,data:$("#queryMemberForm",$p).serialize()});
			}
		},
		modifyCombineGooddetail:function(obj,id,moneyscale){
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
				data:"combinegoods.id="+id+"&combinegoods."+$(obj).attr("name")+"="+$(obj).val(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
    					if($(obj).attr("name")!='memo'){
	    					var apurchasePrice = floatMul($("input[name='purchasePrice']",$tr).val(),$(obj).val());
	    					$("td[name='apurchasePrice']",$tr).html(setScale(apurchasePrice,moneyscale, "roundhalfup"));
	    					
	    					var asalePrice = floatMul($("input[name='salePrice']",$tr).val(),$(obj).val());
	    					$("td[name='asalePrice']",$tr).html(setScale(asalePrice,moneyscale, "roundhalfup"));
    					}
	    			}
				}
			});
		},
		//组合商品 添加成份呢商品时 检查有没选择组合商品
		checkIsCheckedGoods:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			if($("#chooseGoods",$p).val()=="")
			{
				alertMsg.warn('请先选择某一组合商品');
				return false;
			}else{
				return true;
			}
		},
		onChangeGoodsName:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			if($("input[name='goods.shortname']",$p).val()==""){
				$("input[name='goods.shortname']",$p).val($(obj).val());
			}
		},
		refreshOrderByFlag:function(obj,tempflag){
			var $p = $(obj).parents(".unitBox:first");
			$("#flag",$p).val(tempflag); 
			$("#pagerForm",$p).submit();
		},
		gooodSupplierCancel:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var goodCode =$("#sid",$p).val(); 
			$("#goodsupplier",$p).loadUrl(Bird.homePath+'/base/goodsupplier!list.do',{goodCode:goodCode},false);
			$.pdialog.closeCurrent(); 
		},
		goodsappendrecord:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var goodCode =$("#sid",$p).val(); 
			$("#curTab",$p).val($(obj).attr("id"));
			var goodsappendrecordsDiv = $("#goodsappendrecords",$p);
			goodsappendrecordsDiv.loadUrl(Bird.homePath+'/base/goodsappendrecord!list.do',{goodCode:goodCode},function(){
				goodsappendrecordsDiv.find("[layoutH]").layoutH();
			});
		}
		,
		listBranchGoods:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			//$("#goodsupplierPanel",$p).css("display","none");
			var goodCode =$("#sid",$p).val(); 
			var branchgoodsDiv = $("#branchgoods",$p);
			$("#curTab",$p).val($(obj).attr("id"));
			branchgoodsDiv.loadUrl(Bird.homePath+'/base/branchgoods!listmxfgood.do',{goodCode:goodCode},function(){
				branchgoodsDiv.find("[layoutH]").layoutH();
			});
		},
		goodsSupplierList:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			//$("#goodsupplierPanel",$p).css("display","block");
			var goodCode =$("#sid",$p).val();
			$("#curTab",$p).val($(obj).attr("id"));
			var goodsupplierDiv = $("#goodsupplier",$p);
			goodsupplierDiv.loadUrl(Bird.homePath+'/base/goodsupplier!listfgood.do',{goodCode:goodCode},function(){
				goodsupplierDiv.find("[layoutH]").layoutH();
			});
		},
		goods_listmx:function(obj,goodCode){
			var $p = $(obj).parents(".unitBox:first");
			var branchgoodsDiv = $("#branchgoods",$p);
			var goodsupplierDiv = $("#goodsupplier",$p);
			var goodsappendrecordsDiv = $("#goodsappendrecords",$p);
			goodsupplierDiv.loadUrl(Bird.homePath+'/base/goodsupplier!listfgood.do',{goodCode:goodCode},function(){
				goodsupplierDiv.find("[layoutH]").layoutH();
			});
			branchgoodsDiv.loadUrl(Bird.homePath+'/base/branchgoods!listmxfgood.do',{goodCode:goodCode},function(){
				branchgoodsDiv.find("[layoutH]").layoutH();
			});
			goodsappendrecordsDiv.loadUrl(Bird.homePath+'/base/goodsappendrecord!list.do',{goodCode:goodCode},function(){
				goodsappendrecordsDiv.find("[layoutH]").layoutH();
			});
			$("#sid",$p).val(goodCode);
		},
		goodsadd:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var categoryCode = $("input[name='categoryCode']",$p).val();
			var opts = {};
			opts.max = true;//是否打开后最大化
			opts.mask = true;//是否开启遮罩
			opts.maxable = true;//是否有最大化按钮
			opts.minable = false;//是否有最小化按钮，有最小化则开启底部最小化栏
			opts.fresh = true;//是否可以刷新本对话框
			opts.resizable = true;//是否可以改变弹出框大小
			opts.drawable = true;//是否可以拖动
			opts.close = "";
			opts.param = "";
			$.pdialog.open(Bird.homePath+'/base/goods!add.do?categoryCode='+categoryCode,'goods_add','新增-商品档案',opts);
		},
		fz:function(obj,id){//goodsupplier_list.vm,onclick="migr.fz(this,'$!c.id')"
			var $p = $(obj).parents(".unitBox:first");
			$("#goodSupplierId",$p).val(id);
		},
		goodsupplierDel:function(obj){//商品档案模块
			var $p = $(obj).parents(".unitBox:first");
			alertMsg.confirm("你确定要删除此信息?",{
				okCall:function(){
					var zid =$("#goodSupplierId",$p).val(); 
	    			var goodCode =$("#sid",$p).val(); 
	    			$("#goodsupplier",$p).loadUrl(Bird.homePath+'/base/goodsupplier!drop.do?id='+zid+'&goodCode='+goodCode,'','');
				}
			});
		},
		goodsupplieradd:function(obj){//商品档案模块
			var $p = $(obj).parents(".unitBox:first");
			var goodCode =$("#sid",$p).val(); 
			if(goodCode.length==0)
			{
				alertMsg.warn("请选择一个商品在增加商品对应供应商信息!");
				return false;
			}else
			{
				var url=$(obj).attr("href")+"?goodCode="+goodCode;
				$(obj).attr("href",url);
				return true;
			}
		},
		goodsupplieredit:function(id,obj){//商品档案模块
			//打开窗口,opts是窗口初始化参数
			var opts = {};
			opts.max = false;//是否打开后最大化
			opts.mask = true;//是否开启遮罩
			opts.maxable = true;//是否有最大化按钮
			opts.minable = false;//是否有最小化按钮，有最小化则开启底部最小化栏
			opts.fresh = true;//是否可以刷新本对话框
			opts.resizable = true;//是否可以改变弹出框大小
			opts.drawable = true;//是否可以拖动
			opts.close = "";
			opts.param = "";
			//弹出框ID命名规范:模块名_功能名，如：branch_area_add
			$.pdialog.open($(obj).attr("href")+'?id='+id,'goodsupplier_edit','修改-货号对应供应商',opts);
		} ,
		addCombineDetail:function(args,$p){
			var codes = args['goodCode'];
			var branchCode = $("input[name='combineorder.branchCode']",$p).val();
			if(branchCode==''){
				alertMsg.warn("请先选择分店仓库,再重新选择商品.");
				return false;
			}
			var url=$("#addCombineDetailUrl",$p).val()+"?goodCode="+codes+"&combineorder.branchCode="+branchCode;
			var refreshUrl=$("#refreshCombineOrderUrl",$p).val();
			jQuery.ajax({
	    		type:"POST",
	    		url: url,
	    		dataType: "json",
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="300")
	    			{
	    				alertMsg.error(data.message);
	    			}else{
	    				var dialog = $.pdialog.reload(refreshUrl,{dialogId:$("#dialogId",$p).val(),data:$("#orderForm",$p).serialize()});
	    				if(dialog){
	    					var box = dialog.find(".dialogContent");
	    					$.setLookupBox(box);
	    				}
	    			}
	    		}
	    	});
		},
		refreshCombineOrder:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var url=$("#refreshCombineOrderUrl",$p).val();
			jQuery.pdialog.reload(url,{dialogId:$("#dialogId",$p).val(),data:$("#orderForm",$p).serialize()});
		},
		refreshCombineOrder1:function(btn,data){
			var $p = $(btn).parents(".unitBox:first");
			var refreshUrl=$("#refreshCombineOrderUrl",$p).val();
			var dialogId = $("#dialogId",$p).val();
			$.pdialog.reload(refreshUrl,{dialogId:dialogId,data:$("#orderForm",$p).serialize()});
		},
		dialogCombineOrderFormDone:function(data,form){//form提交后的回调函数
			var $p = $(form).parents(".unitBox:first");
			var url=$("#refreshCombineOrderUrl",$p).val();
			var dialogId = $("#dialogId",$p).val();
			Bird.ajaxDone(data);
			//有单据则根据orderNo进行加载，无则新增页面 
			$.pdialog.reload(url,{dialogId:dialogId,data:'orderNo='+data.orderNo});
		},
		checkCombineDetail:function(btn){
			var $p = $(btn).parents(".unitBox:first");
			var detailSize = $("#combineDetailSize",$p).val();
			if(!detailSize || detailSize < 1){
				alertMsg.error("没有输入单据的明细内容，不能保存！如果你想不保存退出请关闭本窗口！");
				return false;
			}
			if(!migr.commonOrderMoneyAndAmountValidatePositiveFloat("combinedetail.goodNum",$p)){
				return false;
			}
			return true;
		},
		changeType:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var detailSize = $("#combineDetailSize",$p).val();
			if(detailSize && detailSize > 0){
				alertMsg.confirm("现有数据将被清空,你确定要改变组合方式吗?",{
					okCall:function(){  
						var type=$("select[name='combineorder.type']",$p).val();
						var clearUrl=$("#clearCombineOrderUrl",$p).val()+"?goodType="+type;
						jQuery.pdialog.reload(clearUrl,{dialogId:$("#dialogId",$p).val(),data:'isNew=1'});
					}
				});
			}else
			{
				var type=$("select[name='combineorder.type']",$p).val();
				var clearUrl=$("#clearCombineOrderUrl",$p).val()+"?goodType="+type;
				jQuery.pdialog.reload(clearUrl,{dialogId:$("#dialogId",$p).val(),data:'isNew=1'});
			}
		},
		updateCombineDetail:function(input,id,defaultscale,numscale,moneyscale){
			if($(input).attr("name")!='memo'){
				//校验数字格式
				if(!$(input).val().isNumber()){
					alertMsg.error("请输入合法的数字！");
					$(input).focus();
					$(input).addClass("error");
					return; 
				}
				$(input).removeClass("error");
			}
			var $p = $(input).parents(".unitBox:first");
			var updateDetailUrl = $("#updateCombineDetailUrl",$p).val();
			var $tr = $(input).parents("tr:first");
			$.ajax({
	    		type:"POST",
	    		url: updateDetailUrl,
	    		dataType: "json",
	    		data:"combinedetail.id="+id+"&"+$(input).serialize(),
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
	    				if(data.data)
	    				{
	    					$("input[name='combinedetail.goodNum']",$tr).val(setScale(data.data.goodNum,numscale, "roundhalfup"));
	    					$("td[rname='costPrice']",$tr).text(setScale(data.data.costPrice,moneyscale, "roundhalfup"));
	    					$("td[rname='totalSum']",$tr).text(setScale(data.data.totalSum,moneyscale, "roundhalfup"));
	    					$("td[rname='ttNum']",$p).text(setScale(data.data.tNum,numscale, "roundhalfup"));
	    					$("td[rname='tTotal']",$p).text(setScale(data.data.tTotal,moneyscale, "roundhalfup"));
	    				}
	    			}
	    		}
	    	});
		},
		deleteCombineorder:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			if($("#state",$p).val()=="0"){
				alertMsg.confirm("确认删除？", {
		    		okCall: function(){
		    			$("#orderForm",$p).attr("action",$("#dropCombineOrderUrl",$p).val());
						$("#orderForm",$p).submit();
		    		}
		    	});
			}else{
				alertMsg.error('无法删除单据.');
			}
		},
		newCombineorder:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var orderNo = $("#orderNo",$p).val();
			var detailSize = $("#combineDetailSize",$p).val();		
			if(detailSize>0 && orderNo.length==0)
			{
				alertMsg.confirm("当前单据未保存,你确定要新建?如果新建单据,当前数据将被删除!", {
		    		okCall: function(){
		    			var url=$("#clearCombineOrderUrl",$p).val();
		    			//新建单据 跳转到初始的新增页面
		    			$.pdialog.reload(url,{dialogId:$("#dialogId",$p).val(),data:'isNew=1&goodType=2'});
		    		}
		    	});
			}else
			{	
				var url=$("#clearCombineOrderUrl",$p).val();
				//新建单据 跳转到初始的新增页面
				$.pdialog.reload(url,{dialogId:$("#dialogId",$p).val(),data:'isNew=1&goodType=2'});
			}
		},
		//选择purch后的回调方法
		chooseCombineOrderCallback:function(args,$p){
			//选择purch后，获取传来的orderNo
			var orderNo = args["orderNo"];
			//根据orderNo打开相应的明细单据
			var url=$("#refreshCombineOrderUrl",$p).val();
			var dialogId = $("#dialogId",$p).val();
			//根据orderNo打开相应单据
			$.pdialog.reload(url,{dialogId:dialogId,data:'orderNo='+orderNo});
		},
		beforeAdstockorderDetailChoose:function(btn){
			var $lookBtn = $(btn);
			var $p = $lookBtn.parents(".unitBox:first");
			
			var branchCode = $("input[name='adstockorder.branchCode']",$p).val();
			if(branchCode==''){
				alertMsg.error("请选择仓库！");
				return false;
			}
			
			return true;
		},
		addAdstockDetail:function(args,$p){
			var codes = args['goodCode'];
			var amount = args['goodNum'];
			if(amount==undefined){
				amount=0;
			}
			if(jQuery(".branchName",$p).val()==''){
				alert("请选择仓库");
				return false;
			}
			var url=$("#addAdstockDetailUrl",$p).val()+"?goodCodes="+codes+"&amount="+amount;
			var refreshUrl=$("#refreshAdstockOrderUrl",$p).val();
			jQuery.ajax({
	    		type:"POST",
	    		url: url,
	    		data:$("#orderForm",$p).serialize(),
	    		dataType: "json",
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
	    				var dialog = $.pdialog.reload(refreshUrl,{dialogId:$("#dialogId",$p).val(),data:$("#orderForm",$p).serialize()});
	    				if(dialog){
	    					var box = dialog.find(".dialogContent");
	    					$.setLookupBox(box);
	    				}
	    				
	    			}
	    		}
	    	});
		},
		refreshAdstockOrder:function(data,btn){//刷新adstockorderForm页面
			var $p = $(btn).parents(".unitBox:first");
			var refreshUrl=$("#refreshAdstockOrderUrl",$p).val();
			var dialogId = $("#dialogId",$p).val();
			$.pdialog.reload(refreshUrl,{dialogId:dialogId,data:$("#orderForm",$p).serialize()});
		},
		refreshAdstockOrder1:function(btn,data){//刷新adstockorderForm页面
			var $p = $(btn).parents(".unitBox:first");
			var refreshUrl=$("#refreshAdstockOrderUrl",$p).val();
			var dialogId = $("#dialogId",$p).val();
			$.pdialog.reload(refreshUrl,{dialogId:dialogId,data:$("#orderForm",$p).serialize()});
		},
		dialogAdstockOrderFormDone:function(data,form){//form提交后的回调函数
			var $p = $(form).parents(".unitBox:first");
			var url=$("#refreshAdstockOrderUrl",$p).val();
			var dialogId = $("#dialogId",$p).val();
			Bird.ajaxDone(data);
			//有单据则根据orderNo进行加载，无则新增页面 
			$.pdialog.reload(url,{dialogId:dialogId,data:'isNew=1&adstockorder.orderNo='+data.orderNo});
		},
		checkAdstockDetail:function(btn){
			var $p = $(btn).parents(".unitBox:first");
			var detailSize = $("#adstockDetailSize",$p).val();
			if(!detailSize || detailSize < 1){
				alertMsg.error("没有输入单据的明细内容，不能保存！如果你想不保存退出请关闭本窗口！");
				return false;
			}
			if(!migr.commonOrderMoneyAndAmountValidatePositiveFloat("goodNum",$p)){
				return false;
			}else if(!migr.commonOrderMoneyAndAmountValidatePositiveFloat("boxNum",$p)){
				return false;
			}else if(!migr.commonOrderMoneyAndAmountValidateNotNegativeFloat("costPrice",$p)){
				return false;
			}
			return true;
		},
		updateAdstockDetail:function(input,id){
			if($(input).attr("name")!='memo'){
				//校验数字格式
				if(!$(input).val().isNumber()){
					alertMsg.error("请输入合法的数字！");
					$(input).focus();
					$(input).addClass("error");
					return;
				}
				$(input).removeClass("error");
			}
			var $p = $(input).parents(".unitBox:first");
			var updateDetailUrl = $("#updateAdstockDetailUrl",$p).val();
			var $tr = $(input).parents("tr:first");
			$.ajax({
	    		type:"POST",
	    		url: updateDetailUrl,
	    		dataType: "json",
	    		data:"adstockdetail.goodCode="+id+"&"+$(input).serialize(),
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
	    				if(data.data){
	    					$("input[name='adstockdetail.goodNum']",$tr).val(setScale(data.data.goodNum, 2, "roundhalfup"));
	    					$("input[name='adstockdetail.boxNum']",$tr).val(setScale(data.data.boxNum, 2, "roundhalfup"));
	    					$("input[name='adstockdetail.costPrice']",$tr).text(setScale(data.data.costPrice, 2, "roundhalfup"));
	    					$("td[rname='totalSum']",$tr).text(setScale(data.data.totalSum, 2, "roundhalfup"));
	    					$("td[rname='tNum']",$p).text(setScale(data.data.tNum, 2, "roundhalfup"));
	    					$("td[rname='tTotal']",$p).text(setScale(data.data.tTotal, 2, "roundhalfup"));
	    				}
	    			}
	    		}
	    	});
		},
		//删除当前单据，在没有审核时可以删除
		dropAdstockOrder:function(btn){
			var $p = $(btn).parents(".unitBox:first");
			//获取purch的状态，如果是未审核状态就可以删除，否则不可以删除
			var state = $("[name='adstockorder.state']",$p).val();
			if(state && state == '0'){
				alertMsg.confirm("确认删除单据？",{
					okCall:function(){
						var dropAdstockOrderUrl = $("#dropAdstockOrderUrl",$p).val();
						//获取Id进行删除
						$.ajax({
				    		type:"POST",
				    		url: dropAdstockOrderUrl,
				    		dataType: "json",
				    		data:$("input[name='adstockorder.orderNo']",$p).serialize(),
				    		async: false,
				    		success: function(data) {
				    			if(data.statusCode=="200"){
				    				alertMsg.correct(data.message);
				    				//继续打开新增页面
				    				var refreshUrl=$("#refreshAdstockOrderUrl",$p).val();
				    				var dialogId = $("#dialogId",$p).val();
				    				$.pdialog.reload(refreshUrl,{dialogId:dialogId,data:'isNew=1'});
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
		newAdstockOrder:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var orderNo = $("#orderNo",$p).val();
			var detailSize = $("#adstockDetailSize",$p).val();		
			if(detailSize>0 && orderNo.length==0)
			{
				alertMsg.confirm("当前单据未保存,你确定要新建?如果新建单据,当前数据将被删除!", {
		    		okCall: function(){
		    			var url=$("#refreshAdstockOrderUrl",$p).val();
		    			//新建单据 跳转到初始的新增页面
		    			$.pdialog.reload(url,{dialogId:$("#dialogId",$p).val(),data:'isNew=1'});
		    		}
		    	});
			}else
			{	
				var url=$("#refreshAdstockOrderUrl",$p).val();
				//新建单据 跳转到初始的新增页面
				$.pdialog.reload(url,{dialogId:$("#dialogId",$p).val(),data:'isNew=1'});
			}
		},
		chooseAdstockOrderCallback:function(args,$p){
			var orderNo = args["orderNo"];
			//根据orderNo打开相应的明细单据
			var url=$("#refreshAdstockOrderUrl",$p).val();
			var dialogId = $("#dialogId",$p).val();
			//根据orderNo打开相应单据
			$.pdialog.reload(url,{dialogId:dialogId,data:'isNew=1&adstockorder.orderNo='+orderNo});
		},
		addAdcostDetail:function(args,$p){
			var codes = args['goodCode'];
			var amount = args['goodNum'];
			if(amount==undefined){
				amount=0;
			}
			var url=$("#addAdcostDetailUrl",$p).val()+"?goodCodes="+codes+"&amount="+amount;
			var refreshUrl=$("#refreshAdcostOrderUrl",$p).val();
			jQuery.ajax({
	    		type:"POST",
	    		url: url,
	    		dataType: "json",
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="300")
	    			{
	    				alertMsg.error(data.message);
	    			}else{
	    				var dialog = $.pdialog.reload(refreshUrl,{dialogId:$("#dialogId",$p).val(),data:$("#adcostorderForm",$p).serialize()});
	    				if(dialog){
	    					var box = dialog.find(".dialogContent");
	    					$.setLookupBox(box);
	    				}
	    			}
	    		}
	    	});
		},
		refreshAdcostOrder:function(data,btn){//刷新adcostorderForm页面
			var $p = $(btn).parents(".unitBox:first");
			var refreshUrl=$("#refreshAdcostOrderUrl",$p).val();
			var dialogId = $("#dialogId",$p).val();
			$.pdialog.reload(refreshUrl,{dialogId:dialogId,data:$("#adcostorderForm",$p).serialize()});
		},
		refreshAdcostOrder1:function(btn,data){//刷新adcostorderForm页面
			var $p = $(btn).parents(".unitBox:first");
			var refreshUrl=$("#refreshAdcostOrderUrl",$p).val();
			var dialogId = $("#dialogId",$p).val();
			$.pdialog.reload(refreshUrl,{dialogId:dialogId,data:$("#adcostorderForm",$p).serialize()});
		},
		dialogAdcostOrderFormDone:function(data,form){//form提交后的回调函数
			var $p = $(form).parents(".unitBox:first");
			var url=$("#refreshAdcostOrderUrl",$p).val();
			var dialogId = $("#dialogId",$p).val();
			Bird.ajaxDone(data);
			//有单据则根据orderNo进行加载，无则新增页面 
			$.pdialog.reload(url,{dialogId:dialogId,data:'isNew=1&adcostorder.orderNo='+data.orderNo});
		},
		updateAdcostDetail:function(input,id,defaultScale,numScale,moneyScale){
			if($(input).attr("name")!='memo'){
				//校验数字格式
				if(!$(input).val().isNumber()){
					alertMsg.error("请输入合法的数字！");
					$(input).focus();
					$(input).addClass("error");
					return;
				}
				$(input).removeClass("error");
			}
			var $p = $(input).parents(".unitBox:first");
			var updateDetailUrl = $("#updateAdcostDetailUrl",$p).val();
			var $tr = $(input).parents("tr:first");
			$.ajax({
	    		type:"POST",
	    		url: updateDetailUrl,
	    		dataType: "json",
	    		data:"adcostdetail.goodCode="+id+"&"+$(input).serialize(),
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
	    				if(data.data){
	    					$("input[name='adcostdetail.goodNum']",$tr).val(setScale(data.data.goodNum, numScale, "roundhalfup"));
	    					$("input[name='adcostdetail.newPrice']",$tr).text(setScale(data.data.newPrice, moneyScale, "roundhalfup"));
	    					$("td[rname='marginSum']",$tr).text(setScale(data.data.marginSum, moneyScale, "roundhalfup"));
	    					$("td[rname='tNum']",$p).text(setScale(data.data.tNum,numScale, "roundhalfup"));
	    					$("td[rname='tTotal']",$p).text(setScale(data.data.tTotal,moneyScale, "roundhalfup"));
	    				}
	    			}
	    		}
	    	});
		},
		//删除当前单据，在没有审核时可以删除
		dropAdcostOrder:function(btn){
			var $p = $(btn).parents(".unitBox:first");
			//获取purch的状态，如果是未审核状态就可以删除，否则不可以删除
			var state = $("[name='adcostorder.state']",$p).val();
			if(state && state == '0'){
				alertMsg.confirm("确认删除单据？",{
					okCall:function(){
						var dropAdcostOrderUrl = $("#dropAdcostOrderUrl",$p).val();
						//获取Id进行删除
						$.ajax({
				    		type:"POST",
				    		url: dropAdcostOrderUrl,
				    		dataType: "json",
				    		data:$("input[name='adcostorder.orderNo']",$p).serialize(),
				    		async: false,
				    		success: function(data) {
				    			if(data.statusCode=="200"){
				    				alertMsg.correct(data.message);
				    				//继续打开新增页面
				    				var refreshUrl=$("#refreshAdcostOrderUrl",$p).val();
				    				var dialogId = $("#dialogId",$p).val();
				    				$.pdialog.reload(refreshUrl,{dialogId:dialogId,data:'isNew=1'});
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
		newAdcostOrder:function(obj){
			alert(1212);
			var $p = $(obj).parents(".unitBox:first");
			var orderNo = $("#orderNo",$p).val();
			var detailSize = $("#adcostDetailSize",$p).val();	
			if(!migr.commonOrderMoneyAndAmountValidatePositiveFloat("goodNum",$p)){
				return ;
			}else if(!migr.commonOrderMoneyAndAmountValidateNotNegativeFloat("newPrice",$p)){
				return ;
			}
			if(detailSize>0 && orderNo.length==0)
			{
				alertMsg.confirm("当前单据未保存,你确定要新建?如果新建单据,当前数据将被删除!", {
		    		okCall: function(){
		    			var url=$("#refreshAdcostOrderUrl",$p).val();
		    			//新建单据 跳转到初始的新增页面
		    			$.pdialog.reload(url,{dialogId:$("#dialogId",$p).val(),data:'isNew=1'});
		    		}
		    	});
			}else
			{	
				var url=$("#refreshAdcostOrderUrl",$p).val();
				//新建单据 跳转到初始的新增页面
				$.pdialog.reload(url,{dialogId:$("#dialogId",$p).val(),data:'isNew=1'});
			}
		},
		checkAdcostDetail:function(btn){
			var $p = $(btn).parents(".unitBox:first");
			var detailSize = $("#adcostDetailSize",$p).val();
			if(!detailSize || detailSize < 1){
				alertMsg.error("没有输入单据的明细内容，不能保存！如果你想不保存退出请关闭本窗口！");
				return false;
			}
			return true;
		},
		chooseAdcostOrderCallback:function(args,$p){
			var orderNo = args["orderNo"];
			//根据orderNo打开相应的明细单据
			var url=$("#refreshAdcostOrderUrl",$p).val();
			var dialogId = $("#dialogId",$p).val();
			//根据orderNo打开相应单据
			$.pdialog.reload(url,{dialogId:dialogId,data:'isNew=1&adcostorder.orderNo='+orderNo});
		},
		addTransferDetail:function(args,$p){
			var codes = args['goodCode'];
			var amount = args['goodNum'];
			if(amount==undefined){
				amount=0;
			}
			if(jQuery(".inBranchName",$p).val()==''){
				alert("请选择调入仓库");
				return false;
			}
			if(jQuery(".outBranchName",$p).val()==''){
				alert("请选择调出仓库");
				return false;
			}
			var url=$("#addTransferDetailUrl",$p).val()+"?goodCodes="+codes+"&amount="+amount;
			var refreshUrl=$("#refreshTransferOrderUrl",$p).val();
			jQuery.ajax({
	    		type:"POST",
	    		url: url,
	    		data:$("#orderForm",$p).serialize(),
	    		dataType: "json",
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
	    				var dialog = $.pdialog.reload(refreshUrl,{dialogId:$("#dialogId",$p).val(),data:$("#orderForm",$p).serialize()});
	    				if(dialog){
	    					var box = dialog.find(".dialogContent");
	    					$.setLookupBox(box);
	    				}
	    			}
	    		}
	    	});
		},
		refreshTransferOrder:function(data,btn){
			var $p = $(btn).parents(".unitBox:first");
			var refreshUrl=$("#refreshTransferOrderUrl",$p).val();
			var dialogId = $("#dialogId",$p).val();
			$.pdialog.reload(refreshUrl,{dialogId:dialogId,data:$("#orderForm",$p).serialize()});
		},
		refreshTransferOrder1:function(btn,data){
			var $p = $(btn).parents(".unitBox:first");
			var refreshUrl=$("#refreshTransferOrderUrl",$p).val();
			var dialogId = $("#dialogId",$p).val();
			$.pdialog.reload(refreshUrl,{dialogId:dialogId,data:$("#orderForm",$p).serialize()});
		},
		dialogTransferOrderFormDone:function(data,form){//form提交后的回调函数
			var $p = $(form).parents(".unitBox:first");
			var url=$("#refreshTransferOrderUrl",$p).val();
			var dialogId = $("#dialogId",$p).val();
			Bird.ajaxDone(data);
			//有单据则根据orderNo进行加载，无则新增页面 
			$.pdialog.reload(url,{dialogId:dialogId,data:'isNew=1&transferorder.orderNo='+data.orderNo});
		},
		updateTransferDetail:function(input,id,defaultscale,numscale,moneyscale){
			if($(input).attr("name")!='memo'){
				//校验数字格式
				if(!$(input).val().isNumber()){
					alertMsg.error("请输入合法的数字！");
					$(input).focus();
					$(input).addClass("error");
					return;
				}
				$(input).removeClass("error");
			}
			var $p = $(input).parents(".unitBox:first");
			var updateDetailUrl = $("#updateTransferDetailUrl",$p).val();
			var $tr = $(input).parents("tr:first");
			$.ajax({
	    		type:"POST",
	    		url: updateDetailUrl,
	    		dataType: "json",
	    		data:"transferdetail.goodCode="+id+"&"+$(input).serialize(),
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
	    				if(data.data){
	    					$("input[name='transferdetail.boxNum']",$tr).val(setScale(data.data.boxNum,defaultscale, "roundhalfup"));
	    					$("input[name='transferdetail.goodNum']",$tr).val(setScale(data.data.goodNum,numscale, "roundhalfup"));
	    					$("input[name='transferdetail.costPrice']",$tr).val(setScale(data.data.costPrice,moneyscale, "roundhalfup"));
	    					$("td[rname='totalSum']",$tr).text(setScale(data.data.totalSum,moneyscale, "roundhalfup"));
	    					$("td[rname='tNum']",$p).text(setScale(data.data.tNum,numscale, "roundhalfup"));
	    					$("td[rname='tTotal']",$p).text(setScale(data.data.tTotal,moneyscale, "roundhalfup"));
	    				}
	    			}
	    		}
	    	});
		},
		//删除当前单据，在没有审核时可以删除
		dropTransferOrder:function(btn){
			var $p = $(btn).parents(".unitBox:first");
			//获取purch的状态，如果是未审核状态就可以删除，否则不可以删除
			var state = $("[name='transferorder.state']",$p).val();
			if(state && state == '0'){
				alertMsg.confirm("确认删除单据？",{
					okCall:function(){
						var dropTransferOrderUrl = $("#dropTransferOrderUrl",$p).val();
						//获取Id进行删除
						$.ajax({
				    		type:"POST",
				    		url: dropTransferOrderUrl,
				    		dataType: "json",
				    		data:$("input[name='transferorder.orderNo']",$p).serialize(),
				    		async: false,
				    		success: function(data) {
				    			if(data.statusCode=="200"){
				    				alertMsg.correct(data.message);
				    				//继续打开新增页面
				    				var refreshUrl=$("#refreshTransferOrderUrl",$p).val();
				    				var dialogId = $("#dialogId",$p).val();
				    				$.pdialog.reload(refreshUrl,{dialogId:dialogId,data:'isNew=1'});
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
		newTransferOrder:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var orderNo = $("#orderNo",$p).val();
			var detailSize = $("#transferDetailSize",$p).val();		
			if(detailSize>0 && orderNo.length==0)
			{
				alertMsg.confirm("当前单据未保存,你确定要新建?如果新建单据,当前数据将被删除!", {
		    		okCall: function(){
		    			var url=$("#refreshTransferOrderUrl",$p).val();
		    			//新建单据 跳转到初始的新增页面
		    			$.pdialog.reload(url,{dialogId:$("#dialogId",$p).val(),data:'isNew=1'});
		    		}
		    	});
			}else
			{	
				var url=$("#refreshTransferOrderUrl",$p).val();
				//新建单据 跳转到初始的新增页面
				$.pdialog.reload(url,{dialogId:$("#dialogId",$p).val(),data:'isNew=1'});
			}
		},
		checkTransferDetail:function(btn){
			var $p = $(btn).parents(".unitBox:first");
			var outbranch = $("input[name='transferorder.outBranchCode']",$p).val();
			var intbranch = $("input[name='transferorder.inBranchCode']",$p).val();
			if(outbranch==intbranch)
			{
				alertMsg.error("调出和调入不能是同一个仓库!");
				return false;
			}
			var detailSize = $("#transferDetailSize",$p).val();
			if(!detailSize || detailSize < 1){
				alertMsg.error("没有输入单据的明细内容，不能保存！如果你想不保存退出请关闭本窗口！");
				return false;
			}
			if(!migr.commonOrderMoneyAndAmountValidatePositiveFloat("transferdetail.goodNum",$p)){
				return false;
			}else if(!migr.commonOrderMoneyAndAmountValidatePositiveFloat("transferdetail.boxNum",$p)){
				return false;
			}else if(!migr.commonOrderMoneyAndAmountValidateNotNegativeFloat("transferdetail.costPrice",$p)){
				return false;
			}
			return true;
		},
		chooseTransferOrderCallback:function(args,$p){
			var orderNo = args["orderNo"];
			//根据orderNo打开相应的明细单据
			var url=$("#refreshTransferOrderUrl",$p).val();
			var dialogId = $("#dialogId",$p).val();
			//根据orderNo打开相应单据
			$.pdialog.reload(url,{dialogId:dialogId,data:'isNew=1&transferorder.orderNo='+orderNo});
		},
		vipcategoryFresh:function()
		{	
			$("#vipcategory").loadUrl(Bird.homePath+'/member/vipcategory!list.do','',function(){
				$("#vipcategory").find("[layoutH]").layoutH();},'POST');	
		},
		
		
		savePosSaleSet:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			alertMsg.confirm("确认要保存？", {
	    		okCall: function()
	    		{
	    			var url=$("#savePosSaleSetUrl").val();
	    			jQuery.ajax({
	    				type:"POST",
	    				url: url,
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
	    		}
	    	});
		},
		savePrintsetup:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			alertMsg.confirm("确认要保存？", {
	    		okCall: function()
	    		{
					$("#printsetupForm").submit();
	    		}
	    	});  
		},
		savePrintformat:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			alertMsg.confirm("确认要保存？", {
	    		okCall: function()
	    		{
					$("#printformatForm").submit();
	    		}
	    	});
		},
		toOpPresent:function(obj,isReturn){
			var $p = $(obj).parents(".unitBox:first");
			var cardid = $("input[name='vipinfo.cardid']",$p).val();
			var url=$("#opPresentUrl",$p).val()+"?presentcard.currVipCode="+cardid+"&presentcard.isReturn="+isReturn;
			alertMsg.confirm("确认操作？", {
	    		okCall: function()
	    		{
	    			jQuery.ajax({
	    	    		type:"POST",
	    	    		url: url,
	    	    		dataType: "json",
	    	    		async: false,
	    	    		success: function(data){
	    	    			if(data.statusCode=="300"){
	    	    				alertMsg.error(data.message);
	    	    			}else if(data.statusCode=="200"){
	    	    				$("input[name='presentMoney']",$p).val(0);
	    	    				alertMsg.info(data.message);
	    	    				migr.commRefreshOrder(obj);
	    	    			}
	    	    		}
	    	    	});
	    		}
	    	}); 
			
		},
		toPresentcardOrderVipinfo:function(obj){
			var $p = $(obj).parents(".unitBox:first");	
			var cardid = $("input[name='vipinfo.cardid']",$p).val();
			var url=$("#presentcardOrderUrl",$p).val()+"?presentcard.currVipCode="+cardid;
			var options = {};
			options.mask = eval("true");
			options.width = $(obj).attr("width");
			options.height = $(obj).attr("height");
			var rel = $(obj).attr("rel");
			$.pdialog.open(url, rel, '赠礼号分配', options);
		},
		toPresentcardOrder:function(obj){
			var $p = $(obj).parents(".unitBox:first");	
			var cardid = $("input[name='recharge.cardid']",$p).val();
			if(cardid=='' || cardid.length==0)
			{
				alertMsg.error("请输入会员ID号！", {
		    		okCall: function()
		    		{
		    			$("input[name='recharge.cardid']",$p).focus();
		    		}
		    	});
				return false;
			}else
			{	
				var url=$("#presentcardOrderUrl",$p).val()+"?presentcard.currVipCode="+cardid;
				var options = {};
				options.mask = eval("true");
				options.width = $(obj).attr("width");
				options.height = $(obj).attr("height");
				var rel = $(obj).attr("rel");
				$.pdialog.open(url, rel, '赠礼号分配', options);
			}
		},
		toViewOrder:function(obj){
			var $p = $(obj).parents(".unitBox:first");	
			var cardid = $("input[name='recharge.cardid']",$p).val();
			if(cardid=='' || cardid.length==0)
			{
				alertMsg.error("请输入会员ID号！", {
		    		okCall: function()
		    		{
		    			$("input[name='recharge.cardid']",$p).focus();
		    		}
		    	});
				return false;
			}else
			{	
				var url=$("#viewOrderUrl",$p).val()+"?presentcard.currVipCode="+cardid;
				var options = {};
				options.mask = eval("true");
				options.width = $(obj).attr("width");
				options.height = $(obj).attr("height");
				var rel = $(obj).attr("rel");
				$.pdialog.open(url, rel, '查看排队情况', options);
			}
		},
		//------------------------------------------会员模块开始
		//-------------会员设置
		//-------------会员设置公用的东西
		saveMemberSet:function(obj,firstUrl){
			var $p = $(obj).parents(".unitBox:first");
			alertMsg.confirm("确认要保存？", {
	    		okCall: function()
	    		{
	    			var url="";
	    			if(firstUrl!=undefined){
	    				url=$("#"+firstUrl,$p).val();
	    			}else{
	    				url=$("#saveMemberSetUrl",$p).val();
	    			}
	    			jQuery.ajax({
	    				type:"POST",
	    				url: url,
	    				data:"curTab="+$("#curTab",$p).val(),
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
	    		}
	    	});
		},
		membermodify_by_checkbox:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var check;
			if($(obj).attr("checked")){
				check=1;
			}else{
				check=0;
			}
			var url=$("#updateMemberSetUrl",$p).val();
			jQuery.ajax({
				type:"POST",
				url: url,
				data:"id="+$(obj).attr("pid")+"&checked="+check+"&curTab="+$("#curTab",$p).val(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.status=="error"){
						alertMsg.error(data.message);
					}
				}
			});
		},
		//会员的一般设置
		membermodify_day:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			if(!migr.commonNotNegativeInteger(obj,"会员生日提醒的天数必须大于等于0")){
				return ;
			}
			var url=$("#updateMemberSetUrl",$p).val();
			jQuery.ajax({
				type:"POST",
				url: url,
				data:"id="+$(obj).attr("pid")+"&day="+$(obj).attr("value")+"&curTab="+$("#curTab",$p).val(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.status=="error"){
						alertMsg.error(data.message);
					}
				}
			});
		},
		memberset:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			$("#curTab",$p).val("membersetTab");
		},
		//充值业务设置
		 recharge:function(obj){ 
			var $p = $(obj).parents(".unitBox:first");
			var $rechargeDiv = $("#recharge",$p);
			$("#curTab",$p).val("rechargeTab");
			$rechargeDiv.loadUrl($(obj).attr("objUrl"),'',function(){$rechargeDiv.find("[layoutH]").layoutH();});//展示控件初始化},'POST');
		},
		 modify_day:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			if(!migr.commonNotNegativeFloat(obj,$(obj).attr("validMessage"))){
				return ;
			}
			var url=$("#updateMemberSetUrl",$p).val();
			jQuery.ajax({
				type:"POST",
				url: url,
				data:"id="+$(obj).attr("pid")+"&day="+$(obj).attr("value")+"&curTab="+$("#curTab",$p).val(),
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.status=="error"){
						alertMsg.error(data.message);
					}
				}
			});
		},
		//--------------会员类别
		vipcategorylist:function(obj){ 
			var $p = $(obj).parents(".unitBox:first");
			var $vipcategoryDiv = $("#vipcategory",$p);
			$("#curTab",$p).val("vipcategoryTab");
			$vipcategoryDiv.loadUrl($(obj).attr("objUrl"),'',function(){$vipcategoryDiv.find("[layoutH]").layoutH();});//展示控件初始化},'POST');
		},
		//-------------会员升级
		vipupgradeDetail:function(obj,id,moneyscale){
			var $p = $(obj).parents(".unitBox:first");
			if(!migr.commonFloat(obj,$(obj).attr("validMessage"))){
				return ;
			}
			var updateUrl = $("#updetailVipUpgradeUrl",$p).val();
			$.ajax({
	    		type:"POST",
	    		url: updateUrl,
	    		dataType: "json",
	    		data:"id="+id+"&"+$(obj).serialize(),
	    		async: false,
	    		success: function(data) {
	    			if(data.statusCode=="300"){
	    				alertMsg.error(data.message);
	    			}else{
	    				$(obj).val(setScale($(obj).val(),moneyscale,"roundhalfup"));
	    				$(obj).attr("oldValue",$(obj).val());
	    			}
	    		}
	    	});
		},
		 vipupgrade:function(obj){ 
			 var $p = $(obj).parents(".unitBox:first");
			 var $vipupgradeDiv = $("#vipupgrade",$p);
			 $("#curTab",$p).val("vipupgradeTab");
			 $vipupgradeDiv.loadUrl($(obj).attr("objUrl"),'',function(){$vipupgradeDiv.find("[layoutH]").layoutH();});//展示控件初始化},'POST');
		},
		vipcategoryUpgradeFlag:function(obj)
		{
			 var $p = $(obj).parents(".unitBox:first");
    		 var url=$("#upUpgradeFlagUrl",$p).val();
        	 jQuery.ajax({
        		type:"POST",
        		url: url,
        		data:$(obj).serialize(),
        		dataType: "json",
        		async: false,
        		success: function(data) {
        			if(data.status=="error"){
        				alertMsg.error(data.message);
        			}else{
        				var curTab=$("#curTab",$p).val();
        				$("#"+curTab,$p).trigger("click");
        			}
        		}
        	});
		}
		,
		//--------------积分规则
		changeIntegralRule:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var categoryCode = $("#integrcategoryCode",$p).val();
			$("#integralrule").loadUrl(Bird.homePath+'/member/integralrule!list.do?categoryCode='+categoryCode,'','');	
		},
		integralrulemodify:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var updateIntegralruleUrl=$("#updateIntegralruleUrl",$p).val();
			var flag="checkbox";
			if($(obj).attr("type")=='checkbox'){
				if($(obj).attr("checked")){
					$(obj).val(1);
				}else{
					$(obj).val(0);
				}
			}else if($(obj).attr("type")=='radio'){
				 flag="radio";
			}else{
				 flag="text";
			}
			updateIntegralruleUrl=updateIntegralruleUrl+"&"+$(obj).attr("name")+"="+$(obj).val();
			updateIntegralruleUrl=updateIntegralruleUrl+"&integralrule.changeProp="+$(obj).attr("name");
			jQuery.ajax({
				type:"POST",
				url: updateIntegralruleUrl,
				dataType: "json",
				data:null,
				async: false,
				success: function(data) {
					if(flag=="radio"){
						var curTab=$("#curTab",$p).val();
						$("#"+curTab,$p).trigger("click");
					}
				}
			});
		},
		integralrule:function(obj){ 
			var $p = $(obj).parents(".unitBox:first");
			var $integralruleDiv = $("#integralrule",$p);
			$("#curTab",$p).val("integralruleTab");
			$integralruleDiv.loadUrl($(obj).attr("objUrl"),'',function(){$integralruleDiv.find("[layoutH]").layoutH();});//展示控件初始化},'POST');
		},
		
		//-------------会员模块公用的东西
		queryMember:function(obj){//公用的读卡功能（不包过充值和积分转储值的读卡功能）
			var $p = $(obj).parents(".unitBox:first");	
			var cardid = $("input[name='vipinfo.cardid']",$p).val();
			var branchCode = $("input[name='branchCode']",$p).val();
			var $reReadCard=$("#reReadCard",$p);
			if($reReadCard!=undefined){//表明是读卡操作标记
				$reReadCard.val("0");
			}
			if(cardid=='' || cardid.length==0){alertMsg.error("请输入会员ID号！", {okCall: function(){$("input[name='vipinfo.cardid']",$p).focus();}});
				return false;
			}else{	
				//校验cardid是否存在
				var url=$("#checkCardIdIsExistUrl",$p).val();
    			jQuery.ajax({
    				type:"POST",
    				url: url,
    				dataType: "json",
    				data:"vipinfo.cardid="+cardid+"&branchCode="+branchCode,
    				async: false,
    				success: function(data) {
    					if(data){
    						alertMsg.error("此会员ID不存在,请重新输入", {okCall: function(){$("input[name='vipinfo.cardid']",$p).focus();}});
    					}else{
    						if($("#queryMemberForm",$p).attr("action")!=undefined){
    							$("#queryMemberForm",$p).submit();
    						}else{
    							$("#orderForm",$p).submit();
    						}
    					}
    				}
    			});
			}
		},
		czqueryMember:function(obj){//充值和积分转储值的读卡功能
			var $p = $(obj).parents(".unitBox:first");	
			var cardid = $("input[name='recharge.cardid']",$p).val();
			if(cardid=='' || cardid.length==0){
				alertMsg.error("请输入会员ID号！", {okCall: function(){$("input[name='recharge.cardid']",$p).focus();}});
				return false;
			}else{	
				//校验cardid是否存在
				var url=$("#checkCardIdIsExistUrl",$p).val();
    			jQuery.ajax({
    				type:"POST",
    				url: url,
    				dataType: "json",
    				data:"vipinfo.cardid="+cardid,
    				async: false,
    				success: function(data) {
    					if(data){
    						alertMsg.error("此会员ID不存在,请重新输入");
    						$("input[name='recharge.cardid']",$p).focus();
    					}else{
    						$("#queryMemberForm",$p).submit();
    					}
    				}
    			});
			}
		},
		isHaveReadVipCard:function(state,p,cardid){//判断是否读卡了
			if(state==''){
				alertMsg.error("请先读卡!",{okCall: function(){$("input[name='"+cardid+"']",p).focus();}});
				return false;
			}
			return true;
		},
		isNormalVipCard:function(state,p,cardid){//判断是否是正常会员卡
			if(state!=0)
			{
				alertMsg.error("会员卡状态不正常！", {okCall: function(){$("input[name='"+cardid+"']",p).focus();}});
				return false;
			}
			return true;
		},
		isHaveOperatorBranchForVipCard:function(branchName,branchCode,p){//判断是否有操作门店
			if($("input[name='"+branchName+"']",p).val()==''){
				alertMsg.error("当前操作用户是机构用户,必须选择一个操作门店！", {okCall: function(){$("input[name='"+branchCode+"']",p).focus();}});
				return false;
			}
			return true;
		}
		,
		//----------------充值卡管理
		resetMemberPassword:function(obj){
			var $p = $(obj).parents(".unitBox:first");
			var state = $("#cardstate",$p).val();
			if(!migr.isHaveReadVipCard(state,$p,"vipinfo.cardid")){//判断是否读卡了
				return;
			}
			var password=$("#memberPassword",$p).val();
			if(password==""){alertMsg.error("重置密码不能为空！", {okCall: function(){$("#memberPassword",$p).focus();}});
				return false;
			}
			alertMsg.confirm("确认重置密码？", {
	    		okCall: function()
	    		{
					var url=$("#resetMemberPasswordUrl",$p).val();
	    			jQuery.ajax({
	    				type:"POST",
	    				url: url,
	    				dataType: "json",
	    				data:$("#queryMemberForm",$p).serialize(),
	    				async: false,
	    				success: function(data) {
	    					if(data.statusCode=="300"){
	    						alertMsg.error(data.message);
	    					}else{
	    						alertMsg.correct(data.message);
	    					}
	    				}
	    			});
	    		}
	    	}); 
		},
		operMember:function(obj,state)//
		{
			var $p = $(obj).parents(".unitBox:first");	
			if(!migr.isHaveOperatorBranchForVipCard('branchName','branchCode',$p)){//判断是否有操作门店
				return;
			}
			var confirmMessage=$(obj).attr("confirmMessage");//得到操作的确认提示信息
			alertMsg.confirm(confirmMessage, {
	    		okCall: function()
	    		{
	    			$("#state",$p).val(state);   
	 				jQuery.ajax({
	 		    		type:"POST",
	 		    		url: $("#dealVipinfoCardOperatorUrl",$p).val(),
	 		    		data:$("#queryMemberForm",$p).serialize(),
	 		    		dataType: "json",
	 		    		async: false,
	 		    		success: function(data){
	 		    			if(data.statusCode=="300"){
	 		    				alertMsg.error($(obj).attr("errorMessage"));//提示错误信息
	 		    			}else{
	 		    				alertMsg.correct($(obj).attr("correctMessage"));//提示正确信息
	 		    				jQuery.pdialog.reload($("#queryMemberForm",$p).attr("action"),{dialogId:$("#dialogId",$p).val(),data:$("#queryMemberForm",$p).serialize()});
	 		    			}
	 		    		}
	 		    	});
	    		}
	    	});
		},
		//----------------补卡换卡
		changeCard:function(obj)
		{
			var $p = $(obj).parents(".unitBox:first");	
			if(!migr.isHaveOperatorBranchForVipCard('branchName','branchCode',$p)){//判断是否有操作门店
				return;
			}
			var state = $("#state",$p).val();
			if(!migr.isHaveReadVipCard(state,$p,"vipinfo.cardid")){//判断是否读卡了
				return;
			}
			if(!migr.isNormalVipCard(state,$p,"vipinfo.cardid")){//判断是否是正常会员卡
				return;
			}
			
			var cardid = $("input[name='newcardid']",$p).val();
			if(cardid=='' || cardid.length==0){
				alertMsg.error("请输入新会员ID号！", {okCall: function(){$("input[name='newcardid']",$p).focus();}});
				return false;
			}
			var oldcardid = $("#oldcardid",$p).val();
			var url=$("#changeCardUrl",$p).val()+"?newcardid="+cardid+"&vipinfo.cardid="+oldcardid;
			jQuery.ajax({
	    		type:"POST",
	    		url: url,
	    		dataType: "json",
	    		async: false,
	    		success: function(data){
	    			if(data.statusCode=="300"){
	    				alertMsg.error(data.message, {
	    		    		okCall: function(){
	    		    			$("input[name='newcardid']",$p).focus();
	    		    		}
	    		    	});
	    			}else{
	    				alertMsg.correct(data.message);
	    				jQuery.pdialog.reload($("#queryMemberForm",$p).attr("action"),{dialogId:$("#dialogId",$p).val(),data:$("#queryMemberForm",$p).serialize()});
	    			}
	    		}
	    	});
		},
		//----------------充值
		changeCzmoney:function(obj){//充值金额的联动
			var $p = $(obj).parents(".unitBox:first");
			var state = $("#state",$p).val();
			if(!migr.isHaveReadVipCard(state,$p,"recharge.cardid")){//先判断没有读卡
				return;
			}
			if(!migr.commonPositiveFloat(obj)){//校验正数
				return;
			};
			var $p = $(obj).parents(".unitBox:first");
			var $thisCzmoney=$("#thisCzmoney",$p);//本次充值金额
			var $thisSfxjForInput=$("input[name='recharge.sfxj']",$p);//本次实付金额(输入框的)
			var $thisSfxj=$("#thisSfxj",$p);//本次实付金额（红色显示的）
			$thisCzmoney.val($(obj).val());
			$thisSfxjForInput.val($(obj).val());
			$thisSfxj.val($(obj).val());
		},
		changeSfxj:function(obj){//会员充值 业务(充值金额的联动)
			var $p = $(obj).parents(".unitBox:first");
			var state = $("#state",$p).val();
			if(!migr.isHaveReadVipCard(state, $p,"recharge.cardid")){//先判断没有读卡
				return;
			}
			if(!migr.commonPositiveFloat(obj)){//校验正数
				return;
			};
			var $p = $(obj).parents(".unitBox:first");
			var $thisSfxj=$("#thisSfxj",$p);//本次实付金额（红色显示的）
			$thisSfxj.val($(obj).val());
		},
		rechagerFtype:function(obj){//处理银行卡选择列表
			var $p = $(obj).parents(".unitBox:first");
			var state = $("#state",$p).val();
			if(!migr.isHaveReadVipCard(state,$p,"recharge.cardid")){//先判断没有读卡
				return;
			}
			var $bankCard=$("input[name='recharge.memo']",$p);//得到银行卡输入框（memo的命名确实不规范，只能利用这个字段了）
			if($(obj).val()=='0')//选择的支付方式是现金
			{
				$bankCard.attr("readonly",true);
				$("input[name='recharge.sfxj']",$p).focus();
				$bankCard.val("");
			}else{//选择的支付方式是银行卡
				$bankCard.attr("readonly",false);
				$bankCard.focus();
			}
		},
		rechargeCard:function(obj)//会员充值 业务
		{
			var $p = $(obj).parents(".unitBox:first");	
			if(!migr.isHaveOperatorBranchForVipCard('branchName','recharge.branchCode',$p)){//判断是否有操作门店
				return;
			}
			var state = $("#state",$p).val();
			if(!migr.isHaveReadVipCard(state,$p,"recharge.cardid")){//判断是否读卡了
				return;
			}
			if(!migr.isNormalVipCard(state,$p,"recharge.cardid")){//判断是否是正常会员卡
				return;
			}
			var isStored = $("#isStored",$p).val();
			if(isStored!=1){
				alertMsg.error("此卡的会员类型不能储值,请到会员设置进行相关设置", {okCall: function(){$("input[name='recharege.cardid']",$p).focus();}});
				return false;
			}
			var czmoney =$("input[name='recharge.czmoney']",$p).val();
			if(!migr.commonPositiveFloat($("input[name='recharge.czmoney']",$p),"充值金额不能小于等于0")){//校验正数
				return;
			};
			var sfxj =$("input[name='recharge.sfxj']",$p).val();
			if(!migr.commonPositiveFloat($("input[name='recharge.sfxj']",$p),"实付现金不能小于等于0")){//校验正数
				return;
			};
			var czyh = $("#czyh",$p).val();
			if((parseFloat(czyh)*parseFloat(czmoney))-parseFloat(sfxj)>0)
			{
				var tt = Math.round((parseFloat(sfxj)/parseFloat(czmoney))*100)/100;
				alert("目前优惠率是"+tt+",低于本操作员最低储值优惠率"+czyh+",不能充值");
				return false;
			}
			var returnType = $("#returnType",$p);
			if(returnType!=undefined && returnType.val()==""){
				alertMsg.error("请选择此次充值的返现赠礼方式！");
				return false;
			}
			alertMsg.confirm("你确定要充值?", {
	    		okCall: function()
	    		{
					var url=$("#rechargeUrl",$p).val();
	    			jQuery.ajax({
			    		type:"POST",
			    		url: url,
			    		data:$("#queryMemberForm",$p).serialize(),
			    		dataType: "json",
			    		async: false,
			    		success: function(data) 
			    		{
			    			if(data.statusCode=="300")
			    			{
			    				alertMsg.error(data.message);
			    			}else
			    			{
			    				alertMsg.correct(data.message);
			    				jQuery.pdialog.reload($("#queryMemberForm",$p).attr("action"),{dialogId:$("#dialogId",$p).val(),data:$("#queryMemberForm",$p).serialize()});
			    			}
			    		}
			    	});	
	    		}
			});
		},
		//----------------积分转储值
		rechargeIntegral:function(obj)
		{
			var $p = $(obj).parents(".unitBox:first");	
			var state = $("#state",$p).val();
			if(!migr.isHaveReadVipCard(state,$p,"recharge.cardid")){//判断是否读卡了
				return;
			}
			if(!migr.isNormalVipCard(state,$p,"recharge.cardid")){//判断是否是正常会员卡
				return;
			}
			var syjf = $("#syjf",$p).val();
			var jf = $("#jf",$p).val();
			var cz = $("#cz",$p).val();
			var integral = $("input[name='recharge.integral']",$p).val();
			var oldValue=$("input[name='recharge.integral']",$p).attr("oldValue");
			if(!migr.commonPositiveFloat($("input[name='recharge.integral']",$p),"使用积分不能小于等于0")){//校验正数(这一步一定会把 旧值覆盖)
				return;
			}
			if(jf==0 || cz ==0)
			{
				alertMsg.error("请到会员设置-->充值业务,里面设置相关积分转储值的值!", {okCall: function(){$("input[name='recharge.integral']",$p).focus();}});
				return;
			}
			if(parseFloat(syjf)-parseFloat(integral)<0)
			{
				$("input[name='recharge.integral']",$p).val(oldValue);
				alertMsg.error("使用积分已超过当前会员剩余积分", {okCall: function(){$("input[name='recharge.integral']",$p).focus();}});
				return ;
			}
			var tt = Math.round(((parseFloat(cz)*parseFloat(integral))/parseFloat(jf))*100)/100;
			$("input[name='recharge.czmoney']",$p).val(tt);
		},
		jfrechargeCard:function(obj)
		{
			var $p = $(obj).parents(".unitBox:first");	
			if(!migr.isHaveOperatorBranchForVipCard('branchName','recharge.branchCode',$p)){//判断是否有操作门店
				return;
			}
			var state = $("#state",$p).val();
			if(!migr.isHaveReadVipCard(state,$p,"recharge.cardid")){//判断是否读卡了
				return;
			}
			if(!migr.isNormalVipCard(state,$p,"recharge.cardid")){//判断是否是正常会员卡
				return;
			}
			var isStored = $("#isStored",$p).val();
			if(isStored!=1){
				alertMsg.error("此卡的会员类型不能储值,请到会员设置进行相关设置", {okCall: function(){$("input[name='recharege.cardid']",$p).focus();}});
				return false;
			}
			if(!migr.commonPositiveFloat($("input[name='recharge.integral']",$p),"使用积分不能小于等于0")){//校验正数
				return;
			};
			if(!migr.commonPositiveFloat($("input[name='recharge.czmoney']",$p),"充值金额不能小于等于0")){//校验正数
				return;
			}
			alertMsg.confirm("你确定要积分转储值?", {
	    		okCall: function()
	    		{
	    			var url=$("#rechargeUrl",$p).val();
	    			jQuery.ajax({
			    		type:"POST",
			    		url: url,
			    		data:$("#queryMemberForm",$p).serialize(),
			    		dataType: "json",
			    		async: false,
			    		success: function(data) 
			    		{
			    			if(data.statusCode=="300")
			    			{
			    				alertMsg.error(data.message);
			    			}else
			    			{
			    				alertMsg.correct(data.message);
			    				jQuery.pdialog.reload($("#queryMemberForm",$p).attr("action"),{dialogId:$("#dialogId",$p).val(),data:$("#queryMemberForm",$p).serialize()});
			    			}
			    		}
			    	});	
	    		}
			});
		},
		//----------------积分礼品兑换
		//礼品兑换数据更改
		addGiftDetails:function(args,$p){
			var codes = args['goodCode'];
			var url=$("#addDetailUrl",$p).val()+"?giftCodes="+codes;
			var refreshUrl=$("#refreshUrl",$p).val();
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
		updateGiftExchangeByzz:function(input,no,integral,limintnum,giftCode){
			var $p = $(input).parents(".unitBox:first");
			var state = $("#state",$p).val();
			var $num = $("#num"+no,$p);//本次兑换数量(必须放前面不然的话就被下面三个校验函数覆盖了)
			var oldNum=$num.attr("oldValue");//原来的值
			if(oldNum==''){
				oldNum=0;
			}
			if(!migr.isHaveReadVipCard(state,$p,"vipinfo.cardid")){//判断是否读卡了
				return;
			}
			if(!migr.isNormalVipCard(state,$p,"vipinfo.cardid")){//判断是否是正常会员卡
				return;
			}
			if(!migr.commonPositiveFloat(input,"兑换数量必须大于0")){//校验正数
				return;
			};
			var branchCode=$("input[name='branchCode']",$p).val();//当前操作门店
			var cardid=$("#oldcardid",$p).val();//会员卡id
			
			var $haveExchangeNum=$("#haveExchangeNum"+no,$p);//已经兑换数量
			var $useIntegral = $("#useIntegral"+no,$p);//使用积分（某项的）
			//var $remainderNum = $("#remainderNum"+no,$p);//剩余数量（某项的）
			var $bintegral = $("#bintegral",$p);//本次积分(汇总后的)
			var $dintegral = $("#dintegral",$p);//剩余积分（汇总后的）
			var $syintegral=$("#syintegral",$p);//会员卡的剩余积分
			if(parseFloat($num.val())>limintnum){
				$num.val(oldNum);
				alertMsg.error("兑换数量超标，请重新输入", {okCall: function(){$num.focus();}});
				return ;
			}else {
				jQuery.ajax({
					type:"POST",
					url: $(input).attr("myurl"),
					data:"giftexchange.branchCode="+branchCode+"&giftexchange.cardid="+cardid+"&giftexchange.num="+$num.val()
						+"&giftexchange.haveexchangeNum="+$haveExchangeNum.val()+"&giftexchange.goodCode="+giftCode,
					dataType: "json",
					async: false,
					success: function(data) {
						if(data.statusCode=="300")
		    			{
							alertMsg.error(data.message,{okCall: function(){$num.focus();}});
							$num.val(oldNum);
		    			}else{
		    				$useIntegral.text(parseFloat($num.val())*parseFloat(integral));
							//$remainderNum.val(parseFloat(limintnum)-parseFloat($num.val()));
							$num.attr("oldValue",$num.val());
							$bintegral.val(data.thisintegral);
							$dintegral.val($syintegral.val()-data.thisintegral);
		    			}
					}
				});
			}
		},
		exchangeCard:function(obj)
		{
			var $p = $(obj).parents(".unitBox:first");	
			if(!migr.isHaveOperatorBranchForVipCard('branchName','branchCode',$p)){//判断是否有操作门店
				return;
			}
			var state = $("#state",$p).val();
			if(!migr.isHaveReadVipCard(state,$p,"vipinfo.cardid")){//判断是否读卡了
				return;
			}
			if(!migr.isNormalVipCard(state,$p,"vipinfo.cardid")){//判断是否是正常会员卡
				return;
			}
			var isintegral = $("#isintegral",$p).val();
			if(isintegral!=1){
				alertMsg.error("此卡的会员类型不能积分,请到会员设置进行相关设置", {okCall: function(){$("input[name='vipinfo.cardid']",$p).focus();}});
				return false;
			}
			alertMsg.confirm("你确定进行积分兑换?", {
	    		okCall: function()
	    		{
					var oldcardid = $("#oldcardid",$p).val();
					var memo = $("input[name='memo']",$p).val();
					var branchCode= $("input[name='branchCode']",$p).val();
					var url=$("#exchangeMemberUrl",$p).val()+"?vipinfo.cardid="+oldcardid+"&branchCode="+branchCode+"&memo="+memo;
					jQuery.ajax({
			    		type:"POST",
			    		url: url,
			    		dataType: "json",
			    		async: false,
			    		success: function(data) 
			    		{
			    			if(data.statusCode=="300")
			    			{
			    				alertMsg.error(data.message);
			    			}else{
			    				$("#reReadCard",$p).val(2);//三个按钮全部隐藏的标记
			    				alertMsg.correct(data.message);
			    				migr.commRefreshOrder(obj);
			    			}
			    		}
			    	});	
		    	}});
		},
		//----------------积分调整
		awardIntegral:function(obj)
		{
			var $p = $(obj).parents(".unitBox:first");	
			var state = $("#state",$p).val();
			if(!migr.isHaveReadVipCard(state,$p,"vipinfo.cardid")){//判断是否读卡了
				return;
			}
			if(!migr.isNormalVipCard(state,$p,"vipinfo.cardid")){//判断是否是正常会员卡
				return;
			}
			var $integralObj=$("input[name='acclist.integral']",$p);
			var integral = $integralObj.val();
			var syintegral = $("#syintegral",$p).val();
			if(!migr.commonPositiveFloat($integralObj,"本次调整积分不能小于等于0")){//校验正数
				return;
			};
			if(!syintegral.isNumber()){//假如会员卡的剩余积分不是数字的话  比如是空的话	
				syintegral = 0;
			}
			$("#bintegral",$p).val(integral);//本次积分的值等于输入的值
			var type = $("select[name='acclist.type']",$p).val();
			if(type==""){
				alertMsg.error("请选择调整原因");
				$("#bintegral",$p).val(0);
				$("input[name='acclist.integral']",$p).val(0);
				return false;
			}else if(type==2){//2表示积分奖励
				$("#dintegral",$p).val(parseFloat(syintegral)+parseFloat(integral));
			}else if(type==0){//0表示积分冲减
				$("#dintegral",$p).val(parseFloat(syintegral)-parseFloat(integral));
			}
		},
		awardCard:function(obj){
			var $p = $(obj).parents(".unitBox:first");	
			if(!migr.isHaveOperatorBranchForVipCard('branchName','branchCode',$p)){//判断是否有操作门店
				return;
			}
			var state = $("#state",$p).val();
			if(!migr.isHaveReadVipCard(state,$p,"vipinfo.cardid")){//判断是否读卡了
				return;
			}
			if(!migr.isNormalVipCard(state,$p,"vipinfo.cardid")){//判断是否是正常会员卡
				return;
			}
			
			var type = $("select[name='acclist.type']",$p).val();
			if(type==""){
				alertMsg.error("请选择调整原因");
				return false;
			}
			var isintegral = $("#isintegral",$p).val();
			if(isintegral!=1){//判断能不能积分
				alertMsg.error("此卡的会员类型不能积分,请到会员设置进行相关设置", {okCall: function(){$("input[name='vipinfo.cardid']",$p).focus();}});
				return false;
			}
			var $integralObj=$("input[name='acclist.integral']",$p);
			var integral =$integralObj.val();
			if(!migr.commonPositiveFloat($integralObj,"本次调整积分不能小于等于0")){//校验正数
				return;
			};
			alertMsg.confirm("你确定要调整积分?", {
	    		okCall: function()
	    		{
					var oldcardid = $("#oldcardid",$p).val();
					var memo = $("input[name='acclist.memo']",$p).val();
					var url=$("#awardMemberUrl",$p).val()+"?vipinfo.cardid="+oldcardid+"&acclist.integral="+integral+"&acclist.memo="+memo+"&acclist.type="+type+"&branchCode="+$("input[name='branchCode']",$p).val();
					jQuery.ajax({
			    		type:"POST",
			    		url: url,
			    		dataType: "json",
			    		async: false,
			    		success: function(data) 
			    		{
			    			if(data.statusCode=="300")
			    			{
			    				alertMsg.error(data.message);
			    			}else
			    			{
			    				alertMsg.correct(data.message);
			    				jQuery.pdialog.reload($("#queryMemberForm",$p).attr("action"),{dialogId:$("#dialogId",$p).val(),data:$("#queryMemberForm",$p).serialize()});
			    			}
			    		}
			    	});	
	    		}
			});
		}
		//------------------------
	});
})(jQuery,migr);