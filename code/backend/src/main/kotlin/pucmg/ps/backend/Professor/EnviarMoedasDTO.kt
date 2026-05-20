package pucmg.ps.backend.Professor

data class EnviarMoedasDTO(
    val alunoId: Long,
    val quantidade: Int,
    val descricao: String? = null
)