package com.koomii.api.ryz.validator;

import static com.koomii.api.APIResponse.*;

import com.jfinal.core.Controller;
import com.koomii.base.BaseValidator;

public class UserKeyValidator extends BaseValidator {
	
	private static final String MSG_KEY = "u_loginKey";

	@Override
	protected void validate(Controller c) {
		validateRequired("key", MSG_KEY, "login key is null");
	}

	@Override
	protected void handleError(Controller c) {
		toAPIResponse(c, RESPONSE_CODE_ERROR_NotLogin, c.getAttrForStr(MSG_KEY), null);
	}

}
