package com.koomii.api.ryz.validator;

import static com.koomii.api.common.APIResponse.*;

import com.jfinal.core.Controller;
import com.koomii.base.BaseValidator;

public class UserEditValidator extends BaseValidator {
	
	@Override
	protected void validate(Controller c) {
		if(!c.getPara("userInfo.birthday").isEmpty()){
			validateDatetime(c,"userInfo.birthday", "1900-01-01 00:00:00", "2100-01-01 00:00:00", "msg_birthday", "birthday is error");
		}
		if(!c.getPara("userInfo.sex").isEmpty()){
			validateInteger("userInfo.sex",0,1, "msg_sex", "userInfo.sex is error");
		}
	}

	@Override
	protected void handleError(Controller c) {
		toAPIResponse(c, RESPONSE_CODE_ERROR_UserEditParamError, "user edit parameter is error", null);
	}

}
