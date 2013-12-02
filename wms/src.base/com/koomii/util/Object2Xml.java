package com.koomii.util;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.collections.CollectionUtils;
import org.apache.log4j.Logger;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

import com.thoughtworks.xstream.XStream;




public class Object2Xml{
	private static Logger log = Logger.getLogger(Object2Xml.class);
	/**
	 * javabean对象和XML转换的方法
	 * @param objName 类的权限定名
	 * @param obj ：传入的对象
	 * @return 转换成的xml字符串
	 * @throws MessageException 
	 */
	public static String Object2Xml(String objName,String rootName,Object obj){
		StringBuffer xml = new StringBuffer();
		xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
		xml.append("<").append(rootName).append(">\n");
		xml.append(Object2Xml.getFullObjectXml(objName, obj));
		xml.append("</").append(rootName).append(">\n");
		
	return xml.toString();
	}
	
	
	
	
	
	public static class User{
		private String name;
		private long password;
		private int age;
		private Double money;
		private Date date;
	
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public long getPassword() {
			return password;
		}
		public void setPassword(long password) {
			this.password = password;
		}
		public int getAge() {
			return age;
		}
		public void setAge(int age) {
			this.age = age;
		}
		public Double getMoney() {
			return money;
		}
		public void setMoney(Double money) {
			this.money = money;
		}
		public Date getDate() {
			return date;
		}
		public void setDate(Date date) {
			this.date = date;
		}
		
	}
	
	/**
	 * 将集合转换成xml格式
	 * @param tempHashMap  类的对应关系和标签名
	 * @param objs   要转的集合
	 * @param migr   分割对象的表示
	 * @return
	 */
	public static String Object2Xml(Map<String,String>tempHashMap,List objs,String migr){
		StringBuffer xml = new StringBuffer();
		xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
		xml.append("<info>");
		XStream xs = new XStream();
		if(CollectionUtils.isNotEmpty(objs)){
			xml.append("<migr>").append("\n");
			for(Object obj:objs){
				xs.alias(tempHashMap.get(obj.getClass().getName()),obj.getClass());
				xml.append(xs.toXML(obj));
			}
			xml.append("\n").append("</migr>").append("\n");;
		}
		xml.append("</info>");
		return xml.toString();
	}

	/**
	 * 将xml转成 对象集合
	 * @param xmlstr   传过来的xml
	 * @param tempHashMap    标签名和类的对应关系
	 * @return
	 */
   public static List xml2Object(String xmlstr,Map<String,String>tempHashMap){
		List  list=new ArrayList();
		StringBuffer xml = new StringBuffer();
		String head="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
		String[]subStringMigr=ChristStringUtil.substringsBetween(xmlstr,"<migr>","</migr>");
		for(int i=0;i<subStringMigr.length;i++){
			String child=subStringMigr[i];
			child=child.trim();
			if(ChristStringUtil.isNotEmpty(child)){
				String typeName=ChristStringUtil.substringBetween(child, "<",">");
				Object tempObject;
				try {
					tempObject = Xml2Object(Class.forName(tempHashMap.get(typeName)),head+child);
					list.add(tempObject);
				} catch (ClassNotFoundException e) {
					e.printStackTrace();
				}
			}
		}
		return list;
	}
   
   
   /**
	 * 将集合转换成xml格式
	 * @param tempHashMap  类的对应关系和标签名
	 * @param objs   要转的集合
	 * @param migr   分割对象的表示
	 * @return
	 */
	public static String Object2XmlForOne(Map<String,String>tempHashMap,Object object,String migr){
		List list=new ArrayList();
		if(object!=null){
			list.add(object);
		}
		return Object2Xml(tempHashMap,list,migr);
	}

	/**
	 * 将xml转成 对象集合
	 * @param xmlstr   传过来的xml
	 * @param tempHashMap    标签名和类的对应关系
	 * @return
	 */
  public static Object xml2ObjectForOne(String xmlstr,Map<String,String>tempHashMap){
		List  list=xml2Object(xmlstr,tempHashMap);
		if(CollectionUtils.isNotEmpty(list)){
			return list.get(0);
		}
		return null;
	}
  
	public static void main(String[] args) {
		User user = new User();
				user.setName("name");
				user.setPassword(2222221L);
				user.setAge(10);
				user.setMoney(10D);
				user.setDate(new Date());
				List list=new ArrayList();
				list.add(user);
				Map<String,String>tempHash=new HashMap<String,String>();
				Map<String,String>reverseTempHash=new HashMap<String,String>();
				tempHash.put(User.class.getName(),"User");
				reverseTempHash.put("User",User.class.getName());
				String result=Object2Xml(tempHash,list,"migr");
				System.out.println(result);
				System.out.println(User.class.getName());
				List tempList=xml2Object(result,reverseTempHash);
				User u = (User) tempList.get(0);
				System.out.println("name:"+u.getName()+",psd:"+u.getPassword()+",age:"+u.getAge()+",date"+u.getDate());
	}
	
