package com.koomii.api.ryz.controller;

import static com.koomii.api.common.APIResponse.*;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.io.FileUtils;


import com.alibaba.druid.util.Base64;
import com.jfinal.aop.Before;
import com.jfinal.core.JFinal;
import com.jfinal.upload.UploadFile;
import com.koomii.api.base.BaseAPIController;
import com.koomii.api.ryz.model.Account;
import com.koomii.api.ryz.validator.PassowrdValidator;
import com.koomii.api.ryz.validator.UserEditValidator;
import com.koomii.api.ryz.validator.UserKeyValidator;
import com.koomii.api.ryz.validator.UsernamePassowrdValidator;
import com.koomii.common.Constant;
import com.koomii.util.ChristDateUtils;
import com.koomii.util.ChristStringUtil;
import com.koomii.util.CommonUtil;
import com.koomii.util.ModelUtils;

public class UserInfoController extends BaseAPIController {
	
	/**
	 * 用户登录
	 */
	@Before(UsernamePassowrdValidator.class)
	public void login(){
		String username = getPara("username");//用户名
		String password = getPara("password");//密码
		String clientType = getPara("ct");//客户端类型 1-Android 2-Apple 3-WindowsPhone
		String version = getPara("v");//客户端版本
		//查询用户
		Account user = Account.dao.getUserByLoginName(username);
		if(user == null || !user.getStr("loginPwd").equals(password)){
			toAPIResponse(RESPONSE_CODE_ERROR_LoginFail, "login fail,acount or password is wrong", null);
			return;
		}
		if(user.getInt("state") == 1){
			toAPIResponse(RESPONSE_CODE_ERROR_AccountLocked, "account locked", null);
			return;
		}
		Date loginDate = ChristDateUtils.getCurrentDateTime();
		//生成key
		Map<String, String> keyMap = new HashMap<String, String>();
		keyMap.put("username", username);
//		keyMap.put("password", password);
		keyMap.put("ct", clientType);
		keyMap.put("v", version);
		keyMap.put("loginDate", loginDate.getTime()+"");
		String loginKey = Base64.byteArrayToBase64(gson.toJson(keyMap).getBytes());
		loginKey = loginKey.substring(0, loginKey.length()-2);
		//将key保存到数据库
		user.set("loginKey", loginKey).set("loginDate", ChristDateUtils.getCurrentDateTime()).update();
		//登录的用户，把key放到session里
//		Subject subject = SecurityUtils.getSubject();
//		if(subject.isAuthenticated()){
//			subject.getSession().setAttribute("loginKey", loginKey);
//		}
		Map<String, Object> result = new HashMap<String,Object>();
		result.put(RESULT_CDOE_LoginUser, user);
		toAPIResponse(RESPONSE_CODE_SUCCESS, "login ok", result);
	}
	
	/**
	 * 用户退出
	 */
	@Before(UserKeyValidator.class)
	public void logout(){
		String key = getPara("key");
		//根据Key查询用户
		Account user = Account.dao.getUserByKey(key);
		//删除key和登录时间
		if(user != null)
			user.set("loginKey", null).set("loginDate", null).update();
		toAPIResponse(RESPONSE_CODE_SUCCESS, "logout ok", null);
	}
	
	
	
	/**
	 * 用户注册
	 */
	@Before(UsernamePassowrdValidator.class)
	public void reg(){
		String username = getPara("username");//用户名
		String password = getPara("password");//密码
		String mobile = getPara("mobile");//手机号
		String clientType = getPara("ct");//客户端类型 1-Android 2-Apple 3-WindowsPhone
		String version = getPara("v");//客户端版本
		//判定是否已经存在
		if(null != Account.dao.getUserByLoginName(username)){
			toAPIResponse(RESPONSE_CODE_ERROR_AccountExist, "account is exist", null);
			return;
		}
		//注册信息
		Account user = new Account();
		user.set("loginName", username).set("loginPwd", password).set("mobile", mobile);
		ModelUtils.fillForSave(user);
		user.set("state", 0).set("ruyibiAll", 0).set("ruyibiLocked", 0).set("ruyibi", 0).set("pkNum", 0);
		//保存
		user.save();
		
		Map<String, Object> result = new HashMap<String,Object>();
		result.put(RESULT_CDOE_RegUserName, username);
		toAPIResponse(RESPONSE_CODE_SUCCESS, "reg ok", result);
	}
	
