package pucmg.ti4.backend.Empresa

data class EmpresaCadastroDTO(
    val nomeFantasia: String,
    val razaoSocial: String,
    val cnpj: String,
    val email: String,
    val senha: String,
    val telefone: String?,
    val cep: String,
    val rua: String,
    val numero: String,
    val bairro: String,
    val cidade: String,
    val estado: String
)