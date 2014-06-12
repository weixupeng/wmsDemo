package util;

import java.text.DecimalFormat;

public class ChineseNumberUtil {

	public static String formatPercent(float percent) {
		DecimalFormat df = new DecimalFormat("#0.00");

		return df.format(percent * 100.0 + 0.005);
	}

	public static String Fen2Yuan(long __fen) {
		DecimalFormat df = new DecimalFormat("#0.00");

		return df.format(__fen / 100.0);
	}

	public static int Fen2YuanInt(long __fen) {
		return (int) (__fen / 100);
	}

	public static String SmallToBigRMB(long __fen) {
		return "人民币" + CurrencyToBigRMB(__fen);
	}

	public static String joinString(String arg1, String arg2) {
		return arg1 + arg2;
	}

	public static long pluslong(long arg1, long arg2) {
		return arg1 + arg2;
	}

	public static String divlong(long arg) {
		if (arg > 1024)
			return "" + (arg / 1024) + "k";
		else
			return "" + arg + "b";
	}

	// return real value from long.
	// @_p : scale of reduce
	// etc : getReat(500,10) -> 50.00
	public static String getReal(long __lVal, int _p) {
		DecimalFormat df = new DecimalFormat("#0.##");
		return df.format(__lVal / (1.0 * _p));
	}

	public static String getRealFromStr(String __strVal, int _p) {
		long __lVal = 0;

		if (__strVal != null && __strVal.length() > 0) {
			try {
				__lVal = Long.parseLong(__strVal);
			} catch (NumberFormatException e) {
				__lVal = 0;
			}
		}

		DecimalFormat df = new DecimalFormat("#0.##");
		return df.format(__lVal / (1.0 * _p));
	}


	public String display2Html(String arg1) {
		if (arg1 == null || arg1.length() == 0)
			return "&nbsp;";

		arg1 = arg1.replaceAll("\n", "<br>");
		arg1 = arg1.replaceAll(" ", "&nbsp;");
		arg1 = arg1.replaceAll("\t", "&nbsp;&nbsp;&nbsp;&nbsp;");
		return arg1;
	}


	public String shortString(String s, int nMaxLen) {
		if (null == s)
			return s;
		int nLen = 0;
		for (int i = 0; i < s.length(); i++) {
			nLen++;
			if (s.charAt(i) > 127)
				nLen++;
			if (nLen >= nMaxLen * 2)
				return s.substring(0, i);
		}
		return s;
	}

	public Object getObjectInstance(String className) {
		try {
			Class cls = Class.forName(className);
			return cls.newInstance();
		} catch (Exception ex) {
			return null;
		}
	}

	public static String CurrencyToBigRMB(long __fen) {
		if (__fen < 0)
			return "负" + CurrencyToBigRMB(-__fen);

		String strYuan = "元";

		String[] BigNumber = { "零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖" };
		String[] unit2 = { "拾", "佰", "仟" };
		String[] unit3 = { "角", "分" };
		// 判断金额是否为零元
		if (__fen == 0L) {
			return ("零" + strYuan + "整");
		}

		String strCurrency = String.valueOf(__fen);

		// 小于一元
		if (strCurrency.length() < 3) {
			if (strCurrency.length() == 1) {
				strCurrency = "0" + strCurrency;
			}
			return ("零" + strYuan + getBigWrite(strCurrency.substring(0, 1))
					+ "角" + getBigWrite(strCurrency.substring(1)) + "分");
		}

		// 大于等于一元
		String smallInt = "", smallFloat = "";// 小写人民币的整数部分与小数部分
		String bigRMB = "";

		String strXiaoShu;

		smallInt = strCurrency.substring(0, strCurrency.length() - 2);// 小写的整数部分
		smallFloat = strCurrency.substring(strCurrency.length() - 2);// 小写的小数部分

		// 处理小数部分
		if (smallFloat.equals("0") || smallFloat.equals("00")) {
			strXiaoShu = "整";
		} else {
			strXiaoShu = getBigWrite(smallFloat.substring(0, 1)) + "角"
					+ getBigWrite(smallFloat.substring(1)) + "分";
		}

		return getBigInt(smallInt) + strYuan + strXiaoShu;

	}
	
