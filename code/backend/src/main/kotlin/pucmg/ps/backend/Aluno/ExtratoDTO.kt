package pucmg.ps.backend.Aluno

import pucmg.ps.backend.shared.enums.TipoMovimentacao
import java.time.LocalDateTime

data class ExtratoDTO(
    val valor: Int,
    val descricao: String?,
    val tipo: TipoMovimentacao,
    val data: LocalDateTime
)