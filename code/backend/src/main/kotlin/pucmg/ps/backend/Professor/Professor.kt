package pucmg.ps.backend.Professor

import jakarta.persistence.*
import pucmg.ps.backend.features.auth.user.UserEntity
import pucmg.ps.backend.Moeda.CarteiraEntity

@Entity
@Table(name = "professores")
class Professor(
    name: String = "",
    email: String = "",
    password: String = "",

    @Column(unique = true)
    var cpf: String = "",

    var departamento: String = "",

    @OneToOne(
        cascade = [CascadeType.ALL],
        fetch = FetchType.LAZY
    )
    @JoinColumn(name = "carteira_id")
    var carteira: CarteiraEntity = CarteiraEntity()

) : UserEntity(name = name, email = email, password = password)