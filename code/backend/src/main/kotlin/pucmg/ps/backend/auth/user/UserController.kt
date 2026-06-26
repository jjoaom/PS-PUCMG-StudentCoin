package pucmg.ps.backend.features.auth.user

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*
import pucmg.ps.backend.features.auth.CreateUserRequest
import pucmg.ps.backend.features.auth.UpdateUserRequest
import pucmg.ps.backend.features.auth.UserResponse

@RestController
@RequestMapping("/users")
class UserController(private val userService: UserService) {
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    fun create(@RequestBody request: CreateUserRequest): ResponseEntity<UserResponse> =
        ResponseEntity.status(HttpStatus.CREATED).body(userService.create(request))

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    fun findById(@PathVariable id: Long): ResponseEntity<UserResponse> = ResponseEntity.ok(userService.findById(id))

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isSelf(authentication, #id)")
    fun update(
        @PathVariable id: Long,
        @RequestBody request: UpdateUserRequest,
        @AuthenticationPrincipal currentUser: UserDetails
    ): ResponseEntity<UserResponse> =
        ResponseEntity.ok(userService.update(id, currentUser, request))

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        userService.delete(id)
        return ResponseEntity.noContent().build()
    }

}