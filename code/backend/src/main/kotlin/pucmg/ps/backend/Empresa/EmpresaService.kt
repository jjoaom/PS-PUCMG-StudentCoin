package pucmg.ps.backend.Empresa

import org.springframework.stereotype.Service

@Service
class EmpresaService(
    private val empresaRepository: EmpresaRepository
) {

    fun cadastrar(dto: EmpresaCadastroDTO): Empresa {

        if (empresaRepository.existsByEmail(dto.email)) {
            throw RuntimeException("Email já cadastrado")
        }

        if (empresaRepository.existsByCnpj(dto.cnpj)) {
            throw RuntimeException("CNPJ já cadastrado")
        }

        val empresa = Empresa(
            nomeFantasia = dto.nomeFantasia,
            razaoSocial = dto.razaoSocial,
            cnpj = dto.cnpj,
            email = dto.email,
            senha = dto.senha,
            telefone = dto.telefone,
            cep = dto.cep,
            rua = dto.rua,
            numero = dto.numero,
            bairro = dto.bairro,
            cidade = dto.cidade,
            estado = dto.estado
        )

        return empresaRepository.save(empresa)
    }

    fun login(dto: EmpresaLoginDTO): Empresa {

        val empresa = empresaRepository.findByEmail(dto.email)
            ?: throw RuntimeException("Email ou senha inválidos")

        if (empresa.senha != dto.senha) {
            throw RuntimeException("Email ou senha inválidos")
        }

        return empresa
    }

    fun buscarPorId(id: Long): Empresa {
        return empresaRepository.findById(id)
            .orElseThrow { RuntimeException("Empresa não encontrada") }
    }

    fun atualizar(id: Long, dto: EmpresaCadastroDTO): Empresa {
        val empresa = empresaRepository.findById(id)
            .orElseThrow { RuntimeException("Empresa não encontrada") }

        empresa.nomeFantasia = dto.nomeFantasia
        empresa.razaoSocial = dto.razaoSocial
        empresa.cnpj = dto.cnpj
        empresa.email = dto.email
        empresa.senha = dto.senha
        empresa.telefone = dto.telefone
        empresa.cep = dto.cep
        empresa.rua = dto.rua
        empresa.numero = dto.numero
        empresa.bairro = dto.bairro
        empresa.cidade = dto.cidade
        empresa.estado = dto.estado

        return empresaRepository.save(empresa)
    }
}