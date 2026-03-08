package com.elevanda.school_client_backend.service;

import com.elevanda.school_client_backend.dto.CreateTeacherRequestDTO;
import com.elevanda.school_client_backend.dto.TeacherResponseDTO;

public interface TeacherService {
    
    TeacherResponseDTO convertUserToTeacher(CreateTeacherRequestDTO request);
}
