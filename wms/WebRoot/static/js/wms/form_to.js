var detail = {};//当前选中的货物
var detailList = [];//单据明细列表
/**
 * 根据tag查询货物
 * @param obj materialBtn
 */
var materialTpl = $('#materialTpl').html();
function materialSearch(obj){
	if($("#materialId").val() == ''){
		alert("请输入货物编号或名称!");
		return;
	}
	var btn = $(obj);
	var params = $("#materialId").serializeArray();
	$.ajax({
		type: 'POST',
		url:btn.attr("action"),
		data:params,
		dataType:"json",
		success: function(data){
			var html = juicer(materialTpl,data);
			$("#materials").html(html).show();
		}
	});
}
/**
 * 根据storeId查询仓位
 * @param obj materialBtn
 */
var storageBinTpl = $('#storageBinTpl').html();
/* typ=0转出仓库，type=1转入仓库 */
function storageBinSearch(obj,type){
	var storeId = "";
	var binCode = "";
	var storeMessage = "请选择仓库!";
	var binCodeMessage = "请输入仓位编码!";
	var selectId = "outStorageBins";
	if(type == 0){
		storeId = $("[name='form.outStorage']").val();
		storeMessage = "请选择转出仓库!";
		binCode = $("#outBinCode").val();
		binCodeMessage = "请输入转出仓位编码!";
		selectId = "outStorageBins";
	}else if(type == 1){
		storeId = $("[name='form.inStorage']").val();
		storeMessage = "请选择转入仓库!";
		binCode = $("#inBinCode").val();
		binCodeMessage = "请输入转入仓位编码!";
		selectId = "inStorageBins";
	}
	if(!storeId){
		alert(storeMessage);
		return;
	}
	
	if(!binCode){
		alert(binCodeMessage);
		return;
	}
	var btn = $(obj);
	var params = "binCode="+binCode+"&storeId="+storeId;
	$.ajax({
		type: 'POST',
		url:btn.attr("action"),
		data:params,
		dataType:"json",
		success: function(data){
			var html = juicer(storageBinTpl,data);
			$("#"+selectId).html(html).show();
		}
	});
}
/**
 * 选择货物
 * @param obj
 */
function selectMaterial(obj){
	var sel = $(obj);
	var v = sel.val();
	if(v){
		var vals = v.split("###");
		detail.materialId = vals[0];
		detail.materialName = vals[1];
	}else{
		detail.materialId = null;
	}
}
/**
 * 选择仓位
 * @param obj
 */
function selectStorageBin(obj,type){
	var sel = $(obj);
	var v = sel.val();
	if(v){
		var vals = v.split("###");
		if(type == 0){
			detail.outStorageBinId = vals[0];
			detail.outStorageBinCode = vals[1];
		}else{
			detail.inStorageBinId = vals[0];
			detail.inStorageBinCode = vals[1];
		}
		
	}else{
		if(type == 0){//入库
			detail.outStorageBinId = null;
		}else if(type == 1){//出库
			detail.inStorageBinId = null;
		}
	}
}

var id = 1;//明细项目号
var detailTpl = $('#detailTpl').html();//明细模版
function add(){
	if(!detail.outStorageBinId){
		alert("请选择转出仓位！");
		return;
	}
	if(!detail.inStorageBinId){
		alert("请选择转入仓位！");
		return;
	}
	if(!detail.materialId){
		alert("请选择货物！");
		return;
	}
	var q = $("#quantity");
	detail.quantity = q.val();
	detail.id = id;
	id++;
	if(!detail.quantity){
		alert("请输入货物的入库数量！");
		return;
	}
	detailList.push(detail);
	detail = {};
	q.val("");//清空数量
	$("#inStorageBins").html("").hide();//隐藏转入仓位选择
	$("#outStorageBins").html("").hide();//隐藏转出仓位选择
	$("#materials").html("").hide();//隐藏货物选择
	var html = juicer(detailTpl,detailList);
	$("#detailTplWrap").html(html);
}
function del(obj){
	var sid = $(obj).attr("sid");
	for(var i=0;i<detailList.length;i++){
		if(sid == detailList[i].id){
			detailList.splice(i, 1);
		}
	}
	var html = juicer(detailTpl,detailList);
	$("#detailTplWrap").html(html);
}
function saveForm(obj){
	if(!$("[name='form.outStorage']").val()){
		alert("请选择出库仓库！");
		return;
	}	
	if(!$("[name='form.inStorage']").val()){
		alert("请选择入库仓库！");
		return;
	}
	if($("[name='form.optime']").val() == ''){
		alert("请输入货物转储时间！");
		return;
	}
	if($("[name='form.worker']").val() == ''){
		alert("作业人不可为空！");
		return;
	}
	var btn = $(obj);
	if(detailList.length == 0){
		alert("没有明细信息！");
		return;
	}
	$("#status").val(btn.attr("status"));
	$("#detailList").val($.toJSONString(detailList));
	$("#ioForm").submit();
}