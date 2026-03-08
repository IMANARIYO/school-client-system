package com.elevanda.school_client_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassRequestDTO {

    @NotBlank(message = "Class name is required")
    @Schema(description = "Name of the class", example = "Mathematics A")
    private String name;

    @NotBlank(message = "Grade level is required")
    @Schema(description = "Grade level", example = "10")
    private String gradeLevel;

    @Schema(description = "Section", example = "A")
    private String section;

    @Schema(description = "Class representative student ID")
    private Long classRepresentativeId;

    @Schema(description = "Responsible teacher ID")
    private Long responsibleTeacherId;

    @Positive(message = "Capacity must be positive")
    @Schema(description = "Maximum capacity", example = "40")
    private Integer capacity;

    @Schema(description = "Room number", example = "101")
    private String roomNumber;

    @Schema(description = "Additional notes")
    private String notes;
}
