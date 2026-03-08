package com.elevanda.school_client_backend.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherResponseDTO {

    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String bloodGroup;
    private String medicalConditions;
    private LocalDate hireDate;
    private String employmentType;
    private String specialization;
    private String qualification;
    private Integer yearsOfExperience;
    private String subjectsCanTeach;
    private String gradeLevelsCanTeach;
    private String bankName;
    private String bankBranch;
    private String accountNumber;
    private String accountType;
    private BigDecimal salary;
    private String taxId;
    private String staffId;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
