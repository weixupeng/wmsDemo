package com.koomii.common;

import com.jfinal.core.JFinal;
import com.jfinal.plugin.activerecord.ActiveRecordPlugin;
import com.koomii.api.ryz.model.Feedback;
import com.koomii.api.ryz.model.PkInfo;
import com.koomii.api.ryz.model.RuyibiFlow;
import com.koomii.api.ryz.model.UserInfo;

public class ModelConfig {
	public static final String TABLE_UserInfo = "ryz_user_info";
	public static final String TABLE_PKInfo = "ryz_pankou_info";
	public static final String TABLE_Flow = "ryz_ruyibi_flow";
	public static final String TABLE_Feedback = "ryz_feedback";
	
	public static void config(ActiveRecordPlugin arp){
		arp.addMapping(TABLE_UserInfo,UserInfo.class);
		arp.addMapping(TABLE_PKInfo,PkInfo.class);
		arp.addMapping(TABLE_Flow,RuyibiFlow.class);
		arp.addMapping(TABLE_Feedback,Feedback.class);
	}
	/**
	 * 建议使用 JFinal 手册推荐的方式启动项目
	 * 运行此 main 方法可以启动项目，此main方法可以放置在任意的Class类定义中，不一定要放于此
	 */
	public static void main(String[] args) {
		JFinal.start("WebRoot", 80, "/", 5);
	}
}
