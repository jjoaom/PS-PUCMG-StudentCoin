package pucmg.ps.backend.Moeda

import org.springframework.stereotype.Repository
import pucmg.ps.backend.Moeda.CarteiraEntity
import org.springframework.data.jpa.repository.JpaRepository

@Repository
interface CarteiraRepository : JpaRepository<CarteiraEntity, Long> {

}