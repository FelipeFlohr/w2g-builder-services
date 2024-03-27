package dev.felipeflohr.w2gservices.builder.business

import dev.felipeflohr.w2gservices.builder.dto.AvailableGuildDTO
import org.springframework.http.ResponseEntity

interface MessengerBusiness {
    suspend fun getGuildsWithImageLink(guildIds: Collection<String>): ResponseEntity<List<AvailableGuildDTO>>
}