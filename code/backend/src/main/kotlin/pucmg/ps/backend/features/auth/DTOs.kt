package pucmg.ps.backend.features.auth

import pucmg.ps.backend.features.auth.user.UserEntity

//UserDTO
data class CreateUserRequest(
    val name: String,
    val email: String,
    val password: String,
    val permissions: Set<String> = emptySet()
)

data class UpdateUserRequest(
    val name: String?,
    val email: String?,
    val password: String?,
    val active: Boolean?,
    val permissions: Set<String>?
)

data class UserResponse(
    val id: Long,
    val name: String,
    val email: String,
    val active: Boolean,
    val permissions: Set<String>,
    val createdAt: String,
    val updatedAt: String
)

fun UserEntity.toResponse() = UserResponse(
    id = id!!,
    name = name,
    email = email,
    active = active,
    permissions = permissions.map { it.name }.toSet(),
    createdAt = createdAt?.toString() ?: "",
    updatedAt = updatedAt?.toString() ?: ""
)
// AuthDTO
data class LoginRequest(
    val email: String,
    val password: String
)

data class AuthResponse(
    val accessToken: String,
    val user: UserResponse
)

data class MeResponse(
    val id: Long,
    val name: String,
    val email: String,
    val permissions: Set<String>
)

fun UserEntity.toMeResponse() = MeResponse(
    id = id!!,
    name = name,
    email = email,
    permissions = permissions.map { it.name }.toSet()
)