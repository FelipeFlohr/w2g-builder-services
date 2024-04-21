package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO
import dev.felipeflohr.w2gservices.builder.dto.GuildAndChannelDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import dev.felipeflohr.w2gservices.builder.functions.virtualThreadSupplier
import dev.felipeflohr.w2gservices.builder.repositories.DiscordMessageRepository
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageAuthorService
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageService
import dev.felipeflohr.w2gservices.builder.services.ReferenceDownloadService
import java.util.Date
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class DiscordMessageServiceImpl @Autowired constructor(
    private val repository: DiscordMessageRepository,
    private val authorService: DiscordMessageAuthorService,
    private val referenceDownloaderService: ReferenceDownloadService,
) : DiscordMessageService {
    override suspend fun save(dto: DiscordMessageDTO): DiscordMessageEntity {
        val entity = dto.toEntity()
        val author = authorService.save(entity.author)
        entity.author = author
        val savedEntity = virtualThreadSupplier { repository.save(entity) }

        referenceDownloaderService.downloadAndSaveReferenceForEntityInBackground(savedEntity)
        return savedEntity
    }

    override suspend fun upsert(dto: DiscordMessageDTO): DiscordMessageEntity {
        return update(dto) ?: save(dto)
    }

    override suspend fun update(dto: DiscordMessageDTO): DiscordMessageEntity? {
        val id = virtualThreadSupplier { repository.findIdByMessageId(dto.id) }
        if (id != null) {
            val entity = dto.toEntity(id)
            val authorId = virtualThreadSupplier { repository.findAuthorIdById(id) }

            entity.author.id = authorId
            val authorEntity = authorService.save(entity.author)
            entity.author = authorEntity
            return virtualThreadSupplier { repository.save(entity) }
        }
        return null
    }

    override suspend fun delete(dto: DiscordMessageDTO): Boolean {
        val id = virtualThreadSupplier { repository.findIdByMessageId(dto.id) }
        if (id != null) {
            virtualThreadSupplier { repository.deleteById(id) }
        }
        return id != null
    }

    override suspend fun getAllByFileReferencesEmptyAndFileLogsEmpty(): List<DiscordMessageEntity> {
        return virtualThreadSupplier { repository.findAllByFileReferencesEmptyAndFileLogsEmpty() }
    }

    override suspend fun getAllDistinctGuildIdsAndChannelIds(): Set<GuildAndChannelDTO> {
        return virtualThreadSupplier { repository.findAllDistinctGuildIdsAndChannelIds() }
    }

    override suspend fun getDistinctChannelIdsByGuildId(guildId: String): Set<String> {
        return virtualThreadSupplier { repository.findAllDistinctChannelIdsByGuildId(guildId) }
    }

    override suspend fun getAllByGuildIdAndChannelIdAndMessageCreatedAtAfter(
        guildId: String,
        channelId: String,
        createdAt: Date
    ): List<DiscordMessageEntity> {
        return virtualThreadSupplier { repository.findAllByGuildIdAndChannelIdAndMessageCreatedAtAfter(guildId, channelId, createdAt) }
    }
}
