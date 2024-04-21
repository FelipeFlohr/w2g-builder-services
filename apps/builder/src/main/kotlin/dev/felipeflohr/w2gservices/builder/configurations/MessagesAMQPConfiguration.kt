package dev.felipeflohr.w2gservices.builder.configurations

import com.rabbitmq.client.Connection
import com.rabbitmq.client.Delivery
import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.Queue
import org.springframework.amqp.core.TopicExchange
import org.springframework.amqp.rabbit.connection.ConnectionFactory
import org.springframework.amqp.rabbit.core.RabbitAdmin
import org.springframework.boot.autoconfigure.amqp.RabbitProperties
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.ApplicationListener
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.rabbitmq.RabbitFlux
import reactor.rabbitmq.Receiver
import reactor.rabbitmq.ReceiverOptions

@Configuration
class MessagesAMQPConfiguration {
    companion object {
        const val MESSAGES_EXCHANGE = "messages.ex"
        const val MESSAGES_BOOTSTRAP = "messages.bootstrap"
        const val MESSAGES_DELIMITATION = "messages.delimitation"
        const val MESSAGES_CREATED = "messages.created"
        const val MESSAGES_UPDATED = "messages.updated"
        const val MESSAGES_DELETED = "messages.deleted"
    }

    @Bean
    fun rabbitAdmin(connection: ConnectionFactory): RabbitAdmin {
        return RabbitAdmin(connection)
    }

    @Bean
    fun connectionMono(rabbitProperties: RabbitProperties): Mono<Connection> {
        val connectionFactory = com.rabbitmq.client.ConnectionFactory()
        connectionFactory.host = rabbitProperties.host
        connectionFactory.port = rabbitProperties.port
        connectionFactory.username = rabbitProperties.username
        connectionFactory.password = rabbitProperties.password
        return Mono.fromCallable {
            connectionFactory.newConnection("a")
        }
    }

    @Bean
    fun initializeAdmin(admin: RabbitAdmin): ApplicationListener<ApplicationReadyEvent> {
        return ApplicationListener { admin.initialize() }
    }

    @Bean
    fun receiver(connection: Mono<Connection>): Receiver {
        return RabbitFlux.createReceiver(ReceiverOptions().connectionMono(connection))
    }

    @Bean(MESSAGES_BOOTSTRAP)
    fun bootstrapDeliveryFlux(receiver: Receiver): Flux<Delivery> {
        return receiver.consumeAutoAck(MESSAGES_BOOTSTRAP)
    }

    @Bean(MESSAGES_DELIMITATION)
    fun delimitationDeliveryFlux(receiver: Receiver): Flux<Delivery> {
        return receiver.consumeAutoAck(MESSAGES_DELIMITATION)
    }

    @Bean(MESSAGES_CREATED)
    fun createdDeliveryFlux(receiver: Receiver): Flux<Delivery> {
        return receiver.consumeAutoAck(MESSAGES_CREATED)
    }

    @Bean(MESSAGES_UPDATED)
    fun updatedDeliveryFlux(receiver: Receiver): Flux<Delivery> {
        return receiver.consumeAutoAck(MESSAGES_UPDATED)
    }

    @Bean(MESSAGES_DELETED)
    fun deletedDeliveryFlux(receiver: Receiver): Flux<Delivery> {
        return receiver.consumeAutoAck(MESSAGES_DELETED)
    }

    @Bean
    fun messagesExchange(): TopicExchange {
        return TopicExchange(MESSAGES_EXCHANGE)
    }

    @Bean
    fun messagesBootstrapQueue(): Queue {
        return Queue(MESSAGES_BOOTSTRAP)
    }

    @Bean
    fun messagesDelimitationQueue(): Queue {
        return Queue(MESSAGES_DELIMITATION)
    }

    @Bean
    fun messagesCreatedQueue(): Queue {
        return Queue(MESSAGES_CREATED)
    }

    @Bean
    fun messagesDeletedQueue(): Queue {
        return Queue(MESSAGES_DELETED)
    }

    @Bean
    fun messagesUpdatedQueue(): Queue {
        return Queue(MESSAGES_UPDATED)
    }

    @Bean
    fun messagesBootstrapBinding(exchange: TopicExchange): Binding {
        return BindingBuilder
            .bind(messagesBootstrapQueue())
            .to(exchange)
            .with(MESSAGES_UPDATED)
    }

    @Bean
    fun messagesDelimitationBinding(exchange: TopicExchange): Binding {
        return BindingBuilder
            .bind(messagesDelimitationQueue())
            .to(exchange)
            .with(MESSAGES_DELIMITATION)
    }

    @Bean
    fun messagesCreatedBinding(exchange: TopicExchange): Binding {
        return BindingBuilder
            .bind(messagesCreatedQueue())
            .to(exchange)
            .with(MESSAGES_CREATED)
    }

    @Bean
    fun messagesDeletedBinding(exchange: TopicExchange): Binding {
        return BindingBuilder
            .bind(messagesDeletedQueue())
            .to(exchange)
            .with(MESSAGES_DELETED)
    }

    @Bean
    fun messagesUpdatedBinding(exchange: TopicExchange): Binding {
        return BindingBuilder
            .bind(messagesUpdatedQueue())
            .to(exchange)
            .with(MESSAGES_UPDATED)
    }
}
