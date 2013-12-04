package com.koomii.wms.controller;

import com.jfinal.plugin.activerecord.Page;
import com.koomii.base.BaseController;
import com.koomii.sys.model.Userinfo;
import com.koomii.wms.model.Storage;

import static com.koomii.wms.common.ModelConfigWms.*;

public class StorageController extends BaseController {
	
	public void index() {
		Page<Storage> pager = Storage.dao.paginate(
				getParaToInt("pager.pageNumber", 1),
				getParaToInt("pager.pageSize", 20),
				"select * ", 
				" from " + TABLE_Storage);
		setAttr("pager",pager);
		render("../storage_list.html");
	}
	
	public void add() {
		render("../storage_input.html");
	}
	
	public void checkIsNotExist(){
		renderJson(checkIsNotExist(TABLE_Storage, "id", getPara("storage.id")));
	}
	
	public void checkNameIsNotExist(){
		renderJson(checkIsNotExist(TABLE_Storage, "name", getPara("storage.name")));
	}
	
	public void save() {
		Storage s = getModel(Storage.class, "storage");
		s.save();
		renderDWZSuccessJson("仓库创建成功！");
	}
	
	public void edit() {
		setAttr("storage",Storage.dao.findById(getPara("id")));
		render("../storage_input.html");
	}
	
	public void update() {
		Storage s = getModel(Storage.class, "storage");
		s.update();
		renderDWZSuccessJson("仓库修改成功！");
	}
	
	public void delete() {
		String[] ids = getParaValues("ids");
		for(String id:ids){
			Storage.dao.deleteById(id);
		}
		renderDWZSuccessJson("删除成功!");
	}
}
