package com.koomii.base;



import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.jfinal.core.Controller;

public class BaseController extends Controller {
//	public static Gson gson = new Gson();
	public static Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
	
	
	
	/**
	 * 转换dwz json格式输出
	 * @param statusCode
	 * @param message
	 * @param navTabId
	 * @return
	 */
	public void toDwzJson(Integer statusCode,String message,String navTabId){
		Map<String,Object> jsonMap=new HashMap<String,Object>();
		jsonMap.put("statusCode", statusCode);
		if(message!=null)
		jsonMap.put("message",message);
		if(navTabId!=null)
			jsonMap.put("navTabId", navTabId);
		this.renderJson(gson.toJson(jsonMap));
	}
	
	public void renderDWZSuccessJson(String message,String navTabId){
		toDwzJson(200, message, navTabId);
	}
	
	public void renderDWZSuccessJson(String message){
		toDwzJson(200, message, null);
	}
	
	public void renderDWZErrorJson(String message,String navTabId){
		toDwzJson(300, message, navTabId);
	}
	
	public void renderDWZErrorJson(String message){
		toDwzJson(300, message, null);
	}
	
}
