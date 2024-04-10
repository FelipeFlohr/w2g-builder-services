package dev.felipeflohr.w2gservices.filestorage.utils;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.function.Function;

public class FileStorageCompletableFutureUtils {
    @SuppressWarnings("unchecked")
    public static <T, R> List<R> allOfVirtualThread(Collection<T> items, Function<T, R> mappingFunction) {
        var futureArray = items
            .stream()
            .map(item -> CompletableFuture.supplyAsync(() -> mappingFunction.apply(item), getVirtualThreadExecutor()))
            .toArray(CompletableFuture[]::new);

        CompletableFuture<Void> combinedFutures = CompletableFuture.allOf(futureArray);
        combinedFutures.join();

        return Arrays.stream(futureArray)
                .map(future -> (R) future.join())
                .toList();
    }

    private static Executor getVirtualThreadExecutor() {
        return Executors.newVirtualThreadPerTaskExecutor();
    }
}
