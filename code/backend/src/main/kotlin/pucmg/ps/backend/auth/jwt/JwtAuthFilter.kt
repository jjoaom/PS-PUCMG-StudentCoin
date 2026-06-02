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
            try {
                val username = jwtService.extractUsername(token)

                val authentication = SecurityContextHolder.getContext().authentication
                if (authentication == null) {

                    val userDetails = userDetailsService.loadUserByUsername(username)

                    if (jwtService.isTokenValid(token, userDetails)) {
                        authenticate(userDetails, request)
                        println("JWT AUTH: ${userDetails.authorities}")
                    }
                }

            } catch (e: Exception) {
                log.error("JWT inválido ou expirado", e)
                SecurityContextHolder.clearContext()
            }
        }

        filterChain.doFilter(request, response)
    }

    private fun authenticate(
        userDetails: UserDetails,
        request: HttpServletRequest
    ) {
        val authToken = UsernamePasswordAuthenticationToken(
            userDetails,
            null,
            userDetails.authorities
        )

        authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
        SecurityContextHolder.getContext().authentication = authToken
    }

    private fun extractToken(request: HttpServletRequest): String? {
        val header = request.getHeader("Authorization")
        return if (header != null && header.startsWith("Bearer ")) {
            header.substring(7)
        } else null
    }
}