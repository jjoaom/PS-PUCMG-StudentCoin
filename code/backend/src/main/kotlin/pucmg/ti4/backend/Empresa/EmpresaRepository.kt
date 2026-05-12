package pucmg.ti4.backend.Empresa

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface EmpresaRepository : JpaRepository<Empresa, Long> {

    fun findByEmail(email: String): Empresa?

    fun existsByEmail(email: String): Boolean

    fun existsByCnpj(cnpj: String): Boolean
}