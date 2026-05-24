package pucmg.ps.backend.Professor

import org.springframework.stereotype.Service
import pucmg.ps.backend.shared.events.EnviarMoedasEvent
import pucmg.ps.backend.shared.events.MoedaProducer

@Service
class ProfessorService(
    private val professorDao: ProfessorDao,
    private val moedaProducer: MoedaProducer
) {

    fun cadastrar(dto: ProfessorCadastroDTO): Professor {
        if (professorDao.existsByEmail(dto.email)) {
            throw RuntimeException("Já existe um professor cadastrado com este e-mail.")
        }

        if (professorDao.existsByCpf(dto.cpf)) {
            throw RuntimeException("Já existe um professor cadastrado com este CPF.")
        }

        val professor = Professor(
            name = dto.name,
            email = dto.email,
            password = dto.password,
            cpf = dto.cpf,
            departamento = dto.departamento,
        )

        professor.carteira.saldo = 10000

        return professorDao.save(professor)
    }

    fun login(dto: ProfessorLoginDTO): Professor {
        val professor = professorDao.findByEmail(dto.email)

        if (professor.password != dto.password) {
            throw RuntimeException("Senha inválida.")
        }

        return professor
    }

    fun listarTodos(): List<Professor> {
        return professorDao.findAll()
    }

    fun buscarPorId(id: Long): Professor {
        return professorDao.findById(id)
    }

    fun atualizar(id: Long, dto: ProfessorUpdateDTO): Professor {
        val professor = professorDao.findById(id)

        dto.email?.let { novoEmail ->
            if (novoEmail != professor.email && professorDao.existsByEmail(novoEmail)) {
                throw RuntimeException("Já existe outro professor usando este e-mail.")
            }
            professor.email = novoEmail
        }

        dto.cpf?.let { novoCpf ->
            if (novoCpf != professor.cpf && professorDao.existsByCpf(novoCpf)) {
                throw RuntimeException("Já existe outro professor usando este CPF.")
            }
            professor.cpf = novoCpf
        }

        dto.name?.let {
            professor.name = it
        }

        dto.password?.let {
            professor.password = it
        }

        dto.departamento?.let {
            professor.departamento = it
        }

        return professorDao.save(professor)
    }

    fun enviarMoedas(professorId: Long, dto: EnviarMoedasDTO): String {
        if (dto.quantidade <= 0) {
            throw RuntimeException("Quantidade inválida")
        }

        if (!professorDao.existsById(professorId)) {
            throw RuntimeException("Professor não encontrado")
        }

        val event = EnviarMoedasEvent(
            professorId = professorId,
            alunoId = dto.alunoId,
            quantidade = dto.quantidade,
            descricao = dto.descricao
        )

        moedaProducer.enviar(event)

        return "Solicitação enviada para processamento."
    }
}