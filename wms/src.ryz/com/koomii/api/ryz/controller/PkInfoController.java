package com.koomii.api.ryz.controller;

import static com.koomii.api.common.APIResponse.*;

import java.util.HashMap;
import java.util.Map;

import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.tx.Tx;
import com.koomii.api.base.BaseAPIController;
import com.koomii.api.common.ModelConfig;
import com.koomii.api.ryz.model.PkInfo;
import com.koomii.api.ryz.model.RuyibiFlow;
import com.koomii.api.ryz.model.UserInfo;
import com.koomii.api.ryz.validator.IdValidator;
import com.koomii.api.ryz.validator.PkJudgeValidator;
import com.koomii.api.ryz.validator.UserKeyValidator;
import com.koomii.common.Constant;
import com.koomii.util.ChristDateUtils;
import com.koomii.util.ModelUtils;

public class PkInfoController extends BaseAPIController {
	/**
	 * 最热PK列表
	 */
	public void hot(){
		int pageNumber = getParaToInt("pageNumber", 1);
		String key = getPara("key");//登录密钥，已登录用户必须传递，以便分析
		String clientType = getPara("ct");//客户端类型 1-Android 2-Apple 3-WindowsPhone
		String version = getPara("v");//客户端版本
		
		Page<PkInfo> pager = PkInfo.dao.paginate(pageNumber, Constant.pageSize,
				"select * ",
				" from " + ModelConfig.TABLE_PKInfo +" order by pv desc");
		
		Map<String, Object> result = new HashMap<String,Object>();
		result.put(RESULT_CDOE_PKInfoHotPage, pager);
		toAPIResponse(RESPONSE_CODE_SUCCESS, "get pk hot list ok", result);
	}
	
	/**
	 * 最新PK列表
	 */
	public void lastest(){
		int pageNumber = getParaToInt("pageNumber", 1);
		
		String key = getPara("key");//登录密钥，已登录用户必须传递，以便分析
		String clientType = getPara("ct");//客户端类型 1-Android 2-Apple 3-WindowsPhone
		String version = getPara("v");//客户端版本
		
		Page<PkInfo> pager = PkInfo.dao.paginate(pageNumber, Constant.pageSize,
				"select * ",
				" from " + ModelConfig.TABLE_PKInfo +" order by createDate desc");
		
		Map<String, Object> result = new HashMap<String,Object>();
		result.put(RESULT_CDOE_PKInfoLastestPage, pager);
		toAPIResponse(RESPONSE_CODE_SUCCESS, "get pk lastest list ok", result);
	}
	
	/**
	 * 发布盘口
	 */
	@Before({UserKeyValidator.class,Tx.class})
	public void add(){
		String key = getPara("key");//登录密钥，已登录用户必须传递，以便分析
		//根据Key查询用户
		UserInfo user = UserInfo.dao.getUserByKey(key);
		//不存在则返回错误
		if(user == null){
			toAPIResponse(RESPONSE_CODE_ERROR_AccountNotExist, "account not exist or not login", null);
			return;
		}
		//发布盘口
		PkInfo pkInfo = getModel(PkInfo.class);
		//检验PK信息
		Integer pkRuyibi = pkInfo.getInt("ruyibi");
		if(pkInfo == null || pkInfo.getStr("content") == null || pkRuyibi == null){
			toAPIResponse(RESPONSE_CODE_ERROR_PKInfoNull, "pk info is fail", null);
			return;
		}
		//判断金币是否够用
		long accountRuyibi = user.getLong("ruyibi");
		if(pkRuyibi > accountRuyibi){
			toAPIResponse(RESPONSE_CODE_ERROR_RuyibiNotEnough, "account ruyibi is not enough ", null);
			return;
		}
		ModelUtils.fillForSave(pkInfo);
		pkInfo.set("type",0).
			set("pubUserId", user.getStr("id")).
			set("judgeMethod",1).
			set("state",0).
			set("pv", 0).
			save();
		//锁定用户金额
		long ruyibiLocked = user.getLong("ruyibiLocked");
		//从可用账户转移到锁定账户，总金额ruyibiAll不变
		accountRuyibi -= pkRuyibi;
		ruyibiLocked += pkRuyibi;
		
		//变更盘口总数
		long pkNum = Db.queryLong("select count(*) from "+ModelConfig.TABLE_PKInfo+" where pubUserId=?",user.getStr("id"));
		user.set("pkNum",pkNum).
			 set("ruyibi",accountRuyibi).
			 set("ruyibiLocked",ruyibiLocked).
			 update();
		
		toAPIResponse(RESPONSE_CODE_SUCCESS, "pk add ok", null);
	}
	
