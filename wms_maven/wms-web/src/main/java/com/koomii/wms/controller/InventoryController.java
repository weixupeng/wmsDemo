package com.koomii.wms.controller;

import static com.koomii.wms.common.ModelConfigWms.*;

import java.util.ArrayList;
import java.util.List;

import util.ChristStringUtil;

import com.jfinal.plugin.activerecord.Page;
import com.koomii.base.BaseController;
import com.koomii.wms.model.Inventory;
import com.koomii.wms.model.Storage;

public class InventoryController extends BaseController {
	
	
	public void index() {
		StringBuffer whee = new StringBuffer();
		List<Object> param = new ArrayList<Object>();
		String storage = getPara("storage");
		if(ChristStringUtil.isNotEmpty(storage)){
			whee.append(" and i.storageId = ? ");
			param.add(storage);
		}
		String tag = getPara("tag");
		if(ChristStringUtil.isNotEmpty(tag)){
			whee.append(" and m.tag like ? ");
			param.add("%" + tag + "%");
		}
		
		whee.append(" order by i.storageId asc,i.materialId asc");
		Page<Inventory> pager = Inventory.dao.paginate(
				getParaToInt("pager.pageNumber", 1),
				getParaToInt("pager.pageSize", 20),
				"select i.*,m.name as materialName,s.name as storageName ", 
				" from "+TABLE_Inventory+" i,"+TABLE_Material+" m,"+TABLE_Storage+" s where s.id=i.storageId and m.id=i.materialId " + whee.toString(),
				param.toArray());
		
		setAttr("storage", storage);
		setAttr("tag", tag);
		setAttr("storageList", Storage.dao.find("select * from "+TABLE_Storage));
		setAttr("pager",pager);
		render("../inventory_list.html");
	}
}
