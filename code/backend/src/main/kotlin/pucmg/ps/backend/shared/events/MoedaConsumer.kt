package pucmg.ps.backend.shared.events

import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import pucmg.ps.backend.Aluno.AlunoRepository
import pucmg.ps.backend.Moeda.MovimentacaoMoedaEntity
import pucmg.ps.backend.Moeda.MovimentacaoMoedaRepository
import pucmg.ps.backend.Professor.ProfessorRepository
import pucmg.ps.backend.shared.config.RabbitConfig
import pucmg.ps.backend.shared.enums.TipoMovimentacao

@Service
class MoedaConsumer(
    private val professorRepository: ProfessorRepository,
    private val alunoRepository: AlunoRepository,
    private val movimentacaoRepository: MovimentacaoMoedaRepository,
    private val moedaEmailProducer: MoedaEmailProducer
) {

    @RabbitListener(queues = [RabbitConfig.MOEDA_QUEUE])
    @Transactional
    fun consumir(event: EnviarMoedasEvent) {
        val professor = professorRepository.findById(event.professorId)
            .orElseThrow { RuntimeException("Professor não encontrado") }

        val aluno = alunoRepository.findById(event.alunoId)
            .orElseThrow { RuntimeException("Aluno não encontrado") }

        if (event.quantidade <= 0) {
            throw RuntimeException("Quantidade inválida")
        }

        if (professor.carteira.saldo < event.quantidade) {
            throw RuntimeException("Saldo insuficiente")
        }

        professor.carteira.saldo -= event.quantidade
        aluno.carteira.saldo += event.quantidade

        val motivo = event.descricao.ifBlank {
            "Sem motivo informado"
        }

        val movimentacaoProfessor = MovimentacaoMoedaEntity(
            valor = event.quantidade,
            tipo = TipoMovimentacao.DEBITO,
            descricao = "Envio para ${aluno.name}: $motivo",
            carteira = professor.carteira
        )

        val movimentacaoAluno = MovimentacaoMoedaEntity(
            valor = event.quantidade,
            tipo = TipoMovimentacao.CREDITO,
            descricao = "Recebido de ${professor.name}: $motivo",
            carteira = aluno.carteira
        )

        movimentacaoRepository.save(movimentacaoProfessor)
        movimentacaoRepository.save(movimentacaoAluno)

        alunoRepository.save(aluno)
        professorRepository.save(professor)

        val moedaRecebidaEvent = MoedaRecebidaEvent(
            alunoId = aluno.id!!,
            alunoNome = aluno.name,
            alunoEmail = aluno.email,
            professorNome = professor.name,
            quantidadeMoedas = event.quantidade,
            descricao = motivo
        )

        moedaEmailProducer.publicar(moedaRecebidaEvent)
    }
}