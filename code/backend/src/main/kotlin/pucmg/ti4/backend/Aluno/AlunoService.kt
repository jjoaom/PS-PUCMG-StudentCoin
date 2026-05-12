package pucmg.ti4.backend.Aluno

import org.springframework.stereotype.Service

@Service
class AlunoService(
    private val alunoRepository: AlunoRepository
) {

    fun cadastrar(dto: AlunoCadastroDTO): Aluno {

        if (alunoRepository.existsByEmail(dto.email)) {
            throw RuntimeException("Email já cadastrado")
        }

        if (alunoRepository.existsByCpf(dto.cpf)) {
            throw RuntimeException("CPF já cadastrado")
        }

        val aluno = Aluno(
            nome = dto.nome,
            email = dto.email,
            senha = dto.senha,
            cpf = dto.cpf,
            rg = dto.rg,
            telefone = dto.telefone,
            cep = dto.cep,
            rua = dto.rua,
            numero = dto.numero,
            bairro = dto.bairro,
            cidade = dto.cidade,
            estado = dto.estado,
            curso = dto.curso,
            instituicaoId = dto.instituicaoId
        )

        return alunoRepository.save(aluno)
    }

    fun login(dto: AlunoLoginDTO): Aluno {

        val aluno = alunoRepository.findByEmail(dto.email)
            ?: throw RuntimeException("Email ou senha inválidos")

        if (aluno.senha != dto.senha) {
            throw RuntimeException("Email ou senha inválidos")
        }

        return aluno
    }

        fun buscarPorId(id: Long): Aluno {
        return alunoRepository.findById(id)
            .orElseThrow { RuntimeException("Aluno não encontrado") }
    }

    fun atualizar(id: Long, dto: AlunoCadastroDTO): Aluno {
        val aluno = alunoRepository.findById(id)
            .orElseThrow { RuntimeException("Aluno não encontrado") }

        aluno.nome = dto.nome
        aluno.email = dto.email
        aluno.senha = dto.senha
        aluno.cpf = dto.cpf
        aluno.rg = dto.rg
        aluno.telefone = dto.telefone
        aluno.cep = dto.cep
        aluno.rua = dto.rua
        aluno.numero = dto.numero
        aluno.bairro = dto.bairro
        aluno.cidade = dto.cidade
        aluno.estado = dto.estado
        aluno.curso = dto.curso
        aluno.instituicaoId = dto.instituicaoId

        return alunoRepository.save(aluno)
    }
}