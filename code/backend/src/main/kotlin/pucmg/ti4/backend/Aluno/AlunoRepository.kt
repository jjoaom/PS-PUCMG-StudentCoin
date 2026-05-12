package pucmg.ti4.backend.Aluno

import org.springframework.data.jpa.repository.JpaRepository

interface AlunoRepository : JpaRepository<Aluno, Long> {

    fun findByEmail(email: String): Aluno?

    fun existsByEmail(email: String): Boolean

    fun existsByCpf(cpf: String): Boolean
}