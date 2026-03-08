package com.elevanda.school_client_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateParentRequestDTO {

    @NotNull(message = "User ID is required")
    @Schema(description = "User ID to convert to parent", example = "1")
    private Long userId;

    @NotBlank(message = "Phone number is required")
    @Schema(description = "Parent phone number", example = "+1234567890")
    private String phone;
}
