package pucmg.ps.backend.shared.events

data class MoedaRecebidaEvent(
    val alunoId: Long = 0,
    val alunoNome: String = "",
    val alunoEmail: String = "",
    val professorNome: String = "",
    val quantidadeMoedas: Int = 0,
    val descricao: String = ""
)