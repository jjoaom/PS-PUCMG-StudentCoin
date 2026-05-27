package pucmg.ps.backend.features.auth

import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import pucmg.ps.backend.features.auth.jwt.JwtService
import pucmg.ps.backend.features.auth.user.UserDao
import pucmg.ps.backend.features.auth.refreshToken.RefreshTokenDao
import pucmg.ps.backend.features.auth.refreshToken.RefreshTokenEntity
import pucmg.ps.backend.features.auth.refreshToken.RefreshTokenNotFoundException
import java.security.MessageDigest
import java.time.Instant
import java.util.Base64
import org.springframework.transaction.annotation.Transactional

@Service
class AuthService(
    private val authenticationManager: AuthenticationManager,
    private val jwtService: JwtService,
    private val userDao: UserDao,
    private val refreshTokenDao: RefreshTokenDao
) {

    fun login(request: LoginRequest): Pair<AuthResponse, String> {

        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(
                request.email,
                request.password
            )
        )

        val user = userDao.findByEmail(request.email)

        val permissions = user.permissions
            .map { it.name }
            .toSet()

        val accessToken =
            jwtService.generateToken(user.email, permissions)

        // CORRIGIDO
        val rawRefreshToken =
            jwtService.generateRefreshToken(user.email, permissions)

        val refreshToken = RefreshTokenEntity(
            tokenHash = hash(rawRefreshToken),
            expiresAt = Instant.now().plusSeconds(7 * 24 * 60 * 60),
            user = user
        )

        refreshTokenDao.save(refreshToken)

        val response = AuthResponse(
            accessToken = accessToken,
            user = user.toResponse()
        )

        return Pair(response, rawRefreshToken)
    }

    @Transactional
    fun refresh(rawRefreshToken: String): Pair<AuthResponse, String> {

        val stored =
            refreshTokenDao.findByTokenHash(hash(rawRefreshToken))

        if (refreshTokenDao.isExpired(stored)) {
            throw RefreshTokenNotFoundException()
        }

        refreshTokenDao.deleteByTokenHash(stored.tokenHash)

        val user = stored.user

        val permissions = user.permissions
            .map { it.name }
            .toSet()

        val newAccessToken =
            jwtService.generateToken(user.email, permissions)

        val newRefreshToken =
            jwtService.generateRefreshToken(user.email, permissions)

        val refreshToken = RefreshTokenEntity(
            tokenHash = hash(newRefreshToken),
            expiresAt = Instant.now().plusSeconds(7 * 24 * 60 * 60),
            user = user
        )

        refreshTokenDao.save(refreshToken)

        val response = AuthResponse(
            accessToken = newAccessToken,
            user = user.toResponse()
        )

        return Pair(response, newRefreshToken)
    }

    @Transactional
    fun logout(rawRefreshToken: String) {
        refreshTokenDao.deleteByTokenHash(hash(rawRefreshToken))
    }

    fun me(currentUser: UserDetails): MeResponse =
        userDao.findByEmail(currentUser.username).toMeResponse()

    fun meByEmail(email: String): MeResponse =
        userDao.findByEmail(email).toMeResponse()

    fun extractUsername(token: String): String =
        jwtService.extractUsername(token)

    private fun hash(token: String): String {
        val digest = MessageDigest.getInstance("SHA-256")
        val bytes = digest.digest(token.toByteArray())
        return Base64.getEncoder().encodeToString(bytes)
    }
}