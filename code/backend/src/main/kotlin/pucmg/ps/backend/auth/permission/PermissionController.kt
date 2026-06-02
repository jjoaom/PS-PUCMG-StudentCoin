package pucmg.ps.backend.features.auth.permission

import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import org.slf4j.LoggerFactory

@RestController
@RequestMapping("/permissions")
class PermissionController(
    private val permissionService: PermissionService
) {

    private val log = LoggerFactory.getLogger(PermissionController::class.java)

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    fun getAll(): ResponseEntity<List<PermissionResponse>> {
        log.debug("GET /permissions called")
        return ResponseEntity.ok(permissionService.getAll())
    }

    @GetMapping("/{name}")
    @PreAuthorize("isAuthenticated()")
    fun findByName(
        @PathVariable name: String
    ): ResponseEntity<PermissionResponse> {
        log.debug("GET /permissions/{} called", name)
        return ResponseEntity.ok(permissionService.findByName(name))
    }
}