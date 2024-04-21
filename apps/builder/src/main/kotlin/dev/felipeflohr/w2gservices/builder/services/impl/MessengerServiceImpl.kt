package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.business.MessengerBusiness
import dev.felipeflohr.w2gservices.builder.dto.AvailableChannelDTO
import dev.felipeflohr.w2gservices.builder.dto.AvailableGuildDTO
import dev.felipeflohr.w2gservices.builder.dto.GuildAndChannelIdsDTO
import dev.felipeflohr.w2gservices.builder.services.MessengerService
import dev.felipeflohr.w2gservices.builder.utils.LoggerUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service

@Service
class MessengerServiceImpl @Autowired constructor(
    private val business: MessengerBusiness
) : MessengerService {
    private val logger = LoggerUtils.getLogger(MessengerServiceImpl::class)

    override suspend fun getGuildsWithImageLink(guildIds: Collection<String>): Set<AvailableGuildDTO> {
        val res = business.getGuildsWithImageLink(guildIds)
        if (res.statusCode.isError || res.body == null) {
            logResponseError(res)
            return emptySet()
        }
        return res.body!!.toSet()
    }

    override suspend fun getChannelNames(channels: GuildAndChannelIdsDTO): Set<AvailableChannelDTO> {
        val res = business.getChannelNames(channels)
        if (res.statusCode.isError || res.body == null) {
            logResponseError(res)
        }
        return res.body!!.toSet()
    }

    private fun logResponseError(response: ResponseEntity<*>) {
        logger.error("Request returned ${response.statusCode.value()} | ${response.body.toString()}")
    }
}