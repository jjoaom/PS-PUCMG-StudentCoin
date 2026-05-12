# Scripts
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker%20Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Bash](https://img.shields.io/badge/Shell_Script-121011?style=for-the-badge&logo=gnu-bash&logoColor=white)

# Como usar
Os scripts contidos neste diretório tem como objetivo facilitar o desenvolvimento local do projeto
Para executar os Scripts no Windows, utilize os arquivos **.bat**
Para executar os Scripts no Linux, utilize os arquivos **.sh**

# Observações
Inicialmente, somente o Backend e o Banco de Dados da aplicação estão inclusos no Docker compose devido ao processo de compilação do frontend rodar melhor no SDK Android e dificuldade de emulação Android via Container.

| Script            | Responsabilidade                          |
|-------------------|--------------------------------------------|
| Start | Iniciar os containers |
| Stop | Para os containers | 
| Rebuild | Recria os containers sem eliminar os volumes |
| Reset | Recria os containers eliminando os volumes |
| Status | Exibe o status dos containers |
| Logs | Exibe as logs dos containers |