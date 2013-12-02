package com.koomii.util;

import java.util.Date;

import com.jfinal.plugin.activerecord.Model;

public class ModelUtils {
	public static void fillForSave(Model m){
		m.set("id", CommonUtil.getUUID());
		m.set("createDate", new Date());
		m.set("modifyDate", new Date());
	}
	
	public static void fillForUpdate(Model m){
		m.set("modifyDate", new Date());
	}
}
