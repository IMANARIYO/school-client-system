package com.elevanda.school_client_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignTeacherRequestDTO {

    @NotNull(message = "Teacher ID is required")
    @Schema(description = "Teacher ID to assign", example = "1")
    private Long teacherId;
}
