# PS-PUCMG-StudentCoin
Trabalho Laboratório 03 Disciplina Projeto de Software

## Atividade Prática da Disciplina Projeto de Software

# Stack
[![Kotlin](https://img.shields.io/badge/Kotlin-%237F52FF.svg?logo=kotlin&logoColor=white)](https://kotlinlang.org/docs/home.html)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?logo=springboot&logoColor=fff)](https://docs.spring.io/spring-boot/documentation.html)
[![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?logo=springsecurity&logoColor=fff)](https://docs.spring.io/spring-security/reference/index.html)
[![RabbitMQ](https://img.shields.io/badge/Rabbitmq-FF6600?logo=rabbitmq&logoColor=fff)](https://docs.spring.io/spring-security/reference/index.html)

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000?logo=shadcnui&logoColor=fff)](https://ui.shadcn.com/docs/components)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/docs/installation/using-vite)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/home)

![Postgres](https://img.shields.io/badge/Postgres-%23316192.svg?logo=postgresql&logoColor=white)

![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?logo=github-actions&logoColor=white)
[![SonarQube Cloud](https://img.shields.io/badge/SonarQube%20Cloud-126ED3?logo=sonarqubecloud&logoColor=fff)](https://sonarcloud.io/login)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jjoaom_PS-PUCMG-StudentCoin&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jjoaom_PS-PUCMG-StudentCoin)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=jjoaom_PS-PUCMG-StudentCoin&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jjoaom_PS-PUCMG-StudentCoin)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=jjoaom_PS-PUCMG-StudentCoin&metric=coverage)](https://sonarcloud.io/summary/new_code?id=jjoaom_PS-PUCMG-StudentCoin)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=jjoaom_PS-PUCMG-StudentCoin&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jjoaom_PS-PUCMG-StudentCoin)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=jjoaom_PS-PUCMG-StudentCoin&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jjoaom_PS-PUCMG-StudentCoin)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=jjoaom_PS-PUCMG-StudentCoin&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jjoaom_PS-PUCMG-StudentCoin)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=jjoaom_PS-PUCMG-StudentCoin&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jjoaom_PS-PUCMG-StudentCoin)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=jjoaom_PS-PUCMG-StudentCoin&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jjoaom_PS-PUCMG-StudentCoin)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=jjoaom_PS-PUCMG-StudentCoin&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jjoaom_PS-PUCMG-StudentCoin)


**O escopo da atividade por ser acessado [por aqui](./docs/LABORATÓRIO%2005%20-%20Sistema%20de%20Moeda%20Estudantil%20(Release%203).pdf).**

## Integrantes

- Diogo Henrique Moreira da Silva
- João Marcos de Aquino Gonçalves
- João Victor dos Santos Nogueira

## Professor

- João Paulo Aramuni

# Como rodar a aplicação

## Dev

Para rodar a aplicação em modo de desenvolvimento, acesse o terminal no diretório `/code` e digite:
```
docker-compose up
```
## Prod

Para rodar a aplicação em modo de produção, acesse o terminal no diretório `/code` e digite:
```
docker compose -f docker-compose.prod.yml up --build   
```

# Documentação

### Modelagem do sistema
![Sistema](./docs/sistema.png)

### Diagrama de Casos de Uso
![Diagrama de Casos de Uso](./docs/CasosdeUso.png)

### Diagrama de Classes
![Diagrama de Classes](./docs/classe.png)

### Diagrama de Componentes
![Diagrama de Componentes](./docs/DiagramadeComponentes.svg)

### Diagrama ER
![Diagrama de Componentes](./docs/diagramaER.png)

## Diagramas de Sequência

![Diagrama de Sequência: Login](./docs/sequence-diagrams/Login.png)

![Diagrama de Sequência: Cadastro Aluno](./docs/sequence-diagrams/CadastroAluno.png)

![Diagrama de Sequência: Consultar Saldo e Histórico](./docs/sequence-diagrams/ConsultaSaldo.png)

![Diagrama de Sequência: Evento de atualização de Moeda dos professores](./docs/sequence-diagrams/EnvioSemestralMoeda.png)

![Diagrama de Sequência: Envio de moedas para alunos](./docs/sequence-diagrams/EnvioMoedaProfessorV2.png)

![Diagrama de Sequência: Cadastro de empresa parceira](./docs/sequence-diagrams/CadastroEmpresaParceira.png)



![Diagrama de Sequência Geral](./docs/sequence-diagrams/DiagramaGeralV2.png)

## Histórias do Usuário

**HU01**  
Como aluno, quero me cadastrar na plataforma, para participar do sistema de moeda estudantil.

**HU02**  
Como usuário, quero realizar login na plataforma, para acessar as funcionalidades do sistema.

**HU03**  
Como professor, quero enviar moedas para um aluno, para reconhecer seu desempenho e participação.

**HU04**  
Como aluno, quero receber notificação por email ao ganhar moedas, para saber quando fui recompensado.

**HU05**  
Como aluno, quero consultar meu saldo e extrato, para acompanhar minhas moedas recebidas e gastas.

**HU06**  
Como professor, quero consultar meu saldo e extrato, para acompanhar as moedas que distribuí.

**HU07**  
Como empresa parceira, quero me cadastrar na plataforma, para oferecer vantagens aos alunos.

**HU08**  
Como empresa parceira, quero cadastrar vantagens com descrição, foto e custo em moedas, para disponibilizar benefícios aos alunos.

**HU09**  
Como aluno, quero trocar minhas moedas por vantagens, para obter descontos ou produtos.

**HU10**  
Como aluno, quero receber um cupom por email após resgatar uma vantagem, para utilizá-la presencialmente.

**HU11**  
Como empresa parceira, quero receber notificação quando uma vantagem for resgatada, para validar o uso do benefício.

**HU12**  
Como professor, quero receber moedas automaticamente a cada semestre, para distribuí-las aos alunos.

**HU13**  
Como aluno, quero selecionar minha instituição no cadastro, para me vincular corretamente ao sistema.

* **Estratégia de Acesso ao Banco de Dados:** A estratégia de acesso ao banco utilizada no projeto foi ORM com JPA/Hibernate. As entidades Kotlin, como Aluno e Empresa, são mapeadas para tabelas do MySQL por meio das anotações @Entity e @Table. O acesso aos dados é feito por interfaces Repository que estendem JpaRepository, evitando SQL manual nas operações básicas de CRUD. O fluxo segue a arquitetura MVC, em que o Controller recebe as requisições, o Service aplica as regras de negócio e o Repository realiza a comunicação com o banco de dados.
