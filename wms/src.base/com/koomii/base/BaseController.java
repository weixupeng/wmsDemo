package com.koomii.base;

import static com.koomii.api.APIResponse.RESPONSE_CODE_ERROR_NotLogin;

import java.util.HashMap;
import java.util.Map;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.jfinal.core.Controller;
import com.jfinal.kit.JsonKit;
import com.koomii.util.ChristStringUtil;

public class BaseController extends Controller {
//	public static Gson gson = new Gson();
	public static Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
	
	public void toAPIResponse(String code,String message,Map<String,Object> result){
		Map<String,Object> jsonMap=new HashMap<String,Object>();
		jsonMap.put("code", code);
		jsonMap.put("message",message);
		jsonMap.put("result", result);
		
		String jsonStr = JsonKit.toJson(jsonMap);
		
		renderJson(jsonStr);
	}
	
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
