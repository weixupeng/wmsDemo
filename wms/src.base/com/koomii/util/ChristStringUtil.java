package com.koomii.util;

import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.security.MessageDigest;
import java.text.DecimalFormat;
import java.util.Random;
import java.util.StringTokenizer;


import org.apache.commons.lang.StringUtils;


public class ChristStringUtil extends StringUtils {
	protected static final String m_strEncrypt = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	protected	static	final	String	CRYPT_DEFAULT = "MD5";
    
    /** 空字符串。 */
    public static final String EMPTY_STRING = "";

	/**
	 * toArray convert a string to a array of string
	 *
	 * @param str the original string
	 * @param delim the separate string
	 * @return the array of string
	 *
	 * @see	java.util.StringTokenizer
	 */
	public static String[] toArray( String __str, String __delim )
	{
		if( null == __str )
			return	null;

		StringTokenizer	st = new StringTokenizer( __str, __delim );
		int	nCount = st.countTokens();
		if( null == st || 0 >= nCount )
			return	null;

		String	astrToken[]	= new String[ nCount ];
		for( int i=0; i<nCount; i++ )
		{
			astrToken[i]	= st.nextToken().trim();
		}
		return	astrToken;
	}
	
	/**
     * 如果字符串是<code>null</code>，则返回空字符串<code>""</code>，否则返回字符串本身。
     * <pre>
     * StringUtil.defaultIfNull(null)  = ""
     * StringUtil.defaultIfNull("")    = ""
     * StringUtil.defaultIfNull("  ")  = "  "
     * StringUtil.defaultIfNull("bat") = "bat"
     * </pre>
     *
     * @param str 要转换的字符串
     *
     * @return 字符串本身或空字符串<code>""</code>
     */
    public static String defaultIfNull(String str) {
        return (str == null) ? EMPTY_STRING
                             : str;
    }
	
	/***
	 * 
	 * @author liuxf
	 * @date Dec 31, 2011
	 * @param i
	 * @return
	 * @description 获取编号 后面几位字符
	 */
	public static String getCharNum(int i){
		String str="";
		if(i/10==0){
			str = "0000"+i;
		}else if (i/100==0) {
			str = "000"+i;
		}else if (i/1000==0) {
			str = "00"+i;
		}else if (i/10000==0) {
			str = "0"+i;
		}else if (i/100000==0) {
			str = i+"";
		}
		return str;
	}

	public	static	boolean	isEmptyString( String s )
	{
		return	null==s || 0==s.length();
	}

	public	static	boolean	isString( String s )
	{
		return	null!=s && s.length()>0;
	}

	/**
	 * toArray convert a string to a array of string by using default delim ":"
	 *
	 * @param str the original string
	 * @return the array of string
	 *
	 * @see	java.util.StringTokenizer
	 */
	public static String[] toArray( String __str )
	{
		return toArray( __str, ":" );
	}

	public static String randomString( )
	{
		return	randomString( 11 );
	}

	public static String randomString( int nLen )
	{
		Random	oRandom	=	new Random( System.currentTimeMillis() );
		StringBuffer	sb	=	new	StringBuffer();
		for( int i=0; i<nLen; i++ )
		{
			sb.append( m_strEncrypt.charAt( oRandom.nextInt( m_strEncrypt.length() ) ) );
		}
		return sb.toString();
	}

   
    public static String toHex(byte buffer[])
	{
        StringBuffer sb = new StringBuffer();
        String s = null;
        for (int i = 0; i < buffer.length; i++) {
            s = Integer.toHexString((int) buffer[i] & 0xff);
            if (s.length() < 2)
                sb.append('0');
            sb.append(s);
        }
        return (sb.toString());
    }

    public static String intercept( String __str, int __len )
    {
        if ( null == __str || 0 == __str.length() ) return "";

        if ( __str.length() <= __len ) return __str;

		int counter = 0;
        if ( __str.charAt( __len ) > 0x80 )
		{
			for ( int i=0; i<__len; i++ )
			{
				if ( __str.charAt( i ) > 0x80 ) counter++;
			}
			if ( counter % 2 == 1 ) __len = __len - 1;
		}
        return __str.substring(0, __len );
    }
    
	public static String md5( String s )
	{
		try
		{
			MessageDigest md = MessageDigest.getInstance( CRYPT_DEFAULT );
			md.update( s.getBytes() ) ;
			return toHex( md.digest() );
		}
		catch( Exception ex )
		{
			return	s;
		}
	}

	/**
	 * 得到字符串的实际长度,包括空格什么的
	 * @author fg
	 * @date 2012-2-1
	 * @param str
	 * @return
	 * @description
	 */
	public static int getLen(String str)
	{
		int a = 0;
		for (int i = 0; i < str.length(); i++)
		{
			if (str.substring(i, i + 1).matches("[\u4e00-\u9fa5]+"))
			{
				a = a+2;
			}else
			{
				a =  a+1;
			}     
		}
		return a;
	}
	
	// 得到空格
	public static String getSpace(String s, int m) 
	{
		String s1 = s;
		for (int i = 0; i < m; i++) {
			s1 = s1 + " ";
		}
		return s1;
	}
	
	public static String getStr(String s, int m) 
	{
		String s1 = "";
		for (int i = 0; i < m; i++) 
		{
			s1 = s1 + s;
		}
		return s1;
	}
	
	
	//得到数字的长度
	public static String getString(double d, int m) 
	{
		DecimalFormat myformat = new DecimalFormat("###,###.##");
		return getSpace(myformat.format(d), m - myformat.format(d).length());
	}
	
	/**
	 * 通过输入字符串,和总宽度,字符串不超过总宽度的补齐空格
	 * @author fg
	 * @date 2012-2-2
	 * @param str
	 * @param m
	 * @return
	 * @description
	 */
	public static String getString(String str, int m) 
	{
		return str + getStr(" ",m-getLen(str));
	}
	
	/**
	 * 小票字体居中
	 * @author fg
	 * @date 2012-2-2
	 * @return
	 * @description
	 */
	public static String getCenterStr(String str,int m)
	{
		int len = ChristStringUtil.getLen(str);
		String ss = ChristStringUtil.getStr(" ",(int)((m-len))/2);
		return ss+str+ss;
	}   
		
	public static void main(String[] args) {
		
		System.out.println(getCenterStr("谢谢回顾！",40));
		System.out.println(getCenterStr("123",40));
		System.out.println(getCenterStr("本地软件供应商电话:32323232",40));
		
		System.out.println("d\b\b\b\bd");
	}
}
