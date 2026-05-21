package pucmg.ps.backend.Moeda

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*

@Entity
@Table(name = "carteiras")
class CarteiraEntity(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    var saldo: Int = 0,

    @OneToMany(
        mappedBy = "carteira",
        cascade = [CascadeType.ALL],
        orphanRemoval = true
    )
    @JsonIgnore
    val movimentacoes: MutableList<MovimentacaoMoedaEntity> = mutableListOf()
)