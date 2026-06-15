package pucmg.ps.backend.shared.config

import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.Queue
import org.springframework.amqp.core.TopicExchange
import org.springframework.amqp.rabbit.connection.ConnectionFactory
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter
import org.springframework.amqp.support.converter.MessageConverter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class RabbitConfig {

    companion object {
        const val MOEDA_QUEUE = "moeda.enviar.queue"
        const val MOEDA_EXCHANGE = "moeda.exchange"
        const val MOEDA_ROUTING_KEY = "moeda.enviar"

        const val RESGATE_QUEUE = "resgate.email.queue"
        const val RESGATE_EXCHANGE = "resgate.exchange"
        const val RESGATE_ROUTING_KEY = "resgate.email"

        const val MOEDA_EMAIL_QUEUE = "moeda.email.queue"
        const val MOEDA_EMAIL_EXCHANGE = "moeda.email.exchange"
        const val MOEDA_EMAIL_ROUTING_KEY = "moeda.email.routing-key"
    }

    @Bean
    fun moedaQueue(): Queue {
        return Queue(MOEDA_QUEUE, true)
    }

    @Bean
    fun moedaExchange(): TopicExchange {
        return TopicExchange(MOEDA_EXCHANGE)
    }

    @Bean
    fun moedaBinding(
        moedaQueue: Queue,
        moedaExchange: TopicExchange
    ): Binding {
        return BindingBuilder
            .bind(moedaQueue)
            .to(moedaExchange)
            .with(MOEDA_ROUTING_KEY)
    }

    @Bean
    fun resgateQueue(): Queue {
        return Queue(RESGATE_QUEUE, true)
    }

    @Bean
    fun resgateExchange(): TopicExchange {
        return TopicExchange(RESGATE_EXCHANGE)
    }

    @Bean
    fun resgateBinding(
        resgateQueue: Queue,
        resgateExchange: TopicExchange
    ): Binding {
        return BindingBuilder
            .bind(resgateQueue)
            .to(resgateExchange)
            .with(RESGATE_ROUTING_KEY)
    }

    @Bean
    fun moedaEmailQueue(): Queue {
        return Queue(MOEDA_EMAIL_QUEUE, true)
    }

    @Bean
    fun moedaEmailExchange(): TopicExchange {
        return TopicExchange(MOEDA_EMAIL_EXCHANGE)
    }

    @Bean
    fun moedaEmailBinding(
        moedaEmailQueue: Queue,
        moedaEmailExchange: TopicExchange
    ): Binding {
        return BindingBuilder
            .bind(moedaEmailQueue)
            .to(moedaEmailExchange)
            .with(MOEDA_EMAIL_ROUTING_KEY)
    }

    @Bean
    fun jacksonConverter(): MessageConverter {
        return Jackson2JsonMessageConverter()
    }

    @Bean
    fun rabbitTemplate(
        connectionFactory: ConnectionFactory,
        converter: MessageConverter
    ): RabbitTemplate {
        return RabbitTemplate(connectionFactory).apply {
            messageConverter = converter
        }
    }
}