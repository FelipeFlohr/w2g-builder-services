package dev.felipeflohr.w2gservices.builder.repositories

interface DownloaderRepository {
    fun getIdsWithReferencesOrLogByMessageIds(messageIds: Collection<Long>): List<Long>
}