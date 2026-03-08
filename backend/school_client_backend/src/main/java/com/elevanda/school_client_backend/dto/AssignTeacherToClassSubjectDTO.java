package com.elevanda.school_client_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignTeacherToClassSubjectDTO {

    @NotNull(message = "Teacher ID is required")
    @Schema(description = "Teacher ID", example = "1")
    private Long teacherId;

    @NotNull(message = "Class ID is required")
    @Schema(description = "Class ID", example = "1")
    private Long classId;

    @NotNull(message = "Subject ID is required")
    @Schema(description = "Subject ID", example = "1")
    private Long subjectId;
}
