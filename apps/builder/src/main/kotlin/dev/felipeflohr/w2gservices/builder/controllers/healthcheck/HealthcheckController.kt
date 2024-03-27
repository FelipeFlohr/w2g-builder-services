package dev.felipeflohr.w2gservices.builder.controllers.healthcheck

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@Suppress("EmptyMethod")
@RestController
@RequestMapping("/healthcheck")
class HealthcheckController {
    @GetMapping
    @ResponseStatus(value = HttpStatus.OK)
    fun health() {}
}
