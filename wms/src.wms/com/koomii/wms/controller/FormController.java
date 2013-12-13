package com.koomii.wms.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;

import util.ChristStringUtil;
import util.CommonUtil;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.tx.Tx;
import com.koomii.base.BaseController;
import com.koomii.sys.model.Userinfo;
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
		setAttr("storageList", Storage.dao.find("select * from "+TABLE_Storage));
		setAttr("customerList", Customer.dao.find("select * from "+TABLE_Customer));
		render("../form_io.html");
	}
	
	/**
	 * 查询商品
	 */
	public void searchMaterial(){
		List<Material> mlist = new ArrayList<Material>();
		String tag = getPara("tag");
		if(ChristStringUtil.isNotEmpty(tag)){
			mlist = Material.dao.find("select * from "+TABLE_Material
					+" where tag like ?"
					, "%"+tag+"%");
		}
		renderJson(mlist);
	}
	
	@Before(Tx.class)
	public void iosave(){
		//保存抬头
		Form form = getModel(Form.class,"form");
		form.set("createDate", new Date());
		Subject subject = SecurityUtils.getSubject();
		Session session = subject.getSession(true);
		Userinfo loginUser = (Userinfo) session.getAttribute("loginUser");
		form.set("oprator", loginUser.getStr("id"));
		form.save();
		//保存明细
		String detailListStr = getPara("detailList");
		JSONArray djArray = JSON.parseArray(detailListStr);
		for(int i=0;i<djArray.size();i++){
			JSONObject jo = djArray.getJSONObject(i);
			FormDetail d = new FormDetail();
			d.set("materialId", jo.getString("materialId"));
			d.set("materialName", jo.getString("materialName"));
			d.set("quantity", jo.getString("quantity"));
			d.set("formId", form.getLong("id"));
			d.save();
		}
		setAttr("message","入库操作成功！");
		render("../form_io_result.html");
	}
}
