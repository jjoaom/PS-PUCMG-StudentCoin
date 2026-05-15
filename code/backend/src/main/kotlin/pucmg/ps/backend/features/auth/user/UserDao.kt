package pucmg.ps.backend.features.auth.user

import org.springframework.stereotype.Component

@Component
class UserDao(private val repository: UserRepository) {
    fun save(user: UserEntity): UserEntity = repository.save(user)

    fun findByEmail(email: String): UserEntity =
        repository.findByEmail(email) ?: throw UserNotFoundException(email)

    fun findById(id: Long): UserEntity =
        repository.findById(id).orElseThrow { UserNotFoundException(id) }
    fun existsByEmail(email: String): Boolean = repository.existsByEmail(email)

    fun deleteById(id: Long) {
        if (!repository.existsById(id)) throw UserNotFoundException(id)
        repository.deleteById(id)
    }
}

class UserNotFoundException : RuntimeException {
    constructor(email: String) : super("User not found: $email")
    constructor(id: Long) : super("User not found: id=$id")
}