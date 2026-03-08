package com.elevanda.school_client_backend.service;

import com.elevanda.school_client_backend.dto.CreateParentRequestDTO;
import com.elevanda.school_client_backend.dto.ParentResponseDTO;
import com.elevanda.school_client_backend.dto.StudentResponseDTO;

import java.util.List;

public interface ParentService {
    
    ParentResponseDTO convertUserToParent(CreateParentRequestDTO request);
    
    List<StudentResponseDTO> getStudentsByParentId(Long parentId);
}
