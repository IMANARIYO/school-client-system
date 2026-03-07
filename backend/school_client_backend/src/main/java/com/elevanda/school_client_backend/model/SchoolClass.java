package com.elevanda.school_client_backend.model;

import com.elevanda.school_client_backend.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "classes")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class SchoolClass extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(name = "grade_level", nullable = false)
    private String gradeLevel;

    private String section;

    @ManyToOne
    @JoinColumn(name = "class_representative")
    private Student classRepresentative;

    @ManyToOne
    @JoinColumn(name = "responsible_teacher")
    private Teacher responsibleTeacher;

    private Integer capacity;

    @Column(name = "room_number")
    private String roomNumber;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @OneToMany(mappedBy = "schoolClass", cascade = CascadeType.ALL)
    private List<Student> students;

    @OneToMany(mappedBy = "schoolClass", cascade = CascadeType.ALL)
    private List<Schedule> schedules;

    @OneToMany(mappedBy = "schoolClass", cascade = CascadeType.ALL)
    private List<ClassSubject> classSubjects;
}
