package com.elevanda.school_client_backend.controller;

import com.elevanda.school_client_backend.common.PaginatedResponse;
import com.elevanda.school_client_backend.common.StandardApiResponse;
import com.elevanda.school_client_backend.dto.SubjectRequestDTO;
import com.elevanda.school_client_backend.dto.SubjectResponseDTO;
import com.elevanda.school_client_backend.service.SubjectService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    @Operation(summary = "Create a new subject", description = "Create a new subject", tags = {"Subject Management"})
    @PostMapping
    public ResponseEntity<StandardApiResponse<SubjectResponseDTO>> createSubject(@Valid @RequestBody SubjectRequestDTO request) {
        SubjectResponseDTO response = subjectService.createSubject(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardApiResponse<>(true, "Subject created successfully", response));
    }

    @Operation(summary = "Get subject by ID", description = "Retrieve a single subject by its ID", tags = {"Subject Management"})
    @GetMapping("/{id}")
    public ResponseEntity<StandardApiResponse<SubjectResponseDTO>> getSubjectById(@PathVariable Long id) {
        SubjectResponseDTO response = subjectService.getSubjectById(id);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Subject retrieved successfully", response));
    }

    @Operation(summary = "Get all subjects", description = "Retrieve a paginated list of subjects, optionally filtered by search text", tags = {"Subject Management"})
    @GetMapping
    public ResponseEntity<StandardApiResponse<PaginatedResponse<SubjectResponseDTO>>> getAllSubjects(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        Page<SubjectResponseDTO> page = subjectService.getAllSubjects(search, pageable);
        PaginatedResponse<SubjectResponseDTO> response = PaginatedResponse.<SubjectResponseDTO>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Subjects retrieved successfully", response));
    }

    @Operation(summary = "Update subject", description = "Update an existing subject", tags = {"Subject Management"})
    @PutMapping("/{id}")
    public ResponseEntity<StandardApiResponse<SubjectResponseDTO>> updateSubject(
            @PathVariable Long id,
            @Valid @RequestBody SubjectRequestDTO request) {
        SubjectResponseDTO response = subjectService.updateSubject(id, request);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Subject updated successfully", response));
    }

    @Operation(summary = "Delete subject", description = "Soft delete a subject by its ID", tags = {"Subject Management"})
    @DeleteMapping("/{id}")
    public ResponseEntity<StandardApiResponse<Void>> deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Subject deleted successfully", null));
    }

    @Operation(summary = "Get subjects by class", description = "Get all subjects taught in a specific class", tags = {"Subject Management"})
    @GetMapping("/class/{classId}")
    public ResponseEntity<StandardApiResponse<PaginatedResponse<SubjectResponseDTO>>> getSubjectsByClassId(
            @PathVariable Long classId,
            Pageable pageable) {
        Page<SubjectResponseDTO> page = subjectService.getSubjectsByClassId(classId, pageable);
        PaginatedResponse<SubjectResponseDTO> response = PaginatedResponse.<SubjectResponseDTO>builder()
                .content(page.getContent())
                .size(page.getSize())
                .page(page.getNumber())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Subjects retrieved successfully", response));
    }

    @Operation(summary = "Assign subject to class", description = "Assign a subject to a class", tags = {"Subject Management"})
    @PostMapping("/{subjectId}/class/{classId}")
    public ResponseEntity<StandardApiResponse<SubjectResponseDTO>> assignSubjectToClass(
            @PathVariable Long subjectId,
            @PathVariable Long classId) {
        SubjectResponseDTO response = subjectService.assignSubjectToClass(subjectId, classId);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Subject assigned to class successfully", response));
    }
}
