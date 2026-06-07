package pucmg.ps.backend.shared.events

data class EnviarMoedasEvent(
    val professorId: Long = 0,
    val alunoId: Long = 0,
    val quantidade: Int = 0,
    val descricao: String = ""
)