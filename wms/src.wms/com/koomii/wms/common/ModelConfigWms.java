package com.koomii.wms.common;

import com.jfinal.core.JFinal;
import com.jfinal.plugin.activerecord.ActiveRecordPlugin;
import com.koomii.wms.model.Storage;

public class ModelConfigWms {
	
	public static final String TABLE_Storage = "wms_storage";
	
	public static void config(ActiveRecordPlugin arp){
		arp.addMapping(TABLE_Storage,Storage.class);
	}
	/**
	 * 建议使用 JFinal 手册推荐的方式启动项目
	 * 运行此 main 方法可以启动项目，此main方法可以放置在任意的Class类定义中，不一定要放于此
	 */
	public static void main(String[] args) {
		JFinal.start("WebRoot", 80, "/", 5);
	}
}
