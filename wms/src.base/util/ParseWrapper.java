package util;

public class ParseWrapper {
	public	static	int	parseInt( String s, int nDefault )
	{
		try
		{
			return	Integer.parseInt( s );
		}
		catch( Exception e )
		{
		}
		return	nDefault;
	}

	public	static	long parseLong( String s, long lnDefault )
	{
		try
		{
			return	Long.parseLong( s );
		}
		catch( Exception e )
		{
		}
		return	lnDefault;
	}

	public	static	float parseFloat( String s, float fDefault )
	{
		try
		{
			return	Float.parseFloat( s );
		}
		catch( Exception e )
		{
		}
		return	fDefault;
	}

	public	static	double parseDouble( String s, double dDefault )
	{
		try
		{
			return	Double.parseDouble( s );
		}
		catch( Exception e )
		{
		}
		return	dDefault;
	}

	public	static	boolean	parseBool( String strBool )
	{
		if( null==strBool )
			return	false;
		String	s	=	strBool.toLowerCase( );
		if( "true".equals( s ) || "on".equals( s ) || "yes".equals( s ) || "1".equals( s ) )
			return	true;
		return	false;
	}
	
}
