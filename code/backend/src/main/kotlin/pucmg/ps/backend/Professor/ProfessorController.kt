package pucmg.ps.backend.Professor

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/professor")
class ProfessorController(
    private val professorService: ProfessorService
) {

    @PostMapping
    fun cadastrar(@RequestBody dto: ProfessorCadastroDTO): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(professorService.cadastrar(dto))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @PostMapping("/login")
    fun login(@RequestBody dto: ProfessorLoginDTO): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(professorService.login(dto))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @GetMapping
    fun listarTodos(): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(professorService.listarTodos())
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @GetMapping("/{id}")
    fun buscarPorId(@PathVariable id: Long): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(professorService.buscarPorId(id))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @PutMapping("/{id}")
    fun atualizar(
        @PathVariable id: Long,
        @RequestBody dto: ProfessorUpdateDTO
    ): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(professorService.atualizar(id, dto))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @PostMapping("/{professorId}/enviar-moedas")
    fun enviarMoedas(
        @PathVariable professorId: Long,
        @RequestBody dto: EnviarMoedasDTO
    ): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(professorService.enviarMoedas(professorId, dto))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @GetMapping("/{id}/saldo")
    fun consultarSaldo(@PathVariable id: Long): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(professorService.consultarSaldo(id))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @GetMapping("/{id}/extrato")
    fun consultarExtrato(@PathVariable id: Long): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(professorService.consultarExtrato(id))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }
}