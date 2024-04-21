package dev.felipeflohr.w2gservices.builder.business.impl

import dev.felipeflohr.w2gservices.builder.annotations.Business
import dev.felipeflohr.w2gservices.builder.business.FileStorageBusiness
import dev.felipeflohr.w2gservices.builder.configurations.WebClientConfiguration
import dev.felipeflohr.w2gservices.builder.dto.FileExistResultDTO
import dev.felipeflohr.w2gservices.builder.types.FileStorageApplicationAddressesType
import kotlinx.coroutines.reactive.awaitFirst
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.http.ResponseEntity
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient

@Business
class FileStorageBusinessImpl @Autowired constructor(
    @Qualifier(WebClientConfiguration.FILE_STORAGE_WEB_CLIENT_BEAN_NAME) private val webClient: WebClient
) : FileStorageBusiness {
    override suspend fun getStaleData(hashes: Set<String>): ResponseEntity<List<FileExistResultDTO>> {
        return webClient
            .post()
            .uri(FileStorageApplicationAddressesType.STALE_DATA.address)
            .body(BodyInserters.fromValue(hashes))
            .retrieve()
            .toEntityList(FileExistResultDTO::class.java)
            .awaitFirst()
    }
}