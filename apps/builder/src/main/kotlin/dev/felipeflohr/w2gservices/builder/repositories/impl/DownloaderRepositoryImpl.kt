package dev.felipeflohr.w2gservices.builder.repositories.impl

import dev.felipeflohr.w2gservices.builder.repositories.DownloaderRepository
import jakarta.persistence.EntityManager
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Repository

@Repository
class DownloaderRepositoryImpl @Autowired constructor (
    private val entityManager: EntityManager
) : DownloaderRepository {
    override fun getIdsWithReferencesOrLogByMessageIds(messageIds: Collection<Long>): List<Long> {
        val sql = """
            select dme.id
            from DiscordMessageEntity dme
            where dme.id in (:messageIds)
            and (
                (select count(mfr.id) from MessageFileReferenceEntity mfr where mfr.message.id = dme.id) > 0
                or
                (select count(mfl.id) from MessageFileLogEntity mfl where mfl.message.id = dme.id) > 0
            )
        """.trimIndent()

        val query = entityManager.createQuery(sql, Long::class.java)
        query.setParameter("messageIds", messageIds)
        return query.resultList
    }
}