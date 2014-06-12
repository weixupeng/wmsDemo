package util;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.commons.lang.time.DateUtils;


/**
 * @author christ-lee
 * @date 2012-2-3
 */
public class ChristDateUtils extends DateUtils {
	
	/**
	 * 获取一天中最大的时间
	 * @param date
	 * @return
	 */
	public static Date getDayLastTime(Date date){
		date = DateUtils.setHours(date, 23);
		date = DateUtils.setMinutes(date, 59);
		date = DateUtils.setSeconds(date, 59);
		date = DateUtils.setMilliseconds(date, 999);
		return date;
	}
	
	/** new a Calendar instance */
    static GregorianCalendar cldr = new GregorianCalendar();

    /** the milli second of a day */
    public static final long DAYMILLI = 24 * 60 * 60 * 1000;

    /** the milli seconds of an hour */
    public static final long HOURMILLI = 60 * 60 * 1000;

    /** the milli seconds of a minute */
    public static final long MINUTEMILLI = 60 * 1000;

    /** the milli seconds of a second */
    public static final long SECONDMILLI = 1000;

    /** added time */
    public static final String TIMETO = " 23:59:59";

    /**
     * set the default time zone
     */
    static {
        cldr.setTimeZone(java.util.TimeZone.getTimeZone("GMT+9:00"));
    }

    /** flag before */
    public static final transient int BEFORE = 1;

    /** flag after */
    public static final transient int AFTER = 2;

    /** flag equal */
    public static final transient int EQUAL = 3;

    /** date format dd/MMM/yyyy:HH:mm:ss +0900 */
    public static final String TIME_PATTERN_LONG = "dd/MMM/yyyy:HH:mm:ss +0900";

    /** date format dd/MM/yyyy:HH:mm:ss +0900 */
    public static final String TIME_PATTERN_LONG2 = "dd/MM/yyyy:HH:mm:ss +0900";

    /** date format yyyy-MM-dd HH:mm:ss */
    public static final String TIME_PATTERN = "yyyy-MM-dd HH:mm:ss";

    /** date format YYYY-MM-DD HH24:MI:SS */
    public static final String DB_TIME_PATTERN = "YYYY-MM-DD HH24:MI:SS";

    /** date format dd/MM/yy HH:mm:ss */
    public static final String TIME_PATTERN_SHORT = "dd/MM/yy HH:mm:ss";

    /** date format dd/MM/yy HH24:mm */
    public static final String TIME_PATTERN_SHORT_1 = "yyyy/MM/dd HH:mm";

    /** date format yyyyMMddHHmmss */
    public static final String TIME_PATTERN_SESSION = "yyyyMMddHHmmss";

    /** date format yyyyMMdd */
    public static final String DATE_FMT_0 = "yyyyMMdd";

    /** date format yyyy/MM/dd */
    public static final String DATE_FMT_1 = "yyyy/MM/dd";

    /** date format yyyy/MM/dd hh:mm:ss */
    public static final String DATE_FMT_2 = "yyyy/MM/dd hh:mm:ss";

    /** date format yyyy-MM-dd */
    public static final String DATE_FMT_3 = "yyyy-MM-dd";
    /**
     * change string to date
     * 将String类型的日期转成Date类型
     * @param sDate the date string
     * @param sFmt the date format
     *
     * @return Date object
     */
    public static java.util.Date toDate(String sDate, String sFmt) {
        if (ChristStringUtil.isBlank(sDate) || ChristStringUtil.isBlank(sFmt)) {
            return null;
        }
        
        SimpleDateFormat sdfFrom = null;
        java.util.Date   dt = null;
        try {
            sdfFrom     = new SimpleDateFormat(sFmt);
            dt          = sdfFrom.parse(sDate);
        } catch (Exception ex) {
            return null;
        } finally {
            sdfFrom = null;
        }

        return dt;
    }

    /**
     * change date to string
     * 将日期类型的参数转成String类型
     * @param dt a date
     *
     * @return the format string
     */
    public static String toString(java.util.Date date) {
        return toString(date, DATE_FMT_3);
    }

