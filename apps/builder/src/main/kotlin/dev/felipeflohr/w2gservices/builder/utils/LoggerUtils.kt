package dev.felipeflohr.w2gservices.builder.utils

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import kotlin.reflect.KClass

class LoggerUtils {
    companion object {
        @JvmStatic
        fun <T : Any> getLogger(kClass: KClass<T>): Logger {
            return LoggerFactory.getLogger(kClass.java)
        }

        @JvmStatic
        fun <T : Any> getLogger(clazz: Class<T>): Logger {
            return LoggerFactory.getLogger(clazz)
        }
    }
}