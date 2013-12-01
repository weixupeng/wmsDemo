package com.koomii.base;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.jfinal.core.Controller;
import com.jfinal.kit.JsonKit;
import com.jfinal.validate.Validator;

public abstract class BaseValidator extends Validator {
	public void toAPIResponse(Controller c,String code,String message,Map<String,Object> result){
		Map<String,Object> jsonMap=new HashMap<String,Object>();
		jsonMap.put("code", code);
		jsonMap.put("message",message);
		jsonMap.put("result", result);
		
		//JsonKit被lzy改造了
		JsonKit.customerDateFormart = "yyyy-MM-dd HH:mm:ss";
		String jsonStr = JsonKit.toJson(jsonMap);
		
		c.renderJson(jsonStr);
	}
	
	
	
	/** 
	 * Validate date.
	 */
	protected void validateDatetime(Controller controller,String field, Date min, Date max, String errorKey, String errorMessage) {
		try {
			String value = controller.getPara(field);
			Date temp = new SimpleDateFormat(datetimePattern).parse(value);	// Date temp = Date.valueOf(value); 为了兼容 64位 JDK
			if (temp.before(min) || temp.after(max))
				addError(errorKey, errorMessage);
		}
		catch (Exception e) {
			addError(errorKey, errorMessage);
		}
	}
	
	// TODO set in Const and config it in Constants. TypeConverter do the same thing.
	private static final String datetimePattern = "yyyy-MM-dd HH:mm:ss";
	
	/** 
	 * Validate date. Date formate: yyyy-MM-dd  HH:mm:ss
	 */
	protected void validateDatetime(Controller controller,String field, String min, String max, String errorKey, String errorMessage) {
		// validateDate(field, Date.valueOf(min), Date.valueOf(max), errorKey, errorMessage);  为了兼容 64位 JDK
		try {
			SimpleDateFormat sdf = new SimpleDateFormat(datetimePattern);
			validateDatetime(controller,field, sdf.parse(min), sdf.parse(max), errorKey, errorMessage);
		} catch (ParseException e) {
			addError(errorKey, errorMessage);
		}
	}
}
