package pucmg.ti4.backend.Empresa

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/empresa")
@CrossOrigin(origins = ["http://localhost:5173"])
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

    @PostMapping("/login")
    fun login(@RequestBody dto: EmpresaLoginDTO): ResponseEntity<Any> {
        return try {
            val empresa = empresaService.login(dto)
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
    }