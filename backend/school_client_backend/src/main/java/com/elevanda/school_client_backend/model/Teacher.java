package com.elevanda.school_client_backend.model;

import com.elevanda.school_client_backend.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "teachers")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Teacher extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    private String gender;

    @Column(name = "address_line1")
    private String addressLine1;

    @Column(name = "address_line2")
    private String addressLine2;

    private String city;
    private String state;

    @Column(name = "postal_code")
    private String postalCode;

    private String country;
    private String phone;
    private String email;

    @Column(name = "emergency_contact_name")
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone")
    private String emergencyContactPhone;

    @Column(name = "blood_group")
    private String bloodGroup;

    @Column(name = "medical_conditions", columnDefinition = "TEXT")
    private String medicalConditions;

    @Column(name = "hire_date")
    private LocalDate hireDate;

    @Column(name = "employment_type")
    private String employmentType;

    private String specialization;
    private String qualification;

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;

    @Column(name = "subjects_can_teach", columnDefinition = "TEXT")
    private String subjectsCanTeach;

    @Column(name = "grade_levels_can_teach", columnDefinition = "TEXT")
    private String gradeLevelsCanTeach;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "bank_branch")
    private String bankBranch;

    @Column(name = "account_number")
    private String accountNumber;

    @Column(name = "account_type")
    private String accountType;

    private BigDecimal salary;

    @Column(name = "tax_id")
    private String taxId;

    @Column(name = "staff_id", unique = true)
    private String staffId;

    @Column(nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL)
    private List<TeacherSubject> teacherSubjects;

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL)
    private List<Grade> gradesEntered;

    @OneToMany(mappedBy = "approvedBy")
    private List<Grade> gradesApproved;

    @OneToMany(mappedBy = "responsibleTeacher")
    private List<SchoolClass> responsibleForClasses;

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL)
    private List<Schedule> schedules;
}
