package pucmg.ps.backend.Empresa

import org.springframework.stereotype.Component

@Component
class EmpresaDao(
    private val repository: EmpresaRepository
) {
    fun save(empresa: Empresa): Empresa =
        repository.save(empresa)

    fun findById(id: Long): Empresa =
        repository.findById(id)
            .orElseThrow { EmpresaNotFoundException(id) }

    fun findByEmail(email: String): Empresa =
        repository.findByEmail(email)
            ?: throw EmpresaNotFoundException(email)

    fun existsByEmail(email: String): Boolean =
        repository.existsByEmail(email)

    fun existsByCnpj(cnpj: String): Boolean =
        repository.existsByCnpj(cnpj)

    fun deleteById(id: Long) {
        if (!repository.existsById(id)) {
            throw EmpresaNotFoundException(id)
        }
        repository.deleteById(id)
    }
}

class EmpresaNotFoundException : RuntimeException {
    constructor(email: String) : super("Empresa não encontrada: $email")
    constructor(id: Long) : super("Empresa não encontrada: id=$id")
}