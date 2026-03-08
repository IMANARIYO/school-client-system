package com.elevanda.school_client_backend.controller;

import com.elevanda.school_client_backend.common.StandardApiResponse;
import com.elevanda.school_client_backend.dto.CreateStudentRequestDTO;
import com.elevanda.school_client_backend.dto.StudentResponseDTO;
import com.elevanda.school_client_backend.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @Operation(
            summary = "Convert user to student",
            description = "Convert an existing user to a student by providing student details, parent ID, class ID, and changing their role",
            tags = {"Student Management"}
    )
    @PostMapping("/convert")
    public ResponseEntity<StandardApiResponse<StudentResponseDTO>> convertUserToStudent(
            @Valid @RequestBody CreateStudentRequestDTO request) {
        StudentResponseDTO response = studentService.convertUserToStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardApiResponse<>(true, "User converted to student successfully", response));
    }
}
