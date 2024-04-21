package dev.felipeflohr.w2gservices.builder.annotations

import org.springframework.beans.factory.config.ConfigurableBeanFactory
import org.springframework.context.annotation.Scope
import org.springframework.stereotype.Component


@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
@Component
annotation class Business
