package pucmg.ps.backend.shared.events

import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.stereotype.Service
import pucmg.ps.backend.shared.config.RabbitConfig

@Service
class MoedaProducer(
    private val rabbitTemplate: RabbitTemplate
) {

    fun enviar(event: EnviarMoedasEvent) {
        rabbitTemplate.convertAndSend(
            RabbitConfig.MOEDA_EXCHANGE,
            RabbitConfig.MOEDA_ROUTING_KEY,
            event
        )
    }
}