package pucmg.ps.backend.features.auth.permission

import org.springframework.stereotype.Repository
import org.springframework.data.jpa.repository.JpaRepository

@Repository
interface PermissionRepository : JpaRepository<PermissionEntity, Long> {
    fun findByNameIn(names: Set<String>): Set<PermissionEntity>
}