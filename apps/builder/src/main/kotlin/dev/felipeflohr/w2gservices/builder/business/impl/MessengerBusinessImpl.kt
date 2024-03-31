package dev.felipeflohr.w2gservices.builder.business.impl

import dev.felipeflohr.w2gservices.builder.business.MessengerBusiness
import dev.felipeflohr.w2gservices.builder.dto.AvailableChannelDTO
import dev.felipeflohr.w2gservices.builder.dto.AvailableGuildDTO
import dev.felipeflohr.w2gservices.builder.dto.GuildAndChannelIdsDTO
import dev.felipeflohr.w2gservices.builder.types.MessengerApplicationAddressesType
import kotlinx.coroutines.reactive.awaitFirst
import org.springframework.http.ResponseEntity
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient

class MessengerBusinessImpl(
    private val messengerWebClient: WebClient
) : MessengerBusiness {
    override suspend fun getGuildsWithImageLink(guildIds: Collection<String>): ResponseEntity<List<AvailableGuildDTO>> {
        return messengerWebClient
            .post()
            .uri(MessengerApplicationAddressesType.GUILD_IMAGES.address)
            .body(BodyInserters.fromValue(guildIds))
            .retrieve()
            .toEntityList(AvailableGuildDTO::class.java)
            .awaitFirst()
    }

    override suspend fun getChannelNames(channels: GuildAndChannelIdsDTO): ResponseEntity<List<AvailableChannelDTO>> {
        return messengerWebClient
            .post()
            .uri(MessengerApplicationAddressesType.CHANNEL_NAMES.address)
            .body(BodyInserters.fromValue(channels))
            .retrieve()
            .toEntityList(AvailableChannelDTO::class.java)
            .awaitFirst()
    }
}