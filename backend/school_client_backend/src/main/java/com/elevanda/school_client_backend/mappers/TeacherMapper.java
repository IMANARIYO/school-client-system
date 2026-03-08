package com.elevanda.school_client_backend.mappers;

import com.elevanda.school_client_backend.dto.CreateTeacherRequestDTO;
import com.elevanda.school_client_backend.dto.TeacherResponseDTO;
import com.elevanda.school_client_backend.model.Teacher;
import org.springframework.stereotype.Component;

@Component
public class TeacherMapper {

    public TeacherResponseDTO toResponseDTO(Teacher teacher) {
        if (teacher == null) return null;

        return TeacherResponseDTO.builder()
                .id(teacher.getId())
                .userId(teacher.getUser() != null ? teacher.getUser().getId() : null)
                .firstName(teacher.getUser() != null ? teacher.getUser().getFirstName() : null)
                .lastName(teacher.getUser() != null ? teacher.getUser().getLastName() : null)
                .email(teacher.getEmail())
                .phone(teacher.getPhone())
                .dateOfBirth(teacher.getDateOfBirth())
                .gender(teacher.getGender())
                .addressLine1(teacher.getAddressLine1())
                .addressLine2(teacher.getAddressLine2())
                .city(teacher.getCity())
                .state(teacher.getState())
                .postalCode(teacher.getPostalCode())
                .country(teacher.getCountry())
                .emergencyContactName(teacher.getEmergencyContactName())
                .emergencyContactPhone(teacher.getEmergencyContactPhone())
                .bloodGroup(teacher.getBloodGroup())
                .medicalConditions(teacher.getMedicalConditions())
                .hireDate(teacher.getHireDate())
                .employmentType(teacher.getEmploymentType())
                .specialization(teacher.getSpecialization())
                .qualification(teacher.getQualification())
                .yearsOfExperience(teacher.getYearsOfExperience())
                .subjectsCanTeach(teacher.getSubjectsCanTeach())
                .gradeLevelsCanTeach(teacher.getGradeLevelsCanTeach())
                .bankName(teacher.getBankName())
                .bankBranch(teacher.getBankBranch())
                .accountNumber(teacher.getAccountNumber())
                .accountType(teacher.getAccountType())
                .salary(teacher.getSalary())
                .taxId(teacher.getTaxId())
                .staffId(teacher.getStaffId())
                .status(teacher.getStatus())
                .createdAt(teacher.getCreatedAt())
                .updatedAt(teacher.getUpdatedAt())
                .build();
    }

    public Teacher toEntity(CreateTeacherRequestDTO dto) {
        if (dto == null) return null;

        return Teacher.builder()
                .dateOfBirth(dto.getDateOfBirth())
                .gender(dto.getGender())
                .addressLine1(dto.getAddressLine1())
                .addressLine2(dto.getAddressLine2())
                .city(dto.getCity())
                .state(dto.getState())
                .postalCode(dto.getPostalCode())
                .country(dto.getCountry())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .emergencyContactName(dto.getEmergencyContactName())
                .emergencyContactPhone(dto.getEmergencyContactPhone())
                .bloodGroup(dto.getBloodGroup())
                .medicalConditions(dto.getMedicalConditions())
                .hireDate(dto.getHireDate())
                .employmentType(dto.getEmploymentType())
                .specialization(dto.getSpecialization())
                .qualification(dto.getQualification())
                .yearsOfExperience(dto.getYearsOfExperience())
                .subjectsCanTeach(dto.getSubjectIds())
                .gradeLevelsCanTeach(dto.getGradeLevelsCanTeach())
                .bankName(dto.getBankName())
                .bankBranch(dto.getBankBranch())
                .accountNumber(dto.getAccountNumber())
                .accountType(dto.getAccountType())
                .salary(dto.getSalary())
                .taxId(dto.getTaxId())
                .staffId(dto.getStaffId())
                .status("ACTIVE")
                .build();
    }
}
