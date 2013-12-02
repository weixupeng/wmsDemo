package com.koomii.api.common;

import com.jfinal.config.Routes;
import com.jfinal.core.JFinal;
import com.koomii.api.ryz.controller.ConsoleController;
import com.koomii.api.ryz.controller.PkInfoController;
import com.koomii.api.ryz.controller.UserInfoController;

public class RouteConfigRyz {
	
	public static void config(Routes me){
		me.add("/api/u", UserInfoController.class);
		me.add("/api/pk", PkInfoController.class);
		me.add("/console", ConsoleController.class);
	}
	
	/**
	 * 建议使用 JFinal 手册推荐的方式启动项目
	 * 运行此 main 方法可以启动项目，此main方法可以放置在任意的Class类定义中，不一定要放于此
	 */
	public static void main(String[] args) {
		JFinal.start("WebRoot", 80, "/", 5);
	}
}
