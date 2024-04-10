package dev.felipeflohr.w2gservices.builder.business.impl

import dev.felipeflohr.w2gservices.builder.business.FileStorageBusiness
import dev.felipeflohr.w2gservices.builder.dto.FileExistResultDTO
import dev.felipeflohr.w2gservices.builder.types.FileStorageApplicationAddressesType
import kotlinx.coroutines.reactive.awaitFirst
import org.springframework.http.ResponseEntity
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient

class FileStorageBusinessImpl(private val fileStorageWebClient: WebClient) : FileStorageBusiness {
    override suspend fun getStaleData(hashes: Set<String>): ResponseEntity<List<FileExistResultDTO>> {
        return fileStorageWebClient
            .post()
            .uri(FileStorageApplicationAddressesType.STALE_DATA.address)
            .body(BodyInserters.fromValue(hashes))
            .retrieve()
            .toEntityList(FileExistResultDTO::class.java)
            .awaitFirst()
    }
}