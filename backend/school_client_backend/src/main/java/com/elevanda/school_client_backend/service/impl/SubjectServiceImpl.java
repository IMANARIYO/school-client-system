package com.elevanda.school_client_backend.service.impl;

import com.elevanda.school_client_backend.dto.SubjectRequestDTO;
import com.elevanda.school_client_backend.dto.SubjectResponseDTO;
import com.elevanda.school_client_backend.exception.ResourceNotFoundException;
import com.elevanda.school_client_backend.mappers.SubjectMapper;
import com.elevanda.school_client_backend.model.ClassSubject;
import com.elevanda.school_client_backend.model.SchoolClass;
import com.elevanda.school_client_backend.model.Subject;
import com.elevanda.school_client_backend.repository.ClassRepository;
import com.elevanda.school_client_backend.repository.ClassSubjectRepository;
import com.elevanda.school_client_backend.repository.SubjectRepository;
import com.elevanda.school_client_backend.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;
    private final ClassRepository classRepository;
    private final ClassSubjectRepository classSubjectRepository;
    private final SubjectMapper subjectMapper;

    @Override
    @Transactional
    public SubjectResponseDTO createSubject(SubjectRequestDTO request) {
        Subject subject = subjectMapper.toEntity(request);
        subject.setCreatedAt(LocalDateTime.now());
        subject.setUpdatedAt(LocalDateTime.now());
        
        Subject saved = subjectRepository.save(subject);
        return subjectMapper.toResponseDTO(saved);
    }

    @Override
    public SubjectResponseDTO getSubjectById(Long id) {
        Subject subject = subjectRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));
        return subjectMapper.toResponseDTO(subject);
    }

    @Override
    public Page<SubjectResponseDTO> getAllSubjects(String search, Pageable pageable) {
        Page<Subject> subjects;
        
        if (search != null && !search.trim().isEmpty()) {
            subjects = subjectRepository.searchSubjects(search, pageable);
        } else {
            subjects = subjectRepository.findAllActive(pageable);
        }
        
        return subjects.map(subjectMapper::toResponseDTO);
    }

    @Override
    @Transactional
    public SubjectResponseDTO updateSubject(Long id, SubjectRequestDTO request) {
        Subject subject = subjectRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));
        
        subjectMapper.updateEntity(subject, request);
        subject.setUpdatedAt(LocalDateTime.now());
        
        Subject updated = subjectRepository.save(subject);
        return subjectMapper.toResponseDTO(updated);
    }

    @Override
    @Transactional
    public void deleteSubject(Long id) {
        Subject subject = subjectRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));
        
        subject.setDeletedAt(LocalDateTime.now());
        subjectRepository.save(subject);
    }

    @Override
    public Page<SubjectResponseDTO> getSubjectsByClassId(Long classId, Pageable pageable) {
        classRepository.findByIdAndNotDeleted(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));
        
        Page<Subject> subjects = subjectRepository.findByClassId(classId, pageable);
        return subjects.map(subjectMapper::toResponseDTO);
    }

    @Override
    @Transactional
    public SubjectResponseDTO assignSubjectToClass(Long subjectId, Long classId) {
        Subject subject = subjectRepository.findByIdAndNotDeleted(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + subjectId));
        
        SchoolClass schoolClass = classRepository.findByIdAndNotDeleted(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));
        
        // Check if already assigned
        if (classSubjectRepository.findByClassIdAndSubjectId(classId, subjectId).isPresent()) {
            throw new IllegalArgumentException("Subject already assigned to this class");
        }
        
        ClassSubject classSubject = ClassSubject.builder()
                .schoolClass(schoolClass)
                .subject(subject)
                .build();
        classSubject.setCreatedAt(LocalDateTime.now());
        classSubject.setUpdatedAt(LocalDateTime.now());
        
        classSubjectRepository.save(classSubject);
        
        return subjectMapper.toResponseDTO(subject);
    }
}
