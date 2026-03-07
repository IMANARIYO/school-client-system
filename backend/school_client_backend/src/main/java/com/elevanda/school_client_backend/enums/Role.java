package com.elevanda.school_client_backend.enums;


import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Set;

@RequiredArgsConstructor
public enum Role {

    SUPER_ADMIN(Set.of(
            // Full access for everything
            Permission.USER_FULL,
            Permission.FEE_FULL,
            Permission.GRADES_FULL,
            Permission.ATTENDANCE_FULL,
            Permission.TIMETABLE_FULL,
            Permission.CLASS_FULL,
            Permission.TEACHER_FULL
    )),

    ADMIN(Set.of(
            Permission.USER_CREATE, Permission.USER_READ, Permission.USER_UPDATE, Permission.USER_DELETE,
            Permission.DEVICE_VERIFY,
            Permission.FEE_DEPOSIT, Permission.FEE_WITHDRAW, Permission.FEE_VIEW,
            Permission.GRADES_VIEW, Permission.GRADES_UPDATE,
            Permission.ATTENDANCE_VIEW, Permission.ATTENDANCE_UPDATE,
            Permission.TIMETABLE_VIEW,
            Permission.CLASS_VIEW, Permission.CLASS_MANAGE, Permission.TEACHER_ASSIGN
    )),

    TEACHER(Set.of(
            Permission.GRADES_VIEW, Permission.GRADES_UPDATE,
            Permission.ATTENDANCE_VIEW, Permission.ATTENDANCE_UPDATE,
            Permission.CLASS_VIEW,
            Permission.TIMETABLE_VIEW
    )),

    STUDENT(Set.of(
            Permission.GRADES_VIEW,
            Permission.ATTENDANCE_VIEW,
            Permission.TIMETABLE_VIEW,
            Permission.FEE_VIEW
    )),

    PARENT(Set.of(
            Permission.GRADES_VIEW,
            Permission.ATTENDANCE_VIEW,
            Permission.TIMETABLE_VIEW,
            Permission.FEE_VIEW
    ));

    @Getter
    private final Set<Permission> permissions;
}