package com.elevanda.school_client_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateTeacherRequestDTO {

    @NotNull(message = "User ID is required")
    @Schema(description = "User ID to convert to teacher", example = "1")
    private Long userId;

    @Schema(description = "Date of birth", example = "1985-05-15")
    private LocalDate dateOfBirth;

    @Schema(description = "Gender", example = "Male")
    private String gender;

    @Schema(description = "Address line 1", example = "123 Main Street")
    private String addressLine1;

    @Schema(description = "Address line 2", example = "Apt 4B")
    private String addressLine2;

    @Schema(description = "City", example = "New York")
    private String city;

    @Schema(description = "State", example = "NY")
    private String state;

    @Schema(description = "Postal code", example = "10001")
    private String postalCode;

    @Schema(description = "Country", example = "USA")
    private String country;

    @Schema(description = "Phone number", example = "+1234567890")
    private String phone;

    @Schema(description = "Email", example = "teacher@school.com")
    private String email;

    @Schema(description = "Emergency contact name", example = "John Doe")
    private String emergencyContactName;

    @Schema(description = "Emergency contact phone", example = "+1234567891")
    private String emergencyContactPhone;

    @Schema(description = "Blood group", example = "O+")
    private String bloodGroup;

    @Schema(description = "Medical conditions", example = "None")
    private String medicalConditions;

    @Schema(description = "Hire date", example = "2024-01-01")
    private LocalDate hireDate;

    @Schema(description = "Employment type", example = "FULL_TIME")
    private String employmentType;

    @Schema(description = "Specialization", example = "Mathematics")
    private String specialization;

    @Schema(description = "Qualification", example = "MSc in Mathematics")
    private String qualification;

    @Schema(description = "Years of experience", example = "5")
    private Integer yearsOfExperience;

    @Schema(description = "List of subject IDs the teacher can teach", example = "[1, 2, 3]")
    private List<Long> subjectIds;

    @Schema(description = "Grade levels can teach", example = "9, 10, 11, 12")
    private String gradeLevelsCanTeach;

    @Schema(description = "Bank name", example = "Bank of America")
    private String bankName;

    @Schema(description = "Bank branch", example = "Main Branch")
    private String bankBranch;

    @Schema(description = "Account number", example = "1234567890")
    private String accountNumber;

    @Schema(description = "Account type", example = "SAVINGS")
    private String accountType;

    @Schema(description = "Salary", example = "50000.00")
    private BigDecimal salary;

    @Schema(description = "Tax ID", example = "123-45-6789")
    private String taxId;

    @Schema(description = "Staff ID", example = "STAFF001")
    private String staffId;
}
