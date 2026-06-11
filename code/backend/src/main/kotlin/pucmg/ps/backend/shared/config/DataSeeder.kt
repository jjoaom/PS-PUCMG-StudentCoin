package pucmg.ps.backend.shared.config

import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.password.PasswordEncoder
import pucmg.ps.backend.Aluno.Aluno
import pucmg.ps.backend.Aluno.AlunoRepository
import pucmg.ps.backend.Empresa.Empresa
import pucmg.ps.backend.Empresa.EmpresaRepository
import pucmg.ps.backend.Instituicao.Instituicao
import pucmg.ps.backend.Instituicao.InstituicaoRepository
import pucmg.ps.backend.Professor.Professor
import pucmg.ps.backend.Professor.ProfessorRepository
import pucmg.ps.backend.Vantagem.VantagemEntity
import pucmg.ps.backend.Vantagem.VantagemRepository
import pucmg.ps.backend.features.auth.permission.PermissionEntity
import pucmg.ps.backend.features.auth.permission.PermissionRepository

@Configuration
class DataSeeder {

    @Bean
    fun seedDatabase(
        permissionRepository: PermissionRepository,
        instituicaoRepository: InstituicaoRepository,
        alunoRepository: AlunoRepository,
        professorRepository: ProfessorRepository,
        empresaRepository: EmpresaRepository,
        vantagemRepository: VantagemRepository,
        passwordEncoder: PasswordEncoder
    ) = CommandLineRunner {

        if (permissionRepository.count() > 0) {
            return@CommandLineRunner
        }

        // ── PERMISSIONS ──
        val perms = permissionRepository.saveAll(
            listOf(
                PermissionEntity(name = "ADMIN", description = "Administrador"),
                PermissionEntity(name = "ALUNO", description = "Aluno"),
                PermissionEntity(name = "PROFESSOR", description = "Professor"),
                PermissionEntity(name = "EMPRESA", description = "Empresa Parceira")
            )
        ).map { it.name to it }.toMap()

        val permissaoAluno = perms["ALUNO"]!!
        val permissaoProfessor = perms["PROFESSOR"]!!
        val permissaoEmpresa = perms["EMPRESA"]!!

        // ── INSTITUTIONS ──
        val instituicoes = instituicaoRepository.saveAll(
            listOf(
                Instituicao(nome = "PUC Minas", cnpj = "17295238000190", endereco = "Av. Dom José Gaspar, 500 - Belo Horizonte/MG"),
                Instituicao(nome = "UFMG", cnpj = "17217929000195", endereco = "Av. Pres. Antônio Carlos, 6627 - Belo Horizonte/MG"),
                Instituicao(nome = "CEFET-MG", cnpj = "21966891000105", endereco = "Av. Amazonas, 5253 - Belo Horizonte/MG"),
                Instituicao(nome = "UNA", cnpj = "17242516000151", endereco = "Rua Guajajaras, 175 - Belo Horizonte/MG"),
                Instituicao(nome = "FUMEC", cnpj = "17225802000141", endereco = "Rua Cobre, 200 - Belo Horizonte/MG")
            )
        )

        val pucMinas = instituicoes[0]
        val ufmg = instituicoes[1]

        // ── STUDENTS ──
        val aluno1 = Aluno(
            name = "João Silva",
            email = "aluno1@pucminas.br",
            password = passwordEncoder.encode("123456").toString(),
            cpf = "52998224725",
            rg = "MG1234567",
            telefone = "31998877665",
            cep = "30140071",
            rua = "Rua dos Tupis",
            numero = "150",
            bairro = "Centro",
            cidade = "Belo Horizonte",
            estado = "MG",
            curso = "Engenharia de Software",
            instituicao = pucMinas
        ).apply {
            active = true
            permissions = mutableSetOf(permissaoAluno)
            carteira.saldo = 500
        }

        val aluno2 = Aluno(
            name = "Maria Oliveira",
            email = "aluno2@pucminas.br",
            password = passwordEncoder.encode("123456").toString(),
            cpf = "81772136002",
            rg = "MG7654321",
            telefone = "31995544332",
            cep = "30130000",
            rua = "Rua Pernambuco",
            numero = "300",
            bairro = "Savassi",
            cidade = "Belo Horizonte",
            estado = "MG",
            curso = "Ciência da Computação",
            instituicao = pucMinas
        ).apply {
            active = true
            permissions = mutableSetOf(permissaoAluno)
            carteira.saldo = 250
        }

        val aluno3 = Aluno(
            name = "Pedro Santos",
            email = "aluno3@pucminas.br",
            password = passwordEncoder.encode("123456").toString(),
            cpf = "39425789015",
            rg = "MG9876543",
            telefone = "31992211000",
            cep = "30330230",
            rua = "Rua Alagoas",
            numero = "500",
            bairro = "Barro Preto",
            cidade = "Belo Horizonte",
            estado = "MG",
            curso = "Sistemas de Informação",
            instituicao = ufmg
        ).apply {
            active = true
            permissions = mutableSetOf(permissaoAluno)
            carteira.saldo = 100
        }

        alunoRepository.saveAll(listOf(aluno1, aluno2, aluno3))

        // ── PROFESSORS ──
        val prof1 = Professor(
            name = "Carlos Eduardo",
            email = "professor@pucminas.br",
            password = passwordEncoder.encode("123456").toString(),
            cpf = "50843167002",
            departamento = "Ciência da Computação",
            instituicao = pucMinas
        ).apply {
            active = true
            permissions = mutableSetOf(permissaoProfessor)
            carteira.saldo = 10000
        }

        val prof2 = Professor(
            name = "Ana Beatriz",
            email = "professor2@pucminas.br",
            password = passwordEncoder.encode("123456").toString(),
            cpf = "93768254006",
            departamento = "Engenharia de Software",
            instituicao = pucMinas
        ).apply {
            active = true
            permissions = mutableSetOf(permissaoProfessor)
            carteira.saldo = 10000
        }

        professorRepository.saveAll(listOf(prof1, prof2))

        // ── COMPANIES ──
        val emp1 = Empresa(
            name = "restaurante@universitario.com",
            email = "restaurante@universitario.com",
            password = passwordEncoder.encode("123456").toString(),
            nomeFantasia = "Restaurante Universitário",
            razaoSocial = "Restaurante Universitário Ltda",
            cnpj = "11222333000181",
            telefone = "3133333333",
            cep = "30140071",
            rua = "Av. Afonso Pena",
            numero = "4000",
            bairro = "Centro",
            cidade = "Belo Horizonte",
            estado = "MG"
        ).apply {
            permissions = mutableSetOf(permissaoEmpresa)
        }

        val emp2 = Empresa(
            name = "livraria@universitaria.com",
            email = "livraria@universitaria.com",
            password = passwordEncoder.encode("123456").toString(),
            nomeFantasia = "Livraria Universitária",
            razaoSocial = "Livraria Acadêmica Ltda",
            cnpj = "22333444000192",
            telefone = "3144444444",
            cep = "30130000",
            rua = "Rua da Bahia",
            numero = "1000",
            bairro = "Centro",
            cidade = "Belo Horizonte",
            estado = "MG"
        ).apply {
            permissions = mutableSetOf(permissaoEmpresa)
        }

        val emp3 = Empresa(
            name = "brindes@express.com",
            email = "brindes@express.com",
            password = passwordEncoder.encode("123456").toString(),
            nomeFantasia = "Brindes Express",
            razaoSocial = "Brindes Personalizados S.A.",
            cnpj = "33444555000103",
            telefone = "3155555555",
            cep = "30330230",
            rua = "Rua Timbiras",
            numero = "200",
            bairro = "Barro Preto",
            cidade = "Belo Horizonte",
            estado = "MG"
        ).apply {
            permissions = mutableSetOf(permissaoEmpresa)
        }

        empresaRepository.saveAll(listOf(emp1, emp2, emp3))

        // ── BENEFITS ──
        val vantagens = listOf(
            VantagemEntity(
                descricao = "Cupom de R$ 20,00 no self-service",
                custoMoedas = 50,
                empresa = emp1,
                detalhes = "Válido para qualquer refeição no self-service do Restaurante Universitário."
            ),
            VantagemEntity(
                descricao = "Café da manhã completo grátis",
                custoMoedas = 30,
                empresa = emp1,
                detalhes = "Inclui café, pão, frutas e suco."
            ),
            VantagemEntity(
                descricao = "Desconto de 50% em livros didáticos",
                custoMoedas = 100,
                empresa = emp2,
                detalhes = "Aplicável a livros universitários selecionados. Consulte a lista no site."
            ),
            VantagemEntity(
                descricao = "Vale-presente de R$ 30,00",
                custoMoedas = 80,
                empresa = emp2,
                detalhes = "Válido para qualquer produto da loja."
            ),
            VantagemEntity(
                descricao = "Caneca personalizada StudentCoin",
                custoMoedas = 40,
                empresa = emp3,
                detalhes = "Caneca térmica com logo StudentCoin. Retirada no Bloco I."
            ),
            VantagemEntity(
                descricao = "Camiseta exclusiva StudentCoin",
                custoMoedas = 120,
                empresa = emp3,
                detalhes = "Camiseta 100% algodão com design exclusivo. Tamanhos P, M, G."
            )
        )

        vantagemRepository.saveAll(vantagens)

        println("Seed concluído: 5 instituições, 3 alunos, 2 professores, 3 empresas, 6 vantagens")
    }
}
