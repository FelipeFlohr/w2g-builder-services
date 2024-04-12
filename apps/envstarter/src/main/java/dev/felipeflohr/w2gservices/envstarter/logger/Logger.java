package dev.felipeflohr.w2gservices.envstarter.logger;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Calendar;

public class Logger {
    private static final String ERROR_PREFIX = "ERROR | ";
    private static final String FATAL_PREFIX = "FATAL | ";
    private static final String WARN_PREFIX  = "WARN  | ";
    private static final String INFO_PREFIX  = "INFO  | ";

    private Logger() {}

    public static Logger getLogger() {
        return new Logger();
    }

    public void info(Object msg) {
        System.out.println(getLogString(INFO_PREFIX, msg));
    }

    public void warn(Object msg) {
        System.out.println(getLogString(WARN_PREFIX, msg));
    }

    public void fatal(Object msg) {
        System.err.println(getLogString(FATAL_PREFIX, msg));
    }

    public void error(Object msg) {
        System.err.println(getLogString(ERROR_PREFIX, msg));
    }

    private static String getLogString(String level, Object msg) {
        return level + getDate() + getCallerMethod() + handleMessage(msg);
    }

    private static String handleMessage(Object msg) {
        if (msg instanceof Throwable throwable) {
            var writer = new StringWriter();
            var printWriter = new PrintWriter(writer);

            throwable.printStackTrace(printWriter);
            printWriter.flush();
            return writer.toString().trim();
        }
        return msg.toString();
    }

    private static String getCallerMethod() {
        StackTraceElement[] stackTraceElements = Thread.currentThread().getStackTrace();
        StackTraceElement caller = stackTraceElements[stackTraceElements.length - 1];

        String className = caller.getClassName();
        String methodName = caller.getMethodName();
        return className + "." + methodName + " | ";
    }

    private static String getDate() {
        var calendar = Calendar.getInstance();
        String day = calendarToString(calendar.get(Calendar.DAY_OF_MONTH));
        String month = calendarToString(calendar.get(Calendar.MONTH));
        String year = calendarToString(calendar.get(Calendar.YEAR));

        String hour = calendarToString(calendar.get(Calendar.HOUR_OF_DAY));
        String minute = calendarToString(calendar.get(Calendar.MINUTE));
        String second = calendarToString(calendar.get(Calendar.SECOND));

        return "%s/%s/%s %s:%s:%s | ".formatted(day, month, year, hour, minute, second);
    }

    private static String calendarToString(Integer val) {
        return val < 10 ? "0" + val : val.toString();
    }
}
