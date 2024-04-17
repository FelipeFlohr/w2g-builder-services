package dev.felipeflohr.w2gservices.builder.repositories.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageAuthorDTO
import dev.felipeflohr.w2gservices.builder.repositories.DiscordMessageAuthorCustomRepository
import io.r2dbc.spi.ConnectionFactory
import java.time.Instant
import kotlinx.coroutines.reactive.awaitFirst
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import org.springframework.r2dbc.core.DatabaseClient
import org.springframework.r2dbc.core.bind
import org.springframework.stereotype.Repository

@Repository
class DiscordMessageAuthorCustomRepositoryImpl @Autowired constructor(
    connectionFactory: ConnectionFactory,
) : DiscordMessageAuthorCustomRepository {
    private val client = DatabaseClient.create(connectionFactory)

    override suspend fun update(id: Long, dto: DiscordMessageAuthorDTO): Long {
        val query = """
            UPDATE "TB_DISCORD_MESSAGE_AUTHOR"
            SET "DMA_AVAPNGURL" = :avatarPngUrl,
            "DMA_BANPNGURL" = :bannerPngUrl,
            "DMA_BOT" = :bot,
            "DMA_AUT_CREATED_AT" = :autCreatedAt,
            "DMA_DIS_NAME" = :displayName,
            "DMA_GNAME" = :globalName,
            "DMA_AUTID" = :authorId,
            "DMA_SYS" = :system,
            "DMA_USERNAME" = :username,
            "UPDATED_AT" = :updatedAt,
            "VERSION" = "VERSION" + 1
            WHERE "DMA_ID" = :id
        """.trimIndent()
        return client
            .sql(query)
            .bind("id", id)
            .bind("avatarPngUrl", dto.avatarPngUrl)
            .bind("bannerPngUrl", dto.bannerPngUrl)
            .bind("bot", dto.bot)
            .bind("autCreatedAt", dto.createdAt)
            .bind("displayName", dto.displayName)
            .bind("globalName", dto.globalName)
            .bind("authorId", dto.id)
            .bind("system", dto.system)
            .bind("username", dto.username)
            .bind("updatedAt", Instant.now())
            .fetch()
            .rowsUpdated()
            .awaitFirst()
    }
}