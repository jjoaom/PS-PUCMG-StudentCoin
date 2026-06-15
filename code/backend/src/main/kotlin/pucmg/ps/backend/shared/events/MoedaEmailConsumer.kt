package pucmg.ps.backend.shared.events

import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Service
import pucmg.ps.backend.shared.config.RabbitConfig
import pucmg.ps.backend.shared.email.EmailService

@Service
class MoedaEmailConsumer(
    private val emailService: EmailService
) {

    @RabbitListener(queues = [RabbitConfig.MOEDA_EMAIL_QUEUE])
    fun consumir(event: MoedaRecebidaEvent) {
        emailService.enviarEmailMoedaRecebida(event)
    }
}