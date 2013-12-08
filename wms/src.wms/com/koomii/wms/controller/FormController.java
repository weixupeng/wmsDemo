package com.koomii.wms.controller;

import com.koomii.base.BaseController;
import com.koomii.wms.model.Customer;
import com.koomii.wms.model.Storage;

import static com.koomii.wms.common.ModelConfigWms.*;

public class FormController extends BaseController {
	
	public void io() {
		setAttr("storageList", Storage.dao.find("select * from wms_storage"));
		setAttr("customerList", Customer.dao.find("select * from wms_customer"));
		render("../form_io.html");
	}
	
}