    /**
     * change date object to string
     * 将String类型的日期转成Date类型
     * @param dt date object
     * @param sFmt the date format
     *
     * @return the formatted string
     */
    public static String toString(java.util.Date dt, String format) {
        return DateFormatUtils.format(dt, format);
    }
    
    public static String formatDate(java.util.Date dt, String format) {
        return toString(dt, format);
    }
    

    /**
     * 获取Date所属月的最后一天日期
     * @param date
     * @return Date 默认null
     */
    public static Date getMonthLastDate(Date date) {
        if (null == date) {
            return null;
        }
        
        Calendar ca = Calendar.getInstance();
        ca.setTime(date);
        ca.set(Calendar.HOUR_OF_DAY, 23);
        ca.set(Calendar.MINUTE, 59);
        ca.set(Calendar.SECOND, 59);
        ca.set(Calendar.DAY_OF_MONTH, 1);
        ca.add(Calendar.MONTH, 1);
        ca.add(Calendar.DAY_OF_MONTH, -1);

        Date lastDate = ca.getTime();
        return lastDate;
    }

    /**
     * 获取Date所属月的最后一天日期
     * @param date
     * @param pattern
     * @return String 默认null
     */
    public static String getMonthLastDate(Date date, String pattern) {
        Date lastDate = getMonthLastDate(date);
        if (null == lastDate) {
            return null;
        }
        
        if (ChristStringUtil.isBlank(pattern)) {
            pattern = TIME_PATTERN;
        }
        
        return toString(lastDate, pattern);
    }

    /**
     * 获取Date所属月的第一天日期
     * @param date
     * @return Date 默认null
     */
    public static Date getMonthFirstDate(Date date) {
        if (null == date) {
            return null;
        }
        
        Calendar ca = Calendar.getInstance();
        ca.setTime(date);
        ca.set(Calendar.HOUR_OF_DAY, 0);
        ca.set(Calendar.MINUTE, 0);
        ca.set(Calendar.SECOND, 0);
        ca.set(Calendar.DAY_OF_MONTH, 1);

        Date firstDate = ca.getTime();
        return firstDate;
    }

    /**
     * 获取Date所属月的第一天日期
     * @param date
     * @param pattern
     * @return String 默认null
     */
    public static String getMonthFirstDate(Date date, String pattern) {
        Date firstDate = getMonthFirstDate(date);
        if (null == firstDate) {
            return null;
        }
        
        if (ChristStringUtil.isBlank(pattern)) {
            pattern = TIME_PATTERN;
        }
        
        return toString(firstDate, pattern);
    }

    /**
     * 计算两个日期间隔的天数
     * 
     * @param firstDate 小者
     * @param lastDate 大者
     * @return int 默认-1
     */
    public static int getIntervalDays(java.util.Date firstDate, java.util.Date lastDate) {
        if (null == firstDate || null == lastDate) {
            return -1;
        }
        
        long intervalMilli = lastDate.getTime() - firstDate.getTime();
        return (int) (intervalMilli / (24 * 60 * 60 * 1000));
    }

    /**
     * 计算两个日期间隔的小时数
     * 
     * @param firstDate 小者
     * @param lastDate 大者
     * @return int 默认-1
     */
    public static int getTimeIntervalHours(Date firstDate, Date lastDate) {
        if (null == firstDate || null == lastDate) {
            return -1;
        }
        
        long intervalMilli = lastDate.getTime() - firstDate.getTime();
        return (int) (intervalMilli / (60 * 60 * 1000));
    }

    /**
     * 计算两个日期间隔的分钟数
     * 
     * @param firstDate 小者
     * @param lastDate 大者
     * @return int 默认-1
     */
    public static int getTimeIntervalMins(Date firstDate, Date lastDate) {
        if (null == firstDate || null == lastDate) {
            return -1;
        }
        
        long intervalMilli = lastDate.getTime() - firstDate.getTime();
        return (int) (intervalMilli / (60 * 1000));
    }

