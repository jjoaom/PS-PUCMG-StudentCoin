package pucmg.ps.backend.shared.exception

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(Exception::class)
    fun handleUncaught(ex: Exception): ResponseEntity<Map<String, String>> {
        return ResponseEntity
            .internalServerError()
            .body(mapOf("erro" to "Erro interno do servidor."))
    }
}
