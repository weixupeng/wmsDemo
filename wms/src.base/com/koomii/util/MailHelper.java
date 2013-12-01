package com.migrsoft.util;

import java.io.PrintStream;
import java.util.Date;
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;

public class MailHelper
{

    public MailHelper()
    {
    }

    public static void sendMail(String serverAddress, String user, String pwd, String from, String emailReceiver, String subject, String htmlContents)
    {
    	
        try
        {
            Properties props = System.getProperties();
            props.put("mail.smtp.auth", "true");
            Session session = Session.getDefaultInstance(props, null);
            Message msg = new MimeMessage(session);
            msg.setFrom(new InternetAddress(from));
            InternetAddress address[] = {
                new InternetAddress(emailReceiver)
            };
            msg.setRecipients(javax.mail.Message.RecipientType.TO, address);
            msg.setSubject(subject);
            Multipart mp = new MimeMultipart();
            BodyPart bp = new MimeBodyPart();
            bp.setContent(htmlContents, "text/html;charset=utf-8");
            mp.addBodyPart(bp);
            msg.setContent(mp);
            msg.setSentDate(new Date());
            msg.saveChanges();
            Transport trans = session.getTransport("smtp");
            trans.connect(serverAddress, user, pwd);
            if(trans.isConnected())
            {
                trans.sendMessage(msg, msg.getAllRecipients());
                trans.close();
            }
        }
        catch(Exception ex)
        {
            ex.printStackTrace();
        }
    }
}
