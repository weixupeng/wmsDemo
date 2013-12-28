package com.koomii.wms.controller;

import static com.koomii.wms.common.ModelConfigWms.*;

import java.util.ArrayList;
import java.util.List;

import util.ChristStringUtil;

import com.jfinal.plugin.activerecord.Page;
import com.koomii.base.BaseController;
import com.koomii.wms.model.Inventory;
import com.koomii.wms.model.Storage;
import com.koomii.wms.model.StorageBin;

public class InventoryBinController extends BaseController{
	public void index() {
		StringBuffer whee = new StringBuffer();
		List<Object> param = new ArrayList<Object>();
		Long storageBin = getParaToLong("storageBin",null);
		if(null != storageBin){
			whee.append(" and i.storageBinId = ? ");
			param.add(storageBin);
		}
		String tag = getPara("tag");
		if(ChristStringUtil.isNotEmpty(tag)){
			whee.append(" and m.tag like ? ");
			param.add("%" + tag + "%");
		}
		
		whee.append(" order by i.storageBinId asc,i.materialId asc");
		Page<Inventory> pager = Inventory.dao.paginate(
				getParaToInt("pager.pageNumber", 1),
				getParaToInt("pager.pageSize", 20),
				"select i.*,m.name as materialName,s.binCode as storageBin ", 
				" from "+TABLE_InventoryBin+" i,"+TABLE_Material+" m,"+TABLE_StorageBin+" s where s.id=i.storageBinId and m.id=i.materialId " + whee.toString(),
				param.toArray());
		
		setAttr("storageBin", storageBin);
		setAttr("tag", tag);
		setAttr("storageBinList", StorageBin.dao.find("select * from "+TABLE_StorageBin));
		setAttr("pager",pager);
		render("../inventory_bin.html");
	}
}