	/**
	 * 获取PK详情信息
	 */
	@Before(IdValidator.class)
	public void detail(){
		String id = getPara("id");
		
		String key = getPara("key");//登录密钥，已登录用户必须传递，以便分析
		String clientType = getPara("ct");//客户端类型 1-Android 2-Apple 3-WindowsPhone
		String version = getPara("v");//客户端版本
		
		PkInfo pkInfo = PkInfo.dao.findById(id);
		//不存在则返回错误
		if(pkInfo == null){
			toAPIResponse(RESPONSE_CODE_ERROR_PKInfoNotExist, "pkinfo not exist", null);
			return;
		}
		long pv = pkInfo.getLong("pv") + 1L;
		pkInfo.set("pv", pv).update();
		Map<String, Object> result = new HashMap<String,Object>();
		result.put(RESULT_CDOE_PKInfoDetail, pkInfo);
		toAPIResponse(RESPONSE_CODE_SUCCESS, "get pk detail ok", result);
	}
	
	/**
	 * 参加PK
	 */
	@Before({UserKeyValidator.class,IdValidator.class,Tx.class})
	public void join(){
		String id = getPara("id");
		String key = getPara("key");//登录密钥
		
		//根据Key查询用户
		UserInfo user = UserInfo.dao.getUserByKey(key);
		//不存在则返回错误
		if(user == null){
			toAPIResponse(RESPONSE_CODE_ERROR_AccountNotExist, "account not exist or not login", null);
			return;
		}
		//获取PK信息
		PkInfo pkInfo = PkInfo.dao.findById(id);
		//不存在则返回错误
		if(pkInfo == null){
			toAPIResponse(RESPONSE_CODE_ERROR_PKInfoNotExist, "pkinfo not exist", null);
			return;
		}
		//判断盘口状态=0时才能参与
		if(pkInfo.getInt("state") != 0){
			toAPIResponse(RESPONSE_CODE_ERROR_PKInfoStateError, "pkinfo state error state is not 0", null);
			return;
		}
		//不能参与自己发布到PK
		if(user.getStr("id").equals(pkInfo.getStr("pubUserId"))){
			toAPIResponse(RESPONSE_CODE_ERROR_JoinPKInfoYourSelfCannotJoin, "the publisher of pkinfo is yourself", null);
			return;
		}
		//判断金币是否够用
		Integer pkRuyibi = pkInfo.getInt("ruyibi");
		long accountRuyibi = user.getLong("ruyibi");
		if(pkRuyibi > accountRuyibi){
			toAPIResponse(RESPONSE_CODE_ERROR_RuyibiNotEnough, "account ruyibi is not enough ", null);
			return;
		}
		//更新数据库
		pkInfo.set("recUserId", user.getStr("id")).
			set("pkDate", ChristDateUtils.getCurrentDateTime()).
			set("state", 1).
			update();
		//锁定用户金额
		long ruyibiLocked = user.getLong("ruyibiLocked");
		//从可用账户转移到锁定账户，总金额ruyibiAll不变
		accountRuyibi -= pkRuyibi;
		ruyibiLocked += pkRuyibi;
		user.set("ruyibi",accountRuyibi).
		 	 set("ruyibiLocked",ruyibiLocked).
	 		 update();
		//返回
		Map<String, Object> result = new HashMap<String,Object>();
		result.put(RESULT_CDOE_PKInfoDetail, pkInfo);
		toAPIResponse(RESPONSE_CODE_SUCCESS, "join pk ok", result);
	}
	
	/**
	 * 我的PK列表
	 */
	@Before(UserKeyValidator.class)
	public void my(){
		int pageNumber = getParaToInt("pageNumber", 1);
		String key = getPara("key");//登录密钥
		
		//根据Key查询用户
		UserInfo user = UserInfo.dao.getUserByKey(key);
		//不存在则返回错误
		if(user == null){
			toAPIResponse(RESPONSE_CODE_ERROR_AccountNotExist, "account not exist or not login", null);
			return;
		}
		
		Page<PkInfo> pager = PkInfo.dao.paginate(pageNumber, Constant.pageSize,
				"select * ",
				" from " + ModelConfig.TABLE_PKInfo +" where pubUserId=? order by createDate desc",
				user.getStr("id"));
		
		Map<String, Object> result = new HashMap<String,Object>();
		result.put(RESULT_CDOE_PKInfoMyPage, pager);
		toAPIResponse(RESPONSE_CODE_SUCCESS, "get my pk list ok", result);
		
	}
	
	/**
	 * 我的参与列表
	 */
	@Before(UserKeyValidator.class)
	public void myjoin(){
		int pageNumber = getParaToInt("pageNumber", 1);
		String key = getPara("key");//登录密钥
		
		//根据Key查询用户
		UserInfo user = UserInfo.dao.getUserByKey(key);
		//不存在则返回错误
		if(user == null){
			toAPIResponse(RESPONSE_CODE_ERROR_AccountNotExist, "account not exist or not login", null);
			return;
		}
		
		Page<PkInfo> pager = PkInfo.dao.paginate(pageNumber, Constant.pageSize,
				"select * ",
				" from " + ModelConfig.TABLE_PKInfo +" where recUserId=? order by createDate desc",
				user.getStr("id"));
		
		Map<String, Object> result = new HashMap<String,Object>();
		result.put(RESULT_CDOE_PKInfoMyJoinPage, pager);
		toAPIResponse(RESPONSE_CODE_SUCCESS, "get my join pk list ok", result);
	}
	
