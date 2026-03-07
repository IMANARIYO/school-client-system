package com.elevanda.school_client_backend.enums;


import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Permission {

    // User Management
    USER_CREATE("user:create"),
    USER_READ("user:read"),
    USER_UPDATE("user:update"),
    USER_DELETE("user:delete"),
    DEVICE_VERIFY("device:verify"),
    USER_FULL("user:full"),   // full permission on users

    // Fee Management
    FEE_DEPOSIT("fee:deposit"),
    FEE_WITHDRAW("fee:withdraw"),
    FEE_VIEW("fee:view"),
    FEE_FULL("fee:full"),     // full permission on fees

    // Academic Records
    GRADES_VIEW("grades:view"),
    GRADES_UPDATE("grades:update"),
    GRADES_FULL("grades:full"),  // full permission on grades
    ATTENDANCE_VIEW("attendance:view"),
    ATTENDANCE_UPDATE("attendance:update"),
    ATTENDANCE_FULL("attendance:full"),  // full permission on attendance
    TIMETABLE_VIEW("timetable:view"),
    TIMETABLE_FULL("timetable:full"),    // full permission on timetable

    // Class & Teacher Management
    CLASS_VIEW("class:view"),
    CLASS_MANAGE("class:manage"),
    CLASS_FULL("class:full"),            // full permission on classes
    TEACHER_ASSIGN("teacher:assign"),
    TEACHER_FULL("teacher:full");        // full permission on teachers

    @Getter
    private final String permission;
}

