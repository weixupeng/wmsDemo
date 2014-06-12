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
	var params = $("#materialId").serialize();
	if(!detail.miStorageBinId){
		alert("请选择仓位!");
		return;
	}else{
		params = params+"&binCode="+detail.miStorageBinId;
	}
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
	var msg = "请选择盘点仓库!";
	storeId = $("[name='form.miStorage']").val();
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
		detail.oldQuantity = vals[2];
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
		detail.miStorageBinId = vals[0];
		detail.miStorageBinCode = vals[1];
	}else{
		detail.miStorageBinId = null;
	}
}

var id = 1;//明细项目号
var detailTpl = $('#detailTpl').html();//明细模版
function add(){
	if(!detail.miStorageBinId){
		alert("请选择盘点仓位！");
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
		alert("请输入货物的盘点数量！");
		return;
	}
	detail.balance = detail.quantity - detail.oldQuantity;
	detailList.push(detail);
	detail = {};
	q.val("");//清空数量
	$("#storageBins").html("").hide();//隐藏转入仓位选择
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
	if(!$("[name='form.miStorage']").val()){
		alert("请选择盘点仓库！");
		return;
	}
	if($("[name='form.optime']").val() == ''){
		alert("请输入盘点时间！");
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