	public static String Object2Xml(Class cls,String rootName,Object obj){
		StringBuffer xml = new StringBuffer();
		xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
		XStream xs = new XStream();
		xs.alias(rootName, cls);
		xml.append(xs.toXML(obj));
		return xml.toString();
	}
	
	public static Object Xml2Object(Class cls,String xmlstr){
		ByteArrayInputStream bai=null;
		try {
			bai = new ByteArrayInputStream(xmlstr.getBytes("UTF-8"));
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}
		Object obj = null;
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		DocumentBuilder db = null;
		Document dom = null;
		Class c = null;
		try {
			db = dbf.newDocumentBuilder();
			dom = db.parse(bai);
			c = cls;
			Constructor cons = c.getConstructor((Class[]) null);
			obj = cons.newInstance();
			//3.获取类的所有set方法
			Method[] methods = c.getMethods();
			for(int i=0;i<methods.length;i++){
				Method method = methods[i];
				//获取一个属性名，属性值和类型
				if(method.getName().startsWith("set") && !method.getName().substring(3).equalsIgnoreCase("class")){
					//获取字段
					String fieldName = method.getName().substring(3);
					//下面的代码是转换大小写的
					char ch = fieldName.charAt(0);
					char ch2 = 0;
					if(ch < 90){
						ch2 = (char)(ch + 32);
					}
					fieldName = fieldName.replaceFirst(String.valueOf(ch), String.valueOf(ch2));
					//从xml中解析字段
					NodeList nl = dom.getElementsByTagName(fieldName);
					if(nl.getLength() == 0){
						continue;
					}
					org.w3c.dom.Node node1 = nl.item(0);
					org.w3c.dom.Node node2 = node1.getFirstChild();
					if(node2 == null){
						continue;
					}
					Object fieldValue = node2.getNodeValue();
					Type type = method.getGenericParameterTypes()[0];
					System.out.println(type.toString());
					if(!fieldValue.equals("null")){
						if("class java.lang.Long".equals(type.toString()) || "long".equals(type.toString())){
							fieldValue = Long.valueOf((String) fieldValue);
						}else if("class java.lang.Double".equals(type.toString()) || "double".equals(type.toString())){
							fieldValue = Double.valueOf((String) fieldValue);
						}else if("class java.lang.String".equals(type.toString())){
							//undo
						}else if("class java.lang.Integer".equals(type.toString()) || "int".equals(type.toString())){
							fieldValue = Integer.valueOf((String)fieldValue);
						}else if("class java.util.Date".equals(type.toString())){
							fieldValue = ChristDateUtils.toDate((String)fieldValue,ChristDateUtils.TIME_PATTERN);
						}
						else if("class [B".equals(type.toString())){
							fieldValue = Base64.decodeBase64((String)fieldValue);
						}
						System.out.println(method.getName()+"=========="+fieldValue);
						method.invoke(obj,fieldValue);
					}
				}
			}
		} catch (Exception e) {
			log.error("xml和message的转换出现问题"+e);
			throw new RuntimeException("xml和message的转换出现问题：", e);
		}finally{
			if(bai != null){
				try {
					bai.close();
				} catch (IOException e) {
					log.error("关闭字符数组流异常："+e.getMessage(),e);
				}
			}
		}
		return obj;
	}
	
	
	private static String getFullObjectXml(String objName,Object obj){
		StringBuffer xml = new StringBuffer();
//		xml.append("\t<").append(objName).append(">\n");
		
		try {
			//1.加载类
			Class c = Class.forName(objName);
			
			//3.获取类的所有get方法
			Method[] methods = c.getMethods();

			for(int i=0;i<methods.length;i++){
				Method method = methods[i];
				if(method.getName().startsWith("get") && !method.getName().substring(3).equalsIgnoreCase("class")){
					
					String fieldName = method.getName().substring(3);
					//下面的代码是转换大小写
					char ch = fieldName.charAt(0);
					char ch2 = 0;
					if(ch < 90){
						ch2 = (char)(ch + 32);
					}
					fieldName = fieldName.replaceFirst(String.valueOf(ch), String.valueOf(ch2));
					Object fieldValue = method.invoke(obj,new Object[] {});
					if(fieldValue != null){
						if(fieldValue instanceof byte[]){
							byte[] v = (byte []) fieldValue;
							String value = null;
							value = Base64.encodeBase64String(v);
							fieldValue = value;
						}//end if
						xml.append("\t\t<").append(fieldName).append(">")
						.append(fieldValue).append("</").append(fieldName).append(">\n");
					}//end if
				}//end if
			}//end for
//			xml.append("\t</").append(objName).append(">\n");
		} catch (Exception e) {
			log.error("message和xml的转换出现问题：", e);
			throw new RuntimeException("message和xml的转换出现问题：", e);
		}
		
		return xml.toString();
	}
	
	/**
	 * 
	 * @param xmlStr
	 * @param objectName
	 * @return
	 * @throws MessageException
	 */
	public static Object Xml2Object(String xmlStr,String objectName) {
		return Xml2Object(xmlStr.getBytes(), objectName);
	}
	
