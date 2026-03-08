package com.elevanda.school_client_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignStudentsRequestDTO {

    @NotNull(message = "Class ID is required")
    @Schema(description = "Class ID", example = "1")
    private Long classId;

    @NotEmpty(message = "At least one student ID is required")
    @Schema(description = "List of student IDs to assign", example = "[1, 2, 3]")
    private List<Long> studentIds;
}
