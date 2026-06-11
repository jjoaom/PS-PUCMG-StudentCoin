package pucmg.ps.backend.Aluno

import jakarta.persistence.*
import pucmg.ps.backend.features.auth.user.UserEntity
import pucmg.ps.backend.Instituicao.Instituicao
import pucmg.ps.backend.Moeda.CarteiraEntity

@Entity
@Table(name = "alunos")
open class Aluno(

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instituicao_id")
    var instituicao: Instituicao,

    @OneToOne(
        cascade = [CascadeType.ALL],
        fetch = FetchType.LAZY
    )
    @JoinColumn(name = "carteira_id")
    var carteira: CarteiraEntity = CarteiraEntity()

) : UserEntity(name = name, email = email, password = password)