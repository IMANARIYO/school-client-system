package com.elevanda.school_client_backend.service.impl;

import com.elevanda.school_client_backend.dto.AssignTeacherToClassSubjectDTO;
import com.elevanda.school_client_backend.dto.TeacherSubjectResponseDTO;
import com.elevanda.school_client_backend.exception.ResourceNotFoundException;
import com.elevanda.school_client_backend.mappers.TeacherSubjectMapper;
import com.elevanda.school_client_backend.model.ClassSubject;
import com.elevanda.school_client_backend.model.Teacher;
import com.elevanda.school_client_backend.model.TeacherSubject;
import com.elevanda.school_client_backend.repository.ClassSubjectRepository;
import com.elevanda.school_client_backend.repository.TeacherRepository;
import com.elevanda.school_client_backend.repository.TeacherSubjectRepository;
import com.elevanda.school_client_backend.service.TeacherSubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherSubjectServiceImpl implements TeacherSubjectService {

    private final TeacherSubjectRepository teacherSubjectRepository;
    private final TeacherRepository teacherRepository;
    private final ClassSubjectRepository classSubjectRepository;
    private final TeacherSubjectMapper teacherSubjectMapper;

    @Override
    @Transactional
    public TeacherSubjectResponseDTO assignTeacherToClassSubject(AssignTeacherToClassSubjectDTO request) {
        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
        
        ClassSubject classSubject = classSubjectRepository.findByClassIdAndSubjectId(request.getClassId(), request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Class-Subject combination not found. Please assign subject to class first."));
        
        TeacherSubject teacherSubject = TeacherSubject.builder()
                .teacher(teacher)
                .classSubject(classSubject)
                .build();
        teacherSubject.setCreatedAt(LocalDateTime.now());
        teacherSubject.setUpdatedAt(LocalDateTime.now());
        
        TeacherSubject saved = teacherSubjectRepository.save(teacherSubject);
        return teacherSubjectMapper.toResponseDTO(saved);
    }

    @Override
    public List<TeacherSubjectResponseDTO> getTeachersByClassAndSubject(Long classId, Long subjectId) {
        List<TeacherSubject> teacherSubjects = teacherSubjectRepository.findByClassIdAndSubjectId(classId, subjectId);
        return teacherSubjects.stream()
                .map(teacherSubjectMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TeacherSubjectResponseDTO> getAssignmentsByTeacherId(Long teacherId) {
        teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
        
        List<TeacherSubject> teacherSubjects = teacherSubjectRepository.findByTeacherId(teacherId);
        return teacherSubjects.stream()
                .map(teacherSubjectMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void removeAssignment(Long id) {
        TeacherSubject teacherSubject = teacherSubjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher-Subject assignment not found"));
        
        teacherSubjectRepository.delete(teacherSubject);
    }
}
