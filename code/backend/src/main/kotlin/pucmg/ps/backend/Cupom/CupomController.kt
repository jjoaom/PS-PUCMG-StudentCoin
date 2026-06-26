package pucmg.ps.backend.Cupom

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/cupom")
class CupomController(
    private val cupomService: CupomService
) {

    @PostMapping("/gerar/aluno/{alunoId}/vantagem/{vantagemId}")
    fun gerarCupom(
        @PathVariable alunoId: Long,
        @PathVariable vantagemId: Long
    ): ResponseEntity<Any> {
        return try {
            val cupom = cupomService.gerarCupom(alunoId, vantagemId)
            ResponseEntity.status(HttpStatus.CREATED).body(cupom)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        } catch (e: IllegalStateException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @GetMapping("/{id}")
    fun buscarPorId(@PathVariable id: Long): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(cupomService.buscarPorId(id))
        } catch (e: RuntimeException) {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/codigo/{codigo}")
    fun buscarPorCodigo(@PathVariable codigo: String): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(cupomService.buscarPorCodigo(codigo))
        } catch (e: RuntimeException) {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/aluno/{alunoId}")
    fun listarCuponsAluno(@PathVariable alunoId: Long): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(cupomService.listarCuponsAluno(alunoId))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @GetMapping("/aluno/{alunoId}/nao-utilizados")
    fun listarCuponsAlunoNaoUtilizados(@PathVariable alunoId: Long): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(cupomService.listarCuponsAlunoNaoUtilizados(alunoId))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @GetMapping("/aluno/{alunoId}/utilizados")
    fun listarCuponsAlunoUtilizados(@PathVariable alunoId: Long): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(cupomService.listarCuponsAlunoUtilizados(alunoId))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @PostMapping("/usar/{codigo}")
    fun usarCupom(@PathVariable codigo: String): ResponseEntity<Any> {
        return try {
            val cupomResgatado = cupomService.usarCupom(codigo)
            ResponseEntity.ok(cupomResgatado)
        } catch (e: IllegalStateException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @GetMapping("/verificar/{codigo}")
    fun verificarValidade(@PathVariable codigo: String): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(cupomService.verificarValidade(codigo))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @GetMapping("/vantagem/{vantagemId}/relatorio")
    fun listarCuponsPorVantagem(@PathVariable vantagemId: Long): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(cupomService.listarCuponsPorVantagem(vantagemId))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @DeleteMapping("/{id}")
    fun deletar(@PathVariable id: Long): ResponseEntity<Any> {
        return try {
            cupomService.deletar(id)
            ResponseEntity.noContent().build()
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }
}
