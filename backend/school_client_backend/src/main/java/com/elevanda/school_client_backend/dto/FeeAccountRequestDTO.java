package com.elevanda.school_client_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeAccountRequestDTO {

    @NotNull(message = "Student ID is required")
    @Schema(description = "Student ID", example = "1")
    private Long studentId;

    @NotNull(message = "Balance is required")
    @Schema(description = "Account balance", example = "1000.00")
    private BigDecimal balance;
}
