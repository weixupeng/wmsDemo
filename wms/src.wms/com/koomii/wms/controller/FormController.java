package com.koomii.wms.controller;

import java.util.ArrayList;
import java.util.List;

import util.ChristStringUtil;
import util.ModelUtils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.jfinal.kit.JsonKit;
import com.koomii.base.BaseController;
import com.koomii.wms.common.ModelConfigWms;
import com.koomii.wms.model.Customer;
import com.koomii.wms.model.Form;
import com.koomii.wms.model.FormDetail;
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
	
	public void iosave(){
		//保存抬头
		Form form = getModel(Form.class,"form");
		ModelUtils.fillForSave(form);
		form.save();
		//保存明细
		String detailListStr = getPara("detailList");
		JSONArray djArray = JSON.parseArray(detailListStr);
		
		renderJson("suscess");
	}
}
