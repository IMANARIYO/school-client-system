package com.elevanda.school_client_backend.mappers;

import com.elevanda.school_client_backend.dto.CreateParentRequestDTO;
import com.elevanda.school_client_backend.dto.ParentResponseDTO;
import com.elevanda.school_client_backend.model.Parent;
import org.springframework.stereotype.Component;

@Component
public class ParentMapper {

    public ParentResponseDTO toResponseDTO(Parent parent) {
        if (parent == null) return null;

        return ParentResponseDTO.builder()
                .id(parent.getId())
                .userId(parent.getUser() != null ? parent.getUser().getId() : null)
                .firstName(parent.getUser() != null ? parent.getUser().getFirstName() : null)
                .lastName(parent.getUser() != null ? parent.getUser().getLastName() : null)
                .email(parent.getUser() != null ? parent.getUser().getEmail() : null)
                .phone(parent.getPhone())
                .createdAt(parent.getCreatedAt())
                .updatedAt(parent.getUpdatedAt())
                .build();
    }

    public Parent toEntity(CreateParentRequestDTO dto) {
        if (dto == null) return null;

        return Parent.builder()
                .phone(dto.getPhone())
                .build();
    }
}
