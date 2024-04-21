package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg

@NoArg
data class GuildAndChannelDTO(
    var guildId: String,
    var channelId: String,
)
