package com.elevanda.school_client_backend.dto;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherSubjectResponseDTO {

    private Long id;
    private Long teacherId;
    private String teacherName;
    private Long classId;
    private String className;
    private Long subjectId;
    private String subjectName;
}
