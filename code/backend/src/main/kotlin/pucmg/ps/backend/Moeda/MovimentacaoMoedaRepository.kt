package pucmg.ps.backend.Moeda

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MovimentacaoMoedaRepository
    : JpaRepository<MovimentacaoMoedaEntity, Long> {

    fun findByCarteiraId(carteiraId: Long): List<MovimentacaoMoedaEntity>
}