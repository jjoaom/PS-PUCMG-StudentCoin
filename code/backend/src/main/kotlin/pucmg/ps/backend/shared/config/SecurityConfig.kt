package pucmg.ps.backend.shared.config
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.security.web.header.writers.StaticHeadersWriter
import pucmg.ps.backend.features.auth.CustomUserDetailsService
import pucmg.ps.backend.features.auth.jwt.JwtAuthFilter

@Configuration
@Profile("prod")
@EnableMethodSecurity

internal class SecurityConfig(
    private val customUserDetailsService: CustomUserDetailsService,
    private val jwtAuthFilter: JwtAuthFilter,
    @Value("\${app.cors.allowed-origins}") private val allowedOrigins: String
) {

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
            .cors(Customizer.withDefaults())
            .csrf {
                it.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
            }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter::class.java)
            .authorizeHttpRequests {
                                it.requestMatchers(
                    "/auth/**"
                ).permitAll()
                it.anyRequest().authenticated()
            }

        return http.build()
    }

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
    fun corsConfigurationSource(): CorsConfigurationSource {
        val config = CorsConfiguration()
        config.allowedOriginPatterns = allowedOrigins.split(",").map { it.trim() }
        config.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        config.allowedHeaders = listOf("*")
        config.allowCredentials = true
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", config)
        return source
    }
}