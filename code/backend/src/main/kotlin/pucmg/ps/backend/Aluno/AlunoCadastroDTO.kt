package pucmg.ps.backend.Aluno

data class AlunoCadastroDTO(

    val nome: String,

    val email: String,

    val senha: String,

    val cpf: String,

    val rg: String,

    val telefone: String?,

    val cep: String,

    val rua: String,

    val numero: String,

    val bairro: String,

    val cidade: String,

    val estado: String,

    val curso: String,

    val instituicaoId: Long
)