package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.business.FileStorageBusiness
import dev.felipeflohr.w2gservices.builder.business.impl.FileStorageBusinessImpl
import dev.felipeflohr.w2gservices.builder.configurations.WebClientConfiguration
import dev.felipeflohr.w2gservices.builder.dto.FileExistResultDTO
import dev.felipeflohr.w2gservices.builder.services.FileStorageService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient

@Service
class FileStorageServiceImpl @Autowired constructor(
    @Qualifier(WebClientConfiguration.FILE_STORAGE_WEB_CLIENT_BEAN_NAME) webClient: WebClient
) : FileStorageService {
    private val business: FileStorageBusiness = FileStorageBusinessImpl(webClient)

    override suspend fun getStaleData(hashes: Set<String>): List<FileExistResultDTO> {
        val staleData = business.getStaleData(hashes)
        if (staleData.statusCode.isError || staleData.body == null) {
            return emptyList()
        }
        return staleData.body!!
    }
}