package pucmg.ps.backend.Cupom

import java.time.Instant

data class CupomDTO(
    val id: Long?,
    val codigo: String,
    val dataEmissao: Instant,
    val dataValidade: Instant,
    val utilizado: Boolean,
    val dataUtilizacao: Instant?,
    val alunoId: Long,
    val vantagemId: Long,
    val vantagemDescricao: String,
    val custoMoedas: Int,
    val nomeEmpresa: String
)

data class CupomResgatoDTO(
    val id: Long?,
    val codigo: String,
    val alunoId: Long,
    val vantagemId: Long,
    val dataResgate: Instant
)

fun CupomEntity.toDTO(): CupomDTO =
    CupomDTO(
        id = this.id,
        codigo = this.codigo,
        dataEmissao = this.dataEmissao,
        dataValidade = this.dataValidade,
        utilizado = this.utilizado,
        dataUtilizacao = this.dataUtilizacao,
        alunoId = this.aluno.id!!,
        vantagemId = this.vantagem.id!!,
        vantagemDescricao = this.vantagem.descricao,
        custoMoedas = this.vantagem.custoMoedas,
        nomeEmpresa = this.vantagem.empresa.nomeFantasia
    )

fun CupomEntity.toResgatoDTO(): CupomResgatoDTO =
    CupomResgatoDTO(
        id = this.id,
        codigo = this.codigo,
        alunoId = this.aluno.id!!,
        vantagemId = this.vantagem.id!!,
        dataResgate = this.dataUtilizacao ?: Instant.now()
    )
