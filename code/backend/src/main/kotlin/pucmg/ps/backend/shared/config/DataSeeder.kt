package pucmg.ps.backend.shared.config

import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import pucmg.ps.backend.Aluno.Aluno
import pucmg.ps.backend.Aluno.AlunoRepository
import pucmg.ps.backend.Professor.Professor
import pucmg.ps.backend.Professor.ProfessorRepository

@Configuration
class DataSeeder {

    @Bean
    fun seedDatabase(
        alunoRepository: AlunoRepository,
        professorRepository: ProfessorRepository
    ) = CommandLineRunner {

        if (alunoRepository.count() > 0 || professorRepository.count() > 0) {
            return@CommandLineRunner
        }

        val aluno1 = Aluno(
            name = "Aluno Teste 1",
            email = "aluno1@pucminas.br",
            password = "123456",
            cpf = "11111111111",
            rg = "MG1111111",
            telefone = "31999999999",
            cep = "30140071",
            rua = "Rua A",
            numero = "100",
            bairro = "Centro",
            cidade = "Belo Horizonte",
            estado = "MG",
            curso = "Engenharia de Software",
            instituicaoId = 1
        )

        aluno1.active = true
        aluno1.carteira.saldo = 500

        val aluno2 = Aluno(
            name = "Aluno Teste 2",
            email = "aluno2@pucminas.br",
            password = "123456",
            cpf = "22222222222",
            rg = "MG2222222",
            telefone = "31888888888",
            cep = "30130000",
            rua = "Rua B",
            numero = "200",
            bairro = "Savassi",
            cidade = "Belo Horizonte",
            estado = "MG",
            curso = "Ciência da Computação",
            instituicaoId = 1
        )

        aluno2.active = true
        aluno2.carteira.saldo = 250

        val professor = Professor(
            name = "Professor Teste",
            email = "professor@pucminas.br",
            password = "123456",
            cpf = "33333333333",
            departamento = "Computação"
        )

        professor.active = true
        professor.carteira.saldo = 10000

        alunoRepository.save(aluno1)
        alunoRepository.save(aluno2)
        professorRepository.save(professor)

        println("Dados mockados inseridos com sucesso.")
    }
}