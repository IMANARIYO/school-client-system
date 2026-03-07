package com.elevanda.school_client_backend.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO for resetting a user's password using OTP.
 * Includes validation rules and professional messages.
 */
@Setter
@Getter
@Schema(description = "Data required to reset password using OTP")
public class ResetPasswordWithOtpRequestDTO {

    // Getters and setters
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Pattern(
            regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
            message = "Email must be in a valid format (e.g., user@example.com)"
    )
    @Schema(description = "User's email address", example = "imanariyobaptiste@gmail.com")
    private String email;

    @NotBlank(message = "OTP code is required")
    @Size(min = 6, max = 6, message = "OTP code must be 6 digits")
    @Pattern(regexp = "\\d{6}", message = "OTP code must be numeric")
    @Schema(description = "6-digit OTP sent to the user's email", example = "123456")
    private String otpCode;

    @NotBlank(message = "New password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Schema(description = "New password to set", example = "NewP@ssw0rd123")
    private String newPassword;

}
