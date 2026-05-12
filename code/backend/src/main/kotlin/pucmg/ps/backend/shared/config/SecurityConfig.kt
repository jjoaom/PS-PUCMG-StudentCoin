package pucmg.ps.backend.shared.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.provisioning.InMemoryUserDetailsManager
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.header.writers.StaticHeadersWriter


@Configuration
@Profile("prod")
internal class SecurityConfig {


    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {

        http.headers { headers ->
            headers
                .contentSecurityPolicy { csp ->
                    csp.policyDirectives(
                        "default-src 'self'; " +
                                "script-src 'self' 'unsafe-inline'; " +
                                "style-src 'self' 'unsafe-inline'; " +
                                "object-src 'none'; " +
                                "frame-ancestors 'none';"
                    )
                }
                .addHeaderWriter(
                    StaticHeadersWriter(
                        "Permissions-Policy",
                        "camera=(), microphone=(), geolocation=()"
                    )
                )
                .frameOptions { it.deny() }
                .httpStrictTransportSecurity {
                    it.includeSubDomains(true)
                    it.maxAgeInSeconds(31536000)
                }
        }

        http
            .csrf { it.disable() }
            .sessionManagement {
                it.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }
            .authorizeHttpRequests {
                it.requestMatchers("/auth/**").permitAll()
                // it.requestMatchers("/vacinas/**").permitAll()  
                it.anyRequest().authenticated()
            }

        return http.build()
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }


}