package com.elevanda.school_client_backend.controller;

import com.elevanda.school_client_backend.common.StandardApiResponse;
import com.elevanda.school_client_backend.dto.CreateTeacherRequestDTO;
import com.elevanda.school_client_backend.dto.TeacherResponseDTO;
import com.elevanda.school_client_backend.service.TeacherService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    @Operation(
            summary = "Convert user to teacher",
            description = "Convert an existing user to a teacher by providing teacher details and changing their role",
            tags = {"Teacher Management"}
    )
    @PostMapping("/convert")
    public ResponseEntity<StandardApiResponse<TeacherResponseDTO>> convertUserToTeacher(
            @Valid @RequestBody CreateTeacherRequestDTO request) {
        TeacherResponseDTO response = teacherService.convertUserToTeacher(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardApiResponse<>(true, "User converted to teacher successfully", response));
    }
}
