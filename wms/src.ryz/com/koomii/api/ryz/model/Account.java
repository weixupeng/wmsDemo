package com.koomii.api.ryz.model;

import com.jfinal.plugin.activerecord.Model;
import com.koomii.api.common.ModelConfig;

public class Account extends Model<Account> {
	private static final long serialVersionUID = 6232171820443147930L;
	
	public static Account dao = new Account();
	
	/**
	 * 根据登录用户名获取用户
	 * @param loginName
	 * @return
	 */
	public Account getUserByLoginName(String loginName){
		return Account.dao.findFirst("select * from "+ModelConfig.TABLE_Account+
				" where loginName=?",
				loginName);
		
	}
	
	/**
	 * 根据登录密钥获取用户
	 * @param loginKey
	 * @return
	 */
	public Account getUserByKey(String loginKey){
		return Account.dao.findFirst("select * from "+ModelConfig.TABLE_Account+
				" where loginKey=?",
				loginKey);
		
	}
	
}
