package pucmg.ps.backend.Aluno

import org.springframework.http.HttpStatus
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

    @GetMapping("/{id}/saldo")
    fun consultarSaldo(@PathVariable id: Long): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(alunoService.consultarSaldo(id))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @GetMapping("/{id}/extrato")
    fun consultarExtrato(@PathVariable id: Long): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(alunoService.consultarExtrato(id))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @PostMapping("/{alunoId}/resgatar-vantagem/{vantagemId}")
    fun resgatarVantagem(
        @PathVariable alunoId: Long,
        @PathVariable vantagemId: Long
    ): ResponseEntity<Any> {
        return try {
            val cupom = alunoService.resgatarVantagem(alunoId, vantagemId)
            ResponseEntity.status(HttpStatus.CREATED).body(cupom)
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @GetMapping("/{alunoId}/cupons/disponiveis")
    fun listarCuponsDisponiveis(@PathVariable alunoId: Long): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(alunoService.listarCuponsDisponiveis(alunoId))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @GetMapping("/{alunoId}/cupons/historico")
    fun listarHistoricoCupons(@PathVariable alunoId: Long): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(alunoService.listarHistoricoCupons(alunoId))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @PostMapping("/usar-cupom/{codigo}")
    fun usarCupom(@PathVariable codigo: String): ResponseEntity<Any> {
        return try {
            val resultado = alunoService.usarCupom(codigo)
            ResponseEntity.ok(resultado)
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }
}