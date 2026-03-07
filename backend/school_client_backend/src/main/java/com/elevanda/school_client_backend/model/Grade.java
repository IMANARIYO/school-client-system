package com.elevanda.school_client_backend.model;

import com.elevanda.school_client_backend.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "grades")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Grade extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @ManyToOne
    @JoinColumn(name = "class_subject_id", nullable = false)
    private ClassSubject classSubject;

    @Column(nullable = false)
    private BigDecimal score;

    private String grade;

    @Column(nullable = false)
    private String term;

    @Column(name = "academic_year", nullable = false)
    private String academicYear;

    @Column(name = "exam_type")
    private String examType;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "date_recorded", nullable = false)
    private LocalDateTime dateRecorded;

    @ManyToOne
    @JoinColumn(name = "approved_by")
    private Teacher approvedBy;

    @Column(nullable = false)
    private String status;
}
