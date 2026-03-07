package com.elevanda.school_client_backend.service.impl;


import com.elevanda.school_client_backend.common.ImageUploadService;
import com.elevanda.school_client_backend.dto.*;
import com.elevanda.school_client_backend.exception.*;

import com.elevanda.school_client_backend.enums.Role;

import com.elevanda.school_client_backend.mappers.UserMapper;
import com.elevanda.school_client_backend.model.User;
import com.elevanda.school_client_backend.model.UserPrincipal;
import com.elevanda.school_client_backend.repository.UserRepository;
import com.elevanda.school_client_backend.service.EmailService;
import com.elevanda.school_client_backend.service.JWTService;

import com.elevanda.school_client_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.MessageFormat;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Implementation of UserService.
 * Handles CRUD operations, authentication, password management, and refresh token logic.
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private final JWTService jwtService;

    @Value("${app.base-url}")
    private String baseUrl;
    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final PasswordEncoder myPasswordEncoder;

    @Autowired
    private final AuthenticationManager authenticationManager;

    private final ImageUploadService imageUploadService;
    private final EmailService emailService;

    public UserServiceImpl(JWTService jwtService, UserRepository userRepository,
                           PasswordEncoder myPasswordEncoder, AuthenticationManager authenticationManager,
                           ImageUploadService imageUploadService, EmailService emailService) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.myPasswordEncoder = myPasswordEncoder;
        this.authenticationManager = authenticationManager;
        this.imageUploadService = imageUploadService;
        this.emailService = emailService;
    }

    // ---------------- CRUD ----------------
    @Override
    public UserResponseDTO createUser(UserRequestDTO userRequestDTO) {
        if (userRepository.existsByEmail(String.valueOf(userRequestDTO.getEmail()))) {
            throw new DuplicateEmailException(MessageFormat.format("Email already in use: {0}", userRequestDTO.getEmail()));
        }
        if (userRepository.existsByPhoneNumber(userRequestDTO.getPhoneNumber())) {
            throw new DuplicatePhoneException("Phone number already in use: " + userRequestDTO.getPhoneNumber());
        }

        User user = UserMapper.toEntity(userRequestDTO);

        if (userRequestDTO.getImageUrl() != null && !userRequestDTO.getImageUrl().isEmpty()) {
            String uploadedImageUrl = imageUploadService.uploadImage(userRequestDTO.getImageUrl());
            user.setImageUrl(uploadedImageUrl);
        }

        user.setPassword(myPasswordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return UserMapper.toResponse(savedUser);
    }

    @Override
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        return UserMapper.toResponse(user);
    }

    @Override
    public Page<UserResponseDTO> getAllUsers(String search, Pageable pageable) {
        Page<User> usersPage;
        if (search != null && !search.isEmpty()) {
            usersPage = userRepository.findAll((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("fullName")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("email")), "%" + search.toLowerCase() + "%")
            ), pageable);
        } else {
            usersPage = userRepository.findAll(pageable);
        }
        return usersPage.map(UserMapper::toResponse);
    }

    @Override
    public UserResponseDTO updateUser(Long id, UserRequestDTO userRequestDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        user.setFirstName(userRequestDTO.getFirstName());
        user.setEmail(userRequestDTO.getEmail());
        user.setPhoneNumber(userRequestDTO.getPhoneNumber());

        if (userRequestDTO.getImageUrl() != null && !userRequestDTO.getImageUrl().isEmpty()) {
            if (user.getImageUrl() != null &&
                    !user.getImageUrl().contains("https://www.pngall.com/wp-content/uploads/5/Profile.png")) {
                imageUploadService.deleteImage(user.getImageUrl());
            }
            String uploadedImageUrl = imageUploadService.uploadImage(userRequestDTO.getImageUrl());
            user.setImageUrl(uploadedImageUrl);
        }

        User updatedUser = userRepository.save(user);
        return UserMapper.toResponse(updatedUser);
    }

    @Override
    public UserResponseDTO updateUserRole(Long id, Role role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        if (role == null) throw new IllegalArgumentException("Role must be provided");
        user.setRole(role);
        User updatedUser = userRepository.save(user);
        return UserMapper.toResponse(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        if (user.getImageUrl() != null &&
                !user.getImageUrl().isBlank() &&
                !user.getImageUrl().contains("https://www.pngall.com/wp-content/uploads/5/Profile.png")) {
            imageUploadService.deleteImage(user.getImageUrl());
        }
        userRepository.deleteById(id);
    }

    @Override
    public UserResponseDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
        return UserMapper.toResponse(user);
    }

    // ---------------- AUTHENTICATION ----------------

    @Override
    public UserResponseDTO signup(UserRequestDTO userRequestDTO) {
        // Step 1: Create the user (will throw DuplicateEmailException or DuplicatePhoneException if needed)
        UserResponseDTO response = createUser(userRequestDTO);

        // Step 2: Retrieve the created user or throw a UserNotFoundException (handled globally)
        User user = userRepository.findByEmail(response.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found after creation"));

        // Step 3: Generate email verification token
        String token = UUID.randomUUID().toString();
        user.setEmailVerificationToken(token);
        user.setEmailVerificationExpiry(LocalDateTime.now().plusHours(24));
        userRepository.save(user);

        // Step 4: Send verification email
        String subject = "Verify your email";
        String verificationUrl = baseUrl + "/api/v1/users/verify-email?token=" + token;

        String body = "<h3>Hi " + user.getFirstName() + " " + user.getLastName() + ",</h3>" +
                "<p>Please verify your email by clicking the link below:</p>" +
                "<a href=\"" + verificationUrl + "\">Verify Email</a>";

        try {
            emailService.sendSimpleEmail(user.getEmail(), subject, body);
        } catch (Exception e) {
            // Wrap any email sending failure into a RuntimeException to trigger global handler
            throw new RuntimeException("Failed to send verification email", e);
        }

        return response;
    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
            String accessToken = jwtService.generateAccessToken(principal);
            String refreshToken = jwtService.generateRefreshToken(principal);
            return new AuthResponseDTO(principal.getUsername(), accessToken, refreshToken);
        } catch (Exception ex) {
            throw new AuthenticationException("Invalid email or password");
        }
    }

    @Override
    public UserResponseDTO getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AuthenticationException("No authenticated user found");
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserPrincipal userPrincipal)) {
            throw new AuthenticationException("Invalid authentication principal");
        }

        Long userId = userPrincipal.getUser().getId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        return UserMapper.toResponse(user);
    }

    @Override
    public UserResponseDTO getCurrentUserProfile() {
        return getCurrentUser();
    }

    // ---------------- PASSWORD MANAGEMENT ----------------
    @Override
    public void changePassword(ChangePasswordRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + request.getEmail()));

        if (!myPasswordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new PasswordMismatchException("Old password is incorrect");
        }

        user.setPassword(myPasswordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public void resetPassword(ResetPasswordRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + request.getEmail()));

        user.setPassword(myPasswordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public void resetPasswordWithOtp(String email, String otpCode, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        if (user.isOtpValid(otpCode)) {
            throw new InvalidOtpException("Invalid or expired OTP");
        }

        user.setPassword(myPasswordEncoder.encode(newPassword));
        user.clearOtp();
        userRepository.save(user);

        String subject = "Password Reset Confirmation";
        String body = "<p>Dear " + user.getFirstName() +user.getLastName()+ ",</p>" +
                "<p>Your password has been successfully reset.</p>" +
                "<p>If you did not initiate this request, please contact support immediately.</p>";
        emailService.sendSimpleEmail(user.getEmail(), subject, body);
    }

    // ---------------- REFRESH TOKEN ----------------
    @Override
    public AuthResponseDTO refreshAccessToken(String refreshToken) {
        String email = jwtService.extractEmailAllowExpired(refreshToken);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        if (!jwtService.isRefreshTokenValid(refreshToken, new UserPrincipal(user))) {
            throw new InvalidTokenException("Invalid or expired refresh token");
        }

        String newAccessToken = jwtService.generateAccessToken(new UserPrincipal(user));
        return new AuthResponseDTO(user.getEmail(), newAccessToken, refreshToken);
    }

    // ---------------- OTP METHODS ----------------
    @Override
    public void generateOtp(String email, int minutesValid) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        String otp = String.format("%06d", ThreadLocalRandom.current().nextInt(0, 1_000_000));
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(minutesValid));
        userRepository.save(user);

        String subject = "Password Reset Verification Code";
        String body = """
                <html>
                    <body>
                        <p>Hi %s,</p>
                        <p>You recently requested to reset your password. Use the code below to proceed:</p>
                        <h2 style="color: #2e6c80;">%s</h2>
                        <p>This code will expire in %d minutes.</p>
                        <p>If you did not request this, please ignore this email.</p>
                        <p>Thank you,<br/>Your Company Name</p>
                    </body>
                </html>
                """.formatted(user.getFirstName() +user.getLastName(), otp, minutesValid);

        emailService.sendSimpleEmail(user.getEmail(), subject, body);
    }

    @Override
    public boolean verifyEmail(String token) {
        User user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid verification token"));

        if (user.getEmailVerificationExpiry().isBefore(LocalDateTime.now())) {
            throw new InvalidTokenException("Verification token has expired");
        }

        user.setIsEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setEmailVerificationExpiry(null);
        userRepository.save(user);

        String subject = "Email successfully verified";
        String body = "<p>Hi " + user.getFirstName() +user.getLastName()+ ",</p>" +
                "<p>Your email has been successfully verified. You can now login.</p>";
        emailService.sendSimpleEmail(user.getEmail(), subject, body);

        return true;
    }

    @Override
    public boolean verifyOtp(String email, String otpCode) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        if (user.isOtpValid(otpCode)) {
            throw new InvalidOtpException("Invalid or expired OTP");
        }

        user.clearOtp();
        userRepository.save(user);
        return true;
    }
}
