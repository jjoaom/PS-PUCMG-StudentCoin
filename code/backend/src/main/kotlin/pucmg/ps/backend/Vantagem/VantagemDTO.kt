package pucmg.ps.backend.Vantagem

import java.time.Instant

data class VantagemCadastroDTO(
    val descricao: String,
    val custoMoedas: Int,
    val detalhes: String? = null
)

data class VantagemResponseDTO(
    val id: Long?,
    val descricao: String,
    val custoMoedas: Int,
    val detalhes: String?,
    val ativa: Boolean,
    val empresaId: Long,
    val nomeEmpresa: String,
    val criadoEm: Instant?,
    val atualizadoEm: Instant?
)

fun VantagemEntity.toResponseDTO(): VantagemResponseDTO =
    VantagemResponseDTO(
        id = this.id,
        descricao = this.descricao,
        custoMoedas = this.custoMoedas,
        detalhes = this.detalhes,
        ativa = this.ativa,
        empresaId = this.empresa.id!!,
        nomeEmpresa = this.empresa.nomeFantasia,
        criadoEm = this.criadoEm,
        atualizadoEm = this.atualizadoEm
    )
