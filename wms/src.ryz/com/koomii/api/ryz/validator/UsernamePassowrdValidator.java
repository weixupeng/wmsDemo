package com.koomii.api.ryz.validator;

import static com.koomii.api.APIResponse.*;

import com.jfinal.core.Controller;
import com.koomii.base.BaseValidator;

public class UsernamePassowrdValidator extends BaseValidator {

	@Override
	protected void validate(Controller c) {
		validateRequired("username", "u_message", "登录用户名不能为空");
		validateRequired("password", "p_message", "密码不能为空");
	}

	@Override
	protected void handleError(Controller c) {
		toAPIResponse(c, RESPONSE_CODE_ERROR_UserReqParamError, "username and passowrd can not null", null);
	}

}
