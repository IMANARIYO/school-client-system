package com.elevanda.school_client_backend.service.impl;

import com.elevanda.school_client_backend.dto.ClassRequestDTO;
import com.elevanda.school_client_backend.dto.ClassResponseDTO;
import com.elevanda.school_client_backend.dto.StudentResponseDTO;
import com.elevanda.school_client_backend.exception.ResourceNotFoundException;
import com.elevanda.school_client_backend.mappers.ClassMapper;
import com.elevanda.school_client_backend.mappers.StudentMapper;
import com.elevanda.school_client_backend.model.SchoolClass;
import com.elevanda.school_client_backend.model.Student;
import com.elevanda.school_client_backend.model.Teacher;
import com.elevanda.school_client_backend.repository.ClassRepository;
import com.elevanda.school_client_backend.repository.StudentRepository;
import com.elevanda.school_client_backend.repository.TeacherRepository;
import com.elevanda.school_client_backend.service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClassServiceImpl implements ClassService {

    private final ClassRepository classRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final ClassMapper classMapper;
    private final StudentMapper studentMapper;

    @Override
    @Transactional
    public ClassResponseDTO createClass(ClassRequestDTO request) {
        SchoolClass schoolClass = classMapper.toEntity(request);
        
        if (request.getClassRepresentativeId() != null) {
            Student student = studentRepository.findById(request.getClassRepresentativeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
            schoolClass.setClassRepresentative(student);
        }
        
        if (request.getResponsibleTeacherId() != null) {
            Teacher teacher = teacherRepository.findById(request.getResponsibleTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
            schoolClass.setResponsibleTeacher(teacher);
        }
        
        schoolClass.setCreatedAt(LocalDateTime.now());
        schoolClass.setUpdatedAt(LocalDateTime.now());
        
        SchoolClass saved = classRepository.save(schoolClass);
        return classMapper.toResponseDTO(saved);
    }

    @Override
    public ClassResponseDTO getClassById(Long id) {
        SchoolClass schoolClass = classRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));
        return classMapper.toResponseDTO(schoolClass);
    }

    @Override
    public Page<ClassResponseDTO> getAllClasses(String search, Pageable pageable) {
        Page<SchoolClass> classes;
        
        if (search != null && !search.trim().isEmpty()) {
            classes = classRepository.searchClasses(search, pageable);
        } else {
            classes = classRepository.findAllActive(pageable);
        }
        
        return classes.map(classMapper::toResponseDTO);
    }

    @Override
    @Transactional
    public ClassResponseDTO updateClass(Long id, ClassRequestDTO request) {
        SchoolClass schoolClass = classRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));
        
        classMapper.updateEntity(schoolClass, request);
        
        if (request.getClassRepresentativeId() != null) {
            Student student = studentRepository.findById(request.getClassRepresentativeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
            
            // Validate that student is in this class
            if (student.getSchoolClass() == null || !student.getSchoolClass().getId().equals(id)) {
                throw new IllegalArgumentException("Class representative must be a student in this class");
            }
            
            schoolClass.setClassRepresentative(student);
        }
        
        if (request.getResponsibleTeacherId() != null) {
            Teacher teacher = teacherRepository.findById(request.getResponsibleTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
            schoolClass.setResponsibleTeacher(teacher);
        }
        
        schoolClass.setUpdatedAt(LocalDateTime.now());
        
        SchoolClass updated = classRepository.save(schoolClass);
        return classMapper.toResponseDTO(updated);
    }

    @Override
    @Transactional
    public void deleteClass(Long id) {
        SchoolClass schoolClass = classRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));
        
        schoolClass.setDeletedAt(LocalDateTime.now());
        classRepository.save(schoolClass);
    }

    @Override
    @Transactional
    public ClassResponseDTO assignStudentsToClass(Long classId, List<Long> studentIds) {
        SchoolClass schoolClass = classRepository.findByIdAndNotDeleted(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));
        
        for (Long studentId : studentIds) {
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
            student.setSchoolClass(schoolClass);
            studentRepository.save(student);
        }
        
        schoolClass.setUpdatedAt(LocalDateTime.now());
        classRepository.save(schoolClass);
        
        return classMapper.toResponseDTO(schoolClass);
    }

    @Override
    @Transactional
    public ClassResponseDTO assignTeacherToClass(Long classId, Long teacherId) {
        SchoolClass schoolClass = classRepository.findByIdAndNotDeleted(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));
        
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));
        
        schoolClass.setResponsibleTeacher(teacher);
        schoolClass.setUpdatedAt(LocalDateTime.now());
        
        SchoolClass updated = classRepository.save(schoolClass);
        return classMapper.toResponseDTO(updated);
    }

    @Override
    @Transactional
    public ClassResponseDTO addStudentToClass(Long classId, Long studentId) {
        SchoolClass schoolClass = classRepository.findByIdAndNotDeleted(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));
        
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        
        student.setSchoolClass(schoolClass);
        studentRepository.save(student);
        
        schoolClass.setUpdatedAt(LocalDateTime.now());
        classRepository.save(schoolClass);
        
        return classMapper.toResponseDTO(schoolClass);
    }

    @Override
    @Transactional
    public ClassResponseDTO setClassRepresentative(Long classId, Long studentId) {
        SchoolClass schoolClass = classRepository.findByIdAndNotDeleted(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));
        
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        
        // Validate that student is in this class
        if (student.getSchoolClass() == null || !student.getSchoolClass().getId().equals(classId)) {
            throw new IllegalArgumentException("Class representative must be a student in this class");
        }
        
        schoolClass.setClassRepresentative(student);
        schoolClass.setUpdatedAt(LocalDateTime.now());
        
        SchoolClass updated = classRepository.save(schoolClass);
        return classMapper.toResponseDTO(updated);
    }

    @Override
    public List<StudentResponseDTO> getStudentsByClassId(Long classId) {
        // Verify class exists
        classRepository.findByIdAndNotDeleted(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));
        
        List<Student> students = studentRepository.findByClassId(classId);
        return students.stream()
                .map(studentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
