package com.elevanda.school_client_backend.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;


/**
 * DTO for creating or updating a User.
 * Includes validation rules, default values, and uses Lombok for boilerplate reduction.
 */

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class UserRequestDTO {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    @Schema(description = "Full name of the user", example = "John Doe")
    private String firstName;

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    @Schema(description = "Full name of the user", example = "John Doe")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Pattern(
            regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
            message = "Email must be a valid format (e.g., user@example.com)"
    )
    @Schema(description = "User's email address", example = "imanariyobaptiste@gmail.com")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Schema(description = "User password", example = "P@ssw0rd123")
    private String password;

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^\\+?[1-9]\\d{7,14}$",
            message = "Phone number must be valid (E.164 format, e.g., +250787795163)"
    )
    @Schema(description = "User phone number", example = "+250787795163")
    private String phoneNumber;

    @Schema(description = "Optional profile image", type = "binary", format = "binary")
    private MultipartFile imageUrl;

}
