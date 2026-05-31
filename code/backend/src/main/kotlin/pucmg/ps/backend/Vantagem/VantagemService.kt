package pucmg.ps.backend.Vantagem

import org.springframework.stereotype.Service
import pucmg.ps.backend.Empresa.EmpresaDao

@Service
class VantagemService(
    private val vantagemDAO: VantagemDAO,
    private val empresaDao: EmpresaDao
) {

    fun cadastrar(empresaId: Long, dto: VantagemCadastroDTO): VantagemResponseDTO {
        // Validações
        if (dto.custoMoedas <= 0) {
            throw IllegalArgumentException("O custo em moedas deve ser maior que zero")
        }

        if (dto.descricao.isBlank()) {
            throw IllegalArgumentException("A descrição não pode estar vazia")
        }

        // Verifica se empresa existe
        val empresa = empresaDao.findById(empresaId)

        // Cria nova vantagem
        val vantagem = VantagemEntity(
            descricao = dto.descricao,
            custoMoedas = dto.custoMoedas,
            empresa = empresa,
            detalhes = dto.detalhes,
            ativa = true
        )

        val vantagemSalva = vantagemDAO.save(vantagem)
        return vantagemSalva.toResponseDTO()
    }

    fun buscarPorId(id: Long): VantagemResponseDTO {
        return vantagemDAO.findById(id).toResponseDTO()
    }

    fun listarPorEmpresa(empresaId: Long): List<VantagemResponseDTO> {
        return vantagemDAO.findByEmpresaId(empresaId)
            .map { it.toResponseDTO() }
    }

    fun listarPorEmpresaAtivas(empresaId: Long): List<VantagemResponseDTO> {
        return vantagemDAO.findByEmpresaIdAndAtiva(empresaId, true)
            .map { it.toResponseDTO() }
    }

    fun listarTodasAtivas(): List<VantagemResponseDTO> {
        return vantagemDAO.findAllAtivas()
            .map { it.toResponseDTO() }
    }

    fun atualizar(id: Long, dto: VantagemCadastroDTO): VantagemResponseDTO {
        if (dto.custoMoedas <= 0) {
            throw IllegalArgumentException("O custo em moedas deve ser maior que zero")
        }

        if (dto.descricao.isBlank()) {
            throw IllegalArgumentException("A descrição não pode estar vazia")
        }

        val vantagem = vantagemDAO.updateVantagem(id, dto)
        return vantagem.toResponseDTO()
    }

    fun desativar(id: Long): VantagemResponseDTO {
        val vantagem = vantagemDAO.desativar(id)
        return vantagem.toResponseDTO()
    }

    fun ativar(id: Long): VantagemResponseDTO {
        val vantagem = vantagemDAO.ativar(id)
        return vantagem.toResponseDTO()
    }

    fun deletar(id: Long) {
        vantagemDAO.deleteById(id)
    }
}
