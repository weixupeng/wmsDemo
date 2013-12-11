package com.koomii.wms.controller;

import static com.koomii.wms.common.ModelConfigWms.*;

import com.jfinal.plugin.activerecord.Page;
import com.koomii.base.BaseController;
import com.koomii.wms.model.Material;

public class MaterialController extends BaseController{
	public void index() {
		Page<Material> pager = Material.dao.paginate(
				getParaToInt("pager.pageNumber", 1),
				getParaToInt("pager.pageSize", 20),
				"select * ", 
				" from " + TABLE_Material);
		setAttr("pager",pager);
		render("../material_list.html");
	}
	public void add() {
		render("../material_input.html");
	}
	
	public void checkIsNotExist(){
		renderJson(checkIsNotExist(TABLE_Material, "id", getPara("material.id")));
	}
	
	public void checkNameIsNotExist(){
		renderJson(checkIsNotExist(TABLE_Material, "name", getPara("material.name")));
	}
	
	public void save() {
		Material s = getModel(Material.class, "material");
		s.save();
		renderDWZSuccessJson("货物资料创建成功！");
	}
	
	public void edit() {
		setAttr("material",Material.dao.findById(getPara("id")));
		render("../material_input.html");
	}
	
	public void update() {
		Material s = getModel(Material.class, "material");
		s.update();
		renderDWZSuccessJson("货物资料修改成功！");
	}
	
	public void delete() {
		String[] ids = getParaValues("ids");
		for(String id:ids){
			Material.dao.deleteById(id);
		}
		renderDWZSuccessJson("删除成功!");
	}
}
