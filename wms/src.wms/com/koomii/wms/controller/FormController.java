package com.koomii.wms.controller;

import java.util.ArrayList;
import java.util.List;

import util.ChristStringUtil;

import com.koomii.base.BaseController;
import com.koomii.wms.common.ModelConfigWms;
import com.koomii.wms.model.Customer;
import com.koomii.wms.model.Material;
import com.koomii.wms.model.Storage;

import static com.koomii.wms.common.ModelConfigWms.*;

public class FormController extends BaseController {
	
	/**
	 * 入库单
	 */
	public void io() {
		setAttr("storageList", Storage.dao.find("select * from wms_storage"));
		setAttr("customerList", Customer.dao.find("select * from wms_customer"));
		render("../form_io.html");
	}
	
	/**
	 * 查询商品
	 */
	public void searchMaterial(){
		List<Material> mlist = new ArrayList<Material>();
		String tag = getPara("tag");
		if(ChristStringUtil.isNotEmpty(tag)){
			mlist = Material.dao.find("select * from "+ModelConfigWms.TABLE_Material
					+" where tag like ?"
					, "%"+tag+"%");
		}
		renderJson(mlist);
	}
	
}
