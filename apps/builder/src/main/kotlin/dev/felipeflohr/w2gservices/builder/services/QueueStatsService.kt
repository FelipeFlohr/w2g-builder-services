package dev.felipeflohr.w2gservices.builder.services

interface QueueStatsService {
    suspend fun getQueueSize(queue: String): Int
}