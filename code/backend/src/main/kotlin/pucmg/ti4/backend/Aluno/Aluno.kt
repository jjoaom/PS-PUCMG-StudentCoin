package pucmg.ti4.backend.Aluno

import jakarta.persistence.*

@Entity
@Table(name = "alunos")
data class Aluno(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    var nome: String,

    @Column(unique = true)
    var email: String,

    var senha: String,

    @Column(unique = true)
    var cpf: String,

    var rg: String,

    var telefone: String? = null,

    var cep: String,

    var rua: String,

    var numero: String,

    var bairro: String,

    var cidade: String,

    var estado: String,

    var curso: String,

    var instituicaoId: Long,

    var saldoMoedas: Int = 0
)