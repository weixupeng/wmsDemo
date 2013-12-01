package com.koomii.api.ryz.validator;

import static com.koomii.api.APIResponse.*;

import com.jfinal.core.Controller;
import com.koomii.base.BaseValidator;

public class PassowrdValidator extends BaseValidator {

	@Override
	protected void validate(Controller c) {
		validateRequired("password", "p_message", "密码不能为空");
	}

	@Override
	protected void handleError(Controller c) {
		toAPIResponse(c, RESPONSE_CODE_ERROR_UserReqParamError, "passowrd can not null", null);
	}

}
