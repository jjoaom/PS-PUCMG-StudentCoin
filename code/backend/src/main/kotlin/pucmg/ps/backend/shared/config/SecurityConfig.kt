package pucmg.ps.backend.shared.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.security.web.header.writers.StaticHeadersWriter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

import pucmg.ps.backend.features.auth.CustomUserDetailsService
import pucmg.ps.backend.features.auth.jwt.JwtAuthFilter

@Configuration
@Profile("prod")
@EnableMethodSecurity
internal class SecurityConfig(

    private val customUserDetailsService: CustomUserDetailsService,
    private val jwtAuthFilter: JwtAuthFilter,

    @Value("\${app.cors.allowed-origins}")
    private val allowedOrigins: String,

    @Value("\${app.security.csp.connect-src}")
    private val cspConnectSrc: String,

    @Value("\${app.security.csp.style-src}")
    private val cspStyleSrc: String,

    @Value("\${app.security.csp.font-src}")
    private val cspFontSrc: String
) {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {

        http.headers { headers ->
            headers.contentSecurityPolicy { csp ->
                csp.policyDirectives(
                    "default-src 'self'; " +
                            buildDirective("connect-src", cspConnectSrc) + "; " +
                            buildDirective("style-src", cspStyleSrc) + "; " +
                            buildDirective("font-src", cspFontSrc) + "; " +
                            "img-src 'self' data: blob:; " +
                            "script-src 'self' 'unsafe-inline'; " +
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
            .csrf { it.disable() }
            .sessionManagement {
                it.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter::class.java)
            .authorizeHttpRequests {
                it.requestMatchers("/auth/**").permitAll()
                it.anyRequest().authenticated()
            }

        return http.build()
    }

    // CSP BUILDER GENÉRICO
	private fun buildDirective(name: String, value: String): String {
	    val sources = value
	        .split(",")
	        .map { it.trim() }
	        .filter { it.isNotBlank() }
	        .map {
	            when (it) {
	                "self", "'self'" -> "'self'"
	                else -> it
	            }
	        }
		.distinct()
	
	    val finalSources = if (sources.isEmpty()) {
	        listOf("'self'")
	    } else {
	        sources
	    }
	
	    return "$name ${finalSources.joinToString(" ")}"
	}

    // AUTH
    @Bean
    fun authenticationProvider(): DaoAuthenticationProvider =
        DaoAuthenticationProvider(customUserDetailsService).apply {
            setPasswordEncoder(passwordEncoder())
        }

    @Bean
    fun authenticationManager(config: AuthenticationConfiguration): AuthenticationManager =
        config.authenticationManager

    @Bean
    fun passwordEncoder(): PasswordEncoder =
        BCryptPasswordEncoder()

    // CORS
    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val config = CorsConfiguration()

        config.allowedOriginPatterns =
            allowedOrigins.split(",").map { it.trim() }

        config.allowedMethods =
            listOf("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")

        config.allowedHeaders = listOf("*")
        config.allowCredentials = true

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", config)

        return source
    }
}
