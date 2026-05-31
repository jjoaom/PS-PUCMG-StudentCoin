package pucmg.ps.backend.Cupom

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CupomRepository : JpaRepository<CupomEntity, Long> {
    fun findByCodigo(codigo: String): CupomEntity?
    fun findByAlunoId(alunoId: Long): List<CupomEntity>
    fun findByAlunoIdAndUtilizado(alunoId: Long, utilizado: Boolean): List<CupomEntity>
    fun findByVantagemId(vantagemId: Long): List<CupomEntity>
}
