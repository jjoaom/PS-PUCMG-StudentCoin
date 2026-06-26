package pucmg.ps.backend.features.auth.user

import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import pucmg.ps.backend.features.auth.CreateUserRequest
import pucmg.ps.backend.features.auth.permission.PermissionDAO
import pucmg.ps.backend.features.auth.UpdateUserRequest
import pucmg.ps.backend.features.auth.UserResponse
import pucmg.ps.backend.features.auth.toResponse

@Service
class UserService (
    private val userDao: UserDao,
    private val permissionDao: PermissionDAO,
    private val passwordEncoder: PasswordEncoder
) {
    fun create(request: CreateUserRequest): UserResponse {
        if (userDao.existsByEmail(request.email))
            throw EmailAlreadyInUseException(request.email)
        val permissions = if (request.permissions.isNotEmpty())
            permissionDao.findByNames(request.permissions)
        else emptySet()

        val user = UserEntity(
            name = request.name,
            email = request.email,
            password = passwordEncoder.encode(request.password).toString(),
            permissions = permissions.toMutableSet()
        )
        return userDao.save(user).toResponse()
    }
    fun findById(id: Long): UserResponse = userDao.findById(id).toResponse()

    fun findByEmail(email: String): UserResponse = userDao.findByEmail(email).toResponse()
    fun update(id: Long, currentUser: UserDetails, request: UpdateUserRequest): UserResponse {
        val user = userDao.findById(id)

        request.name?.let { user.name = it }
        request.active?.let { user.active = it }

        request.email?.let {
            if (it != user.email && userDao.existsByEmail(it))
                throw EmailAlreadyInUseException(it)
            user.email = it
        }

        request.password?.let {
            user.password = passwordEncoder.encode(it).toString()
        }

        request.permissions?.let {
            user.permissions = permissionDao.findByNames(it).toMutableSet()
        }

        return userDao.save(user).toResponse()
    }

    fun delete(id: Long) =
        userDao.deleteById(id)
}


class EmailAlreadyInUseException(email: String)
    : RuntimeException("Email already in use: $email")