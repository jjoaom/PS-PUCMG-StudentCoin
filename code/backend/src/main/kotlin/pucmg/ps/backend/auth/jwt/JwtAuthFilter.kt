package pucmg.ps.backend.features.auth.jwt

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import pucmg.ps.backend.features.auth.CustomUserDetailsService


@Component
class JwtAuthFilter(
    private val jwtService: JwtService,
    private val userDetailsService: CustomUserDetailsService
) : OncePerRequestFilter() {

    companion object {
        private val log: Logger = LoggerFactory.getLogger(JwtAuthFilter::class.java)
    }

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val token = extractToken(request)
        if (token != null) {
            val shouldContinue = processAuthentication(token, request, response)
            if (!shouldContinue) return
        }
        filterChain.doFilter(request, response)
    }

    private fun processAuthentication(
        token: String,
        request: HttpServletRequest,
        response: HttpServletResponse
    ): Boolean {
        return try {
            val username = jwtService.extractUsername(token)
            if (SecurityContextHolder.getContext().authentication != null) return true
            val userDetails = userDetailsService.loadUserByUsername(username)
            if (!userDetails.isEnabled) {
                respondUserDisabled(username, response)
                return false
            }
            authenticateIfValid(token, userDetails, request)
            true
        } catch (e: Exception) {
            log.debug("Token JWT inválido ou expirado: {}", e.message)
            log.error("Erro ao processar autenticação JWT", e)
            true
        }
    }

    private fun extractToken(request: HttpServletRequest): String? {
        val authHeader = request.getHeader("Authorization")
        return if (authHeader != null && authHeader.startsWith("Bearer ")) {
            authHeader.substring(7)
        } else null
    }

    private fun respondUserDisabled(username: String?, response: HttpServletResponse) {
        response.status = HttpServletResponse.SC_FORBIDDEN
        response.contentType = "application/json"
        response.writer.write("{\"error\": \"Usuário desativado\"}")
    }

    private fun authenticateIfValid(
        token: String,
        userDetails: UserDetails,
        request: HttpServletRequest
    ) {
        if (!jwtService.isTokenValid(token, userDetails)) {
            log.debug("Token JWT não válido para usuário {}", userDetails.username)
            return
        }
        val authToken = UsernamePasswordAuthenticationToken(
            userDetails,
            null,
            userDetails.authorities
        )
        authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
        SecurityContextHolder.getContext().authentication = authToken
    }
}