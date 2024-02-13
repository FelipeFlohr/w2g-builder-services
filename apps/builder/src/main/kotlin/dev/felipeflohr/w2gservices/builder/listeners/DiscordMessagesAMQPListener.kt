package dev.felipeflohr.w2gservices.builder.listeners

import dev.felipeflohr.w2gservices.builder.configurations.MessagesAMQPConfiguration
import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO
import dev.felipeflohr.w2gservices.builder.services.DiscordDelimitationMessageService
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageService
import kotlinx.coroutines.runBlocking
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.Message
import org.springframework.stereotype.Component

@Component
class DiscordMessagesAMQPListener(
    @Autowired
    private val messageService: DiscordMessageService,

    @Autowired
    private val delimitationService: DiscordDelimitationMessageService,
) {
    companion object {
        const val BOOTSTRAP_CONTAINER_NAME = "boostrapMessagesListener"
        const val DELIMITATION_CONTAINER_NAME = "delimitationContainerName"
        const val CREATE_CONTAINER_NAME = "createMessagesListener"
        const val UPDATED_CONTAINER_NAME = "updatedMessagesListener"
        const val DELETED_CONTAINER_NAME = "deletedMessagesListener"
        private const val VIRTUAL_THREAD_EXECUTOR = "#{virtualThreadTaskExecutor}"
        private const val BOOTSTRAP_LISTENER_PRIORITY = "1000"
        private const val DELIMITATION_LISTENER_PRIORITY = "100"
    }

    @RabbitListener(
        id = BOOTSTRAP_CONTAINER_NAME,
        queues = [MessagesAMQPConfiguration.MESSAGES_BOOTSTRAP],
        priority = BOOTSTRAP_LISTENER_PRIORITY,
        concurrency = "1"
    )
    fun bootstrapMessage(message: Message<DiscordMessageDTO>) {
        runBlocking {
            messageService.bootstrapMessage(message.payload)
        }
    }

    @RabbitListener(
        id = DELIMITATION_CONTAINER_NAME,
        queues = [MessagesAMQPConfiguration.MESSAGES_DELIMITATION],
        priority = DELIMITATION_LISTENER_PRIORITY,
        executor = VIRTUAL_THREAD_EXECUTOR
    )
    fun delimitationMessage(message: Message<DiscordMessageDTO>) {
        runBlocking {
            delimitationService.saveDelimitationMessage(message.payload)
        }
    }

    @RabbitListener(
        id = CREATE_CONTAINER_NAME,
        queues = [MessagesAMQPConfiguration.MESSAGES_CREATED],
        executor = VIRTUAL_THREAD_EXECUTOR
    )
    fun createMessage(message: Message<DiscordMessageDTO>) {
        runBlocking {
            messageService.saveMessage(message.payload)
        }
    }

    @RabbitListener(
        id = UPDATED_CONTAINER_NAME,
        queues = [MessagesAMQPConfiguration.MESSAGES_UPDATED],
        executor = VIRTUAL_THREAD_EXECUTOR
    )
    fun updateMessage(message: Message<DiscordMessageDTO>) {
        runBlocking {
            messageService.updateMessage(message.payload)
        }
    }

    @RabbitListener(
        id = DELETED_CONTAINER_NAME,
        queues = [MessagesAMQPConfiguration.MESSAGES_DELETED],
        executor = VIRTUAL_THREAD_EXECUTOR
    )
    fun deleteMessage(message: Message<DiscordMessageDTO>) {
        runBlocking {
            messageService.deleteMessage(message.payload)
        }
    }
}