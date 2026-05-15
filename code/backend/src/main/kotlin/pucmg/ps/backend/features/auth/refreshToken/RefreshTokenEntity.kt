package pucmg.ps.backend.features.auth.refreshToken

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import pucmg.ps.backend.features.auth.user.UserEntity
import java.time.Instant

@Entity
@Table(name = "refresh_tokens")
class RefreshTokenEntity(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false, unique = true)
    var tokenHash: String,

    @Column(nullable = false)
    var expiresAt: Instant,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    var user: UserEntity,

    @Column(nullable = true)
    var deviceInfo: String? = null
)