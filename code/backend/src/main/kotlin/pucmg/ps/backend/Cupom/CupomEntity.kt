package pucmg.ps.backend.Cupom

import jakarta.persistence.*
import pucmg.ps.backend.Aluno.Aluno
import pucmg.ps.backend.Vantagem.VantagemEntity
import org.hibernate.annotations.CreationTimestamp
import java.time.Instant
import java.util.*

@Entity
@Table(name = "cupons")
class CupomEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false, unique = true)
    var codigo: String,

    @Column(nullable = false)
    var dataEmissao: Instant,

    @Column(nullable = false)
    var dataValidade: Instant,

    @Column(nullable = false)
    var utilizado: Boolean = false,

    @Column
    var dataUtilizacao: Instant? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aluno_id", nullable = false)
    var aluno: Aluno,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vantagem_id", nullable = false)
    var vantagem: VantagemEntity,

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    var criadoEm: Instant? = null
) {
    fun usar(): Boolean {
        if (utilizado) {
            throw IllegalStateException("Este cupom já foi utilizado em $dataUtilizacao")
        }

        if (Instant.now().isAfter(dataValidade)) {
            throw IllegalStateException("Este cupom expirou em $dataValidade")
        }

        this.utilizado = true
        this.dataUtilizacao = Instant.now()
        return true
    }

    fun isValido(): Boolean {
        return !utilizado && Instant.now().isBefore(dataValidade)
    }

    companion object {
        fun gerar(aluno: Aluno, vantagem: VantagemEntity, diasValidade: Long = 30): CupomEntity {
            val agora = Instant.now()
            val dataValidade = agora.plusSeconds(diasValidade * 24 * 3600)
            val codigo = gerarCodigo()

            return CupomEntity(
                codigo = codigo,
                dataEmissao = agora,
                dataValidade = dataValidade,
                aluno = aluno,
                vantagem = vantagem
            )
        }

        private fun gerarCodigo(): String {
            return "CUPOM-${UUID.randomUUID().toString().substring(0, 8).uppercase()}-${System.currentTimeMillis() % 100000}"
        }
    }
}
