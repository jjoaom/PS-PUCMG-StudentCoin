package pucmg.ps.backend.features.auth.refreshToken

import org.springframework.stereotype.Repository
import org.springframework.data.jpa.repository.JpaRepository
import pucmg.ps.backend.features.auth.user.UserEntity

@Repository
interface RefreshTokenRepository: JpaRepository<RefreshTokenEntity, Long>  {

    fun findByTokenHash(tokenHash: String): RefreshTokenEntity?
    fun deleteByTokenHash(tokenHash: String)
    fun deleteAllByUserId(user: UserEntity)

}
