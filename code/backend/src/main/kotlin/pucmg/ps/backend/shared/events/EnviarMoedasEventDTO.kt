package pucmg.ps.backend.shared.events

data class EnviarMoedasEvent(
    val professorId: Long,
    val alunoId: Long,
    val quantidade: Int,
    val descricao: String?
)