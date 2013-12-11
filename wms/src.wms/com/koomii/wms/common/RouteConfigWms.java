package com.koomii.wms.common;

import com.jfinal.config.Routes;
import com.jfinal.core.JFinal;
import com.koomii.wms.controller.CustomerController;
import com.koomii.wms.controller.FormController;
import com.koomii.wms.controller.MaterialController;
import com.koomii.wms.controller.StorageController;
import com.koomii.wms.controller.EmployeController;;

public class RouteConfigWms {
	
	public static void config(Routes me){
		me.add("/wms/storage", StorageController.class);
		me.add("/wms/form", FormController.class);
		me.add("/wms/material", MaterialController.class);
		me.add("/wms/customer", CustomerController.class);
		me.add("/wms/employe", EmployeController.class);
	}
	
	/**
	 * 建议使用 JFinal 手册推荐的方式启动项目
	 * 运行此 main 方法可以启动项目，此main方法可以放置在任意的Class类定义中，不一定要放于此
	 */
	public static void main(String[] args) {
		JFinal.start("WebRoot", 80, "/", 5);
	}
}
