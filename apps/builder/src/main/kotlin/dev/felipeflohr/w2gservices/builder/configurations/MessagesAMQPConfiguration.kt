package dev.felipeflohr.w2gservices.builder.configurations

import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.Queue
import org.springframework.amqp.core.TopicExchange
import org.springframework.amqp.rabbit.connection.ConnectionFactory
import org.springframework.amqp.rabbit.core.RabbitAdmin
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.ApplicationListener
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class MessagesAMQPConfiguration {
    companion object {
        const val MESSAGES_EXCHANGE = "messages.ex"
        const val MESSAGES_BOOTSTRAP = "messages.bootstrap"
        const val MESSAGES_CREATED = "messages.created"
        const val MESSAGES_DELETED = "messages.deleted"
        const val MESSAGES_UPDATED = "messages.updated"
    }

    @Bean
    fun createRabbitAdmin(connection: ConnectionFactory): RabbitAdmin {
        return RabbitAdmin(connection)
    }

    @Bean
    fun createMessageConverter(): Jackson2JsonMessageConverter {
        return Jackson2JsonMessageConverter()
    }

    @Bean
    fun createRabbitTemplate(connection: ConnectionFactory, messageConverter: Jackson2JsonMessageConverter): RabbitTemplate {
        val rabbitTemplate = RabbitTemplate(connection)
        rabbitTemplate.messageConverter = messageConverter
        return rabbitTemplate
    }

    @Bean
    fun initializeAdmin(admin: RabbitAdmin): ApplicationListener<ApplicationReadyEvent> {
        return ApplicationListener { admin.initialize() }
    }

    @Bean
    fun getMessagesExchange(): TopicExchange {
        return TopicExchange(MESSAGES_EXCHANGE)
    }

    @Bean
    fun getMessagesBootstrapQueue(): Queue {
        return Queue(MESSAGES_BOOTSTRAP)
    }

    @Bean
    fun getMessagesCreatedQueue(): Queue {
        return Queue(MESSAGES_CREATED)
    }

    @Bean
    fun getMessagesDeletedQueue(): Queue {
        return Queue(MESSAGES_DELETED)
    }

    @Bean
    fun getMessagesUpdatedQueue(): Queue {
        return Queue(MESSAGES_UPDATED)
    }

    @Bean
    fun getMessagesBootstrapBinding(exchange: TopicExchange): Binding {
        return BindingBuilder
            .bind(getMessagesBootstrapQueue())
            .to(exchange)
            .with(MESSAGES_UPDATED)
    }

    @Bean
    fun getMessagesCreatedBinding(exchange: TopicExchange): Binding {
        return BindingBuilder
            .bind(getMessagesCreatedQueue())
            .to(exchange)
            .with(MESSAGES_CREATED)
    }

    @Bean
    fun getMessagesDeletedBinding(exchange: TopicExchange): Binding {
        return BindingBuilder
            .bind(getMessagesDeletedQueue())
            .to(exchange)
            .with(MESSAGES_DELETED)
    }

    @Bean
    fun getMessagesUpdatedBinding(exchange: TopicExchange): Binding {
        return BindingBuilder
            .bind(getMessagesUpdatedQueue())
            .to(exchange)
            .with(MESSAGES_UPDATED)
    }
}