package pucmg.ps.backend.Professor

data class ProfessorCadastroDTO(
    val name: String,
    val email: String,
    val password: String,
    val cpf: String,
    val departamento: String,
    val saldoMoedas: Int = 0
)