package dev.felipeflohr.w2gservices.builder.repositories

import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface DiscordMessageRepository : ReactiveCrudRepository<DiscordMessageEntity, Long> {
    fun findByMessageId(messageId: String): Mono<DiscordMessageEntity?>
    fun findAuthorIdByMessageId(messageId: String): Mono<Long?>
}