	public static void main(String[] args) {
		System.out.println(getChineseNumber("0", false));
		System.out.println(getChineseNumber("1", false));
		System.out.println(getChineseNumber("10", false));
		System.out.println(getChineseNumber("17", false));
		System.out.println(getChineseNumber("27", false));
		System.out.println(getChineseNumber("50", false));
		System.out.println(getChineseNumber("99", false));
		System.out.println(getChineseNumber("123", false));
	}
	
	public static String getChineseNumber(String strNum){
		return getChineseNumber(strNum, false);
	}
	
	public static String getChineseNumber(String strNum, boolean addZero){

		String[] BigNumber = { "零", "一", "二", "三", "四", "五", "六", "七", "八", "九" };
		String[] unit2 = { "千", "百", "十" };
		String[] strBlank = { "000", "00", "0" };
		String strResult = "";

		// 补齐
		if (strNum.length() < 4) {
			strNum = strBlank[(strNum.length()) - 1] + strNum;
		}


		// 0值检查
		if ("0000".equals(strNum)) {
			return "0";
		}
		// 分解
		String[] strPerNum = new String[4];

		strPerNum[0] = strNum.substring(0, 1);
		strPerNum[1] = strNum.substring(1, 2);
		strPerNum[2] = strNum.substring(2, 3);
		strPerNum[3] = strNum.substring(3);

		// 前面的0不处理，用'U'做标记。
		for (int i = 0; i < 4; i++) {
			if ("0".equals(strPerNum[i])) {
				strPerNum[i] = "U";
			} else {
				break;
			}
		}
		// 后面的0不处理，用'U'做标记。
		for (int i = 1; i <= 4; i++) {
			if ("0".equals(strPerNum[4 - i])) {
				strPerNum[4 - i] = "U";
			} else {
				break;
			}
		}
		// 连续的0处理后一个,前一个不处理，用'U'做标记。
		for (int i = 1; i < 4; i++) {
			if ("0".equals(strPerNum[i - 1]) && "0".equals(strPerNum[i])) {
				strPerNum[i - 1] = "U";
			}
		}
		// 连接
		for (int i = 0; i < 3; i++) {
			if (!"U".equals(strPerNum[i])) {
				if ("0".equals(strPerNum[i])) {
					strResult = strResult + getSmallWrite(strPerNum[i]);
				} else {
					strResult = strResult + getSmallWrite(strPerNum[i])
							+ unit2[i];
				}
			}
		}
		// 个位
		if (!"U".equals(strPerNum[3])) {
			strResult = strResult + getSmallWrite(strPerNum[3]);
		}

		// 前面是否加“零”
		if ("U".equals(strPerNum[0]) && addZero) {
			strResult = "零" + strResult;
		}
		
		//处理10~20之间的数，为十到十几
		if(strResult.length() == 2 || strResult.length() == 3){
			String yi = strResult.substring(0, 1);
			String shi = strResult.substring(1,2);
			if("一".equals(yi) && "十".equals(shi)){
				strResult = strResult.substring(1, strResult.length());
			}
		}
		
		return strResult;
	
	}

	public static String getQian(String strNum, boolean addZero) {
		String[] BigNumber = { "零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖" };
		String[] unit2 = { "仟", "佰", "拾" };
		String[] strBlank = { "000", "00", "0" };
		String strResult = "";

		// 补齐
		if (strNum.length() < 4) {
			strNum = strBlank[(strNum.length()) - 1] + strNum;
		}

		// System.out.println("getQian:"+strNum);

		// 0值检查
		if ("0000".equals(strNum)) {
			return "0";
		}
		// 分解
		String[] strPerNum = new String[4];

		strPerNum[0] = strNum.substring(0, 1);
		strPerNum[1] = strNum.substring(1, 2);
		strPerNum[2] = strNum.substring(2, 3);
		strPerNum[3] = strNum.substring(3);

		// 前面的0不处理，用'U'做标记。
		for (int i = 0; i < 4; i++) {
			if ("0".equals(strPerNum[i])) {
				strPerNum[i] = "U";
			} else {
				break;
			}
		}
		// 后面的0不处理，用'U'做标记。
		for (int i = 1; i <= 4; i++) {
			if ("0".equals(strPerNum[4 - i])) {
				strPerNum[4 - i] = "U";
			} else {
				break;
			}
		}
		// 连续的0处理后一个,前一个不处理，用'U'做标记。
		for (int i = 1; i < 4; i++) {
			if ("0".equals(strPerNum[i - 1]) && "0".equals(strPerNum[i])) {
				strPerNum[i - 1] = "U";
			}
		}
		// 连接
		for (int i = 0; i < 3; i++) {
			if (!"U".equals(strPerNum[i])) {
				if ("0".equals(strPerNum[i])) {
					strResult = strResult + getBigWrite(strPerNum[i]);
				} else {
					strResult = strResult + getBigWrite(strPerNum[i])
							+ unit2[i];
				}
			}
		}
		// 个位
		if (!"U".equals(strPerNum[3])) {
			strResult = strResult + getBigWrite(strPerNum[3]);
		}

		// 前面是否加“零”
		if ("U".equals(strPerNum[0]) && addZero) {
			strResult = "零" + strResult;
		}
		return strResult;
	}
	
