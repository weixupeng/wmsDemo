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
	public void increase(Form form,List<FormDetail> detailList){
		for(FormDetail detail : detailList){
			//获取货物在入库仓库的库存
			Inventory i = this.findFirst("select * from "+TABLE_Inventory+
					" where storageId=? and materialId=?", 
					getStoreId(form),
					detail.getLong("materialId"));
			//如果没有货物的库存则新建
			if(i == null){
				i = new Inventory().set("storageId", getStoreId(form))
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
				ib = new InventoryBin().set("storageId", getStoreId(form))
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
	/**
	 * 从form中获取当前作业的仓库，根据type不同，获取的字段不同
	 * @param form
	 * @return
	 */
	public String getStoreId(Form form){
		int type = form.getInt("type");
		if(type == 0){
			return form.getStr("inStorage");
		}else if(type == 1){
			return form.getStr("outStorage");
		}
		return null;
	}
	
	/**
	 * 减少库存
	 * @param form 表单
	 * @param detailList 明细
	 */
	public void decrease(Form form,List<FormDetail> detailList){
		for(FormDetail detail : detailList){
			//获取货物在入库仓库的库存
			Inventory i = this.findFirst("select * from "+TABLE_Inventory+
					" where storageId=? and materialId=?", 
					getStoreId(form),
					detail.getLong("materialId"));
			//如果没有货物的库存则新建
			if(i == null){
				i = new Inventory().set("storageId", getStoreId(form))
				.set("materialId", detail.getLong("materialId"))
				.set("quantity", 0d-detail.getDouble("quantity"));
				i.save();
			}else{
				//减少库存
				double quantity = i.getDouble("quantity");
				quantity = quantity - detail.getDouble("quantity");
				i.set("quantity", quantity);
				i.update();
			}
			//减少仓位库存
			InventoryBin ib = InventoryBin.dao.findFirst("select * from "+TABLE_InventoryBin+
					" where storageBinId=? and materialId=?", 
					detail.getLong("storageBinId"),
					detail.getLong("materialId"));
			if(ib == null){
				ib = new InventoryBin().set("storageId", getStoreId(form))
						.set("storageBinId", detail.getLong("storageBinId"))
						.set("storageBinCode", detail.getStr("storageBinCode"))
						.set("materialId", detail.getLong("materialId"))
						.set("quantity", 0d-detail.getDouble("quantity"));
				ib.save();
			}else{
				//增加库存
				double quantity = ib.getDouble("quantity");
				quantity = quantity - detail.getDouble("quantity");
				ib.set("quantity", quantity);
				ib.update();
			}
			//保存流水记录
			Flow.dao.addFlow(form, detail);
		}
	}
}
