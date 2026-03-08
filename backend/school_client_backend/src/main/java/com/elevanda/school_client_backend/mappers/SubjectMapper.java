package com.elevanda.school_client_backend.mappers;

import com.elevanda.school_client_backend.dto.SubjectRequestDTO;
import com.elevanda.school_client_backend.dto.SubjectResponseDTO;
import com.elevanda.school_client_backend.model.Subject;
import org.springframework.stereotype.Component;

@Component
public class SubjectMapper {

    public SubjectResponseDTO toResponseDTO(Subject subject) {
        if (subject == null) return null;

        return SubjectResponseDTO.builder()
                .id(subject.getId())
                .name(subject.getName())
                .description(subject.getDescription())
                .createdAt(subject.getCreatedAt())
                .updatedAt(subject.getUpdatedAt())
                .build();
    }

    public Subject toEntity(SubjectRequestDTO dto) {
        if (dto == null) return null;

        return Subject.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
    }

    public void updateEntity(Subject subject, SubjectRequestDTO dto) {
        if (dto.getName() != null) subject.setName(dto.getName());
        if (dto.getDescription() != null) subject.setDescription(dto.getDescription());
    }
}
