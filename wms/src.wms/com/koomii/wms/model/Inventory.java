package com.koomii.wms.model;

import java.util.List;

import com.jfinal.plugin.activerecord.Model;

import static com.koomii.wms.common.ModelConfigWms.*;

/**
 * 库存
 * @author NewNet
 *
 */
public class Inventory extends Model<Inventory> {
	private static final long serialVersionUID = -9080762596416554263L;
	
	public static Inventory dao = new Inventory();
	
	/**
	 * 增加库存
	 * @param form 表单
	 * @param detailList 明细
	 */
	public void add(Form form,List<FormDetail> detailList){
		for(FormDetail detail : detailList){
			//获取货物在入库仓库的库存
			Inventory i = this.findFirst("select * from "+TABLE_Inventory+
					" where storageId=? and materialId=?", 
					form.getStr("inStorage"),
					detail.getLong("materialId"));
			//如果没有货物的库存则新建
			if(i == null){
				i = new Inventory().set("storageId", form.getStr("inStorage"))
				.set("materialId", detail.getLong("materialId"))
				.set("quantity", detail.getDouble("quantity"));
				i.save();
			}else{
				//增加库存
				double quantity = i.getDouble("quantity");
				quantity += detail.getDouble("quantity");
				i.set("quantity", quantity);
				i.update();
			}
			//增加仓位库存
			InventoryBin ib = InventoryBin.dao.findFirst("select * from "+TABLE_InventoryBin+
					" where storageBinId=? and materialId=?", 
					detail.getLong("storageBinId"),
					detail.getLong("materialId"));
			if(ib == null){
				ib = new InventoryBin().set("storageId", form.getStr("inStorage"))
						.set("storageBinId", detail.getLong("storageBinId"))
						.set("storageBinCode", detail.getStr("storageBinCode"))
						.set("materialId", detail.getLong("materialId"))
						.set("quantity", detail.getDouble("quantity"));
				ib.save();
			}else{
				//增加库存
				double quantity = ib.getDouble("quantity");
				quantity += detail.getDouble("quantity");
				ib.set("quantity", quantity);
				ib.update();
			}
			//保存流水记录
			Flow.dao.addFlow(form, detail);
		}
	}
}
