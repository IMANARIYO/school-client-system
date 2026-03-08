package com.elevanda.school_client_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateStudentRequestDTO {

    @NotNull(message = "User ID is required")
    @Schema(description = "User ID to convert to student", example = "1")
    private Long userId;

    @NotNull(message = "Parent ID is required")
    @Schema(description = "Parent ID", example = "1")
    private Long parentId;

    @NotNull(message = "Class ID is required")
    @Schema(description = "Class ID", example = "1")
    private Long classId;

    @NotNull(message = "Date of birth is required")
    @Schema(description = "Date of birth", example = "2010-05-15")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Gender is required")
    @Schema(description = "Gender", example = "Male")
    private String gender;

    @Schema(description = "Place of birth", example = "New York")
    private String placeOfBirth;

    @NotNull(message = "Enrollment date is required")
    @Schema(description = "Enrollment date", example = "2024-01-01")
    private LocalDate enrollmentDate;

    @Schema(description = "Roll number", example = "2024001")
    private String rollNumber;

    @Schema(description = "Current grade", example = "10")
    private String currentGrade;

    @Schema(description = "Section", example = "A")
    private String section;

    @Schema(description = "Previous school", example = "ABC School")
    private String previousSchool;

    @Schema(description = "Phone", example = "+1234567890")
    private String phone;

    @Schema(description = "Email", example = "student@school.com")
    private String email;

    @Schema(description = "Blood group", example = "O+")
    private String bloodGroup;

    @Schema(description = "Medical conditions", example = "None")
    private String medicalConditions;

    @Schema(description = "Special needs", example = "None")
    private String specialNeeds;
}
