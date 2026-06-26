package pucmg.ps.backend.Instituicao

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/instituicoes")
class InstituicaoController(
    private val instituicaoRepository: InstituicaoRepository
) {

    @GetMapping
    fun listarTodas(): ResponseEntity<List<Instituicao>> {
        return ResponseEntity.ok(instituicaoRepository.findAll())
    }
}
