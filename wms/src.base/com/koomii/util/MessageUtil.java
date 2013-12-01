package com.koomii.util;

import java.io.IOException;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.log4j.Logger;


public class MessageUtil {
	private static Logger log = Logger.getLogger("SNS");
	
	
	/**
	 * 
	 * 发送信息
	 * @Name sendMessage
	 * @param mobilesNo 手机号,多个手机号用","分开。
	 * @param content 发送的信息体。
	 * @param mobilesNo
	 * @param content
	 * @return
	 * @throws IOException
	 * @throws HttpException
	 */
	public static String sendMessage(String mobilesNo,String content)
	throws IOException, HttpException {
	PostMethod post = null;
	String reposeStr = "-1";
	try {
		post = new PostMethod(SMSProperties.getProperty("url"));
		post.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf8");
	    NameValuePair data[] = {
	        new NameValuePair("userid", SMSProperties.getProperty("userid")),
	        new NameValuePair("account", SMSProperties.getProperty("account")), 
	    	new NameValuePair("password", SMSProperties.getProperty("password")), 
	    	new NameValuePair("mobile",mobilesNo), 
	    	new NameValuePair("content",content),
	    	new NameValuePair("sendTime", ""),
	    	new NameValuePair("action", "send"),
	    	new NameValuePair("checkcontent", "0"),
	        new NameValuePair("taskName", ""),
	        new NameValuePair("countnumber", "1"),
	        new NameValuePair("mobilenumber", "1"),
	        new NameValuePair("telephonenumber", "0")
	    };
	    post.setRequestBody(data);
	    HttpClient httpclient = new HttpClient();
	    int result = httpclient.executeMethod(post);
	    if(200 != result){
	    	log.error("发送失败！手机号："+mobilesNo);
	    }
	    reposeStr = post.getResponseBodyAsString();
	    return reposeStr;
	} finally{
		if(post != null){
			post.releaseConnection();
		}
	  }
	}
	
	public static void main(String[] args) {
		try {
			String res = sendMessage("18611154405", "您申请的工程<工人体育场北路55号一层****>已经审批完成，可于2013年8月25日后到办事大厅取文！");
			System.out.println(res);
		} catch (HttpException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
}
