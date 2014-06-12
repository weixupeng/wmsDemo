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
				"select i.*,m.name as materialName,sb.binCode as storageBin,s.id as storeId,s.name as storeName ", 
				" from "+TABLE_InventoryBin+" i,"+TABLE_Material+" m,"+TABLE_Storage+" s,"+TABLE_StorageBin+" sb where s.id=sb.storeId and sb.id=i.storageBinId and m.id=i.materialId " + whee.toString(),
				param.toArray());
		
		setAttr("storageBin", storageBin);
		setAttr("tag", tag);
		setAttr("storageList", Storage.dao.find("select * from "+TABLE_Storage));
		setAttr("pager",pager);
		render("../inventory_bin.html");
	}
	
	public void storebin(){
		List<StorageBin> storageBinLlist = new ArrayList<StorageBin>();
		String storeId = getPara("storeId");
		if(ChristStringUtil.isNotEmpty(storeId)){
			storageBinLlist = StorageBin.dao.find("select * from "+TABLE_StorageBin
					+" where storeId=?"
					, storeId);
		}
		List<Object[]> resultList = new ArrayList<Object[]>();
		Object[] pselect = new Object[2];
		pselect[0] = "";
		pselect[1] = "--请选择--";
		resultList.add(pselect);
		for(StorageBin sb:storageBinLlist){
			Object[] result = new Object[2];
			result[0] = sb.getLong("id");
			result[1] = sb.getStr("binCode");
			resultList.add(result);
		}
		renderJson(resultList);
	}
}