	/**
	 * @see MessageException
	 * @param xmlStr
	 * @param objectName
	 * @return
	 * @throws MessageException
	 */
	public static Object Xml2Object(byte[] bytes,String objectName) {
			ByteArrayInputStream bai = new ByteArrayInputStream(bytes);
			
			Object obj = null;
			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			DocumentBuilder db = null;
			Document dom = null;
			Class c = null;
			try {
				db = dbf.newDocumentBuilder();
				dom = db.parse(bai);
				c = Class.forName(objectName);
				Constructor cons = c.getConstructor((Class[]) null);
				obj = cons.newInstance();
				//3.获取类的所有set方法
				Method[] methods = c.getMethods();
				for(int i=0;i<methods.length;i++){
					Method method = methods[i];
					//获取一个属性名，属性值和类型
					if(method.getName().startsWith("set") && !method.getName().substring(3).equalsIgnoreCase("class")){
						//获取字段
						String fieldName = method.getName().substring(3);
						//下面的代码是转换大小写的
						char ch = fieldName.charAt(0);
						char ch2 = 0;
						if(ch < 90){
							ch2 = (char)(ch + 32);
						}
						fieldName = fieldName.replaceFirst(String.valueOf(ch), String.valueOf(ch2));
						//从xml中解析字段
						NodeList nl = dom.getElementsByTagName(fieldName);
						if(nl.getLength() == 0){
							continue;
						}
						org.w3c.dom.Node node1 = nl.item(0);
						org.w3c.dom.Node node2 = node1.getFirstChild();
						if(node2 == null){
							continue;
						}
						Object fieldValue = node2.getNodeValue();
						Type type = method.getGenericParameterTypes()[0];
						if(!fieldValue.equals("null")){
							if("class java.lang.Long".equals(type.toString()) || "long".equals(type.toString())){
								fieldValue = Long.valueOf((String) fieldValue);
							}else if("class java.lang.Double".equals(type.toString()) || "double".equals(type.toString())){
								fieldValue = Double.valueOf((String) fieldValue);
							}else if("class java.lang.String".equals(type.toString())){
								//undo
							}else if("class java.lang.Integer".equals(type.toString()) || "int".equals(type.toString())){
								fieldValue = Integer.valueOf((String)fieldValue);
							}else if("class java.util.Date".equals(type.toString())){
								fieldValue = ChristDateUtils.toDate((String)fieldValue,ChristDateUtils.TIME_PATTERN);
							}
							else if("class [B".equals(type.toString())){
								fieldValue = Base64.decodeBase64((String)fieldValue);
							}
							method.invoke(obj,fieldValue);
						}
					}
				}
			} catch (Exception e) {
				log.error("xml和message的转换出现问题"+e);
				throw new RuntimeException("xml和message的转换出现问题：", e);
			}finally{
				if(bai != null){
					try {
						bai.close();
					} catch (IOException e) {
						log.error("关闭字符数组流异常："+e.getMessage(),e);
					}
				}
			}
			return obj;
	}
/*
	public static void main(String[] args) {
		//读取文件并加入到user对象，然后将User对象转换成xml并存储
		GitpMessage msg = new GitpMessage();
		msg.setMessageID(1000L);
		msg.setMessageType("file");
		msg.setOriginalFrom("a@A");
		msg.setFrom("a");
		msg.setTo("b@B");
		msg.setExpiration(10000000L);
		msg.setModule("user");
		msg.setMessageBody(new byte[]{1,2,3,4,5});
		String xml = null;
		try {
			xml = Object2Xml("cn.ac.nci.wjxf.gitp.momif.GitpMessage","message",msg);
		} catch (MessageException e) {
			e.printStackTrace();
		}
		System.out.println(xml);
		msg = null;
		xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<message>\n\t<messageType>file</messageType>\n\t<originalFrom>a@A</originalFrom>\n\t<from>a</from>\n\t<to>b@B</to>\n\t<module>user</module>\n\t<messageBody>AQIDBAU=\n\t</messageBody>\n\t<priority>null</priority>\n\t<expiration>10000000</expiration>\n</message>";
		try {
			msg = (GitpMessage) Xml2Object(xml, "cn.ac.nci.wjxf.gitp.momif.GitpMessage");
			System.out.println("msgId:"+msg.getMessageID());
			System.out.println("msgType:"+msg.getMessageType());
			System.out.println("msgOriginalFrom:"+msg.getOriginalFrom());
			System.out.println("msgFrom:"+msg.getFrom());
			System.out.println("msgTo:"+msg.getTo());
			System.out.println("msgExpiration:"+msg.getExpiration());
			System.out.println("msgModule"+msg.getModule());
			System.out.println("xml msgbody:hash:"+msg.getMessageBody()[0]+msg.getMessageBody()[1]+msg.getMessageBody()[2]+msg.getMessageBody()[3]+msg.getMessageBody()[4]);
			
		} catch (MessageException e) {
			e.printStackTrace();
		}
	}
*/
}
