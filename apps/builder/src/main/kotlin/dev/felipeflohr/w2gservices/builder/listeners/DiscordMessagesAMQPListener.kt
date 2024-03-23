package dev.felipeflohr.w2gservices.builder.listeners

import dev.felipeflohr.w2gservices.builder.configurations.MessagesAMQPConfiguration
import dev.felipeflohr.w2gservices.builder.dto.DiscordDelimitationMessageDTO
import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO
import dev.felipeflohr.w2gservices.builder.services.DiscordDelimitationMessageService
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageService
import dev.felipeflohr.w2gservices.builder.services.QueueStatsService
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.Message
import org.springframework.stereotype.Component

@Component
class DiscordMessagesAMQPListener @Autowired constructor(
    private val messageService: DiscordMessageService,
    private val delimitationService: DiscordDelimitationMessageService,
    private val queueStatsService: QueueStatsService
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
        private val queues = listOf(
            MessagesAMQPConfiguration.MESSAGES_BOOTSTRAP,
            MessagesAMQPConfiguration.MESSAGES_DELIMITATION,
            MessagesAMQPConfiguration.MESSAGES_CREATED,
            MessagesAMQPConfiguration.MESSAGES_UPDATED,
            MessagesAMQPConfiguration.MESSAGES_DELETED
        )
    }

    suspend fun waitForOngoingMessages() {
        while(!allQueuesAreEmpty()) {
            delay(500)
        }
    }

    @RabbitListener(
        id = BOOTSTRAP_CONTAINER_NAME,
        queues = [MessagesAMQPConfiguration.MESSAGES_BOOTSTRAP],
        priority = BOOTSTRAP_LISTENER_PRIORITY,
        concurrency = "10"
    )
    private fun bootstrapMessage(message: Message<DiscordMessageDTO>) {
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
    private fun delimitationMessage(message: Message<DiscordDelimitationMessageDTO>) {
        runBlocking {
            delimitationService.saveDelimitationMessage(message.payload)
        }
    }

    @RabbitListener(
        id = CREATE_CONTAINER_NAME,
        queues = [MessagesAMQPConfiguration.MESSAGES_CREATED]
    )
    private fun createMessage(message: Message<DiscordMessageDTO>) {
        runBlocking {
            messageService.save(message.payload)
        }
    }

    @RabbitListener(
        id = UPDATED_CONTAINER_NAME,
        queues = [MessagesAMQPConfiguration.MESSAGES_UPDATED]
    )
    private fun updateMessage(message: Message<DiscordMessageDTO>) {
        runBlocking {
            messageService.update(message.payload)
        }
    }

    @RabbitListener(
        id = DELETED_CONTAINER_NAME,
        queues = [MessagesAMQPConfiguration.MESSAGES_DELETED]
    )
    private fun deleteMessage(message: Message<DiscordMessageDTO>) {
        runBlocking {
            messageService.delete(message.payload)
        }
    }

    private suspend fun allQueuesAreEmpty() = coroutineScope {
        return@coroutineScope queues
            .map {queue ->
                async {
                    queueStatsService.getQueueSize(queue)
                }.await()
            }.all { it == 0 }
    }
}