package com.elevanda.school_client_backend.mappers;


import com.elevanda.school_client_backend.dto.UserRequestDTO;
import com.elevanda.school_client_backend.dto.UserResponseDTO;
import com.elevanda.school_client_backend.model.User;

public class UserMapper {

    // DTO -> Entity
    public static User toEntity(UserRequestDTO dto) {
        if (dto == null) return null;

        return User.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .password(dto.getPassword())
                .build();
    }

    // Entity -> Response DTO
    public static UserResponseDTO toResponse(User user) {
        if (user == null) return null;

        return UserResponseDTO.builder()
                .id(user.getId())
                .imageUrl(user.getImageUrl())
                .fullName(user.getFirstName()+ user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .status(user.getStatus())
                .isEmailVerified(user.getIsEmailVerified())
                .isPhoneVerified(user.getIsPhoneVerified())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
//                .lastLoginAt(user.getLas)
                .build();
    }


}
