package pucmg.ps.backend.features.auth.permission

import org.springframework.stereotype.Component
@Component

class PermissionDAO(private val repository: PermissionRepository) {
    fun findByNames(names: Set<String>): Set<PermissionEntity> {
        val found = repository.findByNameIn(names)
        val foundNames = found.map { it.name }.toSet()
        val missing = names - foundNames
        if (missing.isNotEmpty()) throw PermissionNotFoundException(missing)
        return found
    }
    fun findByName(name: String): PermissionEntity? {
    return repository.findByNameIn(setOf(name)).firstOrNull()
}
}

class PermissionNotFoundException(names: Set<String>)
    : RuntimeException("Permissions not found: ${names.joinToString()}")