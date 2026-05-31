package pucmg.ps.backend.Vantagem

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/vantagem")
@CrossOrigin(origins = ["http://localhost:5173"])
class VantagemController(
    private val vantagemService: VantagemService
) {

    @PostMapping("/empresa/{empresaId}")
    fun cadastrar(
        @PathVariable empresaId: Long,
        @RequestBody dto: VantagemCadastroDTO
    ): ResponseEntity<Any> {
        return try {
            val vantagem = vantagemService.cadastrar(empresaId, dto)
            ResponseEntity.status(HttpStatus.CREATED).body(vantagem)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @GetMapping("/{id}")
    fun buscarPorId(@PathVariable id: Long): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(vantagemService.buscarPorId(id))
        } catch (e: RuntimeException) {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/empresa/{empresaId}")
    fun listarPorEmpresa(@PathVariable empresaId: Long): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(vantagemService.listarPorEmpresa(empresaId))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @GetMapping("/empresa/{empresaId}/ativas")
    fun listarPorEmpresaAtivas(@PathVariable empresaId: Long): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(vantagemService.listarPorEmpresaAtivas(empresaId))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @GetMapping
    fun listarTodasAtivas(): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(vantagemService.listarTodasAtivas())
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @PutMapping("/{id}")
    fun atualizar(
        @PathVariable id: Long,
        @RequestBody dto: VantagemCadastroDTO
    ): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(vantagemService.atualizar(id, dto))
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @PatchMapping("/{id}/desativar")
    fun desativar(@PathVariable id: Long): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(vantagemService.desativar(id))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @PatchMapping("/{id}/ativar")
    fun ativar(@PathVariable id: Long): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(vantagemService.ativar(id))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @DeleteMapping("/{id}")
    fun deletar(@PathVariable id: Long): ResponseEntity<Any> {
        return try {
            vantagemService.deletar(id)
            ResponseEntity.noContent().build()
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }
}
