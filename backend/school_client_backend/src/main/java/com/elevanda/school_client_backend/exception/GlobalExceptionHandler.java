package com.elevanda.school_client_backend.exception;


import com.elevanda.school_client_backend.common.StandardApiResponse;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.HashMap;
import java.util.Map;
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Validation errors from @Valid
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<StandardApiResponse<Map<String, String>>> handleValidationErrors(
            MethodArgumentNotValidException ex
    ) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new StandardApiResponse<>(false, "Validation failed", errors));
    }

    // Resource not found
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<StandardApiResponse<String>> handleUserNotFound(UserNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new StandardApiResponse<>(false, ex.getMessage(), null));
    }

    // Duplicate fields (custom exceptions)
    @ExceptionHandler({DuplicateEmailException.class, DuplicatePhoneException.class})
    public ResponseEntity<StandardApiResponse<String>> handleDuplicateFields(RuntimeException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new StandardApiResponse<>(false, ex.getMessage(), null));
    }

    // Authentication errors
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<StandardApiResponse<String>> handleAuthentication(AuthenticationException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new StandardApiResponse<>(false, ex.getMessage(), null));
    }

    // Invalid password
    @ExceptionHandler(PasswordMismatchException.class)
    public ResponseEntity<StandardApiResponse<String>> handlePasswordMismatch(PasswordMismatchException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new StandardApiResponse<>(false, ex.getMessage(), null));
    }

    // Invalid tokens or OTPs
    @ExceptionHandler({InvalidTokenException.class, InvalidOtpException.class})
    public ResponseEntity<StandardApiResponse<String>> handleInvalidTokenOrOtp(RuntimeException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new StandardApiResponse<>(false, ex.getMessage(), null));
    }

    // Database constraint violations (e.g., unique constraint, foreign key)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<StandardApiResponse<Void>> handleDataIntegrity(DataIntegrityViolationException ex) {
        String message = "Database constraint violation";

        Throwable cause = ex.getCause();
        if (cause instanceof ConstraintViolationException hibernateEx) {
            String constraint = hibernateEx.getConstraintName();
            if ("UKostq1ec3toafnjok09y9l7dox".equals(constraint)) {
                message = "Product slug already exists. Please choose a different slug.";
            }
        }

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new StandardApiResponse<>(false, message, null));
    }

    // Catch-all for all other unhandled exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<StandardApiResponse<Void>> handleAllExceptions(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new StandardApiResponse<>(false, "An unexpected error occurred", null));
    }


    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<StandardApiResponse<String>> handleNoHandlerFound(NoHandlerFoundException ex) {
        String message = String.format("Resource not found: %s", ex.getRequestURL());
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new StandardApiResponse<>(false, message, null));
    }
}
