package com.migrsoft.util;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;

import javax.imageio.ImageIO;

import jp.sourceforge.qrcode.QRCodeDecoder;
import jp.sourceforge.qrcode.data.QRCodeImage;
import jp.sourceforge.qrcode.exception.DecodingFailedException;

public class QRCodeDecoderTest {
	public QRCodeDecoderTest() {
	}

	public static void main(String[] args) {
		QRCodeDecoder decoder = new QRCodeDecoder();
		File imageFile = new File("TestQRCode.png");
		BufferedImage image = null;
		try {
			image = ImageIO.read(imageFile);
		} catch (IOException e) {
			System.out.println("Error: " + e.getMessage());
		}
		try {
			String decodedData = new String(decoder.decode(new J2SEImage(image)), "UTF-8");
			System.out.println(decodedData);
		} catch (DecodingFailedException dfe) {
			System.out.println("Error: " + dfe.getMessage());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
	}
	public static class J2SEImage implements QRCodeImage {
		BufferedImage image;
		public J2SEImage(BufferedImage image) {
			this.image = image;
		}
		public int getWidth() {
			return image.getWidth();
		}
		public int getHeight() {
			return image.getHeight();
		}
		public int getPixel(int x, int y) {
			return image.getRGB(x, y);
		}
	}
}
