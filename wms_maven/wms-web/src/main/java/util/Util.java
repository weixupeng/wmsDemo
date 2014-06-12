package util;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Iterator;
import java.util.Map.Entry;
import java.util.TreeMap;

/**
 * @author christ-lee
 * @date 2011-8-26
 */
public class Util {
	private static final char[] DIGITS = { '0', '1', '2', '3', '4', '5', '6',
			'7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' };

	/**
	 * 对参数进行MD5
	 * 
	 * @param params
	 *            排好序的参数Map
	 * @param secret
	 *            应用的密钥
	 * @return MD5签名字符串
	 * @throws UnsupportedEncodingException
	 */
	public static String sign(final TreeMap<String, String> params,
			String secret) throws UnsupportedEncodingException {
		if (null == params || params.isEmpty()) {
			return (String) null;
		}
		if (isBlank(secret)) {
			return (String) null;
		}
		StringBuilder sb = new StringBuilder();
		sb.append(secret);
		for (Iterator<Entry<String, String>> it = params.entrySet().iterator(); it
				.hasNext();) {
			Entry<String, String> entry = it.next();
			sb.append(entry.getKey()).append(defaultString(entry.getValue()));
		}
		sb.append(secret);
		byte[] bytes = sb.toString().getBytes("UTF-8");
		return md5Hex(bytes).toUpperCase();
	}

	public static boolean isBlank(String str) {
		int strLen;
		if (str == null || (strLen = str.length()) == 0) {
			return true;
		}
		for (int i = 0; i < strLen; i++) {
			if ((Character.isWhitespace(str.charAt(i)) == false)) {
				return false;
			}
		}
		return true;
	}

	public static String defaultString(String str) {
		return str == null ? "" : str;
	}

	private static String md5Hex(byte[] bytes) {
		return new String(encodeHex(getMd5Digest().digest(bytes)));
	}

	private static MessageDigest getMd5Digest() {
		try {
			return MessageDigest.getInstance("MD5");
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException(e.getMessage());
		}
	}

	public static char[] encodeHex(byte[] data) {
		int l = data.length;
		char[] out = new char[l << 1];
		// two characters form the hex value.
		for (int i = 0, j = 0; i < l; i++) {
			out[j++] = DIGITS[(0xF0 & data[i]) >>> 4];
			out[j++] = DIGITS[0x0F & data[i]];
		}
		return out;
	}
}
