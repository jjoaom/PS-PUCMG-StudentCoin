package pucmg.ps.backend.Empresa

import jakarta.persistence.*
import pucmg.ps.backend.features.auth.user.UserEntity
import pucmg.ps.backend.Vantagem.VantagemEntity

@Entity
@Table(name = "empresas")
open class Empresa(
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
) : UserEntity(name = name, email = email, password = password) {
    
    @OneToMany(
        mappedBy = "empresa",
        cascade = [CascadeType.REMOVE],
        fetch = FetchType.LAZY
    )
    var vantagens: MutableList<VantagemEntity> = mutableListOf()
}