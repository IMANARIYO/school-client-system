package com.elevanda.school_client_backend.dto;

import lombok.*;
import java.time.LocalTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleResponseDTO {

    private Long id;
    private Long classId;
    private String className;
    private Long teacherId;
    private String teacherName;
    private Long subjectId;
    private String subjectName;
    private String day;
    private LocalTime startTime;
    private LocalTime endTime;
}
