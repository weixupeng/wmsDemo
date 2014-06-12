package com.koomii.wms.controller;

import static com.koomii.wms.common.ModelConfigWms.*;

import com.jfinal.plugin.activerecord.Page;
import com.koomii.base.BaseController;
import com.koomii.wms.model.Customer;

public class CustomerController extends BaseController{
	public void index() {
		Page<Customer> pager = Customer.dao.paginate(
				getParaToInt("pager.pageNumber", 1),
				getParaToInt("pager.pageSize", 20),
				"select * ", 
				" from " + TABLE_Customer);
		setAttr("pager",pager);
		render("../customer_list.html");
	}
	public void add() {
		render("../customer_input.html");
	}
	
	public void checkIsNotExist(){
		renderJson(checkIsNotExist(TABLE_Customer, "id", getPara("customer.id")));
	}
	
	public void checkNameIsNotExist(){
		renderJson(checkIsNotExist(TABLE_Customer, "name", getPara("customer.name")));
	}
	
	public void save() {
		Customer s = getModel(Customer.class, "customer");
		s.save();
		renderDWZSuccessJson("客户资料创建成功！");
	}
	
	public void edit() {
		setAttr("customer",Customer.dao.findById(getPara("id")));
		render("../customer_input.html");
	}
	
	public void update() {
		Customer s = getModel(Customer.class, "customer");
		s.update();
		renderDWZSuccessJson("客户资料修改成功！");
	}
	
	public void delete() {
		String[] ids = getParaValues("ids");
		for(String id:ids){
			Customer.dao.deleteById(id);
		}
		renderDWZSuccessJson("删除成功!");
	}

}
