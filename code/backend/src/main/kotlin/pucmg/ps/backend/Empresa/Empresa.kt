package pucmg.ps.backend.Empresa

import jakarta.persistence.*
import pucmg.ps.backend.features.auth.user.UserEntity

@Entity
@Table(name = "empresas")
class Empresa(
    name: String = "",
    email: String = "",
    password: String = "",

    var nomeFantasia: String,

    var razaoSocial: String,

    @Column(unique = true)
    var cnpj: String,

    var telefone: String? = null,

    var cep: String,
    var rua: String,
    var numero: String,
    var bairro: String,
    var cidade: String,
    var estado: String
) : UserEntity(name = name, email = email, password = password)