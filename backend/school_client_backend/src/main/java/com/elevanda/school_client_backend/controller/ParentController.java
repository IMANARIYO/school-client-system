package com.elevanda.school_client_backend.controller;

import com.elevanda.school_client_backend.common.StandardApiResponse;
import com.elevanda.school_client_backend.dto.CreateParentRequestDTO;
import com.elevanda.school_client_backend.dto.ParentResponseDTO;
import com.elevanda.school_client_backend.dto.StudentResponseDTO;
import com.elevanda.school_client_backend.service.ParentService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/parents")
@RequiredArgsConstructor
public class ParentController {

    private final ParentService parentService;

    @Operation(
            summary = "Convert user to parent",
            description = "Convert an existing user to a parent by providing parent details and changing their role",
            tags = {"Parent Management"}
    )
    @PostMapping("/convert")
    public ResponseEntity<StandardApiResponse<ParentResponseDTO>> convertUserToParent(
            @Valid @RequestBody CreateParentRequestDTO request) {
        ParentResponseDTO response = parentService.convertUserToParent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardApiResponse<>(true, "User converted to parent successfully", response));
    }

    @Operation(
            summary = "Get students by parent",
            description = "Get all students (children) of a specific parent",
            tags = {"Parent Management"}
    )
    @GetMapping("/{parentId}/students")
    public ResponseEntity<StandardApiResponse<List<StudentResponseDTO>>> getStudentsByParentId(
            @PathVariable Long parentId) {
        List<StudentResponseDTO> students = parentService.getStudentsByParentId(parentId);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Students retrieved successfully", students));
    }
}
