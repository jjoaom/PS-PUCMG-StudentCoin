package pucmg.ps.backend.shared.events

data class ResgateVantagemEvent(
    val alunoId: Long = 0,
    val alunoNome: String = "",
    val alunoEmail: String = "",
    val vantagemDescricao: String = "",
    val custoMoedas: Int = 0,
    val nomeEmpresa: String = "",
    val codigoCupom: String = "",
    val dataValidade: String = ""
)
