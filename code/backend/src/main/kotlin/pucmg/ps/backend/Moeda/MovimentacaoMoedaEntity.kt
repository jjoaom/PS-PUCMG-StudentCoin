package pucmg.ps.backend.Moeda

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import pucmg.ps.backend.shared.enums.TipoMovimentacao
import java.time.LocalDateTime

@Entity
@Table(name = "movimentacoes_moeda")
class MovimentacaoMoedaEntity(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    var valor: Int = 0,

    val data: LocalDateTime = LocalDateTime.now(),

    var descricao: String? = null,

    @Enumerated(EnumType.STRING)
    var tipo: TipoMovimentacao,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "carteira_id")
    @JsonIgnore
    var carteira: CarteiraEntity? = null
)