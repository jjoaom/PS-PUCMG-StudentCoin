package pucmg.ps.backend.Professor

import jakarta.persistence.*
import pucmg.ps.backend.features.auth.user.UserEntity

@Entity
@Table(name = "professor")
class Professor(
    name: String = "",
    email: String = "",
    password: String = "",

    @Column(unique = true)
    var cpf: String = "",

    var departamento: String = "",

    var saldoMoedas: Int = 0
) : UserEntity(name = name, email = email, password = password)