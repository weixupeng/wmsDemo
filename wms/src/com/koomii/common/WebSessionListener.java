package com.koomii.common;

import org.apache.shiro.session.Session;
import org.apache.shiro.session.SessionListenerAdapter;

public class WebSessionListener extends SessionListenerAdapter {
	
	@Override
	public void onExpiration(Session session) {
		super.onExpiration(session);
		//TODO session过期处理
		System.out.println("---session过期处理");
		session.removeAttribute("loginUser");
	}
}
