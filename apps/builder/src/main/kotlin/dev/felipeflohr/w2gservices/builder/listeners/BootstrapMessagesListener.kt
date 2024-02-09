package dev.felipeflohr.w2gservices.builder.listeners

import dev.felipeflohr.w2gservices.builder.configurations.MessagesAMQPConfiguration
import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageService
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.Message
import org.springframework.stereotype.Component

@Component
class BootstrapMessagesListener(
    @Autowired
    private val messageService: DiscordMessageService
) {
    companion object {
        const val CONTAINER_NAME = "boostrapMessagesListener"
    }

    @OptIn(DelicateCoroutinesApi::class)
    @RabbitListener(id = CONTAINER_NAME, queues = [MessagesAMQPConfiguration.MESSAGES_BOOTSTRAP])
    fun receiveMessage(message: Message<DiscordMessageDTO>) {
        GlobalScope.launch {
            messageService.saveMessage(message.payload)
        }
    }
}