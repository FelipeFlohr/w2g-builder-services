package dev.felipeflohr.w2gservices.builder.business.impl

import dev.felipeflohr.w2gservices.builder.annotations.Business
import dev.felipeflohr.w2gservices.builder.business.BuilderBusiness
import dev.felipeflohr.w2gservices.builder.dto.VideoReferenceDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordDelimitationMessageEntity
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity

@Business
class BuilderBusinessImpl : BuilderBusiness {
    override fun getReferencesFromMessages(
        delimitationMessage: DiscordDelimitationMessageEntity,
        messages: List<DiscordMessageEntity>
    ): List<VideoReferenceDTO> {
        val references: MutableList<VideoReferenceDTO> = ArrayList()
        references.addAll(messageToReference(delimitationMessage.message))
        messages.map { references.addAll(messageToReference(it)) }

        return references
            .sortedByDescending { it.messageCreatedAt }
    }

    private fun messageToReference(message: DiscordMessageEntity): List<VideoReferenceDTO> {
        if (message.fileReferences != null && message.fileReferences!!.isNotEmpty()) {
            return getVideoReferenceFromMessageFileReference(message)
        } else if (message.fileLogs != null && message.fileLogs!!.isNotEmpty()) {
            return getVideoReferenceFromMessageLog(message)
        }
        return listOf(getVideoReferenceWithNoFileReferenceAndNoLog(message))
    }

    private fun getVideoReferenceFromMessageFileReference(message: DiscordMessageEntity): List<VideoReferenceDTO> {
        return message.fileReferences!!
            .map { reference ->
                VideoReferenceDTO(
                    discordMessageId = message.messageId,
                    discordMessageUrl = message.url,
                    messageCreatedAt = message.createdAt,
                    messageContent = message.content,
                    messageUrlContent = reference.url,
                    fileStorageHashId = reference.fileHash,
                    logBody = null,
                )
            }
    }

    private fun getVideoReferenceFromMessageLog(message: DiscordMessageEntity): List<VideoReferenceDTO> {
        return message.fileLogs!!
            .map { log ->
                VideoReferenceDTO(
                    discordMessageId = message.messageId,
                    discordMessageUrl = message.url,
                    messageCreatedAt = message.createdAt,
                    messageContent = message.content,
                    messageUrlContent = null,
                    fileStorageHashId = null,
                    logBody = log.body
                )
            }
    }

    private fun getVideoReferenceWithNoFileReferenceAndNoLog(message: DiscordMessageEntity): VideoReferenceDTO {
        return VideoReferenceDTO(
            discordMessageId = message.messageId,
            discordMessageUrl = message.url,
            messageCreatedAt = message.createdAt,
            messageContent = message.content,
            messageUrlContent = null,
            fileStorageHashId = null,
            logBody = null,
        )
    }
}