	@Before({UserKeyValidator.class,PkJudgeValidator.class,Tx.class})
	public void judge(){
		String id = getPara("id");
		int outcome = getParaToInt("outcome");
		String key = getPara("key");//登录密钥
		
		//根据Key查询用户
		UserInfo user = UserInfo.dao.getUserByKey(key);
		//不存在则返回错误
		if(user == null){
			toAPIResponse(RESPONSE_CODE_ERROR_AccountNotExist, "account not exist or not login", null);
			return;
		}
		//获取PK信息
		PkInfo pkInfo = PkInfo.dao.findById(id);
		//不存在则返回错误
		if(pkInfo == null){
			toAPIResponse(RESPONSE_CODE_ERROR_PKInfoNotExist, "pkinfo not exist", null);
			return;
		}
		//判断该PK是否属于当前用户
		if(!user.getStr("id").equals(pkInfo.getStr("pubUserId"))){
			toAPIResponse(RESPONSE_CODE_ERROR_PKInfoNotOwnCurrentUserOn, "pkinfo is not own current user on", null);
			return;
		}
		//判断盘口状态
		if(pkInfo.getInt("state") != 1){
			toAPIResponse(RESPONSE_CODE_ERROR_PKInfoStateError, "pkinfo state error state is not 1", null);
			return;
		}
		//PK金币
		int pkRuyibi = pkInfo.getInt("ruyibi");
		//用于计算的金币值
		int pkRuyibiResult = pkRuyibi;
		//发布方胜pkRuyibi是正数，参与方胜pkRuyibi是负数
		
		if(outcome == 0){//参与方胜
			pkRuyibiResult = 0 - pkRuyibiResult;
		}
		//更新数据库
		pkInfo.set("outcome", outcome).
			set("judgeDate", ChristDateUtils.getCurrentDateTime()).
			set("state", 2).
			update();
		
		//变更发布者的账户和流水
		{
			long ruyibiAll = user.getLong("ruyibiAll");
			long ruyibiLocked = user.getLong("ruyibiLocked");
			long ruyibi = user.getLong("ruyibi");
			ruyibiLocked = ruyibiLocked - pkRuyibi;//解除锁定
			ruyibi += pkRuyibi;//解除锁定（将锁定转移到可用）
			ruyibiAll = ruyibiAll + pkRuyibiResult;//总量结算
			ruyibi = ruyibi + pkRuyibiResult;//可用结算
			user.set("ruyibiAll", ruyibiAll).
					set("ruyibiLocked", ruyibiLocked).
					set("ruyibi",ruyibi).update();
			//流水
			Integer earningType = null;
			Integer expenseType = null;
			Integer earning = null;
			Integer expense = null;
			if(outcome == 0){//参与方胜
				expenseType = 0; //支出方式：0 PK支出 1表情购买 2礼品兑换
				expense = pkRuyibi;
			}else{
				earningType = 1;//累积方式：0登录奖励；1 pk获得；2注册取得
				earning = pkRuyibi;
			}
			RuyibiFlow pubFlow = new RuyibiFlow();
			ModelUtils.fillForSave(pubFlow);
			pubFlow.set("userId", user.getStr("id")).
					set("earningType", earningType).
					set("expenseType", expenseType).
					set("earning", earning).
					set("expense", expense).
					set("pkInfoId", pkInfo.getStr("id")).
					save();
		}
		//变更参与者的账户和流水
		{
			UserInfo recUser = user.findById(pkInfo.get("recUserId"));
			long ruyibiAll = recUser.getLong("ruyibiAll");
			long ruyibiLocked = recUser.getLong("ruyibiLocked");
			long ruyibi = recUser.getLong("ruyibi");
			
			ruyibiLocked = ruyibiLocked - pkRuyibi;//删除锁定
			ruyibi += pkRuyibi;//解除锁定（将锁定转移到可用）
			ruyibiAll = ruyibiAll - pkRuyibiResult;//计算总量
			ruyibi = ruyibi - pkRuyibiResult;//计算可用
			recUser.set("ruyibiAll", ruyibiAll).
					set("ruyibiLocked", ruyibiLocked).
					set("ruyibi",ruyibi).
					update();
			//流水
			Integer earningType = null;
			Integer expenseType = null;
			Integer earning = null;
			Integer expense = null;
			if(outcome == 0){//参与方胜
				earningType = 1;//累积方式：0登录奖励；1 pk获得；2注册取得
				earning = pkRuyibi;
			}else{
				expenseType = 0;//支出方式：0 PK支出 1表情购买 2礼品兑换
				expense = pkRuyibi;
			}
			
			RuyibiFlow recFlow = new RuyibiFlow();
			ModelUtils.fillForSave(recFlow);
			recFlow.set("userId", recUser.getStr("id")).
					set("earningType", earningType).
					set("expenseType", expenseType).
					set("earning", earning).
					set("expense", expense).
					set("pkInfoId", pkInfo.getStr("id")).
					save();
		}
		//返回
		Map<String, Object> result = new HashMap<String,Object>();
		result.put(RESULT_CDOE_PKInfoDetail, pkInfo);
		toAPIResponse(RESPONSE_CODE_SUCCESS, "judge pk ok", result);
	}
}
