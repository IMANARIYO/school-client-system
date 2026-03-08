package com.elevanda.school_client_backend.controller;

import com.elevanda.school_client_backend.common.PaginatedResponse;
import com.elevanda.school_client_backend.common.StandardApiResponse;
import com.elevanda.school_client_backend.dto.FeeAccountRequestDTO;
import com.elevanda.school_client_backend.dto.FeeAccountResponseDTO;
import com.elevanda.school_client_backend.service.FeeAccountService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/fee-accounts")
@RequiredArgsConstructor
public class FeeAccountController {

    private final FeeAccountService feeAccountService;

    @Operation(summary = "Create fee account", tags = {"Fee Account Management"})
    @PostMapping
    public ResponseEntity<StandardApiResponse<FeeAccountResponseDTO>> createFeeAccount(@Valid @RequestBody FeeAccountRequestDTO request) {
        FeeAccountResponseDTO response = feeAccountService.createFeeAccount(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardApiResponse<>(true, "Fee account created successfully", response));
    }

    @Operation(summary = "Get fee account by ID", tags = {"Fee Account Management"})
    @GetMapping("/{id}")
    public ResponseEntity<StandardApiResponse<FeeAccountResponseDTO>> getFeeAccountById(@PathVariable Long id) {
        FeeAccountResponseDTO response = feeAccountService.getFeeAccountById(id);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Fee account retrieved successfully", response));
    }

    @Operation(summary = "Get all fee accounts", tags = {"Fee Account Management"})
    @GetMapping
    public ResponseEntity<StandardApiResponse<PaginatedResponse<FeeAccountResponseDTO>>> getAllFeeAccounts(Pageable pageable) {
        Page<FeeAccountResponseDTO> page = feeAccountService.getAllFeeAccounts(pageable);
        PaginatedResponse<FeeAccountResponseDTO> response = PaginatedResponse.<FeeAccountResponseDTO>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Fee accounts retrieved successfully", response));
    }

    @Operation(summary = "Get fee account by student", tags = {"Fee Account Management"})
    @GetMapping("/student/{studentId}")
    public ResponseEntity<StandardApiResponse<FeeAccountResponseDTO>> getFeeAccountByStudentId(@PathVariable Long studentId) {
        FeeAccountResponseDTO response = feeAccountService.getFeeAccountByStudentId(studentId);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Fee account retrieved successfully", response));
    }

    @Operation(summary = "Update balance", tags = {"Fee Account Management"})
    @PatchMapping("/{id}/balance")
    public ResponseEntity<StandardApiResponse<FeeAccountResponseDTO>> updateBalance(
            @PathVariable Long id,
            @RequestParam BigDecimal balance) {
        FeeAccountResponseDTO response = feeAccountService.updateBalance(id, balance);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Balance updated successfully", response));
    }

    @Operation(summary = "Delete fee account", tags = {"Fee Account Management"})
    @DeleteMapping("/{id}")
    public ResponseEntity<StandardApiResponse<Void>> deleteFeeAccount(@PathVariable Long id) {
        feeAccountService.deleteFeeAccount(id);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Fee account deleted successfully", null));
    }
}
