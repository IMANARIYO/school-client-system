package com.elevanda.school_client_backend.service;

import com.elevanda.school_client_backend.dto.CreateStudentRequestDTO;
import com.elevanda.school_client_backend.dto.StudentResponseDTO;

public interface StudentService {
    
    StudentResponseDTO convertUserToStudent(CreateStudentRequestDTO request);
}
