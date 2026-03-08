package com.elevanda.school_client_backend.service.impl;

import com.elevanda.school_client_backend.dto.ScheduleRequestDTO;
import com.elevanda.school_client_backend.dto.ScheduleResponseDTO;
import com.elevanda.school_client_backend.exception.ResourceNotFoundException;
import com.elevanda.school_client_backend.mappers.ScheduleMapper;
import com.elevanda.school_client_backend.model.Schedule;
import com.elevanda.school_client_backend.model.SchoolClass;
import com.elevanda.school_client_backend.model.Subject;
import com.elevanda.school_client_backend.model.Teacher;
import com.elevanda.school_client_backend.repository.ClassRepository;
import com.elevanda.school_client_backend.repository.ScheduleRepository;
import com.elevanda.school_client_backend.repository.SubjectRepository;
import com.elevanda.school_client_backend.repository.TeacherRepository;
import com.elevanda.school_client_backend.service.ScheduleService;
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
public class ScheduleServiceImpl implements ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final ClassRepository classRepository;
    private final TeacherRepository teacherRepository;
    private final SubjectRepository subjectRepository;
    private final ScheduleMapper scheduleMapper;

    @Override
    @Transactional
    public ScheduleResponseDTO createSchedule(ScheduleRequestDTO request) {
        SchoolClass schoolClass = classRepository.findByIdAndNotDeleted(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));
        
        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
        
        Subject subject = subjectRepository.findByIdAndNotDeleted(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        
        Schedule schedule = scheduleMapper.toEntity(request);
        schedule.setSchoolClass(schoolClass);
        schedule.setTeacher(teacher);
        schedule.setSubject(subject);
        schedule.setCreatedAt(LocalDateTime.now());
        schedule.setUpdatedAt(LocalDateTime.now());
        
        Schedule saved = scheduleRepository.save(schedule);
        return scheduleMapper.toResponseDTO(saved);
    }

    @Override
    public ScheduleResponseDTO getScheduleById(Long id) {
        Schedule schedule = scheduleRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found"));
        return scheduleMapper.toResponseDTO(schedule);
    }

    @Override
    public Page<ScheduleResponseDTO> getAllSchedules(Pageable pageable) {
        Page<Schedule> schedules = scheduleRepository.findAllActive(pageable);
        return schedules.map(scheduleMapper::toResponseDTO);
    }

    @Override
    public List<ScheduleResponseDTO> getSchedulesByClassId(Long classId) {
        classRepository.findByIdAndNotDeleted(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));
        
        List<Schedule> schedules = scheduleRepository.findByClassId(classId);
        return schedules.stream()
                .map(scheduleMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ScheduleResponseDTO> getSchedulesByTeacherId(Long teacherId) {
        teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
        
        List<Schedule> schedules = scheduleRepository.findByTeacherId(teacherId);
        return schedules.stream()
                .map(scheduleMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ScheduleResponseDTO updateSchedule(Long id, ScheduleRequestDTO request) {
        Schedule schedule = scheduleRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found"));
        
        if (request.getClassId() != null) {
            SchoolClass schoolClass = classRepository.findByIdAndNotDeleted(request.getClassId())
                    .orElseThrow(() -> new ResourceNotFoundException("Class not found"));
            schedule.setSchoolClass(schoolClass);
        }
        
        if (request.getTeacherId() != null) {
            Teacher teacher = teacherRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
            schedule.setTeacher(teacher);
        }
        
        if (request.getSubjectId() != null) {
            Subject subject = subjectRepository.findByIdAndNotDeleted(request.getSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
            schedule.setSubject(subject);
        }
        
        scheduleMapper.updateEntity(schedule, request);
        schedule.setUpdatedAt(LocalDateTime.now());
        
        Schedule updated = scheduleRepository.save(schedule);
        return scheduleMapper.toResponseDTO(updated);
    }

    @Override
    @Transactional
    public void deleteSchedule(Long id) {
        Schedule schedule = scheduleRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found"));
        
        schedule.setDeletedAt(LocalDateTime.now());
        scheduleRepository.save(schedule);
    }
}
