package pucmg.ps.backend.Aluno

import jakarta.persistence.*
import pucmg.ps.backend.features.auth.user.UserEntity

@Entity
@Table(name = "alunos")
class Aluno(
    name: String = "",
    email: String = "",
    password: String = "",

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
) : UserEntity(name = name, email = email, password = password)