package dev.felipeflohr.w2gservices.builder.business

import dev.felipeflohr.w2gservices.builder.dto.DiscordBuildMessageDTO
import dev.felipeflohr.w2gservices.builder.dto.VideoReferenceDTO
import dev.felipeflohr.w2gservices.builder.entities.MessageFileLogEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileReferenceEntity

interface BuilderBusiness {
    fun generateVideoReferencesFromBuildMessages(messages: Collection<DiscordBuildMessageDTO>): List<VideoReferenceDTO>
    fun populateVideoReferencesAndLogs(messages: Set<DiscordBuildMessageDTO>, references: List<MessageFileReferenceEntity>, logs: List<MessageFileLogEntity>)
}