package com.elevanda.school_client_backend.mappers;

import com.elevanda.school_client_backend.dto.FeeAccountRequestDTO;
import com.elevanda.school_client_backend.dto.FeeAccountResponseDTO;
import com.elevanda.school_client_backend.model.FeeAccount;
import org.springframework.stereotype.Component;

@Component
public class FeeAccountMapper {

    public FeeAccountResponseDTO toResponseDTO(FeeAccount feeAccount) {
        if (feeAccount == null) return null;

        return FeeAccountResponseDTO.builder()
                .id(feeAccount.getId())
                .studentId(feeAccount.getStudent() != null ? feeAccount.getStudent().getId() : null)
                .studentName(feeAccount.getStudent() != null && feeAccount.getStudent().getUser() != null ? 
                        feeAccount.getStudent().getUser().getFirstName() + " " + feeAccount.getStudent().getUser().getLastName() : null)
                .rollNumber(feeAccount.getStudent() != null ? feeAccount.getStudent().getRollNumber() : null)
                .balance(feeAccount.getBalance())
                .updatedAt(feeAccount.getUpdatedAt())
                .build();
    }

    public FeeAccount toEntity(FeeAccountRequestDTO dto) {
        if (dto == null) return null;

        return FeeAccount.builder()
                .balance(dto.getBalance())
                .build();
    }
}
