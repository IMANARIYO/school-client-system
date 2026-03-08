package com.elevanda.school_client_backend.mappers;

import com.elevanda.school_client_backend.dto.ClassRequestDTO;
import com.elevanda.school_client_backend.dto.ClassResponseDTO;
import com.elevanda.school_client_backend.model.SchoolClass;
import org.springframework.stereotype.Component;

@Component
public class ClassMapper {

    public ClassResponseDTO toResponseDTO(SchoolClass schoolClass) {
        if (schoolClass == null) return null;

        return ClassResponseDTO.builder()
                .id(schoolClass.getId())
                .name(schoolClass.getName())
                .gradeLevel(schoolClass.getGradeLevel())
                .section(schoolClass.getSection())
                .classRepresentativeId(schoolClass.getClassRepresentative() != null ? 
                        schoolClass.getClassRepresentative().getId() : null)
                .classRepresentativeName(schoolClass.getClassRepresentative() != null ? 
                        schoolClass.getClassRepresentative().getUser().getFirstName() + " " + 
                        schoolClass.getClassRepresentative().getUser().getLastName() : null)
                .responsibleTeacherId(schoolClass.getResponsibleTeacher() != null ? 
                        schoolClass.getResponsibleTeacher().getId() : null)
                .responsibleTeacherName(schoolClass.getResponsibleTeacher() != null ? 
                        schoolClass.getResponsibleTeacher().getUser().getFirstName() + " " + 
                        schoolClass.getResponsibleTeacher().getUser().getLastName() : null)
                .capacity(schoolClass.getCapacity())
                .roomNumber(schoolClass.getRoomNumber())
                .notes(schoolClass.getNotes())
                .createdAt(schoolClass.getCreatedAt())
                .updatedAt(schoolClass.getUpdatedAt())
                .build();
    }

    public SchoolClass toEntity(ClassRequestDTO dto) {
        if (dto == null) return null;

        return SchoolClass.builder()
                .name(dto.getName())
                .gradeLevel(dto.getGradeLevel())
                .section(dto.getSection())
                .capacity(dto.getCapacity())
                .roomNumber(dto.getRoomNumber())
                .notes(dto.getNotes())
                .build();
    }

    public void updateEntity(SchoolClass schoolClass, ClassRequestDTO dto) {
        if (dto.getName() != null) schoolClass.setName(dto.getName());
        if (dto.getGradeLevel() != null) schoolClass.setGradeLevel(dto.getGradeLevel());
        if (dto.getSection() != null) schoolClass.setSection(dto.getSection());
        if (dto.getCapacity() != null) schoolClass.setCapacity(dto.getCapacity());
        if (dto.getRoomNumber() != null) schoolClass.setRoomNumber(dto.getRoomNumber());
        if (dto.getNotes() != null) schoolClass.setNotes(dto.getNotes());
    }
}
