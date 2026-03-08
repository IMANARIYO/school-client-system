package com.elevanda.school_client_backend.service;

import com.elevanda.school_client_backend.dto.ScheduleRequestDTO;
import com.elevanda.school_client_backend.dto.ScheduleResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ScheduleService {
    
    ScheduleResponseDTO createSchedule(ScheduleRequestDTO request);
    
    ScheduleResponseDTO getScheduleById(Long id);
    
    Page<ScheduleResponseDTO> getAllSchedules(Pageable pageable);
    
    List<ScheduleResponseDTO> getSchedulesByClassId(Long classId);
    
    List<ScheduleResponseDTO> getSchedulesByTeacherId(Long teacherId);
    
    ScheduleResponseDTO updateSchedule(Long id, ScheduleRequestDTO request);
    
    void deleteSchedule(Long id);
}
