package com.elevanda.school_client_backend.controller;

import com.elevanda.school_client_backend.common.PaginatedResponse;
import com.elevanda.school_client_backend.common.StandardApiResponse;
import com.elevanda.school_client_backend.dto.*;


import com.elevanda.school_client_backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;


@RestController
@RequestMapping("/api/v1/users")

public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ---------------- AUTHENTICATION ----------------
    @Operation(
            summary = "Register a new user",
            description = "Sign up a new user",
            tags = {"Authentication"}
    )
    @PostMapping(value = "/signup", consumes = "multipart/form-data")
    public ResponseEntity<StandardApiResponse<UserResponseDTO>> signup(@Valid UserRequestDTO userRequestDTO) {
        UserResponseDTO user = userService.signup(userRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(new StandardApiResponse<>(true, "User registered successfully", user));
    }

    @Operation(
            summary = "User login",
            description = "Authenticate a user and return a token",
            tags = {"Authentication"}
    )
    @PostMapping("/login")
    public ResponseEntity<StandardApiResponse<AuthResponseDTO>> login(@Valid @RequestBody LoginRequestDTO loginRequest) {

        System.out.println("LOGIN ENDPOINT HIT");
        System.out.println("Email: " + loginRequest.getEmail());

        AuthResponseDTO authResponse = userService.login(loginRequest);

        System.out.println("LOGIN SUCCESSFUL");
        System.out.println("Token: " + authResponse.getToken());

        return ResponseEntity.ok(
                new StandardApiResponse<>(true, "Login successful", authResponse)
        );
    }
    @Operation(
            summary = "Refresh access token",
            description = "Use a valid refresh token to get a new access token",
            tags = {"Authentication"}
    )
    @PostMapping("/refresh-token")
    public ResponseEntity<StandardApiResponse<AuthResponseDTO>> refreshToken(@RequestParam("refreshToken") String refreshToken) {
        AuthResponseDTO newTokens = userService.refreshAccessToken(refreshToken);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Access token refreshed successfully", newTokens));
    }






    // ---------------- EMAIL VERIFICATION ----------------
    @Operation(
            summary = "Verify email",
            description = "Verify a user's email using the token sent during signup",
            tags = {"Email Verification"}
    )
    @GetMapping("/verify-email")
    public void verifyEmail(@RequestParam("token") String token, HttpServletResponse response) throws IOException {
        boolean verified = userService.verifyEmail(token);
        if (verified) {
            // Redirect to your portfolio after successful verification
            response.sendRedirect("https://baptiste-portfolio.vercel.app/");
        } else {
            // Redirect to an error page or fallback page
            response.sendRedirect("https://baptiste-portfolio.vercel.app/error");
        }
    }
    @Operation(
            summary = "Request OTP",
            description = "Generates a 6-digit OTP for email verification or password reset. " +
                    "If an account exists, a professional email will be sent with instructions.",
            tags = {"Email Verification"}
    )
    @PostMapping("/generate-otp")
    public ResponseEntity<StandardApiResponse<Void>> generateOtp(
            @RequestParam String email,
            @RequestParam(defaultValue = "10") int minutesValid) {

        // Generate OTP for the email if the user exists
        userService.generateOtp(email, minutesValid); // OTP is sent via email internally

        // Return a generic success message
        String message = "If an account exists for this email, OTP instructions have been sent.";
        return ResponseEntity.ok(new StandardApiResponse<>(true, message, null));
    }


    @Operation(
            summary = "Verify OTP",
            description = "Verify a previously generated OTP",
            tags = {"Email Verification"}
    )
    @PostMapping("/verify-otp")
    public ResponseEntity<StandardApiResponse<Void>> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        boolean verified = userService.verifyOtp(email, otp);
        if (verified) {
            return ResponseEntity.ok(new StandardApiResponse<>(true, "OTP verified successfully", null));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new StandardApiResponse<>(false, "Invalid or expired OTP", null));
        }
    }


    // ---------------- PASSWORD MANAGEMENT ----------------
    @Operation(
            summary = "Admin reset user password",
            description = "Allows an admin to reset a user's password directly. This endpoint requires admin privileges.",
            tags = {"Password Management"}
    )
    @PostMapping("/admin/reset-password")
    public ResponseEntity<StandardApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequestDTO request) {
        userService.resetPassword(request);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Password reset instructions sent", null));
    }
    @Operation(
            summary = "Request password reset (Forgot Password)",
            description = "Generates a 6-digit OTP for password reset. " +
                    "If an account exists, a professional email will be sent with instructions.",
            tags = {"Password Management"}
    )
    @PostMapping("/forgot-password")
    public ResponseEntity<StandardApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDTO request) {

        // Generate OTP for the email if the user exists
        userService.generateOtp(request.getEmail(), 10); // OTP valid for 10 minutes

        // Always return a generic response
        String message = "If an account exists for this email, password reset instructions have been sent.";
        return ResponseEntity.ok(new StandardApiResponse<>(true, message, null));
    }
    // ---------------- PASSWORD MANAGEMENT ----------------
    @Operation(
            summary = "Reset password with OTP",
            description = "Allows a user to reset their password by providing a valid OTP. " +
                    "A professional confirmation email will be sent. " +
                    "The response is generic to avoid exposing whether the email exists.",
            tags = {"Password Management"}
    )
    @PostMapping("/reset-password/otp")
    public ResponseEntity<StandardApiResponse<Void>> resetPasswordWithOtp(
            @Valid @RequestBody ResetPasswordWithOtpRequestDTO request) {

        userService.resetPasswordWithOtp(request.getEmail(), request.getOtpCode(), request.getNewPassword());

        String message = "If the OTP is valid, your password has been reset successfully.";
        return ResponseEntity.ok(new StandardApiResponse<>(true, message, null));
    }


    @Operation(
            summary = "Change password",
            description = "Change password for the logged-in user",
            tags = {"Password Management"}
    )
    @PostMapping("/change-password")
    public ResponseEntity<StandardApiResponse<Void>> changePassword(@Valid @RequestBody ChangePasswordRequestDTO request) {
        userService.changePassword(request);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Password changed successfully", null));
    }

    // ---------------- USER INFO / MANAGEMENT ----------------
    @Operation(summary = "Get current logged-in user", description = "Retrieve information of the currently authenticated user", tags = {"User Management"})
    @GetMapping("/me")
    public ResponseEntity<StandardApiResponse<UserResponseDTO>> getCurrentUser() {
        UserResponseDTO user = userService.getCurrentUser();
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Current user retrieved successfully", user));
    }

    @Operation(summary = "Get current user profile", description = "Retrieve profile information of the currently authenticated user", tags = {"User Management"})
    @GetMapping("/profile")
    public ResponseEntity<StandardApiResponse<UserResponseDTO>> getCurrentUserProfile() {
        UserResponseDTO profile = userService.getCurrentUserProfile();
        return ResponseEntity.ok(new StandardApiResponse<>(true, "User profile retrieved successfully", profile));
    }

    @Operation(summary = "Get user by ID", description = "Retrieve a single user by their Long", tags = {"User Management"})
    @GetMapping("/{id}")
    public ResponseEntity<StandardApiResponse<UserResponseDTO>> getUserById(@PathVariable Long id) {
        UserResponseDTO user = userService.getUserById(id);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "User retrieved successfully", user));
    }

    @Operation(summary = "Get user by email", description = "Retrieve a single user by their email", tags = {"User Management"})
    @GetMapping("/email/{email}")
    public ResponseEntity<StandardApiResponse<UserResponseDTO>> getUserByEmail(@PathVariable String email) {
        UserResponseDTO user = userService.getUserByEmail(email);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "User retrieved successfully", user));
    }

    @Operation(summary = "List all users", description = "Retrieve a paginated list of users, optionally filtered by search text", tags = {"User Management"})
    @GetMapping
    public ResponseEntity<StandardApiResponse<PaginatedResponse<UserResponseDTO>>> getAllUsers(@RequestParam(required = false) String search, Pageable pageable) {
        Page<UserResponseDTO> page = userService.getAllUsers(search, pageable);
        PaginatedResponse<UserResponseDTO> response = PaginatedResponse.<UserResponseDTO>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
        return ResponseEntity.ok(new StandardApiResponse<PaginatedResponse<UserResponseDTO>>(true, "Users retrieved successfully", response));
    }

    @Operation(
            summary = "Update user details",
            description = "Update user basic info without changing profile image",
            tags = {"User Management"}
    )
    @PutMapping(value = "/{id}",  consumes = "multipart/form-data")
    public ResponseEntity<StandardApiResponse<UserResponseDTO>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserRequestDTO request
    ) {
        UserResponseDTO updated = userService.updateUser(id, request);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "User updated successfully", updated));
    }


    @Operation(summary = "Update user role", description = "Update the role of a user. Role must be a valid Role enum value.", tags = {"User Management"})
    @PatchMapping("/{id}/role")
    public ResponseEntity<StandardApiResponse<UserResponseDTO>> updateUserRole(@PathVariable Long id, @Valid @RequestBody UpdateUserRoleRequestDTO request) {
        UserResponseDTO updated = userService.updateUserRole(id, request.getRole());
        return ResponseEntity.ok(new StandardApiResponse<>(true, "User role updated successfully", updated));
    }

    @Operation(summary = "Delete a user", description = "Delete a user by their Long", tags = {"User Management"})
    @DeleteMapping("/{id}")
    public ResponseEntity<StandardApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "User deleted successfully", null));
    }
}
