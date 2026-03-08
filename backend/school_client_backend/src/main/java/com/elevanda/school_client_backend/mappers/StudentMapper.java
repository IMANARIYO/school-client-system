package com.elevanda.school_client_backend.mappers;

import com.elevanda.school_client_backend.dto.CreateStudentRequestDTO;
import com.elevanda.school_client_backend.dto.StudentResponseDTO;
import com.elevanda.school_client_backend.model.Student;
import org.springframework.stereotype.Component;

@Component
public class StudentMapper {

    public StudentResponseDTO toResponseDTO(Student student) {
        if (student == null) return null;

        return StudentResponseDTO.builder()
                .id(student.getId())
                .userId(student.getUser() != null ? student.getUser().getId() : null)
                .firstName(student.getUser() != null ? student.getUser().getFirstName() : null)
                .lastName(student.getUser() != null ? student.getUser().getLastName() : null)
                .email(student.getEmail())
                .phone(student.getPhone())
                .rollNumber(student.getRollNumber())
                .gender(student.getGender())
                .dateOfBirth(student.getDateOfBirth())
                .enrollmentDate(student.getEnrollmentDate())
                .enrollmentStatus(student.getEnrollmentStatus())
                .classId(student.getSchoolClass() != null ? student.getSchoolClass().getId() : null)
                .className(student.getSchoolClass() != null ? student.getSchoolClass().getName() : null)
                .build();
    }
    
    public Student toEntity(CreateStudentRequestDTO dto) {
        if (dto == null) return null;

        return Student.builder()
                .dateOfBirth(dto.getDateOfBirth())
                .gender(dto.getGender())
                .placeOfBirth(dto.getPlaceOfBirth())
                .enrollmentDate(dto.getEnrollmentDate())
                .enrollmentStatus("ACTIVE")
                .rollNumber(dto.getRollNumber())
                .currentGrade(dto.getCurrentGrade())
                .section(dto.getSection())
                .previousSchool(dto.getPreviousSchool())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .bloodGroup(dto.getBloodGroup())
                .medicalConditions(dto.getMedicalConditions())
                .specialNeeds(dto.getSpecialNeeds())
                .build();
    }
}
