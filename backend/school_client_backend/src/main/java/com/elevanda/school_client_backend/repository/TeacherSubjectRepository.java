package com.elevanda.school_client_backend.repository;

import com.elevanda.school_client_backend.model.TeacherSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherSubjectRepository extends JpaRepository<TeacherSubject, Long> {
    
    @Query("SELECT ts FROM TeacherSubject ts WHERE ts.classSubject.schoolClass.id = :classId AND ts.classSubject.subject.id = :subjectId")
    List<TeacherSubject> findByClassIdAndSubjectId(@Param("classId") Long classId, @Param("subjectId") Long subjectId);
    
    @Query("SELECT ts FROM TeacherSubject ts WHERE ts.teacher.id = :teacherId")
    List<TeacherSubject> findByTeacherId(@Param("teacherId") Long teacherId);
}
