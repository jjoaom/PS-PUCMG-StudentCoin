package pucmg.ps.backend.Empresa

import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import pucmg.ps.backend.features.auth.permission.PermissionDAO
import pucmg.ps.backend.Vantagem.VantagemResponseDTO
import pucmg.ps.backend.Vantagem.VantagemDAO
import pucmg.ps.backend.Vantagem.VantagemCadastroDTO
import pucmg.ps.backend.Vantagem.toResponseDTO
import pucmg.ps.backend.Cupom.CupomDAO

@Service
@Transactional(readOnly = true)
class EmpresaService(
    private val empresaDao: EmpresaDao,
    private val passwordEncoder: PasswordEncoder,
    private val permissionDao: PermissionDAO,
    private val vantagemDAO: VantagemDAO? = null,
    private val cupomDAO: CupomDAO? = null
) {

    @Transactional
    fun cadastrar(dto: EmpresaCadastroDTO): Empresa {

        if (empresaDao.existsByEmail(dto.email)) {
            throw RuntimeException("Email já cadastrado")
        }

        if (empresaDao.existsByCnpj(dto.cnpj)) {
            throw RuntimeException("CNPJ já cadastrado")
        }

        val permissaoEmpresa = permissionDao.findByName("EMPRESA")
        val permissoes = if (permissaoEmpresa != null) {
            mutableSetOf(permissaoEmpresa)
        } else {
            mutableSetOf()
        }

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

        return empresaDao.save(empresa)
    }

    fun buscarPorId(id: Long): Empresa {
        return empresaDao.findById(id)
    }

    @Transactional
    fun atualizar(id: Long, dto: EmpresaCadastroDTO): Empresa {
        val empresa = empresaDao.findById(id)

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

        return empresaDao.save(empresa)
    }

    @Transactional
    fun deletar(id: Long) {
        empresaDao.deleteById(id)
    }

    fun listarVantagens(empresaId: Long): List<VantagemResponseDTO> {
        empresaDao.findById(empresaId)
        return vantagemDAO?.findByEmpresaId(empresaId)?.map { it.toResponseDTO() } ?: emptyList()
    }

    fun listarVantagensAtivas(empresaId: Long): List<VantagemResponseDTO> {
        empresaDao.findById(empresaId)
        return vantagemDAO?.findByEmpresaIdAndAtiva(empresaId, true)?.map { it.toResponseDTO() } ?: emptyList()
    }

    @Transactional
    fun criarVantagem(empresaId: Long, dto: VantagemCadastroDTO): VantagemResponseDTO {
        if (vantagemDAO == null) throw RuntimeException("VantagemDAO não disponível")
        
        val empresa = empresaDao.findById(empresaId)
        
        if (dto.custoMoedas <= 0) {
            throw IllegalArgumentException("O custo em moedas deve ser maior que zero")
        }

        if (dto.descricao.isBlank()) {
            throw IllegalArgumentException("A descrição não pode estar vazia")
        }

        val vantagem = pucmg.ps.backend.Vantagem.VantagemEntity(
            descricao = dto.descricao,
            custoMoedas = dto.custoMoedas,
            empresa = empresa,
            detalhes = dto.detalhes,
            ativa = true
        )

        val vantagemSalva = vantagemDAO.save(vantagem)
        return vantagemSalva.toResponseDTO()
    }

    fun gerarRelatorioCupons(empresaId: Long): Map<String, Any> {
        if (vantagemDAO == null || cupomDAO == null) throw RuntimeException("DAOs não disponíveis")
        
        val empresa = empresaDao.findById(empresaId)
        val vantagens = vantagemDAO.findByEmpresaId(empresaId)
        
        val relatorio = vantagens.map { vantagem ->
            mapOf(
                "vantagemId" to vantagem.id,
                "descricao" to vantagem.descricao,
                "custoMoedas" to vantagem.custoMoedas,
                "cuponsGerados" to cupomDAO.findByVantagemId(vantagem.id!!).count { !it.utilizado },
                "cuponsUtilizados" to cupomDAO.findByVantagemId(vantagem.id!!).count { it.utilizado }
            )
        }
        
        return mapOf(
            "empresa" to empresa.nomeFantasia,
            "vantagens" to relatorio,
            "totalCuponsGerados" to relatorio.sumOf { (it["cuponsGerados"] as Int) },
            "totalCuponsUtilizados" to relatorio.sumOf { (it["cuponsUtilizados"] as Int) }
        )
    }
}