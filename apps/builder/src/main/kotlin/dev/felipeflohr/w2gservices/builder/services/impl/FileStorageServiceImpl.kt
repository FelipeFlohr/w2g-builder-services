package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.business.FileStorageBusiness
import dev.felipeflohr.w2gservices.builder.dto.FileExistResultDTO
import dev.felipeflohr.w2gservices.builder.services.FileStorageService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class FileStorageServiceImpl @Autowired constructor(
    private val business: FileStorageBusiness,
) : FileStorageService {
    override suspend fun getStaleData(hashes: Set<String>): List<FileExistResultDTO> {
        val staleData = business.getStaleData(hashes)
        if (staleData.statusCode.isError || staleData.body == null) {
            return emptyList()
        }
        return staleData.body!!
    }
}