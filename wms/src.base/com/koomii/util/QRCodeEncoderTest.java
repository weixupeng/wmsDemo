package com.migrsoft.util;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

import com.swetake.util.Qrcode;

public class QRCodeEncoderTest {
	public static void main(String[] args) throws IOException {
		Qrcode qrcode=new Qrcode();
		qrcode.setQrcodeErrorCorrect('M');
		qrcode.setQrcodeEncodeMode('B');
		qrcode.setQrcodeVersion(7);
		String testString = "[100001]上海通用-别克-君威 ￥210000 库存：32辆";
		byte[] d =testString.getBytes("UTF-8");
		BufferedImage bi = new BufferedImage(139, 139, BufferedImage.TYPE_INT_RGB);
		// createGraphics
		Graphics2D g = bi.createGraphics();
		// set background
		g.setBackground(Color.WHITE);
		g.clearRect(0, 0, 139, 139);
		g.setColor(Color.BLACK);
		if (d.length>0 && d.length <123){
			boolean[][] b = qrcode.calQrcode(d);
			for (int i=0;i<b.length;i++){
				for (int j=0;j<b.length;j++){
					if (b[j][i]) {
						g.fillRect(j*3+2,i*3+2,3,3);
					}
				}
			}
		}
		g.dispose();
		bi.flush();
		String FilePath="TestQRCode.png";
		File f = new File(FilePath);
		ImageIO.write(bi, "png", f);
		System.out.println("doned!");
	}
}
