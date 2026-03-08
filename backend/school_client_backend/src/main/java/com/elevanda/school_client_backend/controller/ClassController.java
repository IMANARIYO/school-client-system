package com.elevanda.school_client_backend.controller;

import com.elevanda.school_client_backend.common.PaginatedResponse;
import com.elevanda.school_client_backend.common.StandardApiResponse;
import com.elevanda.school_client_backend.dto.AssignStudentsRequestDTO;
import com.elevanda.school_client_backend.dto.AssignTeacherRequestDTO;
import com.elevanda.school_client_backend.dto.ClassRequestDTO;
import com.elevanda.school_client_backend.dto.ClassResponseDTO;
import com.elevanda.school_client_backend.dto.StudentResponseDTO;
import com.elevanda.school_client_backend.service.ClassService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/classes")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;

    @Operation(summary = "Create a new class", description = "Create a new school class", tags = {"Class Management"})
    @PostMapping
    public ResponseEntity<StandardApiResponse<ClassResponseDTO>> createClass(@Valid @RequestBody ClassRequestDTO request) {
        ClassResponseDTO response = classService.createClass(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardApiResponse<>(true, "Class created successfully", response));
    }

    @Operation(summary = "Get class by ID", description = "Retrieve a single class by its ID", tags = {"Class Management"})
    @GetMapping("/{id}")
    public ResponseEntity<StandardApiResponse<ClassResponseDTO>> getClassById(@PathVariable Long id) {
        ClassResponseDTO response = classService.getClassById(id);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Class retrieved successfully", response));
    }

    @Operation(summary = "Get all classes", description = "Retrieve a paginated list of classes, optionally filtered by search text", tags = {"Class Management"})
    @GetMapping
    public ResponseEntity<StandardApiResponse<PaginatedResponse<ClassResponseDTO>>> getAllClasses(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        Page<ClassResponseDTO> page = classService.getAllClasses(search, pageable);
        PaginatedResponse<ClassResponseDTO> response = PaginatedResponse.<ClassResponseDTO>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Classes retrieved successfully", response));
    }

    @Operation(summary = "Update class", description = "Update an existing class", tags = {"Class Management"})
    @PutMapping("/{id}")
    public ResponseEntity<StandardApiResponse<ClassResponseDTO>> updateClass(
            @PathVariable Long id,
            @Valid @RequestBody ClassRequestDTO request) {
        ClassResponseDTO response = classService.updateClass(id, request);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Class updated successfully", response));
    }

    @Operation(summary = "Delete class", description = "Soft delete a class by its ID", tags = {"Class Management"})
    @DeleteMapping("/{id}")
    public ResponseEntity<StandardApiResponse<Void>> deleteClass(@PathVariable Long id) {
        classService.deleteClass(id);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Class deleted successfully", null));
    }

    @Operation(summary = "Assign students to class", description = "Assign multiple students to a class", tags = {"Class Management"})
    @PostMapping("/{classId}/students")
    public ResponseEntity<StandardApiResponse<ClassResponseDTO>> assignStudentsToClass(
            @PathVariable Long classId,
            @Valid @RequestBody AssignStudentsRequestDTO request) {
        ClassResponseDTO response = classService.assignStudentsToClass(classId, request.getStudentIds());
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Students assigned to class successfully", response));
    }

    @Operation(summary = "Assign teacher to class", description = "Assign a responsible teacher to a class", tags = {"Class Management"})
    @PostMapping("/{classId}/teacher")
    public ResponseEntity<StandardApiResponse<ClassResponseDTO>> assignTeacherToClass(
            @PathVariable Long classId,
            @Valid @RequestBody AssignTeacherRequestDTO request) {
        ClassResponseDTO response = classService.assignTeacherToClass(classId, request.getTeacherId());
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Teacher assigned to class successfully", response));
    }

    @Operation(summary = "Add student to class", description = "Add a single student to a class", tags = {"Class Management"})
    @PostMapping("/{classId}/student/{studentId}")
    public ResponseEntity<StandardApiResponse<ClassResponseDTO>> addStudentToClass(
            @PathVariable Long classId,
            @PathVariable Long studentId) {
        ClassResponseDTO response = classService.addStudentToClass(classId, studentId);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Student added to class successfully", response));
    }

    @Operation(summary = "Set class representative", description = "Set a student as class representative (student must be in the class)", tags = {"Class Management"})
    @PatchMapping("/{classId}/representative/{studentId}")
    public ResponseEntity<StandardApiResponse<ClassResponseDTO>> setClassRepresentative(
            @PathVariable Long classId,
            @PathVariable Long studentId) {
        ClassResponseDTO response = classService.setClassRepresentative(classId, studentId);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Class representative set successfully", response));
    }

    @Operation(summary = "Get students in class", description = "Get all students enrolled in a specific class", tags = {"Class Management"})
    @GetMapping("/{classId}/students")
    public ResponseEntity<StandardApiResponse<List<StudentResponseDTO>>> getStudentsByClassId(@PathVariable Long classId) {
        List<StudentResponseDTO> students = classService.getStudentsByClassId(classId);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Students retrieved successfully", students));
    }
}
