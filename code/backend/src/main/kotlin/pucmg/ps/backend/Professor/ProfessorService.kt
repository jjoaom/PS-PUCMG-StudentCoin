package pucmg.ps.backend.Professor

import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import pucmg.ps.backend.Aluno.AlunoRepository
import pucmg.ps.backend.Moeda.MovimentacaoMoedaEntity
import pucmg.ps.backend.Moeda.MovimentacaoMoedaRepository
import pucmg.ps.backend.shared.enums.TipoMovimentacao

@Service
class ProfessorService(
    private val professorRepository: ProfessorRepository,
    private val alunoRepository: AlunoRepository,
    private val movimentacaoRepository: MovimentacaoMoedaRepository
) {

    fun cadastrar(dto: ProfessorCadastroDTO): Professor {
        if (professorRepository.existsByEmail(dto.email)) {
            throw RuntimeException("Já existe um professor cadastrado com este e-mail.")
        }

        if (professorRepository.existsByCpf(dto.cpf)) {
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

        return professorRepository.save(professor)
    }

    fun login(dto: ProfessorLoginDTO): Professor {
        val professor = professorRepository.findByEmail(dto.email)
            ?: throw RuntimeException("Professor não encontrado.")

        if (professor.password != dto.password) {
            throw RuntimeException("Senha inválida.")
        }

        return professor
    }

    fun listarTodos(): List<Professor> {
        return professorRepository.findAll()
    }

    fun buscarPorId(id: Long): Professor {
        return professorRepository.findById(id)
            .orElseThrow { RuntimeException("Professor não encontrado.") }
    }

    fun atualizar(id: Long, dto: ProfessorUpdateDTO): Professor {
        val professor = professorRepository.findById(id)
            .orElseThrow { RuntimeException("Professor não encontrado.") }

        dto.email?.let { novoEmail ->
            if (novoEmail != professor.email && professorRepository.existsByEmail(novoEmail)) {
                throw RuntimeException("Já existe outro professor usando este e-mail.")
            }
            professor.email = novoEmail
        }

        dto.cpf?.let { novoCpf ->
            if (novoCpf != professor.cpf && professorRepository.existsByCpf(novoCpf)) {
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

        return professorRepository.save(professor)
    }

    @Transactional
    fun enviarMoedas(professorId: Long, dto: EnviarMoedasDTO): Professor {

        if (dto.quantidade <= 0) {
            throw RuntimeException("A quantidade de moedas deve ser maior que zero.")
        }

        val professor = professorRepository.findById(professorId)
            .orElseThrow { RuntimeException("Professor não encontrado.") }

        val aluno = alunoRepository.findById(dto.alunoId)
            .orElseThrow { RuntimeException("Aluno não encontrado.") }

        if (professor.carteira.saldo < dto.quantidade) {
            throw RuntimeException("Saldo insuficiente para enviar moedas.")
        }

        professor.carteira.saldo -= dto.quantidade
        aluno.carteira.saldo += dto.quantidade

        val debito = MovimentacaoMoedaEntity(
            valor = dto.quantidade,
            descricao = dto.descricao ?: "Envio de moedas",
            tipo = TipoMovimentacao.DEBITO,
            carteira = professor.carteira
        )

        val credito = MovimentacaoMoedaEntity(
            valor = dto.quantidade,
            descricao = dto.descricao ?: "Recebimento de moedas",
            tipo = TipoMovimentacao.CREDITO,
            carteira = aluno.carteira
        )

        movimentacaoRepository.save(debito)
        movimentacaoRepository.save(credito)

        alunoRepository.save(aluno)

        return professorRepository.save(professor)
    }
}