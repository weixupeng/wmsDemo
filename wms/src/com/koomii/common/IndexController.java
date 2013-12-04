package com.koomii.common;



import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.ExcessiveAttemptsException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.crypto.hash.Md5Hash;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;

import com.alibaba.fastjson.JSONObject;
import com.jfinal.aop.Before;
import com.koomii.base.BaseController;
import com.koomii.sys.model.Userinfo;
import com.koomii.util.ChristStringUtil;


public class IndexController extends BaseController {
	
	//主页
	public void index(){
		if(SecurityUtils.getSubject().isAuthenticated()){
			//登录了，跳转登录界面
			redirect("/main");
		}else{
			redirect("/login");
		}
		
	}
	
	
	
	public void login(){
		if(SecurityUtils.getSubject().isAuthenticated()){
			//登录了，跳转登录界面
			redirect("/main");
		}
		render("common/login.html");
	}
	
	public void validateLogin(){
		Userinfo user = getModel(Userinfo.class,"userinfo");
		UsernamePasswordToken token = new UsernamePasswordToken(user.getStr("username"), user.getStr("pwd"));
		try {
			Subject subject = SecurityUtils.getSubject();
			if(!subject.isAuthenticated()){
				subject.login(token);
			}
			// 这里可以调用subject 做判断
			String username = (String)subject.getPrincipal();
			Session session = subject.getSession(true);
			Userinfo loginUser = Userinfo.dao.findFirst("select * from sys_userinfo where username=?",username);
			session.setAttribute("loginUser", loginUser);
			JSONObject json = new JSONObject();
			json.put("statusCode", "200");
			json.put("realname", loginUser.getStr("realname"));
			json.put("message", "恭喜您登录成功！");
			renderJson(json.toJSONString());
		}catch (UnknownAccountException e) {
			renderDWZErrorJson("对不起,你输入的用户名和密码有误！");
		}catch (IncorrectCredentialsException e) {
			renderDWZErrorJson("对不起,你输入的用户名和密码有误！");
		}catch (LockedAccountException e) {
			// TODO: 帐号锁定
			renderDWZErrorJson("此用户已被系统禁止登录！");
		}catch (ExcessiveAttemptsException e) {
			// TODO: Thrown when a system is configured to only allow a certain number of authentication attempts
			e.printStackTrace();
			renderDWZErrorJson("用户登录超过限制数！");
		}catch (AuthenticationException e) {
			//没有权限 
			e.printStackTrace();
			renderDWZErrorJson("此用户没有权限登录系统！");
		} 
	}
	
	//跳转修改密码页面
	public void toUpdatePassword(){
		render("common/updatePassword.html");
	}
	//修改密码
	public void updatePassword(){
		Subject subject = SecurityUtils.getSubject();
		String username = (String)subject.getPrincipal();
		Userinfo loginUser = Userinfo.dao.findFirst("select * from sys_userinfo where username=?",username);
		String newPwd = getPara("newPassword");
		String md5NewPwd = ChristStringUtil.md5(newPwd);
		if(loginUser.get("pwd").equals(md5NewPwd)){
			loginUser.set("pwd", md5NewPwd).update();
			renderDWZSuccessJson("密码修改成功，新密码已生效！");
		}else{
			renderDWZErrorJson("您输入的旧密码错误！");
		}
	}
	
	public void main(){
		render("common/main.html");
	}
	public void sidebar(){
		String func = getPara("func");
		render("common/sidebar_"+func+".html");
	}
	public void shortcut(){
		render("common/shortcut.html");
	}
	
	
	public void logout(){
		try {
			Subject subject = SecurityUtils.getSubject();
			Session session = subject.getSession(true);
			session.removeAttribute("loginUser");
			subject.logout();
			redirect("/index");
		} catch (AuthenticationException e) {
			e.printStackTrace();
			renderText("异常："+e.getMessage());
		}
	}
}
