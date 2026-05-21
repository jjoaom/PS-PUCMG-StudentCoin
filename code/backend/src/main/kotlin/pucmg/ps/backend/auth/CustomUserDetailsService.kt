package pucmg.ps.backend.features.auth

import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.stereotype.Service
import pucmg.ps.backend.features.auth.user.UserRepository

@Service
class CustomUserDetailsService(
    private val userRepository: UserRepository
) : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository.findByEmail(username)
            ?: throw UsernameNotFoundException("Usuário não encontrado")

        val authorities = user.permissions
            .map { SimpleGrantedAuthority(it.name) }

        return org.springframework.security.core.userdetails.User(
            user.email,
            user.password,
            user.active,
            true,
            true,
            true,
            authorities
        )
    }
}