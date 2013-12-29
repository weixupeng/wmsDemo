package com.koomii.wms.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;

import util.ChristStringUtil;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.tx.Tx;
import com.koomii.base.BaseController;
import com.koomii.sys.model.Userinfo;
import com.koomii.wms.model.Customer;
import com.koomii.wms.model.Employe;
import com.koomii.wms.model.Form;
import com.koomii.wms.model.FormDetail;
import com.koomii.wms.model.Inventory;
import com.koomii.wms.model.Material;
import com.koomii.wms.model.Storage;
import com.koomii.wms.model.StorageBin;

import static com.koomii.wms.common.ModelConfigWms.*;

public class FormController extends BaseController {
	
	/**
	 * 入库单 In order
	 */
	public void io() {
		setAttr("storageList", Storage.dao.find("select * from "+TABLE_Storage));
		setAttr("customerList", Customer.dao.find("select * from "+TABLE_Customer+" where type=0 or type=3"));
		setAttr("employeList", Employe.dao.find("select * from "+TABLE_Employe));
		render("../form_io.html");
	}
	@ Before(Tx.class)
	public void iosave(){
		Form form = getModel(Form.class,"form");
		List<FormDetail> detailList = new ArrayList<FormDetail>();
		saveFormAndDetails(form,detailList);
		//增加库存
		Inventory.dao.increase(form, detailList);
		setAttr("type",form.getInt("type"));
		setAttr("message","入库操作成功！单据号："+form.getLong("id"));
		render("../form_result.html");
	}
	private void saveFormAndDetails(Form form,List<FormDetail> detailList){
		int type = form.getInt("type");
		//保存抬头
		form.set("createDate", new Date());
		Subject subject = SecurityUtils.getSubject();
		Session session = subject.getSession(true);
		Userinfo loginUser = (Userinfo) session.getAttribute("loginUser");
		form.set("operator", loginUser.getStr("username"));
		form.save();
		//保存明细
		String detailListStr = getPara("detailList");
		JSONArray djArray = JSON.parseArray(detailListStr);
		for(int i=0;i<djArray.size();i++){
			JSONObject jo = djArray.getJSONObject(i);
			FormDetail d = new FormDetail();
			d.set("materialId", jo.getLong("materialId"));
			d.set("materialName", jo.getString("materialName"));
			d.set("quantity", jo.getDouble("quantity"));
			if(type == 0 || type == 2){
				d.set("inStorageBinId", jo.getLong("inStorageBinId"));
				d.set("inStorageBinCode", jo.getString("inStorageBinCode"));
			}
			if(type == 1 || type == 2){
				d.set("outStorageBinId", jo.getLong("outStorageBinId"));
				d.set("outStorageBinCode", jo.getString("outStorageBinCode"));
			}
			
			if(type == 3){
				d.set("miStorageBinId", jo.getLong("miStorageBinId"));
				d.set("miStorageBinCode", jo.getString("miStorageBinCode"));
				d.set("oldQuantity", jo.getDouble("oldQuantity"));
				d.set("balance", jo.getDouble("balance"));
			}
			
			d.set("formId", form.getLong("id"));
			d.save();
			detailList.add(d);
		}
	}
	
	/**
	 * 出库单 Out order
	 */
	public void oo() {
		setAttr("storageList", Storage.dao.find("select * from "+TABLE_Storage));
		setAttr("customerList", Customer.dao.find("select * from "+TABLE_Customer+" where type=1 or type=3"));
		setAttr("employeList", Employe.dao.find("select * from "+TABLE_Employe));
		render("../form_oo.html");
	}
	
	@ Before(Tx.class)
	public void oosave(){
		Form form = getModel(Form.class,"form");
		List<FormDetail> detailList = new ArrayList<FormDetail>();
		saveFormAndDetails(form,detailList);
		//减少库存
		Inventory.dao.decrease(form, detailList);
		setAttr("type",form.getInt("type"));
		setAttr("message","出库操作成功！单据号："+form.getLong("id"));
		render("../form_result.html");
	}
	
	/**
	 * 转仓单Transfer Order
	 */
	public void to() {
		setAttr("storageList", Storage.dao.find("select * from "+TABLE_Storage));
		setAttr("employeList", Employe.dao.find("select * from "+TABLE_Employe));
		render("../form_to.html");
	}
	
	@ Before(Tx.class)
	public void tosave(){
		Form form = getModel(Form.class,"form");
		List<FormDetail> detailList = new ArrayList<FormDetail>();
		saveFormAndDetails(form,detailList);
		//减少库存
		Inventory.dao.decrease(form, detailList);
		//增加库存
		Inventory.dao.increase(form, detailList);
		setAttr("type",form.getInt("type"));
		setAttr("message","移库操作成功！单据号："+form.getLong("id"));
		render("../form_result.html");
	}
	
	/**
	 * 盘点单 Mi order
	 */
	public void mio() {
		setAttr("storageList", Storage.dao.find("select * from "+TABLE_Storage));
		setAttr("employeList", Employe.dao.find("select * from "+TABLE_Employe));
		render("../form_mio.html");
	}
	
	@ Before(Tx.class)
	public void miosave(){
		Form form = getModel(Form.class,"form");
		List<FormDetail> detailList = new ArrayList<FormDetail>();
		saveFormAndDetails(form,detailList);
		//变更库存
		Inventory.dao.mi(form, detailList);
		setAttr("type",form.getInt("type"));
		setAttr("message","盘点操作成功！单据号："+form.getLong("id"));
		render("../form_result.html");
	}
	
	/**
	 * 查询商品
	 */
	public void searchMaterial(){
		List<Material> mlist = new ArrayList<Material>();
		String tag = getPara("tag");
		Long binCode = getParaToLong("binCode", null);
		if(binCode == null){
			if(ChristStringUtil.isNotEmpty(tag)){
				mlist = Material.dao.find("select * from "+TABLE_Material
						+" where tag like ?"
						, "%"+tag+"%");
			}
		}else{
			String sql = "select m.*,ib.quantity from "+TABLE_Material+" m,"+TABLE_InventoryBin+" ib"
					+" where m.id=ib.materialId and ib.storageBinId=? ";
			if(ChristStringUtil.isNotEmpty(tag)){
				sql += " and tag like ? ";
				mlist = Material.dao.find(sql, binCode,"%"+tag+"%");
			}else{
				mlist = Material.dao.find(sql, binCode);
			}
		}
		renderJson(mlist);
	}
	
	/**
	 * 查询仓位/货位
	 */
	public void searchStorageBin(){
		List<StorageBin> storageBinLlist = new ArrayList<StorageBin>();
		String storeId = getPara("storeId");
		String binCode = getPara("binCode");
		if(ChristStringUtil.isNotEmpty(storeId) && ChristStringUtil.isNotEmpty(binCode)){
			storageBinLlist = StorageBin.dao.find("select * from "+TABLE_StorageBin
					+" where storeId=? and binCode like ?"
					, storeId
					, "%"+binCode+"%");
		}
		renderJson(storageBinLlist);
	}
	
}
