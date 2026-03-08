package com.elevanda.school_client_backend.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeAccountResponseDTO {

    private Long id;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private BigDecimal balance;
    private LocalDateTime updatedAt;
}
