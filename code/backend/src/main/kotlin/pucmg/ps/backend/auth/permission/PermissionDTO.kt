package pucmg.ps.backend.features.auth.permission

fun Permissions.toResponse() = PermissionResponse(
    name = name,
    description = description
)