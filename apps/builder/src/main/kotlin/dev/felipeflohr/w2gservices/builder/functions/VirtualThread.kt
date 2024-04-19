package dev.felipeflohr.w2gservices.builder.functions

import java.util.concurrent.CompletableFuture
import java.util.concurrent.Executors
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException

suspend fun <T> virtualThread(supplier: suspend () -> T): T {
    val executor = Executors.newVirtualThreadPerTaskExecutor()
    return suspendCancellableCoroutine { continuation ->
        val future = CompletableFuture.supplyAsync({
            try {
                runBlocking {
                    supplier()
                }
            } finally {
                executor.shutdown()
            }
        }, executor)
        future.whenComplete { result, exception ->
            if (exception != null) {
                continuation.resumeWithException(exception)
            } else {
                continuation.resume(result)
            }
        }
    }
}