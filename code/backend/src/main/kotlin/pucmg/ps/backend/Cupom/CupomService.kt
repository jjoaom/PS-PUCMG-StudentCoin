package pucmg.ps.backend.Cupom

import org.springframework.stereotype.Service
import pucmg.ps.backend.Aluno.AlunoDao
import pucmg.ps.backend.Vantagem.VantagemDAO
import pucmg.ps.backend.Moeda.CarteiraEntity
import pucmg.ps.backend.Moeda.MovimentacaoMoedaEntity
import pucmg.ps.backend.Moeda.MovimentacaoMoedaRepository
import pucmg.ps.backend.shared.enums.TipoMovimentacao
import pucmg.ps.backend.shared.events.ResgateProducer
import pucmg.ps.backend.shared.events.ResgateVantagemEvent
import pucmg.ps.backend.shared.qrcode.QRCodeService
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import org.springframework.transaction.annotation.Transactional

@Service
class CupomService(
    private val cupomDAO: CupomDAO,
    private val vantagemDAO: VantagemDAO,
    private val alunoDao: AlunoDao,
    private val movimentacaoRepository: MovimentacaoMoedaRepository,
    private val resgateProducer: ResgateProducer,
    private val qrCodeService: QRCodeService
) {

    /**
     * Gera um cupom quando o aluno resgata uma vantagem
     * Debita as moedas da carteira do aluno
     */
    @Transactional
    fun gerarCupom(alunoId: Long, vantagemId: Long): CupomDTO {
        // Busca aluno e vantagem
        val aluno = alunoDao.findById(alunoId)
        val vantagem = vantagemDAO.findById(vantagemId)

        // Valida vantagem ativa
        if (!vantagem.ativa) {
            throw IllegalStateException("Esta vantagem não está disponível no momento")
        }

        // Valida saldo
        val carteira = aluno.carteira
        if (carteira.saldo < vantagem.custoMoedas) {
            throw IllegalArgumentException(
                "Saldo insuficiente. Você tem ${carteira.saldo} moedas, " +
                "mas precisa de ${vantagem.custoMoedas} moedas"
            )
        }

        // Debita moedas
        carteira.saldo -= vantagem.custoMoedas

        // Registra movimentação
        val movimentacao = MovimentacaoMoedaEntity(
            valor = vantagem.custoMoedas,
            tipo = TipoMovimentacao.RESGATE,
            descricao = "Resgate de vantagem: ${vantagem.descricao} - ${vantagem.empresa.nomeFantasia}",
            carteira = carteira
        )
        movimentacaoRepository.save(movimentacao)

        // Gera cupom
        val cupom = CupomEntity.gerar(aluno, vantagem)
        val cupomSalvo = cupomDAO.save(cupom)

        val formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy").withZone(ZoneId.of("America/Sao_Paulo"))

        val qrCodeBase64 = qrCodeService.gerarBase64(cupomSalvo.codigo)

        val event = ResgateVantagemEvent(
            alunoId = aluno.id!!,
            alunoNome = aluno.name,
            alunoEmail = aluno.email,
            vantagemDescricao = vantagem.descricao,
            custoMoedas = vantagem.custoMoedas,
            nomeEmpresa = vantagem.empresa.nomeFantasia,
            codigoCupom = cupomSalvo.codigo,
            dataValidade = formatter.format(cupomSalvo.dataValidade),
            qrCodeBase64 = qrCodeBase64
        )

        resgateProducer.publicar(event)

        return cupomSalvo.toDTO()
    }

    /**
     * Busca um cupom por ID
     */
    fun buscarPorId(id: Long): CupomDTO {
        return cupomDAO.findById(id).toDTO()
    }

    /**
     * Busca um cupom por código
     */
    fun buscarPorCodigo(codigo: String): CupomDTO {
        return cupomDAO.findByCodigo(codigo).toDTO()
    }

    /**
     * Lista todos os cupons de um aluno
     */
    fun listarCuponsAluno(alunoId: Long): List<CupomDTO> {
        return cupomDAO.findByAlunoId(alunoId)
            .map { it.toDTO() }
    }

    /**
     * Lista cupons não utilizados de um aluno
     */
    fun listarCuponsAlunoNaoUtilizados(alunoId: Long): List<CupomDTO> {
        return cupomDAO.findByAlunoIdAndUtilizado(alunoId, false)
            .filter { it.isValido() }
            .map { it.toDTO() }
    }

    /**
     * Lista cupons utilizados de um aluno
     */
    fun listarCuponsAlunoUtilizados(alunoId: Long): List<CupomDTO> {
        return cupomDAO.findByAlunoIdAndUtilizado(alunoId, true)
            .map { it.toDTO() }
    }

    /**
     * Utiliza um cupom (marca como usado)
     */
    fun usarCupom(codigo: String): CupomResgatoDTO {
        val cupom = cupomDAO.findByCodigo(codigo)

        // Valida cupom
        if (cupom.utilizado) {
            throw IllegalStateException("Este cupom já foi utilizado")
        }

        if (Instant.now().isAfter(cupom.dataValidade)) {
            throw IllegalStateException("Este cupom expirou")
        }

        // Marca como utilizado
        cupom.usar()
        cupomDAO.save(cupom)

        return cupom.toResgatoDTO()
    }

    /**
     * Verifica validade de um cupom
     */
    fun verificarValidade(codigo: String): Map<String, Any> {
        val cupom = cupomDAO.findByCodigo(codigo)

        return mapOf(
            "codigo" to cupom.codigo,
            "valido" to cupom.isValido(),
            "utilizado" to cupom.utilizado,
            "dataValidade" to cupom.dataValidade,
            "dataUtilizacao" to (cupom.dataUtilizacao ?: "Não utilizado")
        )
    }

    /**
     * Lista cupons por vantagem (para relatório da empresa)
     */
    fun listarCuponsPorVantagem(vantagemId: Long): List<CupomDTO> {
        return cupomDAO.findByVantagemId(vantagemId)
            .map { it.toDTO() }
    }

    /**
     * Deleta um cupom
     */
    fun deletar(id: Long) {
        cupomDAO.deletarPorId(id)
    }
}
