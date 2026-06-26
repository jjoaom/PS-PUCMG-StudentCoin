package pucmg.ps.backend.Empresa

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import pucmg.ps.backend.Vantagem.VantagemCadastroDTO

@RestController
@RequestMapping("/empresa")
class EmpresaController(
    private val empresaService: EmpresaService
) {

    @PostMapping
    fun cadastrar(@RequestBody dto: EmpresaCadastroDTO): ResponseEntity<Any> {
        return try {
            val empresa = empresaService.cadastrar(dto)
            ResponseEntity.ok(empresa)
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }



    @GetMapping("/{id}")
    fun buscarPorId(@PathVariable id: Long): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(empresaService.buscarPorId(id))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @PutMapping("/{id}")
    fun atualizar(
        @PathVariable id: Long,
        @RequestBody dto: EmpresaCadastroDTO
    ): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(empresaService.atualizar(id, dto))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }
    
    @DeleteMapping("/{id}")
    fun deletar(@PathVariable id: Long): ResponseEntity<Any> {
        return try {
            empresaService.deletar(id)
            ResponseEntity.noContent().build()
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @GetMapping("/{empresaId}/vantagens")
    fun listarVantagens(@PathVariable empresaId: Long): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(empresaService.listarVantagens(empresaId))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @GetMapping("/{empresaId}/vantagens/ativas")
    fun listarVantagensAtivas(@PathVariable empresaId: Long): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(empresaService.listarVantagensAtivas(empresaId))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @PostMapping("/{empresaId}/vantagens")
    fun criarVantagem(
        @PathVariable empresaId: Long,
        @RequestBody dto: VantagemCadastroDTO
    ): ResponseEntity<Any> {
        return try {
            val vantagem = empresaService.criarVantagem(empresaId, dto)
            ResponseEntity.status(HttpStatus.CREATED).body(vantagem)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }

    @GetMapping("/{empresaId}/relatorio/cupons")
    fun gerarRelatorioCupons(@PathVariable empresaId: Long): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(empresaService.gerarRelatorioCupons(empresaId))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("erro" to e.message))
        }
    }
}