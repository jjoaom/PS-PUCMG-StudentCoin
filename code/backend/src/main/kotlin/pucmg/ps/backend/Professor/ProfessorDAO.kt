package pucmg.ps.backend.Professor

import org.springframework.stereotype.Component

@Component
class ProfessorDao(
    private val repository: ProfessorRepository
) {

    fun save(professor: Professor): Professor =
        repository.save(professor)

    fun findById(id: Long): Professor =
        repository.findById(id)
            .orElseThrow { RuntimeException("Professor não encontrado") }

    fun findByEmail(email: String): Professor =
        repository.findByEmail(email)
            ?: throw RuntimeException("Professor não encontrado")

    fun findAll(): List<Professor> =
        repository.findAll()

    fun existsByEmail(email: String): Boolean =
        repository.existsByEmail(email)

    fun existsByCpf(cpf: String): Boolean =
        repository.existsByCpf(cpf)

    fun existsById(id: Long): Boolean =
        repository.existsById(id)

    fun deleteById(id: Long) {
        if (!repository.existsById(id)) {
            throw RuntimeException("Professor não encontrado")
        }

        repository.deleteById(id)
    }
}