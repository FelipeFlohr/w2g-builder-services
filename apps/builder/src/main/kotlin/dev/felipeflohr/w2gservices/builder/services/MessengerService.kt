package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.AvailableGuildDTO

interface MessengerService {
    suspend fun getGuildsWithImageLink(guildIds: Collection<String>): Set<AvailableGuildDTO>
}
