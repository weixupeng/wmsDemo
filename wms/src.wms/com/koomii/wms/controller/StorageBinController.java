package com.koomii.wms.controller;
import static com.koomii.wms.common.ModelConfigWms.*;

import com.jfinal.plugin.activerecord.Page;
import com.koomii.base.BaseController;
import com.koomii.wms.model.Storage;
import com.koomii.wms.model.StorageBin;

public class StorageBinController extends BaseController{
	public void index() {
		Page<StorageBin> pager = StorageBin.dao.paginate(
				getParaToInt("pager.pageNumber", 1),
				getParaToInt("pager.pageSize", 20),
				"select b.*,s.name as storeName ", 
				" from " + TABLE_StorageBin+" b,"+TABLE_Storage+" s where b.storeId=s.id");
		setAttr("pager",pager);
		render("../storage_bin_list.html");
	}
	
	public void add() {
		setAttr("storageList", Storage.dao.find("select * from "+TABLE_Storage));
		render("../storage_bin_input.html");
	}
	
	public void checkIsNotExist(){
		renderJson(checkIsNotExist(TABLE_StorageBin, "id", getPara("storage_bin.id")));
	}
	
	public void checkNameIsNotExist(){
		renderJson(checkIsNotExist(TABLE_StorageBin, "name", getPara("storage_bin.name")));
	}
	
	public void save() {
		StorageBin s = getModel(StorageBin.class, "storage_bin");
		s.save();
		renderDWZSuccessJson("仓库创建成功！");
	}
	
	public void edit() {
		setAttr("storage_bin",StorageBin.dao.findById(getPara("id")));
		setAttr("storageList", Storage.dao.find("select * from "+TABLE_Storage));
		render("../storage_bin_input.html");
	}
	
	public void update() {
		StorageBin s = getModel(StorageBin.class, "storage_bin");
		s.update();
		renderDWZSuccessJson("仓库修改成功！");
	}
	
	public void delete() {
		String[] ids = getParaValues("ids");
		for(String id:ids){
			StorageBin.dao.deleteById(id);
		}
		renderDWZSuccessJson("删除成功!");
	}
}
