package com.elevanda.school_client_backend.controller;

import com.elevanda.school_client_backend.common.StandardApiResponse;
import com.elevanda.school_client_backend.dto.AssignTeacherToClassSubjectDTO;
import com.elevanda.school_client_backend.dto.TeacherSubjectResponseDTO;
import com.elevanda.school_client_backend.service.TeacherSubjectService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/teacher-subjects")
@RequiredArgsConstructor
public class TeacherSubjectController {

    private final TeacherSubjectService teacherSubjectService;

    @Operation(summary = "Assign teacher to class-subject", tags = {"Teacher-Subject Management"})
    @PostMapping("/assign")
    public ResponseEntity<StandardApiResponse<TeacherSubjectResponseDTO>> assignTeacherToClassSubject(
            @Valid @RequestBody AssignTeacherToClassSubjectDTO request) {
        TeacherSubjectResponseDTO response = teacherSubjectService.assignTeacherToClassSubject(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardApiResponse<>(true, "Teacher assigned to class-subject successfully", response));
    }

    @Operation(summary = "Get teachers by class and subject", tags = {"Teacher-Subject Management"})
    @GetMapping("/class/{classId}/subject/{subjectId}")
    public ResponseEntity<StandardApiResponse<List<TeacherSubjectResponseDTO>>> getTeachersByClassAndSubject(
            @PathVariable Long classId,
            @PathVariable Long subjectId) {
        List<TeacherSubjectResponseDTO> teachers = teacherSubjectService.getTeachersByClassAndSubject(classId, subjectId);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Teachers retrieved successfully", teachers));
    }

    @Operation(summary = "Get assignments by teacher", tags = {"Teacher-Subject Management"})
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<StandardApiResponse<List<TeacherSubjectResponseDTO>>> getAssignmentsByTeacherId(
            @PathVariable Long teacherId) {
        List<TeacherSubjectResponseDTO> assignments = teacherSubjectService.getAssignmentsByTeacherId(teacherId);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Assignments retrieved successfully", assignments));
    }

    @Operation(summary = "Remove teacher assignment", tags = {"Teacher-Subject Management"})
    @DeleteMapping("/{id}")
    public ResponseEntity<StandardApiResponse<Void>> removeAssignment(@PathVariable Long id) {
        teacherSubjectService.removeAssignment(id);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Assignment removed successfully", null));
    }
}
