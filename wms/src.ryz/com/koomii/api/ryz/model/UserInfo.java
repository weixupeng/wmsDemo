package com.koomii.api.ryz.model;

import com.jfinal.plugin.activerecord.Model;
import com.koomii.common.ModelConfig;

public class UserInfo extends Model<UserInfo> {
	private static final long serialVersionUID = 6232171820443147930L;
	
	public static UserInfo dao = new UserInfo();
	
	/**
	 * 根据登录用户名获取用户
	 * @param loginName
	 * @return
	 */
	public UserInfo getUserByLoginName(String loginName){
		return UserInfo.dao.findFirst("select * from "+ModelConfig.TABLE_UserInfo+
				" where loginName=?",
				loginName);
		
	}
	
	/**
	 * 根据登录密钥获取用户
	 * @param loginKey
	 * @return
	 */
	public UserInfo getUserByKey(String loginKey){
		return UserInfo.dao.findFirst("select * from "+ModelConfig.TABLE_UserInfo+
				" where loginKey=?",
				loginKey);
		
	}
	
}
