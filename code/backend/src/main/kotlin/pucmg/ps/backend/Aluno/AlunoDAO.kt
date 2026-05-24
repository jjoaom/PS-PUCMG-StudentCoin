package pucmg.ps.backend.Aluno

import org.springframework.stereotype.Component

@Component
class AlunoDao(
    private val repository: AlunoRepository
) {

    fun save(aluno: Aluno): Aluno =
        repository.save(aluno)

    fun findById(id: Long): Aluno =
        repository.findById(id)
            .orElseThrow { AlunoNotFoundException(id) }

    fun findByEmail(email: String): Aluno =
        repository.findByEmail(email)
            ?: throw AlunoNotFoundException(email)

    fun findAll(): List<Aluno> =
        repository.findAll()

    fun existsByEmail(email: String): Boolean =
        repository.existsByEmail(email)

    fun existsByCpf(cpf: String): Boolean =
        repository.existsByCpf(cpf)

    fun existsById(id: Long): Boolean =
        repository.existsById(id)

    fun deleteById(id: Long) {
        if (!repository.existsById(id)) {
            throw AlunoNotFoundException(id)
        }

        repository.deleteById(id)
    }
}

class AlunoNotFoundException : RuntimeException {
    constructor(id: Long) : super("Aluno não encontrado: id=$id")
    constructor(email: String) : super("Aluno não encontrado: $email")
}