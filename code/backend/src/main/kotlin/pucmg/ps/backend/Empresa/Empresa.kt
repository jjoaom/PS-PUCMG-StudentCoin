package pucmg.ps.backend.Empresa

import jakarta.persistence.*

@Entity
@Table(name = "empresas")
data class Empresa(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    var nomeFantasia: String,

    var razaoSocial: String,

    @Column(unique = true)
    var cnpj: String,

    @Column(unique = true)
    var email: String,

    var senha: String,

    var telefone: String? = null,

    var cep: String,
    var rua: String,
    var numero: String,
    var bairro: String,
    var cidade: String,
    var estado: String
)