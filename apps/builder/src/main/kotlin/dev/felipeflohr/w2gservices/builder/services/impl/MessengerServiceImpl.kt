package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.business.MessengerBusiness
import dev.felipeflohr.w2gservices.builder.business.impl.MessengerBusinessImpl
import dev.felipeflohr.w2gservices.builder.configurations.WebClientConfiguration
import dev.felipeflohr.w2gservices.builder.dto.AvailableChannelDTO
import dev.felipeflohr.w2gservices.builder.dto.AvailableGuildDTO
import dev.felipeflohr.w2gservices.builder.dto.GuildAndChannelIdsDTO
import dev.felipeflohr.w2gservices.builder.services.MessengerService
import dev.felipeflohr.w2gservices.builder.utils.LoggerUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient

@Service
class MessengerServiceImpl @Autowired constructor (
    @Qualifier(WebClientConfiguration.MESSENGER_WEB_CLIENT_BEAN_NAME) private val messengerWebClient: WebClient
) : MessengerService {
    private val business: MessengerBusiness = MessengerBusinessImpl(messengerWebClient)
    private val logger = LoggerUtils.getLogger(MessengerServiceImpl::class)

    override suspend fun getGuildsWithImageLink(guildIds: Collection<String>): Set<AvailableGuildDTO> {
        val res = business.getGuildsWithImageLink(guildIds)
        if (res.statusCode.isError || res.body == null) {
            logger.error("Request returned ${res.statusCode.value()} | ${res.body.toString()}")
            return emptySet()
        }
        return res.body!!.toSet()
    }

    override suspend fun getChannelNames(channels: GuildAndChannelIdsDTO): Set<AvailableChannelDTO> {
        val res = business.getChannelNames(channels)
        if (res.statusCode.isError || res.body == null) {
            logger.error("Request returned ${res.statusCode.value()} | ${res.body.toString()}")
        }
        return res.body!!.toSet()
    }
}