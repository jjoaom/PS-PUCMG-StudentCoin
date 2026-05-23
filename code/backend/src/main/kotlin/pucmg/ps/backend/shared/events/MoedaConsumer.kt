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
import pucmg.ps.backend.shared.events.EnviarMoedasEvent

@Service
class MoedaConsumer(
    private val professorRepository: ProfessorRepository,
    private val alunoRepository: AlunoRepository,
    private val movimentacaoRepository: MovimentacaoMoedaRepository
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

        val debito = MovimentacaoMoedaEntity(
            valor = event.quantidade,
            descricao = event.descricao ?: "Envio de moedas",
            tipo = TipoMovimentacao.DEBITO,
            carteira = professor.carteira
        )

        val credito = MovimentacaoMoedaEntity(
            valor = event.quantidade,
            descricao = event.descricao ?: "Recebimento de moedas",
            tipo = TipoMovimentacao.CREDITO,
            carteira = aluno.carteira
        )

        movimentacaoRepository.save(debito)
        movimentacaoRepository.save(credito)

        alunoRepository.save(aluno)
        professorRepository.save(professor)
    }
}