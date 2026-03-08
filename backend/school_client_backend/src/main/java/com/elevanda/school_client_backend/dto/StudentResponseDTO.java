package com.elevanda.school_client_backend.dto;

import lombok.*;
import java.time.LocalDate;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResponseDTO {

    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String rollNumber;
    private String gender;
    private LocalDate dateOfBirth;
    private LocalDate enrollmentDate;
    private String enrollmentStatus;
    private Long classId;
    private String className;
}
