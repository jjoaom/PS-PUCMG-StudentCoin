package pucmg.ps.backend.Vantagem

import jakarta.persistence.*
import pucmg.ps.backend.Empresa.Empresa
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.Instant

@Entity
@Table(name = "vantagens")
class VantagemEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false)
    var descricao: String,

    @Column(nullable = false)
    var custoMoedas: Int,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    var empresa: Empresa,

    @Column(nullable = false)
    var ativa: Boolean = true,

    @Column(length = 1000)
    var detalhes: String? = null,

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    var criadoEm: Instant? = null,

    @UpdateTimestamp
    @Column(nullable = false)
    var atualizadoEm: Instant? = null
) {
    fun desativar() {
        this.ativa = false
    }

    fun ativar() {
        this.ativa = true
    }
}
