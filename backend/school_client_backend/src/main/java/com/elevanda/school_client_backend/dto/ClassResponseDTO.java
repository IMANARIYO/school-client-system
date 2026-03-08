package com.elevanda.school_client_backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassResponseDTO {

    private Long id;
    private String name;
    private String gradeLevel;
    private String section;
    private Long classRepresentativeId;
    private String classRepresentativeName;
    private Long responsibleTeacherId;
    private String responsibleTeacherName;
    private Integer capacity;
    private String roomNumber;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
