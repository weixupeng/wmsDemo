var detail = {};//当前选中的货物
var detailList = [];//单据明细列表
/**
 * 根据tag查询货物
 * @param obj materialBtn
 */
function materialSearch(obj){
	if($("#materialId").val() == ''){
		alert("请输入货物编号或名称!");
		return;
	}
	var btn = $(obj);
	var tpl = $('#materialTpl').html();
	var params = $("#materialId").serializeArray();
	$.ajax({
		type: 'POST',
		url:btn.attr("action"),
		data:params,
		dataType:"json",
		success: function(data){
			var html = juicer(tpl,data);
			$("#materials").html(html).show();
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
	}
}

var id = 1;//明细项目号
var tpl = $('#detailTpl').html();//明细模版
function add(){
	if(!$("#materials").val()){
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
	$("#materials").html("").hide();
	var html = juicer(tpl,detailList);
	$("#detailTplWrap").html(html);
}
function del(obj){
	var sid = $(obj).attr("sid");
	for(var i=0;i<detailList.length;i++){
		if(sid == detailList[i].id){
			detailList.splice(i, 1);
		}
	}
	var html = juicer(tpl,detailList);
	$("#detailTplWrap").html(html);
}
function saveForm(obj){
	if(!$("[name='form.inStorage']").val()){
		alert("请选择入库仓库！");
		return;
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
	var params = $("#ioForm").serializeArray();
	$("#detailList").val($.toJSONString(detailList));
	$("#ioForm").submit();
}