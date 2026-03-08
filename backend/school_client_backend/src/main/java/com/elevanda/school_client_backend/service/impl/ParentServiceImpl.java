package com.elevanda.school_client_backend.service.impl;

import com.elevanda.school_client_backend.dto.CreateParentRequestDTO;
import com.elevanda.school_client_backend.dto.ParentResponseDTO;
import com.elevanda.school_client_backend.dto.StudentResponseDTO;
import com.elevanda.school_client_backend.enums.Role;
import com.elevanda.school_client_backend.exception.ResourceNotFoundException;
import com.elevanda.school_client_backend.mappers.ParentMapper;
import com.elevanda.school_client_backend.mappers.StudentMapper;
import com.elevanda.school_client_backend.model.Parent;
import com.elevanda.school_client_backend.model.Student;
import com.elevanda.school_client_backend.model.User;
import com.elevanda.school_client_backend.repository.ParentRepository;
import com.elevanda.school_client_backend.repository.StudentRepository;
import com.elevanda.school_client_backend.repository.UserRepository;
import com.elevanda.school_client_backend.service.ParentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParentServiceImpl implements ParentService {

    private final UserRepository userRepository;
    private final ParentRepository parentRepository;
    private final StudentRepository studentRepository;
    private final ParentMapper parentMapper;
    private final StudentMapper studentMapper;

    @Override
    @Transactional
    public ParentResponseDTO convertUserToParent(CreateParentRequestDTO request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));
        
        if (parentRepository.findByUserId(request.getUserId()).isPresent()) {
            throw new IllegalArgumentException("User is already a parent");
        }
        
        Parent parent = parentMapper.toEntity(request);
        parent.setUser(user);
        parent.setCreatedAt(LocalDateTime.now());
        parent.setUpdatedAt(LocalDateTime.now());
        
        user.setRole(Role.PARENT);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        
        Parent savedParent = parentRepository.save(parent);
        
        return parentMapper.toResponseDTO(savedParent);
    }

    @Override
    public List<StudentResponseDTO> getStudentsByParentId(Long parentId) {
        parentRepository.findById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent not found with id: " + parentId));
        
        List<Student> students = studentRepository.findByParentId(parentId);
        return students.stream()
                .map(studentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
