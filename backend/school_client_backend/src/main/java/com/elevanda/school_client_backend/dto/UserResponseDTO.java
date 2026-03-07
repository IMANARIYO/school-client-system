package com.elevanda.school_client_backend.dto;


import com.elevanda.school_client_backend.enums.Role;
import com.elevanda.school_client_backend.enums.UsersStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {

    // ✅ Getters and Setters
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private Role role;
    private String imageUrl;
    private UsersStatus status;
    private Boolean isEmailVerified;
    private Boolean isPhoneVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLoginAt;
}