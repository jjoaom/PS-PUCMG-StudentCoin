package pucmg.ti4.backend.features.auth.permission

import org.springframework.stereotype.Service
import org.slf4j.LoggerFactory

@Service
class PermissionService {

    private val log = LoggerFactory.getLogger(PermissionService::class.java)

    fun getAll(): List<PermissionResponse> {
        log.debug("PermissionService.getAll called")
        return enumValues<Permissions>().map { it.toResponse() }
    }
    fun findByName(name: String): PermissionResponse {
        log.debug("PermissionService.findByName called for {}", name)
        return Permissions.valueOf(name).toResponse()
    }
}