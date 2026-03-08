package com.elevanda.school_client_backend.service;

import com.elevanda.school_client_backend.dto.SubjectRequestDTO;
import com.elevanda.school_client_backend.dto.SubjectResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SubjectService {
    
    SubjectResponseDTO createSubject(SubjectRequestDTO request);
    
    SubjectResponseDTO getSubjectById(Long id);
    
    Page<SubjectResponseDTO> getAllSubjects(String search, Pageable pageable);
    
    SubjectResponseDTO updateSubject(Long id, SubjectRequestDTO request);
    
    void deleteSubject(Long id);
    
    Page<SubjectResponseDTO> getSubjectsByClassId(Long classId, Pageable pageable);
    
    SubjectResponseDTO assignSubjectToClass(Long subjectId, Long classId);
}
