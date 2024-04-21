package dev.felipeflohr.w2gservices.builder.business

import dev.felipeflohr.w2gservices.builder.dto.VideoReferenceDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordDelimitationMessageEntity
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity

interface BuilderBusiness {
    fun getReferencesFromMessages(delimitationMessage: DiscordDelimitationMessageEntity, messages: List<DiscordMessageEntity>): List<VideoReferenceDTO>
}