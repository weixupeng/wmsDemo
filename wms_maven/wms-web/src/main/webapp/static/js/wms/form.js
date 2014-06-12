var detail = {};//当前选中的货物
var detailList = [];//单据明细列表
var type = $("#type").val();
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
function storageBinSearch(obj){
	var storeId = "";
	var msg = "请选择入库仓库!";
	if(type == 0){
		storeId = $("[name='form.inStorage']").val();
		msg = "请选择入库仓库!";
	}else if(type == 1){
		storeId = $("[name='form.outStorage']").val();
		msg = "请选择出库仓库!";
	}
	if(!storeId){
		alert(msg);
		return;
	}
	
	if(!$("#binCode").val()){
		alert("请输入仓位编码!");
		return;
	}
	var btn = $(obj);
	var params = $("#binCode").serialize();
	params = params+"&storeId="+storeId;
	$.ajax({
		type: 'POST',
		url:btn.attr("action"),
		data:params,
		dataType:"json",
		success: function(data){
			var html = juicer(storageBinTpl,data);
			$("#storageBins").html(html).show();
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
function selectStorageBin(obj){
	var sel = $(obj);
	var v = sel.val();
	if(v){
		var vals = v.split("###");
		if(type == 0){//入库
			detail.inStorageBinId = vals[0];
			detail.inStorageBinCode = vals[1];
		}else if(type == 1){//出库
			detail.outStorageBinId = vals[0];
			detail.outStorageBinCode = vals[1];
		}
		
	}else{
		if(type == 0){//入库
			detail.inStorageBinId = null;
		}else if(type == 1){//出库
			detail.outStorageBinId = null;
		}
	}
}

var id = 1;//明细项目号
var detailTpl = $('#detailTpl').html();//明细模版
function add(){
	var storeBinId = "";
	if(type == 0){//入库
		storeBinId = detail.inStorageBinId;
	}else if(type == 1){//出库
		storeBinId = detail.outStorageBinId;
	}
	
	if(!storeBinId){
		alert("请选择仓位！");
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
	q.val("");
	$("#storageBins").html("").hide();//隐藏仓位选择
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
	var type = $("#type").val();
	if(type == 0){
		if(!$("[name='form.inStorage']").val()){
			alert("请选择入库仓库！");
			return;
		}
	}else if(type == 1){
		if(!$("[name='form.outStorage']").val()){
			alert("请选择出库仓库！");
			return;
		}
	}
	
	if(!$("[name='form.customer']").val()){
		alert("请选择供应商！");
		return;
	}
	if($("[name='form.optime']").val() == ''){
		alert("请输入货物入库时间！");
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