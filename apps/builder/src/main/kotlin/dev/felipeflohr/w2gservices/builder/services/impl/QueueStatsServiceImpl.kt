package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.services.QueueStatsService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.withContext
import org.springframework.amqp.rabbit.core.RabbitAdmin
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class QueueStatsServiceImpl @Autowired constructor (
    private val admin: RabbitAdmin
) : QueueStatsService {
    override suspend fun getQueueSize(queue: String): Int = coroutineScope {
        val props = admin.getQueueProperties(queue)
        return@coroutineScope props["QUEUE_MESSAGE_COUNT"].toString().toInt()
    }
}