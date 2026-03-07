package com.elevanda.school_client_backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                // API Info
                .info(new Info()
                        .title("Inventory Management System API")
                        .version("1.0.0")
                        .description("Spring Boot REST API for managing inventory users and authentication.")
                        .termsOfService("https://example.com/terms")
                        .contact(new Contact()
                                .name("IMANARIYO Baptiste")
                                .email("imanariyobaptiste@gmail.com")
                                .url("https://baptiste-portfolio.vercel.app/")
                                )
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html"))
                )
                // Servers
                .servers(List.of(
                        new Server().url("http://localhost:8081").description("Local Development Server"),
                        new Server().url("https://dev.example.com").description("Development Server"),
                        new Server().url("https://staging.example.com").description("Staging Server"),
                        new Server().url("https://api.example.com").description("Production Server")
                ))
                // Global JWT Security
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                        )

                ) .addTagsItem(new Tag().name("Authentication").description("APIs for login, signup, and OTP"))
                .addTagsItem(new Tag().name("Email Verification").description("Verify a user's email using the token sent during signup"))
                .addTagsItem(new Tag().name("Password Management").description("APIs for changing or resetting passwords"))
                .addTagsItem(new Tag().name("User Management").description("APIs for fetching and managing users"))
        ;

    }
}
