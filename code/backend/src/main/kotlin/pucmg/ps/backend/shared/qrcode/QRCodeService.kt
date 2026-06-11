package pucmg.ps.backend.shared.qrcode

import com.google.zxing.BarcodeFormat
import com.google.zxing.client.j2se.MatrixToImageWriter
import com.google.zxing.qrcode.QRCodeWriter
import org.springframework.stereotype.Service
import java.io.ByteArrayOutputStream
import java.util.Base64

@Service
class QRCodeService {

    fun gerarBase64(conteudo: String, largura: Int = 250, altura: Int = 250): String {
        val writer = QRCodeWriter()
        val bitMatrix = writer.encode(conteudo, BarcodeFormat.QR_CODE, largura, altura)
        val outputStream = ByteArrayOutputStream()
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream)
        val pngBytes = outputStream.toByteArray()
        return Base64.getEncoder().encodeToString(pngBytes)
    }
}
