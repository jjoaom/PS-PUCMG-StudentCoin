package pucmg.ps.backend.Aluno

import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import pucmg.ps.backend.features.auth.permission.PermissionDAO

@Service
class AlunoService(
    private val alunoRepository: AlunoRepository,
    private val passwordEncoder: PasswordEncoder,
    private val permissionDao: PermissionDAO
) {

    fun cadastrar(dto: AlunoCadastroDTO): Aluno {

        if (alunoRepository.existsByEmail(dto.email)) {
            throw RuntimeException("Email já cadastrado")
        }

        if (alunoRepository.existsByCpf(dto.cpf)) {
            throw RuntimeException("CPF já cadastrado")
        }

        val permissaoAluno = permissionDao.findByName("ALUNO")
        val permissoes = if (permissaoAluno != null) mutableSetOf(permissaoAluno) else mutableSetOf()

        val aluno = Aluno(
            name = dto.nome,
            email = dto.email,
            password = passwordEncoder.encode(dto.senha).toString(),
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
        ).apply {
            this.permissions = permissoes
        }

        return alunoRepository.save(aluno)
    }

    fun buscarPorId(id: Long): Aluno {
        return alunoRepository.findById(id)
            .orElseThrow { RuntimeException("Aluno não encontrado") }
    }

    fun atualizar(id: Long, dto: AlunoCadastroDTO): Aluno {
        val aluno = alunoRepository.findById(id)
            .orElseThrow { RuntimeException("Aluno não encontrado") }

        aluno.name = dto.nome
        aluno.email = dto.email
        if (dto.senha.isNotBlank()) {
            aluno.password = passwordEncoder.encode(dto.senha).toString()
        }
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