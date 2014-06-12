package com.koomii.wms.common;

import com.jfinal.core.JFinal;
import com.jfinal.plugin.activerecord.ActiveRecordPlugin;
import com.koomii.wms.model.Customer;
import com.koomii.wms.model.Employe;
import com.koomii.wms.model.Flow;
import com.koomii.wms.model.Form;
import com.koomii.wms.model.FormDetail;
import com.koomii.wms.model.Inventory;
import com.koomii.wms.model.InventoryBin;
import com.koomii.wms.model.Material;
import com.koomii.wms.model.Storage;
import com.koomii.wms.model.StorageBin;

public class ModelConfigWms {
	
	public static final String TABLE_Customer = "wms_customer";
	public static final String TABLE_Employe = "wms_employe";
	public static final String TABLE_Flow = "wms_flow";
	public static final String TABLE_Form = "wms_form";
	public static final String TABLE_FormDetail = "wms_form_detail";
	public static final String TABLE_Inventory = "wms_inventory";
	public static final String TABLE_InventoryBin = "wms_inventory_bin";
	public static final String TABLE_Material = "wms_material";
	public static final String TABLE_Storage = "wms_storage";
	public static final String TABLE_StorageBin = "wms_storage_bin";
	
	public static void config(ActiveRecordPlugin arp){
		arp.addMapping(TABLE_Customer,Customer.class);
		arp.addMapping(TABLE_Employe,Employe.class);
		arp.addMapping(TABLE_Flow,Flow.class);
		arp.addMapping(TABLE_Form,Form.class);
		arp.addMapping(TABLE_FormDetail,FormDetail.class);
		arp.addMapping(TABLE_Inventory,Inventory.class);
		arp.addMapping(TABLE_InventoryBin,InventoryBin.class);
		arp.addMapping(TABLE_Material,Material.class);
		arp.addMapping(TABLE_Storage,Storage.class);
		arp.addMapping(TABLE_StorageBin,StorageBin.class);
	}
	/**
	 * 建议使用 JFinal 手册推荐的方式启动项目
	 * 运行此 main 方法可以启动项目，此main方法可以放置在任意的Class类定义中，不一定要放于此
	 */
	public static void main(String[] args) {
		JFinal.start("WebRoot", 80, "/", 5);
	}
}
