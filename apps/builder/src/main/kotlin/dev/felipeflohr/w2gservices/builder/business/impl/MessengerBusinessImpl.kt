package dev.felipeflohr.w2gservices.builder.business.impl

import dev.felipeflohr.w2gservices.builder.annotations.Business
import dev.felipeflohr.w2gservices.builder.business.MessengerBusiness
import dev.felipeflohr.w2gservices.builder.configurations.WebClientConfiguration
import dev.felipeflohr.w2gservices.builder.dto.AvailableChannelDTO
import dev.felipeflohr.w2gservices.builder.dto.AvailableGuildDTO
import dev.felipeflohr.w2gservices.builder.dto.GuildAndChannelIdsDTO
import dev.felipeflohr.w2gservices.builder.types.MessengerApplicationAddressesType
import kotlinx.coroutines.reactive.awaitFirst
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.http.ResponseEntity
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient

@Business
class MessengerBusinessImpl @Autowired constructor(
    @Qualifier(WebClientConfiguration.MESSENGER_WEB_CLIENT_BEAN_NAME) private val webClient: WebClient
) : MessengerBusiness {
    override suspend fun getGuildsWithImageLink(guildIds: Collection<String>): ResponseEntity<List<AvailableGuildDTO>> {
        return webClient
            .post()
            .uri(MessengerApplicationAddressesType.GUILD_IMAGES.address)
            .body(BodyInserters.fromValue(guildIds))
            .retrieve()
            .toEntityList(AvailableGuildDTO::class.java)
            .awaitFirst()
    }

    override suspend fun getChannelNames(channels: GuildAndChannelIdsDTO): ResponseEntity<List<AvailableChannelDTO>> {
        return webClient
            .post()
            .uri(MessengerApplicationAddressesType.CHANNEL_NAMES.address)
            .body(BodyInserters.fromValue(channels))
            .retrieve()
            .toEntityList(AvailableChannelDTO::class.java)
            .awaitFirst()
    }
}