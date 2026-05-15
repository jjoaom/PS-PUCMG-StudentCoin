package pucmg.ps.backend.Empresa

import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import pucmg.ps.backend.features.auth.permission.PermissionDAO

@Service
class EmpresaService(
    private val empresaRepository: EmpresaRepository,
    private val passwordEncoder: PasswordEncoder,
    private val permissionDao: PermissionDAO
) {

    fun cadastrar(dto: EmpresaCadastroDTO): Empresa {

        if (empresaRepository.existsByEmail(dto.email)) {
            throw RuntimeException("Email já cadastrado")
        }

        if (empresaRepository.existsByCnpj(dto.cnpj)) {
            throw RuntimeException("CNPJ já cadastrado")
        }

        val permissaoEmpresa = permissionDao.findByName("EMPRESA")
        val permissoes = if (permissaoEmpresa != null) mutableSetOf(permissaoEmpresa) else mutableSetOf()

        val empresa = Empresa(
            name = dto.nomeFantasia,
            email = dto.email,
            password = passwordEncoder.encode(dto.senha).toString(),
            nomeFantasia = dto.nomeFantasia,
            razaoSocial = dto.razaoSocial,
            cnpj = dto.cnpj,
            telefone = dto.telefone,
            cep = dto.cep,
            rua = dto.rua,
            numero = dto.numero,
            bairro = dto.bairro,
            cidade = dto.cidade,
            estado = dto.estado
        ).apply {
            this.permissions = permissoes
        }

        return empresaRepository.save(empresa)
    }

    fun buscarPorId(id: Long): Empresa {
        return empresaRepository.findById(id)
            .orElseThrow { RuntimeException("Empresa não encontrada") }
    }

    fun atualizar(id: Long, dto: EmpresaCadastroDTO): Empresa {
        val empresa = empresaRepository.findById(id)
            .orElseThrow { RuntimeException("Empresa não encontrada") }

        empresa.name = dto.nomeFantasia
        empresa.email = dto.email
        if (dto.senha.isNotBlank()) {
            empresa.password = passwordEncoder.encode(dto.senha).toString()
        }
        empresa.nomeFantasia = dto.nomeFantasia
        empresa.razaoSocial = dto.razaoSocial
        empresa.cnpj = dto.cnpj
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