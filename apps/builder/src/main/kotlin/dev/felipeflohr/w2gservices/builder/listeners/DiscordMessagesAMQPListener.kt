package dev.felipeflohr.w2gservices.builder.listeners

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.rabbitmq.client.Delivery
import dev.felipeflohr.w2gservices.builder.configurations.MessagesAMQPConfiguration
import dev.felipeflohr.w2gservices.builder.dto.DiscordDelimitationMessageDTO
import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO
import dev.felipeflohr.w2gservices.builder.services.BuilderService
import jakarta.annotation.PostConstruct
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.cancel
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.reactive.asFlow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component
import reactor.core.publisher.Flux
import kotlin.reflect.KClass

@Component
class DiscordMessagesAMQPListener @Autowired constructor(
    @Qualifier(MessagesAMQPConfiguration.MESSAGES_BOOTSTRAP) private val bootstrapDeliveryFlux: Flux<Delivery>,
    @Qualifier(MessagesAMQPConfiguration.MESSAGES_DELIMITATION) private val delimitationDeliveryFlux: Flux<Delivery>,
    @Qualifier(MessagesAMQPConfiguration.MESSAGES_CREATED) private val createdDeliveryFlux: Flux<Delivery>,
    @Qualifier(MessagesAMQPConfiguration.MESSAGES_UPDATED) private val updatedDeliveryFlux: Flux<Delivery>,
    @Qualifier(MessagesAMQPConfiguration.MESSAGES_DELETED) private val deletedFlux: Flux<Delivery>,
    private val service: BuilderService,
) {
    @PostConstruct
    private fun init() {
        deliveryListenerWrapper(bootstrapDeliveryFlux, DiscordMessageDTO::class, ::bootstrapMessage)
        deliveryListenerWrapper(delimitationDeliveryFlux, DiscordDelimitationMessageDTO::class, ::delimitationMessage)
        deliveryListenerWrapper(createdDeliveryFlux, DiscordMessageDTO::class, ::createdMessage)
        deliveryListenerWrapper(updatedDeliveryFlux, DiscordMessageDTO::class, ::updatedMessage)
        deliveryListenerWrapper(deletedFlux, DiscordMessageDTO::class, ::deletedMessage)
    }

    private fun <T : Any> deliveryListenerWrapper(deliveryFlux: Flux<Delivery>, clazz: KClass<T>, callback: suspend (T) -> Unit) {
        val coroutineScope = CoroutineScope(Job() + Dispatchers.Default)
        val mapper = ObjectMapper().registerKotlinModule()

        deliveryFlux
            .doOnCancel { coroutineScope.cancel() }
            .doOnTerminate { coroutineScope.cancel() }
            .asFlow()
            .onEach {
                val obj: T = mapper.readValue(it.body, clazz.java)
                callback(obj)
            }
            .launchIn(coroutineScope)
    }

    private suspend fun bootstrapMessage(message: DiscordMessageDTO) {
        service.bootstrapMessage(message)
    }

    private suspend fun delimitationMessage(message: DiscordDelimitationMessageDTO) {
        service.delimitationMessage(message)
    }

    private suspend fun createdMessage(message: DiscordMessageDTO) {
        service.createdMessage(message)
    }

    private suspend fun updatedMessage(message: DiscordMessageDTO) {
        service.updatedMessage(message)
    }

    private suspend fun deletedMessage(message: DiscordMessageDTO) {
        service.deletedMessage(message)
    }
}