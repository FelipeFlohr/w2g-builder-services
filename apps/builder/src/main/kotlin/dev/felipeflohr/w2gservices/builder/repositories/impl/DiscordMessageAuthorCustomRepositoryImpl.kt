package dev.felipeflohr.w2gservices.builder.repositories.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageAuthorDTO
import dev.felipeflohr.w2gservices.builder.repositories.DiscordMessageAuthorCustomRepository
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import org.springframework.stereotype.Repository
import java.util.Date

@Repository
class DiscordMessageAuthorCustomRepositoryImpl(
    @PersistenceContext
    private val entityManager: EntityManager
) : DiscordMessageAuthorCustomRepository {
    override fun update(author: DiscordMessageAuthorDTO): Int {
        val queryString = """
            update DiscordMessageAuthorEntity 
            set avatarPngUrl = :avatarPngUrl,
            bannerPngUrl = :bannerPngUrl,
            displayName = :displayName,
            globalName = :globalName,
            system = :system,
            username = :username,
            updatedAt = :currentDate,
            version = version + 1
            where authorId = :id
        """.trimIndent()

        val query = entityManager.createQuery(queryString)
        query.setParameter("avatarPngUrl", author.avatarPngUrl)
        query.setParameter("bannerPngUrl", author.bannerPngUrl)
        query.setParameter("displayName", author.displayName)
        query.setParameter("globalName", author.globalName)
        query.setParameter("system", author.system)
        query.setParameter("username", author.username)
        query.setParameter("currentDate", Date())
        query.setParameter("id", author.id)

        return query.executeUpdate()
    }
}