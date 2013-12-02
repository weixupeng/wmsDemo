package com.koomii.api.ryz.validator;

import static com.koomii.api.common.APIResponse.*;

import com.jfinal.core.Controller;
import com.koomii.base.BaseValidator;

public class PkJudgeValidator extends BaseValidator {
	
	@Override
	protected void validate(Controller c) {
		validateRequired("id", "id_msg", "id is null");
		validateRequired("outcome", "outcome_msg", "outcome is null");
		validateInteger("outcome",0,1, "outcome_message", "outcome不合法");
	}

	@Override
	protected void handleError(Controller c) {
		toAPIResponse(c, RESPONSE_CODE_ERROR_PKInfoJudgeParamError, "the parameter id or outcome is error", null);
	}

}
