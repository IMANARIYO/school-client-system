package com.elevanda.school_client_backend.config;

import java.util.List;

public class PublicEndpoints {
    public static final List<String> ENDPOINTS = List.of(

            // -------------------------
            //   Public Authentication URLs individually
            // -------------------------
            "/api/v1/users/signup",
            "/api/v1/users/login",
            "/api/users/forgot-password",
            "/api/users/reset-password/otp",
            "/api/users/reset-password",
            "/api/users/verify-email",

            "/api/v1/users/verify-email",
            // -------------------------
            //   Public Swagger / API Docs individually
            // -------------------------
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/v3/api-docs/**",
            "/swagger-resources/**",
            "/webjars/**",
            "/api-docs/**",
            "/api-docs.yaml",
            "/api-documentation/**",
            "/v3/api-docs/swagger-config",


            // -------------------------
            //   Public content URLs individually
            // -------------------------
            "/api/public/items",
            "/api/public/categories",
            "/api/public/posts",
            "/api/public/blogs",
            "/api/public/pictures"
    );
}
