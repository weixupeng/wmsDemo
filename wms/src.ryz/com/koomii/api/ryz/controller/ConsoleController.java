package com.koomii.api.ryz.controller;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;

import com.koomii.base.BaseController;

public class ConsoleController extends BaseController {
	
	public void index(){
		setAttr("visitIp",getRequest().getRemoteHost());
		render("home.html");
	}
	
	public void auth(){
		render("auth.html");
	}
	
	public void home(){
		setAttr("visitIp",getRequest().getRemoteHost());
		render("home.html");
	}
	
	public void apilist(){
		render("list.html");
	}
	
	public void apistat(){
		render("stat.html");
	}
	
	
}
