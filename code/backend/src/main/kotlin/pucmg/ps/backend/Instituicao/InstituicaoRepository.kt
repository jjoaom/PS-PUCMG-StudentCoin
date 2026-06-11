package pucmg.ps.backend.Instituicao

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface InstituicaoRepository : JpaRepository<Instituicao, Long>
