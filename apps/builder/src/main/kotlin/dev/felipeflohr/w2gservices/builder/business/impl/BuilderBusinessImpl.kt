package dev.felipeflohr.w2gservices.builder.business.impl

import dev.felipeflohr.w2gservices.builder.business.BuilderBusiness
import dev.felipeflohr.w2gservices.builder.dto.DiscordBuildMessageDTO
import dev.felipeflohr.w2gservices.builder.dto.MessageFileLogDTO
import dev.felipeflohr.w2gservices.builder.dto.MessageFileReferenceDTO
import dev.felipeflohr.w2gservices.builder.dto.VideoReferenceDTO
import dev.felipeflohr.w2gservices.builder.entities.MessageFileLogEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileReferenceEntity

class BuilderBusinessImpl : BuilderBusiness {
    override fun generateVideoReferencesFromBuildMessages(messages: Collection<DiscordBuildMessageDTO>): List<VideoReferenceDTO> {
        val res: MutableList<VideoReferenceDTO> = ArrayList()
        messages.forEach { message ->
            if (message.references.isNotEmpty()) {
                message.references.forEach { res.addLast(generateVideoReferenceFromMessageFileReference(message, it)) }
            } else if (message.logs.isNotEmpty()) {
                message.logs.forEach { res.addLast(generateVideoReferenceFromMessageFileLog(message, it)) }
            } else {
                res.addLast(generateVideoReference(message))
            }
        }

        return res
    }

    override fun populateVideoReferencesAndLogs(messages: Set<DiscordBuildMessageDTO>, references: List<MessageFileReferenceEntity>, logs: List<MessageFileLogEntity>) {
        messages.forEach { message ->
            val thisReferences = references
                .filter { it.message.id == message.id }
                .map { MessageFileReferenceDTO.fromEntity(it) }
            val thisLogs = logs
                .filter { it.message.id == message.id }
                .map { MessageFileLogDTO.fromEntity(it) }

            message.references = thisReferences
            message.logs = thisLogs
        }
    }

    private fun generateVideoReferenceFromMessageFileReference(message: DiscordBuildMessageDTO, reference: MessageFileReferenceDTO): VideoReferenceDTO {
        return VideoReferenceDTO(
            discordMessageId = message.messageId,
            discordMessageUrl = message.url,
            messageCreatedAt = message.createdAt,
            messageContent = message.content,
            messageUrlContent = reference.url,
            fileStorageHashId = reference.fileHash,
            logBody = null,
        )
    }

    private fun generateVideoReferenceFromMessageFileLog(message: DiscordBuildMessageDTO, log: MessageFileLogDTO): VideoReferenceDTO {
        return VideoReferenceDTO(
            discordMessageId = message.messageId,
            discordMessageUrl = message.url,
            messageCreatedAt = message.createdAt,
            messageContent = message.content,
            messageUrlContent = null,
            fileStorageHashId = null,
            logBody = log.body
        )
    }

    private fun generateVideoReference(message: DiscordBuildMessageDTO): VideoReferenceDTO {
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