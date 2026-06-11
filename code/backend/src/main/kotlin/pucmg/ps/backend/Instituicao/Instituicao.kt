package pucmg.ps.backend.Instituicao

import jakarta.persistence.*

@Entity
@Table(name = "instituicoes")
data class Instituicao(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false)
    var nome: String = "",

    @Column(unique = true)
    var cnpj: String? = null,

    var endereco: String? = null
)
