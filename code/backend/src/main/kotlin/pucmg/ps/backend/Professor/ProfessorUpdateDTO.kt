package pucmg.ps.backend.Professor

data class ProfessorUpdateDTO(
    val name: String?,
    val email: String?,
    val password: String?,
    val cpf: String?,
    val departamento: String?
)