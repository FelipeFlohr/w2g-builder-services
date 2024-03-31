package dev.felipeflohr.w2gservices.builder.repositories

import dev.felipeflohr.w2gservices.builder.dto.DiscordBuildMessageDTO

interface BuilderCustomRepository {
    fun getBuildMessages(guildId: String, channelId: String): Set<DiscordBuildMessageDTO>
}
