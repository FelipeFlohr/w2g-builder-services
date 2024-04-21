package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.FileExistResultDTO

interface FileStorageService {
    suspend fun getStaleData(hashes: Set<String>): List<FileExistResultDTO>
}