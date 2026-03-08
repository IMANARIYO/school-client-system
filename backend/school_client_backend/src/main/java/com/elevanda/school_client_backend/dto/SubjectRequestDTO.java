package com.elevanda.school_client_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectRequestDTO {

    @NotBlank(message = "Subject name is required")
    @Schema(description = "Name of the subject", example = "Mathematics")
    private String name;

    @Schema(description = "Subject description", example = "Advanced mathematics covering algebra and calculus")
    private String description;
}
