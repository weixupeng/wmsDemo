package com.koomii.api.common;

public class APIResponse {
	/**
	 * response返回码
	 */
	
	public static final String RESPONSE_CODE_ERROR_IdIsNull = "10001";//id为null
	
	public static final String RESPONSE_CODE_SUCCESS = "10000";//返回成功
	public static final String RESPONSE_CODE_ERROR_LoginFail = "10010";//登录失败
	public static final String RESPONSE_CODE_ERROR_AccountLocked = "10011";//用户被锁定
	public static final String RESPONSE_CODE_ERROR_AccountExist = "10012";//用户已存在
	public static final String RESPONSE_CODE_ERROR_AccountNotExist = "10013";//用户不存在
	public static final String RESPONSE_CODE_ERROR_AccountImgSaveError = "10014";//用户头像保存失败
	public static final String RESPONSE_CODE_ERROR_NotLogin = "10015";//没有登录
	public static final String RESPONSE_CODE_ERROR_RuyibiNotEnough = "10016";//如意币不够用
	public static final String RESPONSE_CODE_ERROR_UserReqParamError = "10017";//用户名密码注册信息异常
	public static final String RESPONSE_CODE_ERROR_UserEditParamError = "10018";//用户编辑参数异常
	
	public static final String RESPONSE_CODE_ERROR_PKInfoNotExist = "10020";//PK信息不存在
	public static final String RESPONSE_CODE_ERROR_PKInfoNull = "10021";//传入PK信息为空
	public static final String RESPONSE_CODE_ERROR_PKInfoNotOwnCurrentUserOn = "10022";//PK信息不是当前用户发布的
	public static final String RESPONSE_CODE_ERROR_JoinPKInfoYourSelfCannotJoin = "10023";//不能参加自己发布的PK
	public static final String RESPONSE_CODE_ERROR_PKInfoJudgeParamError = "10024";//定胜负参数错误
	public static final String RESPONSE_CODE_ERROR_PKInfoStateError = "10025";//PK信息状态错误
	
	/**
	 * Reslut标识
	 */
	public static final String RESULT_CDOE_LoginUser = "LoginUser";//登录用户
	public static final String RESULT_CDOE_RegUserName = "RegUserName";//注册的用户名
	public static final String RESULT_CDOE_PKInfoHotPage = "PKInfoHotPage";//最热PK列表
	public static final String RESULT_CDOE_PKInfoLastestPage = "PKInfoLastestPage";//最新PK列表
	public static final String RESULT_CDOE_PKInfoDetail = "PKInfoDetail";//PK详情
	public static final String RESULT_CDOE_PKInfoMyPage = "PKInfoMyPage";//我的PK列表
	public static final String RESULT_CDOE_PKInfoMyJoinPage = "PKInfoMyJoinPage";//我参与的PK列表
}
