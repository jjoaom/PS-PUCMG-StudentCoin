package pucmg.ps.backend.features.auth.refreshToken

import org.springframework.stereotype.Component
import pucmg.ps.backend.features.auth.user.UserEntity
import java.time.Instant

@Component
class RefreshTokenDao(private val repository: RefreshTokenRepository) {
    fun save(refreshToken: RefreshTokenEntity): RefreshTokenEntity = repository.save(refreshToken)
    fun findByTokenHash(tokenHash: String): RefreshTokenEntity = repository.findByTokenHash(tokenHash) ?: throw RefreshTokenNotFoundException()
    fun deleteByTokenHash(tokenHash: String) = repository.deleteByTokenHash(tokenHash)
    fun deleteAllByUserId(user: UserEntity) = repository.deleteAllByUserId(user)
    fun isExpired(refreshToken: RefreshTokenEntity): Boolean = refreshToken.expiresAt.isBefore(Instant.now())
}

class RefreshTokenNotFoundException : RuntimeException("Refresh token inválido ou expirado")