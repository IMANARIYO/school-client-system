package com.elevanda.school_client_backend.mappers;

import com.elevanda.school_client_backend.dto.ScheduleRequestDTO;
import com.elevanda.school_client_backend.dto.ScheduleResponseDTO;
import com.elevanda.school_client_backend.model.Schedule;
import org.springframework.stereotype.Component;

@Component
public class ScheduleMapper {

    public ScheduleResponseDTO toResponseDTO(Schedule schedule) {
        if (schedule == null) return null;

        return ScheduleResponseDTO.builder()
                .id(schedule.getId())
                .classId(schedule.getSchoolClass() != null ? schedule.getSchoolClass().getId() : null)
                .className(schedule.getSchoolClass() != null ? schedule.getSchoolClass().getName() : null)
                .teacherId(schedule.getTeacher() != null ? schedule.getTeacher().getId() : null)
                .teacherName(schedule.getTeacher() != null && schedule.getTeacher().getUser() != null ? 
                        schedule.getTeacher().getUser().getFirstName() + " " + schedule.getTeacher().getUser().getLastName() : null)
                .subjectId(schedule.getSubject() != null ? schedule.getSubject().getId() : null)
                .subjectName(schedule.getSubject() != null ? schedule.getSubject().getName() : null)
                .day(schedule.getDay())
                .startTime(schedule.getStartTime())
                .endTime(schedule.getEndTime())
                .build();
    }

    public Schedule toEntity(ScheduleRequestDTO dto) {
        if (dto == null) return null;

        return Schedule.builder()
                .day(dto.getDay())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .build();
    }

    public void updateEntity(Schedule schedule, ScheduleRequestDTO dto) {
        if (dto.getDay() != null) schedule.setDay(dto.getDay());
        if (dto.getStartTime() != null) schedule.setStartTime(dto.getStartTime());
        if (dto.getEndTime() != null) schedule.setEndTime(dto.getEndTime());
    }
}
