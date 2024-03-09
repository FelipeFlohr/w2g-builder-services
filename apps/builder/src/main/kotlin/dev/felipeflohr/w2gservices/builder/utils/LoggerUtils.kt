package dev.felipeflohr.w2gservices.builder.utils

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import kotlin.reflect.KClass

object LoggerUtils {
    fun <T : Any> getLogger(clazz: KClass<T>): Logger {
        return LoggerFactory.getLogger(clazz.java)
    }
}