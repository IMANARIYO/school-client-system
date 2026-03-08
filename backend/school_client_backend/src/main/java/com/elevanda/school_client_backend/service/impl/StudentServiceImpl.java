package com.elevanda.school_client_backend.service.impl;

import com.elevanda.school_client_backend.dto.CreateStudentRequestDTO;
import com.elevanda.school_client_backend.dto.StudentResponseDTO;
import com.elevanda.school_client_backend.enums.Role;
import com.elevanda.school_client_backend.exception.ResourceNotFoundException;
import com.elevanda.school_client_backend.mappers.StudentMapper;
import com.elevanda.school_client_backend.model.Parent;
import com.elevanda.school_client_backend.model.SchoolClass;
import com.elevanda.school_client_backend.model.Student;
import com.elevanda.school_client_backend.model.User;
import com.elevanda.school_client_backend.repository.ClassRepository;
import com.elevanda.school_client_backend.repository.ParentRepository;
import com.elevanda.school_client_backend.repository.StudentRepository;
import com.elevanda.school_client_backend.repository.UserRepository;
import com.elevanda.school_client_backend.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;
    private final ClassRepository classRepository;
    private final StudentMapper studentMapper;

    @Override
    @Transactional
    public StudentResponseDTO convertUserToStudent(CreateStudentRequestDTO request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));
        
        if (studentRepository.findByUserId(request.getUserId()).isPresent()) {
            throw new IllegalArgumentException("User is already a student");
        }
        
        Parent parent = parentRepository.findById(request.getParentId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent not found with id: " + request.getParentId()));
        
        SchoolClass schoolClass = classRepository.findByIdAndNotDeleted(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + request.getClassId()));
        
        Student student = studentMapper.toEntity(request);
        student.setUser(user);
        student.setParent(parent);
        student.setSchoolClass(schoolClass);
        student.setCreatedAt(LocalDateTime.now());
        student.setUpdatedAt(LocalDateTime.now());
        
        user.setRole(Role.STUDENT);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        
        Student savedStudent = studentRepository.save(student);
        
        return studentMapper.toResponseDTO(savedStudent);
    }
}
