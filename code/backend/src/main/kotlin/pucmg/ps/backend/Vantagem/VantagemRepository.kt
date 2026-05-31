package pucmg.ps.backend.Vantagem

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface VantagemRepository : JpaRepository<VantagemEntity, Long> {
    fun findByEmpresaId(empresaId: Long): List<VantagemEntity>
    fun findByEmpresaIdAndAtiva(empresaId: Long, ativa: Boolean): List<VantagemEntity>
    fun findAllByAtiva(ativa: Boolean): List<VantagemEntity>
}
