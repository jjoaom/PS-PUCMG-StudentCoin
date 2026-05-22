package pucmg.ps.backend.shared.config

@Configuration
class RabbitConfig {

    companion object {
        const val QUEUE = "user.created.queue"
        const val EXCHANGE = "user.exchange"
        const val ROUTING_KEY = "user.created"
    }

    @Bean
    fun queue(): Queue {
        return Queue(QUEUE, true)
    }

    @Bean
    fun exchange(): TopicExchange {
        return TopicExchange(EXCHANGE)
    }

    @Bean
    fun binding(
        queue: Queue,
        exchange: TopicExchange
    ): Binding {
        return BindingBuilder
            .bind(queue)
            .to(exchange)
            .with(ROUTING_KEY)
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