package com.elevanda.school_client_backend.config;

import com.elevanda.school_client_backend.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static com.elevanda.school_client_backend.config.PublicEndpoints.ENDPOINTS;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JWTFilter jwtFilter;
    private final JwtAuthenticationEntryPoint authenticationEntryPoint;
    private final CustomUserDetailsService userDetailsService;
    private final CustomAccessDeniedHandler accessDeniedHandler;

    public SecurityConfig(JWTFilter jwtFilter, JwtAuthenticationEntryPoint authenticationEntryPoint, CustomUserDetailsService userDetailsService, CustomAccessDeniedHandler accessDeniedHandler) {
        this.jwtFilter = jwtFilter;
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.userDetailsService = userDetailsService;
        this.accessDeniedHandler = accessDeniedHandler;
    }

    @Bean
    public PasswordEncoder myPasswordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(myPasswordEncoder());
        return provider;
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // -------------------------
                //   Exception handling
                // -------------------------
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(authenticationEntryPoint)  // handles 401
                        .accessDeniedHandler(accessDeniedHandler)            // handles 403
                )



                .authorizeHttpRequests(auth -> auth


                        .requestMatchers(ENDPOINTS.toArray(new String[0])).permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/size-systems/**",
                                "/api/materials/**",
                                "/api/shoe-categories/**",
                                "/api/genders/**",
                                "/api/genders",
                                "/api/products",
                                "/api/products/slug",
                                "/api/products/all",
                        "/api/product-variants/public/**"

                        ).permitAll()
                        // -------------------------
                        //   Protected URLs
                        // -------------------------

                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/users/**").authenticated()
                        .requestMatchers("/api/products").hasRole("MANAGER")
                        .requestMatchers("/api/inventory/**").authenticated()

                        .requestMatchers("/api/sales/**").authenticated()

                        // ================= PROTECTED WRITE =================
                        .requestMatchers(HttpMethod.POST,
                                "/api/size-systems/**",
                                "/api/materials/**",
                                "/api/shoe-categories/**",
                                "/api/genders/**",
                                "/api/products/**",
                                "/api/genders"
                        ).authenticated()

                        .requestMatchers(HttpMethod.PUT,
                                "/api/size-systems/**",
                                "/api/materials/**",
                                "/api/shoe-categories/**",
                                "/api/genders/**",
                                "/api/genders",
                        "/api/products/**"
                        ).authenticated()

                        .requestMatchers(HttpMethod.DELETE,
                                "/api/size-systems/**",
                                "/api/materials/**",
                                "/api/products/**",
                                "/api/shoe-categories/**",
                                "/api/genders/**",
                                "/api/genders"
                        ).authenticated()

                        // -------------------------
                        //   Any other request
                        // -------------------------
                        .anyRequest().authenticated()
                )

                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Allow ALL origins (Flutter, emulator, real devices, web)
        config.setAllowedOriginPatterns(List.of("*"));

        config.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"
        ));

        config.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Accept",
                "Origin"
        ));

        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
