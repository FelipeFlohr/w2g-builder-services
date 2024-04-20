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
        delimitationService.upsert(delimitation)
    }

    override suspend fun createdMessage(message: DiscordMessageDTO) {
        messageService.save(message)
    }

    override suspend fun updatedMessage(message: DiscordMessageDTO) {
        val result = messageService.update(message)
        logEntityNotFoundMessage(message, "update", result == null)
    }

    override suspend fun deletedMessage(message: DiscordMessageDTO) {
        val messageWasDeleted = messageService.delete(message)
        logEntityNotFoundMessage(message, "delete", !messageWasDeleted)
    }

    private fun logEntityNotFoundMessage(message: DiscordMessageDTO, operation: String, log: Boolean) {
        if (log) {
            logger.warn(
                "The following message was received in the \"$operation\" listener, however, no entity was " +
                        "found to perform such action: $message"
            )
        }
    }
}