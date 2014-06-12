package com.koomii.base;



import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import util.ChristStringUtil;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Record;

public class BaseController extends Controller {
//	public static Gson gson = new Gson();
	public static Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
	
	/**
	 * 查询指定字段的数据是否存在
	 * @param tableName
	 * @param colum
	 * @param checkValue
	 * @return true:不存在，false：存在
	 */
	public boolean checkIsNotExist(String tableName,String colum,Serializable checkValue){
		StringBuffer sql = new StringBuffer("select ").append(colum).append(" from ").append(tableName).
				append(" where ").append(colum).append(" = ? ");
		
		List<Object> params = new ArrayList<Object>();
		params.add(checkValue);
		
		String id = getPara("id");
		if(ChristStringUtil.isNotEmpty(id)){
			sql.append(" and id != ? ");
			params.add(id);
		}
		Record record = Db.findFirst(sql.toString(),params.toArray());
		if(record.get(colum) != null){
			return false;
		}
		return true;
	}
	
	/**
	 * 转换dwz json格式输出
	 * @param statusCode
	 * @param message
	 * @param navTabId
	 * @return
	 */
	public void toDwzJson(Integer statusCode,String message,String navTabId,boolean close){
		Map<String,Object> jsonMap=new HashMap<String,Object>();
		jsonMap.put("statusCode", statusCode);
		if(message!=null)
		jsonMap.put("message",message);
		if(navTabId!=null)
			jsonMap.put("navTabId", navTabId);
		if(close)
			jsonMap.put("callbackType","closeCurrent");
		this.renderJson(gson.toJson(jsonMap));
	}
	public void renderDWZSuccessJson(String message,String navTabId,boolean close){
		toDwzJson(200, message, navTabId,close);
	}
	public void renderDWZSuccessJson(String message,String navTabId){
		toDwzJson(200, message, navTabId,false);
	}
	
	public void renderDWZSuccessJson(String message){
		toDwzJson(200, message, null,false);
	}
	
	public void renderDWZErrorJson(String message,String navTabId){
		toDwzJson(300, message, navTabId,false);
	}
	
	public void renderDWZErrorJson(String message){
		toDwzJson(300, message, null,false);
	}
	
}
