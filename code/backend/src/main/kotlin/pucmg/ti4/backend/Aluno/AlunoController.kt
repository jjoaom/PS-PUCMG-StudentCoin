package pucmg.ti4.backend.Aluno

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/alunos")
@CrossOrigin(origins = ["http://localhost:5173"])
class AlunoController(
    private val alunoService: AlunoService
) {

    @PostMapping
    fun cadastrar(
        @RequestBody dto: AlunoCadastroDTO
    ): ResponseEntity<Any> {

        return try {

            val aluno = alunoService.cadastrar(dto)

            ResponseEntity.ok(aluno)

        } catch (e: RuntimeException) {

            ResponseEntity
                .badRequest()
                .body(mapOf("erro" to e.message))
        }
    }

    @PostMapping("/login")
    fun login(
        @RequestBody dto: AlunoLoginDTO
    ): ResponseEntity<Any> {

        return try {

            val aluno = alunoService.login(dto)

            ResponseEntity.ok(aluno)

        } catch (e: RuntimeException) {

            ResponseEntity
                .badRequest()
                .body(mapOf("erro" to e.message))
        }
    }

    @GetMapping("/{id}")
    fun buscarPorId(@PathVariable id: Long): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(alunoService.buscarPorId(id))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @PutMapping("/{id}")
    fun atualizar(
        @PathVariable id: Long,
        @RequestBody dto: AlunoCadastroDTO
    ): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(alunoService.atualizar(id, dto))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }
}