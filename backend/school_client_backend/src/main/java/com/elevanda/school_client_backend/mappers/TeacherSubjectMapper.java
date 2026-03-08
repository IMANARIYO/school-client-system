package com.elevanda.school_client_backend.mappers;

import com.elevanda.school_client_backend.dto.TeacherSubjectResponseDTO;
import com.elevanda.school_client_backend.model.TeacherSubject;
import org.springframework.stereotype.Component;

@Component
public class TeacherSubjectMapper {

    public TeacherSubjectResponseDTO toResponseDTO(TeacherSubject teacherSubject) {
        if (teacherSubject == null) return null;

        return TeacherSubjectResponseDTO.builder()
                .id(teacherSubject.getId())
                .teacherId(teacherSubject.getTeacher() != null ? teacherSubject.getTeacher().getId() : null)
                .teacherName(teacherSubject.getTeacher() != null && teacherSubject.getTeacher().getUser() != null ? 
                        teacherSubject.getTeacher().getUser().getFirstName() + " " + teacherSubject.getTeacher().getUser().getLastName() : null)
                .classId(teacherSubject.getClassSubject() != null && teacherSubject.getClassSubject().getSchoolClass() != null ? 
                        teacherSubject.getClassSubject().getSchoolClass().getId() : null)
                .className(teacherSubject.getClassSubject() != null && teacherSubject.getClassSubject().getSchoolClass() != null ? 
                        teacherSubject.getClassSubject().getSchoolClass().getName() : null)
                .subjectId(teacherSubject.getClassSubject() != null && teacherSubject.getClassSubject().getSubject() != null ? 
                        teacherSubject.getClassSubject().getSubject().getId() : null)
                .subjectName(teacherSubject.getClassSubject() != null && teacherSubject.getClassSubject().getSubject() != null ? 
                        teacherSubject.getClassSubject().getSubject().getName() : null)
                .build();
    }
}
