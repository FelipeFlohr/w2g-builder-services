package dev.felipeflohr.w2gservices.builder.dto

data class GuildAndChannelIdsDTO(
    var guildId: String,
    var channelIds: Collection<String>
)
