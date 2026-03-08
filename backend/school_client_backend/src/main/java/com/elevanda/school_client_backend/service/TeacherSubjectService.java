package com.elevanda.school_client_backend.service;

import com.elevanda.school_client_backend.dto.AssignTeacherToClassSubjectDTO;
import com.elevanda.school_client_backend.dto.TeacherSubjectResponseDTO;

import java.util.List;

public interface TeacherSubjectService {
    
    TeacherSubjectResponseDTO assignTeacherToClassSubject(AssignTeacherToClassSubjectDTO request);
    
    List<TeacherSubjectResponseDTO> getTeachersByClassAndSubject(Long classId, Long subjectId);
    
    List<TeacherSubjectResponseDTO> getAssignmentsByTeacherId(Long teacherId);
    
    void removeAssignment(Long id);
}
