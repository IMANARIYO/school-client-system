package com.elevanda.school_client_backend.service;


import com.elevanda.school_client_backend.dto.*;

import com.elevanda.school_client_backend.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


/**
 * Service interface for User operations.
 * Handles CRUD, authentication, password management, OTP generation/verification, and refresh token logic.
 */
public interface UserService {

    // ---------------- CRUD OPERATIONS ----------------
    UserResponseDTO createUser(UserRequestDTO userRequestDTO);  // Create a new user

    UserResponseDTO getUserById(Long id);                       // Get a user by ID

    Page<UserResponseDTO> getAllUsers(String search, Pageable pageable); // Get all users with optional search

    UserResponseDTO updateUser(Long id, UserRequestDTO userRequestDTO); // Update a user

    /**
     * Update a user's role. Role must be one of the values defined in the Role enum.
     *
     * @param id Long of the user
     * @param role New role for the user
     * @return updated UserResponseDTO
     */
    UserResponseDTO updateUserRole(Long id, Role role);

    void deleteUser(Long id);                                   // Delete a user by ID

    UserResponseDTO getUserByEmail(String email);              // Find a user by email

    // ---------------- AUTHENTICATION ----------------
    UserResponseDTO signup(UserRequestDTO userRequestDTO);     // Register new user

    AuthResponseDTO login(LoginRequestDTO loginRequest);       // Login user and generate JWT tokens

    UserResponseDTO getCurrentUser();                          // Get currently authenticated user

    UserResponseDTO getCurrentUserProfile();                    // Get current user profile

    // ---------------- PASSWORD MANAGEMENT ----------------
    void changePassword(ChangePasswordRequestDTO request);     // Change password for authenticated user

    void resetPassword(ResetPasswordRequestDTO request);      // Reset password directly (e.g., admin or system reset)

    void resetPasswordWithOtp(String email, String otpCode, String newPassword); // Reset password using OTP verification

    // ---------------- REFRESH TOKEN ----------------
    /**
     * Refreshes the access token using a valid refresh token.
     * @param refreshToken the refresh token provided by client
     * @return AuthResponseDTO containing new access token (and optionally a new refresh token)
     */
    AuthResponseDTO refreshAccessToken(String refreshToken);

    // ---------------- OTP MANAGEMENT ----------------
    /**
     * Generate a 6-digit numeric OTP for a given email.
     * Can be used for signup verification or password reset.
     *
     * @param email        user's email
     * @param minutesValid OTP expiration time in minutes
     */
    void generateOtp(String email, int minutesValid);
    /**
     * Verify a user's email using the token sent to them.
     * @param token the email verification token
     * @return true if email successfully verified
     */

    boolean verifyEmail(String token);
    /**
     * Verify a user's OTP.
     * @param email user's email
     * @param otpCode OTP to verify
     * @return true if OTP is valid, false otherwise
     */
    boolean verifyOtp(String email, String otpCode);
}
