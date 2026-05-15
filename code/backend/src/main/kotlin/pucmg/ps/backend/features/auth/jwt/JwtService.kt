package pucmg.ps.backend.features.auth.jwt

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import jakarta.servlet.http.HttpServletRequest
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.util.*

@Service
class JwtService {

    @Value("\${jwt.secret}")
    private lateinit var secret: String

    @Value("\${jwt.expirationMs:3600000}")
    private var expirationMs: Long = 0

    private val signingKey get() = Keys.hmacShaKeyFor(secret.toByteArray())

    fun generateToken(username: String, roles: Set<String>): String {
        val now = Date()
        return Jwts.builder()
            .subject(username)
            .claim("roles", roles)
            .issuedAt(now)
            .expiration(Date(now.time + expirationMs))
            .signWith(signingKey)
            .compact()
    }

    fun generateRefreshToken(username: String, roles: Set<String>): String {
        val now = Date()
        return Jwts.builder()
            .subject(username)
            .claim("roles", roles)
            .issuedAt(now)
            .expiration(Date(now.time + 7 * 24 * 60 * 60 * 1000))
            .signWith(signingKey)
            .compact()
    }

    fun extractUsername(token: String): String =
        extractAllClaims(token).subject

    fun isTokenValid(token: String, user: UserDetails): Boolean =
        extractUsername(token) == user.username && !isTokenExpired(token)

    private fun isTokenExpired(token: String): Boolean =
        extractAllClaims(token).expiration.before(Date())

    private fun extractAllClaims(token: String) =
        Jwts.parser()
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token)
            .payload

    fun extractTokenFromCookies(request: HttpServletRequest, cookieName: String): String? =
        request.cookies?.firstOrNull { it.name == cookieName }?.value
}