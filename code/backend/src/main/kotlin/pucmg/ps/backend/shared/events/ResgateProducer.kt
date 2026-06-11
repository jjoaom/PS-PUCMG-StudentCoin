package pucmg.ps.backend.shared.events

import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.stereotype.Service
import pucmg.ps.backend.shared.config.RabbitConfig

@Service
class ResgateProducer(
    private val rabbitTemplate: RabbitTemplate
) {

    fun publicar(event: ResgateVantagemEvent) {
        rabbitTemplate.convertAndSend(
            RabbitConfig.RESGATE_EXCHANGE,
            RabbitConfig.RESGATE_ROUTING_KEY,
            event
        )
    }
}
