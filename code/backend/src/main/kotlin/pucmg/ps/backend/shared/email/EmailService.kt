package pucmg.ps.backend.shared.email

import jakarta.mail.internet.MimeMessage
import org.springframework.beans.factory.annotation.Value
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service
import org.thymeleaf.context.Context
import org.thymeleaf.spring6.SpringTemplateEngine
import pucmg.ps.backend.shared.events.ResgateVantagemEvent

@Service
class EmailService(
    private val mailSender: JavaMailSender,
    private val templateEngine: SpringTemplateEngine,
    @Value("\${mail.from}") private val from: String,
    @Value("\${app.url}") private val appUrl: String
) {

    fun enviarCupomResgate(event: ResgateVantagemEvent) {
        val context = Context().apply {
            setVariable("alunoNome", event.alunoNome)
            setVariable("vantagemDescricao", event.vantagemDescricao)
            setVariable("custoMoedas", event.custoMoedas)
            setVariable("nomeEmpresa", event.nomeEmpresa)
            setVariable("codigoCupom", event.codigoCupom)
            setVariable("dataValidade", event.dataValidade)
            setVariable("appUrl", appUrl)
            setVariable("logoUrl", "$appUrl/logo.png")
        }

        val html = templateEngine.process("email/resgate-cupom", context)

        val mensagem: MimeMessage = mailSender.createMimeMessage()
        val helper = MimeMessageHelper(mensagem, true, "UTF-8")

        helper.setFrom(from)
        helper.setTo(event.alunoEmail)
        helper.setSubject("StudentCoin - Cupom resgatado: ${event.vantagemDescricao}")
        helper.setText(html, true)

        mailSender.send(mensagem)
    }
}
