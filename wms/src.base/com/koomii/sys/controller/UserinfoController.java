package com.koomii.sys.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.koomii.base.BaseController;
import com.koomii.sys.model.Userinfo;
import com.koomii.util.ChristStringUtil;
import com.koomii.util.ModelUtils;

public class UserinfoController extends BaseController {
	public void index(){
		StringBuffer whee = new StringBuffer();
		List<Object> param = new ArrayList<Object>();
		String tag = getPara("tag");
		if(ChristStringUtil.isNotEmpty(tag)){
			whee.append(" and tag like ?");
			param.add("%" + tag + "%");
		}
		whee.append(" order by createDate desc ");
		Page<Userinfo> pager = Userinfo.dao.paginate(
				getParaToInt("pager.pageNumber", 1),
				getParaToInt("pager.pageSize", 20),
				"select * ", 
				" from sys_userinfo where 1=1 " + whee.toString(),
				param.toArray());
		
		setAttr("pager",pager);
		render("../userinfo_list.html");
	}
	
	public void add(){
		render("../userinfo_input.html");
	}
	
	public void checkIsNotExist(){
		renderJson(checkIsNotExist("sys_userinfo", "username", getPara("userinfo.username")));
	}
	
	public void save(){
		Userinfo model = getModel(Userinfo.class, "userinfo");
		String pwd = model.get("pwd");
		String md5Pwd = ChristStringUtil.md5(pwd);
		model.set("pwd",md5Pwd);
		model.set("isSystem", false);
		StringBuffer tag = new StringBuffer();
		tag.append(";").append(model.getStr("username")).append(",");
		String realName = model.get("realname");
		if(ChristStringUtil.isNotEmpty(realName)){
			tag.append(";").append(realName).append(",");
		}
		model.set("tag",tag.toString());
		ModelUtils.fillForSave(model);
		model.save();
		renderDWZSuccessJson("创建用户成功！");
	}
	
	public void edit(){
		setAttr("userinfo",Userinfo.dao.findById(getPara("id")));
		render("../userinfo_input.html");
	}
	
	public void update(){
		String id = getPara("id");
		Userinfo model = getModel(Userinfo.class, "userinfo");
		model.set("id", id);
		StringBuffer tag = new StringBuffer();
		tag.append(";").append(model.getStr("username")).append(",");
		String realName = model.get("realname");
		if(ChristStringUtil.isNotEmpty(realName)){
			tag.append(";").append(realName).append(",");
		}
		model.set("tag",tag.toString());
		ModelUtils.fillForUpdate(model);
		model.update();
		renderDWZSuccessJson("修改用户成功！");
	}
	
	public void delete(){
		String[] ids = getParaValues("ids");
		StringBuffer noDeleteBuffer = new StringBuffer();
		int noDeleteCount = 0;
		int deleteCount = 0;
		for(String id:ids){
			Userinfo userinfo = Userinfo.dao.findById(id);
			if(userinfo.getBoolean("isSystem") == true){
				if(noDeleteBuffer.length() == 0){
					noDeleteBuffer.append(userinfo.get("username"));
				}else{
					noDeleteBuffer.append(",").append(userinfo.get("username"));
				}
				noDeleteCount++;
			}else{
				userinfo.delete();
				deleteCount++;
			}
		}
		renderDWZSuccessJson("操作成功，删除成功"+deleteCount+"个，失败"+noDeleteCount+"个，删除失败的用户名："+noDeleteBuffer.toString());
	}
	
	public void toUpdatePassword(){
		setAttr("userinfo",Userinfo.dao.findById(getPara("id")));
		render("../updatePassword.html");
	}
	
	public void updatePassword(){
		String id = getPara("id");
		String pwd = getPara("userinfo.pwd");
		String md5Pwd = ChristStringUtil.md5(pwd);
		Userinfo.dao.findById(getPara("id")).set("pwd",md5Pwd).update();
		renderDWZSuccessJson("修改密码成功！");
	}
	
}
