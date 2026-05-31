package pucmg.ps.backend.Vantagem

import org.springframework.stereotype.Component

@Component
class VantagemDAO(
    private val repository: VantagemRepository
) {
    fun save(vantagem: VantagemEntity): VantagemEntity =
        repository.save(vantagem)

    fun findById(id: Long): VantagemEntity =
        repository.findById(id)
            .orElseThrow { VantagemNotFoundException(id) }

    fun findByEmpresaId(empresaId: Long): List<VantagemEntity> =
        repository.findByEmpresaId(empresaId)

    fun findByEmpresaIdAndAtiva(empresaId: Long, ativa: Boolean): List<VantagemEntity> =
        repository.findByEmpresaIdAndAtiva(empresaId, ativa)

    fun findAllAtivas(): List<VantagemEntity> =
        repository.findAllByAtiva(true)

    fun updateVantagem(id: Long, dto: VantagemCadastroDTO): VantagemEntity {
        val vantagem = findById(id)
        vantagem.descricao = dto.descricao
        vantagem.custoMoedas = dto.custoMoedas
        vantagem.detalhes = dto.detalhes
        return repository.save(vantagem)
    }

    fun deleteById(id: Long) {
        if (!repository.existsById(id)) {
            throw VantagemNotFoundException(id)
        }
        repository.deleteById(id)
    }

    fun desativar(id: Long): VantagemEntity {
        val vantagem = findById(id)
        vantagem.desativar()
        return repository.save(vantagem)
    }

    fun ativar(id: Long): VantagemEntity {
        val vantagem = findById(id)
        vantagem.ativar()
        return repository.save(vantagem)
    }
}

class VantagemNotFoundException : RuntimeException {
    constructor(id: Long) : super("Vantagem não encontrada: id=$id")
}
