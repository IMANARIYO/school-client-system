package com.elevanda.school_client_backend.config;



import com.elevanda.school_client_backend.common.StandardApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    public CustomAccessDeniedHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException
    ) throws IOException, ServletException {

        // Polite guiding message
        String message = "You are logged in but do not have permission to access this resource. " +
                "Please contact your administrator if you think this is an error.";

        // Include useful context in data
        Map<String, Object> data = new HashMap<>();
        data.put("timestamp", LocalDateTime.now());
        data.put("reason", "Forbidden access");
        data.put("requestedUri", request.getRequestURI());
        data.put("httpMethod", request.getMethod());
        data.put("userMessage", "Check your role or permissions to access this endpoint.");

        StandardApiResponse<Map<String, Object>> apiResponse =
                new StandardApiResponse<Map<String, Object>>(false,
                        message,
                        data);

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
    }
}
