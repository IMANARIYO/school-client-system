package com.elevanda.school_client_backend.service.impl;

import com.elevanda.school_client_backend.dto.FeeAccountRequestDTO;
import com.elevanda.school_client_backend.dto.FeeAccountResponseDTO;
import com.elevanda.school_client_backend.exception.ResourceNotFoundException;
import com.elevanda.school_client_backend.mappers.FeeAccountMapper;
import com.elevanda.school_client_backend.model.FeeAccount;
import com.elevanda.school_client_backend.model.Student;
import com.elevanda.school_client_backend.repository.FeeAccountRepository;
import com.elevanda.school_client_backend.repository.StudentRepository;
import com.elevanda.school_client_backend.service.FeeAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FeeAccountServiceImpl implements FeeAccountService {

    private final FeeAccountRepository feeAccountRepository;
    private final StudentRepository studentRepository;
    private final FeeAccountMapper feeAccountMapper;

    @Override
    @Transactional
    public FeeAccountResponseDTO createFeeAccount(FeeAccountRequestDTO request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        
        if (feeAccountRepository.findByStudentId(request.getStudentId()).isPresent()) {
            throw new IllegalArgumentException("Fee account already exists for this student");
        }
        
        FeeAccount feeAccount = feeAccountMapper.toEntity(request);
        feeAccount.setStudent(student);
        feeAccount.setCreatedAt(LocalDateTime.now());
        feeAccount.setUpdatedAt(LocalDateTime.now());
        
        FeeAccount saved = feeAccountRepository.save(feeAccount);
        return feeAccountMapper.toResponseDTO(saved);
    }

    @Override
    public FeeAccountResponseDTO getFeeAccountById(Long id) {
        FeeAccount feeAccount = feeAccountRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fee account not found"));
        return feeAccountMapper.toResponseDTO(feeAccount);
    }

    @Override
    public Page<FeeAccountResponseDTO> getAllFeeAccounts(Pageable pageable) {
        Page<FeeAccount> feeAccounts = feeAccountRepository.findAllActive(pageable);
        return feeAccounts.map(feeAccountMapper::toResponseDTO);
    }

    @Override
    public FeeAccountResponseDTO getFeeAccountByStudentId(Long studentId) {
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        
        FeeAccount feeAccount = feeAccountRepository.findByStudentId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Fee account not found for this student"));
        return feeAccountMapper.toResponseDTO(feeAccount);
    }

    @Override
    @Transactional
    public FeeAccountResponseDTO updateBalance(Long id, BigDecimal balance) {
        FeeAccount feeAccount = feeAccountRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fee account not found"));
        
        feeAccount.setBalance(balance);
        feeAccount.setUpdatedAt(LocalDateTime.now());
        
        FeeAccount updated = feeAccountRepository.save(feeAccount);
        return feeAccountMapper.toResponseDTO(updated);
    }

    @Override
    @Transactional
    public void deleteFeeAccount(Long id) {
        FeeAccount feeAccount = feeAccountRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fee account not found"));
        
        feeAccount.setDeletedAt(LocalDateTime.now());
        feeAccountRepository.save(feeAccount);
    }
}
