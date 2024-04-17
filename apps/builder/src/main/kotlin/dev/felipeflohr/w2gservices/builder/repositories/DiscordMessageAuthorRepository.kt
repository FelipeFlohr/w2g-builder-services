package dev.felipeflohr.w2gservices.builder.repositories

import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageAuthorEntity
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface DiscordMessageAuthorRepository : ReactiveCrudRepository<DiscordMessageAuthorEntity, Long>, DiscordMessageAuthorCustomRepository
