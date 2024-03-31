package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO
import dev.felipeflohr.w2gservices.builder.dto.GuildAndChannelDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import dev.felipeflohr.w2gservices.builder.functions.virtualThread
import dev.felipeflohr.w2gservices.builder.repositories.DiscordMessageRepository
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageAuthorService
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageService
import dev.felipeflohr.w2gservices.builder.services.DownloaderService
import kotlinx.coroutines.coroutineScope
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class DiscordMessageServiceImpl @Autowired constructor (
    private val repository: DiscordMessageRepository,
    private val authorService: DiscordMessageAuthorService,
    private val downloaderService: DownloaderService
) : DiscordMessageService {
    override suspend fun bootstrapMessage(message: DiscordMessageDTO) {
        upsert(message)
    }

    override suspend fun save(message: DiscordMessageDTO) {
        saveAndFlush(message)
    }

    override suspend fun saveAndFlush(message: DiscordMessageDTO): DiscordMessageEntity {
        return virtualThread {
            if (repository.existsByMessageId(message.id)) {
                update(message)
                return@virtualThread getByMessageId(message.id)!!
            } else {
                val messageFlushed = repository.saveAndFlush(message.toEntity())
                coroutineScope {
                    downloaderService.downloadVideosAndSave(listOf(messageFlushed))
                }
                return@virtualThread messageFlushed
            }
        }
    }

    override suspend fun delete(message: DiscordMessageDTO) {
        virtualThread {
            if (repository.existsByMessageId(message.id)) {
                val authorId: Long = getAuthorIdByMessageId(message.id)!!
                repository.deleteByMessageId(message.id)
                authorService.deleteById(authorId)
            }
        }
    }

    override suspend fun update(message: DiscordMessageDTO) {
        virtualThread {
            authorService.updateAuthor(message.author)
            repository.update(message)
        }
    }

    override suspend fun updateAndFlush(message: DiscordMessageDTO): DiscordMessageEntity? {
        return virtualThread {
            authorService.updateAuthor(message.author)
            repository.updateAndFlush(message)
        }
    }

    override suspend fun upsert(message: DiscordMessageDTO) {
        return virtualThread {
            if (repository.existsByMessageId(message.id)) {
                update(message)
            }
            save(message)
        }
    }

    override suspend fun upsertAndFlush(message: DiscordMessageDTO): DiscordMessageEntity {
        return virtualThread {
            if (repository.existsByMessageId(message.id)) {
                updateAndFlush(message)!!
            }
            saveAndFlush(message)
        }
    }

    override suspend fun getByMessageId(messageId: String): DiscordMessageEntity? {
        return virtualThread {
            repository.getByMessageId(messageId)
        }
    }

    override suspend fun getMessageIdByDiscordMessageId(messageId: String): Long? {
        return virtualThread {
            repository.getMessageIdByDiscordMessageId(messageId)
        }
    }

    override suspend fun getAllWithNoFileReference(): List<DiscordMessageEntity> {
        return virtualThread {
            repository.getAllByFileReferencesEmptyAndFileLogsEmpty()
        }
    }

    override suspend fun getAllDistinctGuildIdsAndChannelIds(): Set<GuildAndChannelDTO> {
        return virtualThread {
            repository.getAllDistinctGuildIdsAndChannelIds()
        }
    }

    override suspend fun getAllByMessageIds(messageIds: Collection<String>): List<DiscordMessageEntity> {
        return virtualThread {
            repository.getAllByMessageIdIn(messageIds)
        }
    }

    override suspend fun getAuthorIdByMessageId(messageId: String): Long? {
        return virtualThread {
            repository.getAuthorIdByMessageId(messageId)
        }
    }

    override suspend fun getDistinctGuildIds(): Set<String> {
        return virtualThread {
            repository.getDistinctGuildIds()
        }
    }

    override suspend fun getDistinctChannelIdsByGuildId(guildId: String): Set<String> {
        return virtualThread {
            repository.getAllDistinctChannelIdsByGuildId(guildId)
        }
    }

    override suspend fun existsByMessageId(id: String): Boolean {
        return virtualThread {
            repository.existsByMessageId(id)
        }
    }

    override suspend fun getIdByMessageId(messageId: String): Long? {
        return virtualThread {
            repository.getMessageIdByDiscordMessageId(messageId)
        }
    }
}