	public static String getSmallWrite(String strNum) {
		String[] BigNumber = { "零", "一", "二", "三", "四", "五", "六", "七", "八", "九" };
		try {
			int i = Integer.parseInt(strNum);
			return BigNumber[i];
		} catch (Exception e) {
			return "";
		}
	}

	public static String getBigWrite(String strNum) {
		String[] BigNumber = { "零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖" };
		try {
			int i = Integer.parseInt(strNum);
			return BigNumber[i];
		} catch (Exception e) {
			return "";
		}
	}

	public static String getBigInt(String strNum) {

		String[] unit = { "万", "亿" };
		String[] strZero = { "000000000000000", "00000000000000",
				"0000000000000", "000000000000", "00000000000", "0000000000",
				"000000000", "00000000", "0000000", "000000", "00000", "0000",
				"000", "00", "0" };

		String strResult = "";
		int len = strNum.length();

		// System.out.println("smallInt_补齐前:"+strNum);

		// 小于一万
		if (len < 5) {
			strResult = getQian(strNum, false);
			if ("0".equals(strResult)) {
				return "零";
			} else {
				return strResult;
			}
		}

		// 大于等于一万
		if (len < 16) {
			strNum = strZero[len - 1] + strNum;
		}

		// System.out.println("smallInt:"+strNum);

		String[] strInt = new String[4];// 大写人民币的整数部分
		String[] bigInt = new String[4];

		strInt[0] = strNum.substring(0, 4);
		strInt[1] = strNum.substring(4, 8);
		strInt[2] = strNum.substring(8, 12);
		strInt[3] = strNum.substring(12);

		int StartI = -1; // 指示器，找到不用添0的。
		for (int i = 0; i < 4; i++) {
			if (!"0000".equals(strInt[i])) {
				StartI = i;
				break;
			}
		}

		for (int i = 0; i < 4; i++) {
			if (i == StartI) {
				bigInt[i] = getQian(strInt[i], false);
			} else {
				bigInt[i] = getQian(strInt[i], true);
			}
		}

		// 连接
		// 亿以上部分
		if (!"0".equals(bigInt[0]) || !"0".equals(bigInt[1])) { // 需处理
			if (!"0".equals(bigInt[0])) {
				strResult = bigInt[0] + unit[0];
			}
			if (!"0".equals(bigInt[1])) {
				strResult = strResult + bigInt[1];
			}
			// 添加符号‘亿’
			strResult = strResult + unit[1];
		}
		// 亿以下部分
		String strWan = "";
		if (!"0".equals(bigInt[2]) || !"0".equals(bigInt[3])) {
			if (!"0".equals(bigInt[2])) {
				strWan = bigInt[2] + unit[0];
			}
			if (!"0".equals(bigInt[3])) {
				strWan = strWan + bigInt[3];
			}
		} else {
			strWan = "0";
		}

		if (!"0".equals(strWan)) {
			strResult = strResult + strWan;
		}

		return strResult;
	}

	// n 小数位数
	public static String formatDouble(double dNumber, int n) {
		String strResult = String.valueOf(dNumber);
		int dotPosition = strResult.indexOf(".");// 取得小数点的位置
		if (dotPosition == -1 || (strResult.length() - dotPosition - 1) <= n)
			return strResult;

		strResult = String.valueOf(dNumber + 0.0000001);

		dotPosition = strResult.indexOf(".");// 取得小数点的位置
		if (dotPosition == -1 || (strResult.length() - dotPosition - 1) <= n) {
			return strResult;
		} else {
			return strResult.substring(0, dotPosition + n + 1);
		}
	}

	public static String formatDouble(double dNumber, String strN) {
		int n = Integer.parseInt(strN);
		return formatDouble(dNumber, n);
	}

}
