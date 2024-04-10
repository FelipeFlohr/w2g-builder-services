package dev.felipeflohr.w2gservices.builder.business

import dev.felipeflohr.w2gservices.builder.dto.FileExistResultDTO
import org.springframework.http.ResponseEntity

interface FileStorageBusiness {
    suspend fun getStaleData(hashes: Set<String>): ResponseEntity<List<FileExistResultDTO>>
}