package pucmg.ps.backend.Professor

import org.springframework.data.jpa.repository.JpaRepository

interface ProfessorRepository : JpaRepository<Professor, Long> {

    fun findByEmail(email: String): Professor?

    fun existsByEmail(email: String): Boolean

    fun existsByCpf(cpf: String): Boolean
}