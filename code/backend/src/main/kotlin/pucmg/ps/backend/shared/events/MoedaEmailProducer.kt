package pucmg.ps.backend.shared.events

import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.stereotype.Service
import pucmg.ps.backend.shared.config.RabbitConfig

@Service
class MoedaEmailProducer(
    private val rabbitTemplate: RabbitTemplate
) {

    fun publicar(event: MoedaRecebidaEvent) {
        rabbitTemplate.convertAndSend(
            RabbitConfig.MOEDA_EMAIL_EXCHANGE,
            RabbitConfig.MOEDA_EMAIL_ROUTING_KEY,
            event
        )
    }
}