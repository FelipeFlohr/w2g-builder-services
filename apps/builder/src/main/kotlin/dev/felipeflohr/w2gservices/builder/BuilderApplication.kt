package dev.felipeflohr.w2gservices.builder

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class BuilderApplication

fun main(args: Array<String>) {
    runApplication<BuilderApplication>(*args)
}
