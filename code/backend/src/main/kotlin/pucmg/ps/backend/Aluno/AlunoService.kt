package pucmg.ps.backend.Aluno

import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import pucmg.ps.backend.features.auth.permission.PermissionDAO
import pucmg.ps.backend.Instituicao.InstituicaoRepository
import pucmg.ps.backend.Moeda.MovimentacaoMoedaRepository
import pucmg.ps.backend.Vantagem.VantagemDAO
import pucmg.ps.backend.Cupom.CupomService
import pucmg.ps.backend.Cupom.CupomDTO
import pucmg.ps.backend.Cupom.CupomResgatoDTO

@Service
@Transactional(readOnly = true)
class AlunoService(
    private val alunoDao: AlunoDao,
    private val passwordEncoder: PasswordEncoder,
    private val permissionDao: PermissionDAO,
    private val movimentacaoRepository: MovimentacaoMoedaRepository,
    private val instituicaoRepository: InstituicaoRepository,
    private val vantagemDAO: VantagemDAO? = null,
    private val cupomService: CupomService? = null
) {

    @Transactional
    fun cadastrar(dto: AlunoCadastroDTO): Aluno {

        if (alunoDao.existsByEmail(dto.email)) {
            throw RuntimeException("Email já cadastrado")
        }

        if (alunoDao.existsByCpf(dto.cpf)) {
            throw RuntimeException("CPF já cadastrado")
        }

        val permissaoAluno = permissionDao.findByName("ALUNO")
        val permissoes = if (permissaoAluno != null) mutableSetOf(permissaoAluno) else mutableSetOf()

        val instituicao = instituicaoRepository.findById(dto.instituicaoId)
            .orElseThrow { RuntimeException("Instituição não encontrada") }

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
            instituicao = instituicao
        ).apply {
            this.permissions = permissoes
        }

        return alunoDao.save(aluno)
    }

    fun buscarPorId(id: Long): Aluno {
        return alunoDao.findById(id)
    }

    @Transactional
    fun atualizar(id: Long, dto: AlunoCadastroDTO): Aluno {
        val aluno = alunoDao.findById(id)

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
        aluno.instituicao = instituicaoRepository.findById(dto.instituicaoId)
            .orElseThrow { RuntimeException("Instituição não encontrada") }

        return alunoDao.save(aluno)
    }

    fun consultarSaldo(id: Long): SaldoDTO {
        val aluno = alunoDao.findById(id)

        return SaldoDTO(
            saldo = aluno.carteira.saldo
        )
    }

    fun consultarExtrato(id: Long): List<ExtratoDTO> {
        val aluno = alunoDao.findById(id)

        return movimentacaoRepository
            .findByCarteiraId(aluno.carteira.id!!)
            .map {
                ExtratoDTO(
                    valor = it.valor,
                    descricao = it.descricao,
                    tipo = it.tipo,
                    data = it.data
                )
            }
    }

    @Transactional
    fun resgatarVantagem(alunoId: Long, vantagemId: Long): CupomDTO {
        if (cupomService == null) throw RuntimeException("CupomService não disponível")
        
        val aluno = alunoDao.findById(alunoId)
        val vantagem = vantagemDAO?.findById(vantagemId) 
            ?: throw RuntimeException("Vantagem não encontrada")

        if (!vantagem.ativa) {
            throw RuntimeException("Vantagem não está ativa")
        }

        if (aluno.carteira.saldo < vantagem.custoMoedas) {
            throw RuntimeException("Saldo insuficiente para resgatar esta vantagem")
        }

        return cupomService.gerarCupom(alunoId, vantagemId)
    }

    fun listarCuponsDisponiveis(alunoId: Long): List<CupomDTO> {
        if (cupomService == null) throw RuntimeException("CupomService não disponível")
        
        alunoDao.findById(alunoId)
        
        return cupomService.listarCuponsAlunoNaoUtilizados(alunoId)
    }

    fun listarHistoricoCupons(alunoId: Long): List<CupomDTO> {
        if (cupomService == null) throw RuntimeException("CupomService não disponível")
        
        alunoDao.findById(alunoId)
        
        return cupomService.listarCuponsAluno(alunoId)
    }

    fun usarCupom(codigo: String): CupomResgatoDTO {
        if (cupomService == null) throw RuntimeException("CupomService não disponível")
        
        return cupomService.usarCupom(codigo)
    }

    fun listarTodos(): List<Map<String, Any?>> {
        return alunoDao.findAll().map { aluno ->
            mapOf(
                "id" to aluno.id,
                "nome" to aluno.name,
                "email" to aluno.email,
                "cpf" to aluno.cpf,
                "curso" to aluno.curso,
                "saldo" to aluno.carteira.saldo
            )
        }
    }
}