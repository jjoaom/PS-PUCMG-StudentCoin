package pucmg.ps.backend.features.auth

import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*
import pucmg.ps.backend.features.auth.refreshToken.RefreshTokenNotFoundException

@RestController
@RequestMapping("/auth")
class AuthController(
    private val authService: AuthService,
    @Value("\${cookie.secure}") private val isSecure: Boolean
) {

    companion object {
        private const val REFRESH_COOKIE = "refresh_token"
        private const val REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60
    }

    @PostMapping("/login")
    fun login(
        @RequestBody request: LoginRequest,
        response: HttpServletResponse
    ): ResponseEntity<AuthResponse> {
        val (authResponse, rawRefreshToken) = authService.login(request)
        setRefreshCookie(response, rawRefreshToken)
        return ResponseEntity.ok(authResponse)
    }

    @PostMapping("/refresh")
    fun refresh(
        request: HttpServletRequest,
        response: HttpServletResponse
    ): ResponseEntity<AuthResponse> {
        return try {
            val rawRefreshToken = extractRefreshCookie(request)
            val (authResponse, newRawRefreshToken) = authService.refresh(rawRefreshToken)
            setRefreshCookie(response, newRawRefreshToken)
            ResponseEntity.ok(authResponse)
        } catch (e: RefreshTokenNotFoundException) {
            ResponseEntity.status(401).build()
        }
    }

    @PostMapping("/logout")
    fun logout(
        request: HttpServletRequest,
        response: HttpServletResponse
    ): ResponseEntity<Void> {
        return try {
            val rawRefreshToken = extractRefreshCookie(request)
            authService.logout(rawRefreshToken)
            clearRefreshCookie(response)
            ResponseEntity.noContent().build()
        } catch (e: RefreshTokenNotFoundException) {
            clearRefreshCookie(response)
            ResponseEntity.noContent().build()
        }
    }

    @GetMapping("/me")
    fun me(
        request: HttpServletRequest,
        @AuthenticationPrincipal currentUser: UserDetails?
    ): ResponseEntity<MeResponse> {
        if (currentUser != null) {
            return ResponseEntity.ok(authService.me(currentUser))
        }

        val authHeader = request.getHeader("Authorization")
        val bearerToken = authHeader?.takeIf { it.startsWith("Bearer ") }?.substring(7)
            ?: return ResponseEntity.status(401).build()

        return try {
            val username = authService.extractUsername(bearerToken)
            ResponseEntity.ok(authService.meByEmail(username))
        } catch (_: Exception) {
            ResponseEntity.status(401).build()
        }
    }

    private fun setRefreshCookie(response: HttpServletResponse, token: String) {
        val cookie = Cookie(REFRESH_COOKIE, token).apply {
            isHttpOnly = true
            secure = isSecure
            // use root path so cookie is sent even when frontend proxies under /api
            // (dev proxy often maps /api -> backend). In production you may
            // scope this more tightly if desired.
            path = "/"
            maxAge = REFRESH_TOKEN_MAX_AGE
        }
        response.addCookie(cookie)
    }

    private fun clearRefreshCookie(response: HttpServletResponse) {
        val cookie = Cookie(REFRESH_COOKIE, "").apply {
            isHttpOnly = true
            secure = isSecure
            path = "/"
            maxAge = 0
        }
        response.addCookie(cookie)
    }

    private fun extractRefreshCookie(request: HttpServletRequest): String =
        request.cookies
            ?.firstOrNull { it.name == REFRESH_COOKIE }
            ?.value
            ?: throw RefreshTokenNotFoundException()
}