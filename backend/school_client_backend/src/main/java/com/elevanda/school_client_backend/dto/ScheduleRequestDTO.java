package com.elevanda.school_client_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleRequestDTO {

    @NotNull(message = "Class ID is required")
    @Schema(description = "Class ID", example = "1")
    private Long classId;

    @NotNull(message = "Teacher ID is required")
    @Schema(description = "Teacher ID", example = "1")
    private Long teacherId;

    @NotNull(message = "Subject ID is required")
    @Schema(description = "Subject ID", example = "1")
    private Long subjectId;

    @NotBlank(message = "Day is required")
    @Schema(description = "Day of week", example = "MONDAY")
    private String day;

    @NotNull(message = "Start time is required")
    @Schema(description = "Start time", example = "09:00:00")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    @Schema(description = "End time", example = "10:00:00")
    private LocalTime endTime;
}
