package pucmg.ps.backend.features.auth.permission

enum class Permissions(val description: String) {
    // USERS
    USER_VIEW("Visualizar usuários"),
    USER_EDIT("Criar, atualizar e excluir usuários"),

    // Aluno
    Aluno_VIEW("Visualizar Alunos"),
    Aluno_EDIT("Criar, atualizar e excluir Alunos"),

    // Professor
    Professor_VIEW("Visualizar Professores"),
    Professor_EDIT("Criar, atualizar e excluir Professores"),

    // Empresa
    empresa_VIEW("Visualizar empresas"),
    empresa_EDIT("Criar, atualizar e excluir empresas"),

    // Produtos
    PRODUCTS_VIEW("Visualizar Produtos"),
    PRODUCTS_EDIT("Criar, atualizar e excluir produtos"),

    // ADMIN
    ADMIN("Administrador");

    companion object {
        fun fromNames(names: Set<String>): Set<Permissions> {
            val permissions = names.mapNotNull { valueOfOrNull(it) }.toSet()
            val missing = names - permissions.map { it.name }.toSet()

            if (missing.isNotEmpty()) {
                throw PermissionNotFoundException(missing)
            }

            return permissions
        }

        fun valueOfOrNull(name: String): Permissions? =
            values().firstOrNull { it.name == name }
    }
}

class PermissionNotFoundException(names: Set<String>)
    : RuntimeException("Permissions not found: ${names.joinToString()}")