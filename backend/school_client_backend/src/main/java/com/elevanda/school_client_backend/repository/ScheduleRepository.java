package com.elevanda.school_client_backend.repository;

import com.elevanda.school_client_backend.model.Schedule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    @Query("SELECT s FROM Schedule s WHERE s.deletedAt IS NULL")
    Page<Schedule> findAllActive(Pageable pageable);

    @Query("SELECT s FROM Schedule s WHERE s.id = :id AND s.deletedAt IS NULL")
    Optional<Schedule> findByIdAndNotDeleted(@Param("id") Long id);

    @Query("SELECT s FROM Schedule s WHERE s.schoolClass.id = :classId AND s.deletedAt IS NULL")
    List<Schedule> findByClassId(@Param("classId") Long classId);

    @Query("SELECT s FROM Schedule s WHERE s.teacher.id = :teacherId AND s.deletedAt IS NULL")
    List<Schedule> findByTeacherId(@Param("teacherId") Long teacherId);
}
