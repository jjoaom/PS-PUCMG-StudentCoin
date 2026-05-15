package pucmg.ps.backend.shared.config

import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.core.annotation.Order
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import pucmg.ps.backend.features.auth.jwt.JwtAuthFilter
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity

import pucmg.ps.backend.features.auth.CustomUserDetailsService
import org.springframework.security.authentication.dao.DaoAuthenticationProvider

@Configuration
@EnableWebSecurity
@Profile("dev")
@Order(1)
internal class SecurityConfigDev(
    private val customUserDetailsService: CustomUserDetailsService
) {

    @Bean
    fun authenticationProvider(): DaoAuthenticationProvider =
    DaoAuthenticationProvider(customUserDetailsService).apply {
        setPasswordEncoder(passwordEncoder())
    }

    @Bean
    fun authenticationManager(config: AuthenticationConfiguration): AuthenticationManager =
        config.authenticationManager

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .httpBasic { it.disable() }
            .cors { }
            .authorizeHttpRequests {
                it.requestMatchers(
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**"
                ).permitAll()
                it.anyRequest().permitAll()
            }

        return http.build()
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val config = CorsConfiguration()

        config.allowedOriginPatterns = listOf("http://localhost:5173")
        config.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
        config.allowedHeaders = listOf("*")
        config.allowCredentials = true

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", config)
        return source
    }

    @Bean
    fun jwtFilterRegistration(jwtAuthFilter: JwtAuthFilter): FilterRegistrationBean<JwtAuthFilter> {
        val registration = FilterRegistrationBean(jwtAuthFilter)
        registration.isEnabled = false
        return registration
    }
}