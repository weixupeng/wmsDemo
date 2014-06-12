package com.koomii.wms.model;

import com.jfinal.plugin.activerecord.Model;

/**
 * 流水
 * @author NewNet
 *
 */
public class Flow extends Model<Flow> {
	public static Flow dao = new Flow();
	
	/**
	 * 增加货物流水
	 */
	public void addFlow(Form form,FormDetail detail){
		//根据form类型的不同detail的正负值不一样
		int type = form.getInt("type");//0入库、1出库、2移库、3盘点
		
		Flow flow = new Flow();
		flow.set("type", type);
		flow.set("formId", form.get("id"));
		flow.set("materialId", detail.get("materialId"));
		flow.set("materialName", detail.get("materialName"));
		flow.set("createDate", form.get("createDate"));
		flow.set("worker", form.get("worker"));
		flow.set("operator", form.get("operator"));
		if(type == 0 || type == 2){
			flow.set("inStorage", form.get("inStorage"));
			flow.set("quantity", detail.get("quantity"));
		}else if(type == 1){
			flow.set("outStorage", form.get("outStorage"));
			flow.set("quantity", 0-detail.getDouble("quantity"));
		}else if(type == 3){
			flow.set("miStorage", form.get("miStorage"));
			flow.set("quantity", detail.get("balance"));
		}
		if(type == 2){//移库==上边已经入库了，现在出库
			Flow outFlow = new Flow();
			outFlow.set("type", type);
			outFlow.set("formId", form.get("id"));
			outFlow.set("materialId", detail.get("materialId"));
			outFlow.set("materialName", detail.get("materialName"));
			outFlow.set("createDate", form.get("createDate"));
			outFlow.set("worker", form.get("worker"));
			outFlow.set("operator", form.get("operator"));
			outFlow.set("outStorage", form.get("outStorage"));
			outFlow.set("quantity", 0-detail.getDouble("quantity"));
			outFlow.save();
		}
		flow.save();
	}
}
