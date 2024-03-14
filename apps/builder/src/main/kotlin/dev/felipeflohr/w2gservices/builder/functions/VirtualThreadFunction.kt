package dev.felipeflohr.w2gservices.builder.functions

import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.suspendCancellableCoroutine
import java.util.concurrent.CompletableFuture
import java.util.concurrent.Executors
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException

suspend fun <T> virtualThread(consumer: suspend () -> T): T {
    val executor = Executors.newVirtualThreadPerTaskExecutor()
    return suspendCancellableCoroutine { continuation ->
        val future = CompletableFuture.supplyAsync({
            try {
                runBlocking {
                    consumer()
                }
            } finally {
                executor.shutdown()
            }
        }, executor)
        future.whenComplete { result, exception ->
            if (exception == null) {
                continuation.resume(result)
            } else {
                continuation.resumeWithException(exception)
            }
        }
    }
}