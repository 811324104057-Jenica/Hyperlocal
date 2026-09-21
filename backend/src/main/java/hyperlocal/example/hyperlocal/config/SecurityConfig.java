package hyperlocal.example.hyperlocal.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .cors(cors -> {})
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                // Authentication and registration
                .requestMatchers(
                    "/api/auth/login",
                    "/api/auth/register-customer",
                    "/api/auth/register-provider",
                    "/api/auth/register-admin"
                ).permitAll()

                // Worker APIs
                .requestMatchers(
                    "/api/workers/**"
                ).permitAll()

                // Service APIs
                .requestMatchers(
                    "/api/services/**"
                ).permitAll()

                // Booking APIs
                .requestMatchers(
                    "/api/bookings/**"
                ).permitAll()

                // Payment APIs
                .requestMatchers(
                    "/api/payments/**"
                ).permitAll()

                // Admin APIs
                .requestMatchers(
                    "/api/admin/**"
                ).permitAll()

                // Other requests
                .anyRequest()
                .authenticated()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                    "http://localhost:5173",
                    "http://localhost:5174"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                    "GET",
                    "POST",
                    "PUT",
                    "DELETE",
                    "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}