	/**
	 * 用户信息查询
	 */
	@Before(UserKeyValidator.class)
	public void my(){
		String key = getPara("key");
		//根据Key查询用户
		Account user = Account.dao.getUserByKey(key);
		//不存在则返回错误
		if(user == null){
			toAPIResponse(RESPONSE_CODE_ERROR_AccountNotExist, "account not exist or not login", null);
			return;
		}
		user.set("loginPwd", "************");
		Map<String, Object> result = new HashMap<String,Object>();
		result.put(RESULT_CDOE_LoginUser, user);
		toAPIResponse(RESPONSE_CODE_SUCCESS, "login ok", result);
	}
	
	/**
	 * 用户信息维护
	 */
	@Before({UserKeyValidator.class,UserEditValidator.class})
	public void edit(){
		String key = getPara("key");
		//根据Key查询用户
		Account user = Account.dao.getUserByKey(key);
		//不存在则返回错误
		if(user == null){
			toAPIResponse(RESPONSE_CODE_ERROR_AccountNotExist, "account not exist or not login", null);
			return;
		}
		//更新
		Account um = getModel(Account.class);
		user.set("nickName", um.getStr("nickName"))
			.set("sign", um.getStr("sign"))
			.set("birthday", um.getTimestamp("birthday"))
			.set("sex", um.getInt("sex"))
			.set("mobile", um.getStr("mobile"))
			.set("qq", um.getStr("qq"))
			.set("email", um.getStr("email"))
			.update();
		
		Map<String, Object> result = new HashMap<String,Object>();
		result.put(RESULT_CDOE_LoginUser, user);
		toAPIResponse(RESPONSE_CODE_SUCCESS, "account edit ok", result);
	}
	
	/**
	 * 修改密码
	 */
	@Before({UserKeyValidator.class,PassowrdValidator.class})
	public void modifyPwd(){
		String key = getPara("key");
		String password = getPara("password");
		//根据Key查询用户
		Account user = Account.dao.getUserByKey(key);
		//不存在则返回错误
		if(user == null){
			toAPIResponse(RESPONSE_CODE_ERROR_AccountNotExist, "account not exist or not login", null);
			return;
		}
		//更新
		user.set("loginPwd", password).update();
		
		toAPIResponse(RESPONSE_CODE_SUCCESS, "password modify ok", null);
	}
	
	/**
	 * 用户头像上传
	 */
	@Before(UserKeyValidator.class)
	public void upimg(){
		UploadFile img = getFile();
		String key = getPara("key");
		
		String uploadImageDirRealPath = JFinal.me().getServletContext().getRealPath(Constant.UPLOAD_IMAGE_DIR);
		File uploadImageDir = new File(uploadImageDirRealPath);
		if (!uploadImageDir.exists()) {
			uploadImageDir.mkdirs();
		}
		String dateString = ChristDateUtils.formatDate(new Date(),"yyyyMM");
		String imageExtension =  ChristStringUtil.substringAfterLast(img.getFileName(), ".").toLowerCase();
		String uploadImagePath = Constant.UPLOAD_IMAGE_DIR + dateString + "/" + CommonUtil.getUUID() + "." + imageExtension;
		File file = new File(JFinal.me().getServletContext().getRealPath(uploadImagePath));
		try {
			FileUtils.copyFile(img.getFile(), file);
		} catch (IOException e) {
			e.printStackTrace();
			toAPIResponse(RESPONSE_CODE_ERROR_AccountImgSaveError, "account image save error", null);
			return;
		}
		toAPIResponse(RESPONSE_CODE_SUCCESS, "account image save ok", null);
	}
}
