package com.elevanda.school_client_backend.service.impl;

import com.elevanda.school_client_backend.dto.CreateTeacherRequestDTO;
import com.elevanda.school_client_backend.dto.TeacherResponseDTO;
import com.elevanda.school_client_backend.enums.Role;
import com.elevanda.school_client_backend.exception.ResourceNotFoundException;
import com.elevanda.school_client_backend.mappers.TeacherMapper;
import com.elevanda.school_client_backend.model.Subject;
import com.elevanda.school_client_backend.model.Teacher;
import com.elevanda.school_client_backend.model.User;
import com.elevanda.school_client_backend.repository.SubjectRepository;
import com.elevanda.school_client_backend.repository.TeacherRepository;
import com.elevanda.school_client_backend.repository.UserRepository;
import com.elevanda.school_client_backend.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {

    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final SubjectRepository subjectRepository;
    private final TeacherMapper teacherMapper;

    @Override
    @Transactional
    public TeacherResponseDTO convertUserToTeacher(CreateTeacherRequestDTO request) {
        // Find user
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));
        
        // Check if user is already a teacher
        if (teacherRepository.findByUserId(request.getUserId()).isPresent()) {
            throw new IllegalArgumentException("User is already a teacher");
        }
        
        // Validate subject IDs if provided
        if (request.getSubjectIds() != null && !request.getSubjectIds().isEmpty()) {
            String subjectNames = request.getSubjectIds().stream()
                    .map(subjectId -> subjectRepository.findByIdAndNotDeleted(subjectId)
                            .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + subjectId))
                            .getName())
                    .collect(Collectors.joining(", "));
            
            // Create teacher entity
            Teacher teacher = teacherMapper.toEntity(request);
            teacher.setUser(user);
            teacher.setSubjectsCanTeach(subjectNames);
            teacher.setCreatedAt(LocalDateTime.now());
            teacher.setUpdatedAt(LocalDateTime.now());
            
            // Change user role to TEACHER
            user.setRole(Role.TEACHER);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
            
            // Save teacher
            Teacher savedTeacher = teacherRepository.save(teacher);
            
            return teacherMapper.toResponseDTO(savedTeacher);
        } else {
            // Create teacher entity without subjects
            Teacher teacher = teacherMapper.toEntity(request);
            teacher.setUser(user);
            teacher.setCreatedAt(LocalDateTime.now());
            teacher.setUpdatedAt(LocalDateTime.now());
            
            // Change user role to TEACHER
            user.setRole(Role.TEACHER);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
            
            // Save teacher
            Teacher savedTeacher = teacherRepository.save(teacher);
            
            return teacherMapper.toResponseDTO(savedTeacher);
        }
    }
}
