package com.elevanda.school_client_backend.service;

import com.elevanda.school_client_backend.dto.FeeAccountRequestDTO;
import com.elevanda.school_client_backend.dto.FeeAccountResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface FeeAccountService {
    
    FeeAccountResponseDTO createFeeAccount(FeeAccountRequestDTO request);
    
    FeeAccountResponseDTO getFeeAccountById(Long id);
    
    Page<FeeAccountResponseDTO> getAllFeeAccounts(Pageable pageable);
    
    FeeAccountResponseDTO getFeeAccountByStudentId(Long studentId);
    
    FeeAccountResponseDTO updateBalance(Long id, BigDecimal balance);
    
    void deleteFeeAccount(Long id);
}
