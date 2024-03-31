package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg

@NoArg
data class GuildAndChannelIdsDTO(
    var guildId: String,
    var channelIds: Collection<String>
)
