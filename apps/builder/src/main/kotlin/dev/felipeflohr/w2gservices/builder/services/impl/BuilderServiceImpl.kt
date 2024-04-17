package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordDelimitationMessageDTO
import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO
import dev.felipeflohr.w2gservices.builder.services.BuilderService
import dev.felipeflohr.w2gservices.builder.services.DiscordDelimitationMessageService
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageService
import dev.felipeflohr.w2gservices.builder.utils.LoggerUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class BuilderServiceImpl @Autowired constructor(
    private val messageService: DiscordMessageService,
    private val delimitationService: DiscordDelimitationMessageService,
) : BuilderService {
    private val logger = LoggerUtils.getLogger(BuilderServiceImpl::class)

    override suspend fun bootstrapMessage(message: DiscordMessageDTO) {
        messageService.upsert(message)
    }

    override suspend fun delimitationMessage(delimitation: DiscordDelimitationMessageDTO) {
        delimitationService.save(delimitation)
    }

    override suspend fun createdMessage(message: DiscordMessageDTO) {
        messageService.save(message)
    }

    override suspend fun updatedMessage(message: DiscordMessageDTO) {
        val updatedMessage = messageService.update(message)
        if (updatedMessage == null) {
            logger.warn(generateMessageForEntityNotFound("update", message))
        }
    }

    override suspend fun deletedMessage(message: DiscordMessageDTO) {
        val deletedMessage = messageService.delete(message)
        if (deletedMessage == null) {
            logger.warn(generateMessageForEntityNotFound("delete", message))
        }
    }

    private fun generateMessageForEntityNotFound(queueName: String, message: DiscordMessageDTO): String {
        return "The following message has been received on the $queueName queue, however, no message was found to " +
                "update: $message"
    }
}