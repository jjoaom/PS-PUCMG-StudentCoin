package pucmg.ps.backend.Cupom

import org.springframework.stereotype.Component

@Component
class CupomDAO(
    private val repository: CupomRepository
) {
    fun save(cupom: CupomEntity): CupomEntity =
        repository.save(cupom)

    fun findById(id: Long): CupomEntity =
        repository.findById(id)
            .orElseThrow { CupomNotFoundException(id) }

    fun findByCodigo(codigo: String): CupomEntity =
        repository.findByCodigo(codigo)
            ?: throw CupomNotFoundException(codigo)

    fun findByAlunoId(alunoId: Long): List<CupomEntity> =
        repository.findByAlunoId(alunoId)

    fun findByAlunoIdAndUtilizado(alunoId: Long, utilizado: Boolean): List<CupomEntity> =
        repository.findByAlunoIdAndUtilizado(alunoId, utilizado)

    fun findByVantagemId(vantagemId: Long): List<CupomEntity> =
        repository.findByVantagemId(vantagemId)

    fun deletarPorId(id: Long) {
        if (!repository.existsById(id)) {
            throw CupomNotFoundException(id)
        }
        repository.deleteById(id)
    }
}

class CupomNotFoundException : RuntimeException {
    constructor(id: Long) : super("Cupom não encontrado: id=$id")
    constructor(codigo: String) : super("Cupom não encontrado: $codigo")
}