    /**
     * 比较两个日期的先后顺序
     * @param src
     * @param desc
     * @return
     */
    public static int compareDate(java.util.Date src, java.util.Date desc) {
        if ((src == null) && (desc == null)) {
            return EQUAL;
        } else if (desc == null) {
            return BEFORE;
        } else if (src == null) {
            return AFTER;
        } else {
            long timeSrc  = src.getTime();
            long timeDesc = desc.getTime();

            if (timeSrc == timeDesc) {
                return EQUAL;
            } else {
                return (timeDesc > timeSrc) ? AFTER
                                            : BEFORE;
            }
        }
    }

    /**
     * 比较两个日期的先后顺序
     *
     * @param first date1
     * @param second date2
     *
     * @return EQUAL  - if equal BEFORE - if before than date2 AFTER  - if over than date2
     */
    public static int compareTwoDate(Date first, Date second) {
        if ((first == null) && (second == null)) {
            return EQUAL;
        } else if (first == null) {
            return BEFORE;
        } else if (second == null) {
            return AFTER;
        } else if (first.before(second)) {
            return BEFORE;
        } else if (first.after(second)) {
            return AFTER;
        } else {
            return EQUAL;
        }
    }

    /**
     * 比较日期是否介于两者之间
     * @param date the specified date
     * @param begin date1
     * @param end date2
     *
     * @return true  - between date1 and date2 false - not between date1 and date2
     */
    public static boolean isDateBetween(Date date, Date begin, Date end) {
        int c1 = compareTwoDate(begin, date);
        int c2 = compareTwoDate(date, end);

        return (((c1 == BEFORE) && (c2 == BEFORE)) || (c1 == EQUAL) || (c2 == EQUAL));
    }



    /**
     * return current date
     *
     * @return current date
     */
    public static Date getCurrentDate() {
        return new Date(System.currentTimeMillis());
    }
    
    public static Timestamp getCurrentTimestamp() {
        return new Timestamp(System.currentTimeMillis());
    }

    /**
     * return current calendar instance
     *
     * @return Calendar
     */
    public static Calendar getCurrentCalendar() {
        return Calendar.getInstance();
    }

    /**
     * return current time
     *
     * @return current time
     */
    public static Date getCurrentDateTime() {
        return new Date(System.currentTimeMillis());
    }

    public static String getCurrentDateTimeString(){
        return toString(new Date(System.currentTimeMillis()),"yyyy-MM-dd HH:mm:ss");
    }
    
    /**
     * 获取年份
     * @param date Date
     * @return int
     */
    public static final int getYear(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.YEAR);
    }
    
    /**
     * 获取年份
     * @param millis long
     * @return int
     */
    public static final int getYear(long millis) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(millis);
        return calendar.get(Calendar.YEAR);
    }

    /**
     * 获取月份
     * @param date Date
     * @return int
     */
    public static final int getMonth(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.MONTH) + 1;
    }
    
    /**
     * 获取月份
     * @param millis long
     * @return int
     */
    public static final int getMonth(long millis) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(millis);
        return calendar.get(Calendar.MONTH) + 1;
    }

    /**
     * 获取日期
     * @param date Date
     * @return int
     */
    public static final int getDate(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.DATE);
    }
    
    /**
     * 获取日期
     * @param millis long
     * @return int
     */
    public static final int getDate(long millis) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(millis);
        return calendar.get(Calendar.DATE);
    }

    /**
     * 获取小时
     * @param date Date
     * @return int
     */
    public static final int getHour(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.HOUR_OF_DAY);
    }
    
    /**
     * 获取小时
     * @param millis long
     * @return int
     */
    public static final int getHour(long millis) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(millis);
        return calendar.get(Calendar.HOUR_OF_DAY);
    }

    /**
     * 把日期后的时间归0 变成(yyyy-MM-dd 00:00:00:000)
     * @param date Date
     * @return Date
     */
    public static final Date zerolizedTime(Date fullDate) {
        Calendar cal = Calendar.getInstance();

        cal.setTime(fullDate);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTime();
    }
}
