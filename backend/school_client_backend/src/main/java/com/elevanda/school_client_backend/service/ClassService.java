package com.elevanda.school_client_backend.service;

import com.elevanda.school_client_backend.dto.ClassRequestDTO;
import com.elevanda.school_client_backend.dto.ClassResponseDTO;
import com.elevanda.school_client_backend.dto.StudentResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ClassService {
    
    ClassResponseDTO createClass(ClassRequestDTO request);
    
    ClassResponseDTO getClassById(Long id);
    
    Page<ClassResponseDTO> getAllClasses(String search, Pageable pageable);
    
    ClassResponseDTO updateClass(Long id, ClassRequestDTO request);
    
    void deleteClass(Long id);
    
    ClassResponseDTO assignStudentsToClass(Long classId, List<Long> studentIds);
    
    ClassResponseDTO assignTeacherToClass(Long classId, Long teacherId);
    
    ClassResponseDTO addStudentToClass(Long classId, Long studentId);
    
    ClassResponseDTO setClassRepresentative(Long classId, Long studentId);
    
    List<StudentResponseDTO> getStudentsByClassId(Long classId);
}
