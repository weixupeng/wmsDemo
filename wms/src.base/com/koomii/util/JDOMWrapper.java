package com.migrsoft.util;

import java.io.*;
import org.jdom.*;
import org.jdom.input.*;
import java.util.regex.*;

import java.net.URL;
import java.util.List;
import java.util.ArrayList;
import java.util.Properties;

import com.migrsoft.util.MigrStringUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.Document;
import org.jdom.Element;

public class JDOMWrapper {
	private static	Log log =	LogFactory.getLog( JDOMWrapper.class );
	public static final String	XMLPATHSEP		=	"/";

	protected static Element _findElement( Element eleParent, String astrPath[], int nStartIndex )
	{
		if( null == astrPath || nStartIndex > astrPath.length )
			return	null;

		Element	eleChild	=	eleParent;
		for( int i=nStartIndex; i<astrPath.length; i++ )
		{
			eleChild	=	eleChild.getChild( astrPath[i] );
			if( null == eleChild )
				break;
		}
		return	eleChild;
	}

	protected static Element _findElement( Element eleParent, String astrPath[] )
	{
		return	_findElement( eleParent, astrPath, 0 );
	}

	protected static Element _findElement( Element eleParent, String strPath )
	{
		String	astrPath[]	=	MigrStringUtil.split( strPath, XMLPATHSEP );
		return	_findElement( eleParent, astrPath );
	}

	protected static Element _findElement( Document document, String strPath )
	{
		String	astrPath[]	=	MigrStringUtil.split( strPath, XMLPATHSEP );
		if( null == astrPath || astrPath.length <= 0 )
			return	null;
		Element	eleRoot	=	document.getRootElement();

		if( strPath.startsWith( XMLPATHSEP ) )
			return	_findElement( eleRoot, astrPath, 1 );

		if( astrPath.length>0 && eleRoot.getName().equals( astrPath[0] ) )
			return	_findElement( eleRoot, astrPath, 1 );

		return	_findElement( eleRoot, astrPath );
	}

	protected	static	List	_findElements( Element element, String strPath )
	{
		if( null==strPath )
			return	null;
		String	strKey	=	null;
		String	strValue=	null;
        Pattern pattern =   Pattern.compile( "(.+)\\?(.+)=(.+)" );
        Matcher m   =   pattern.matcher( strPath );
        if( m.find() )
		{
			strPath	=	m.group( 1 );
			strKey	=	m.group( 2 );
			strValue=	m.group( 3 );
		}

		String	astrPath[]	=	MigrStringUtil.split( strPath, XMLPATHSEP );
		if( null == element )
			return	null;
		if( astrPath.length<1 )
			return	null;

		ArrayList	al	=	new	ArrayList();
		if( null!=element.getParent() )
		{
			element	= element.getParentElement();
			List	list	=	element.getChildren( astrPath[ astrPath.length-1 ] );
			if( null==strKey || null==strValue )
				return	list;
			for( int i=list.size()-1; i>=0; i-- )
			{
				Element	ele	=	(Element)list.get(i);
				if( strValue.equals( ele.getAttributeValue( strKey ) ) )
					al.add( ele.clone() );
			}
		}
		else
		{
			al.add( element.clone() );
		}
		return	al;
	}

	private	static String	getURI( String strPath )
	{
        Pattern pattern =   Pattern.compile( "(.+)\\?(.+)" );
        Matcher m   =   pattern.matcher( strPath );
        if( m.find() )
			return	m.group(1);
		return	strPath;
	}

	public static List findElements( Document document, String strPath )
	{
		Element	element	=	_findElement( document, getURI(strPath) );
		return	_findElements( element, strPath );
	}

	public static List findElements( Element eleParent, String strPath )
	{
		Element	element	=	_findElement( eleParent, getURI(strPath) );
		return	_findElements( element, strPath );
	}

	public static Element findElement( Element eleParent, String strPath )
	{
		List	list	=	findElements( eleParent, strPath );
		if( null==list || 0==list.size() )
			return	null;
		return	(Element)list.get(0);
	}

	public static Element findElement( Document document, String strPath )
	{
		List	list	=	findElements( document, strPath );
		if( null==list || 0==list.size() )
			return	null;
		return	(Element)list.get(0);
	}

	public	static	Properties	populate( Element ele )
	{
		Properties	props	=	new	Properties( );
		if( null==ele )
			return	props;
		List	list	=	ele.getAttributes( );
		for( int i=0; null!=list && i<list.size(); i++ )
		{
			Attribute	attr	=	(Attribute)list.get(i);
			props.setProperty( attr.getName(), attr.getValue() );
		}
		return	props;
	}

	public	static	Document	loadXML( URL url )
	{
		if( null==url )
			return	null;
		try
		{
			SAXBuilder	builder	=	new SAXBuilder();
			return builder.build( url );
		}
		catch( JDOMException e )
		{
			log.error( e );
		}
		catch( IOException e )
		{
			log.error( e );
		}
		return	null;
	}
}
