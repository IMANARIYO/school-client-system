package com.elevanda.school_client_backend.repository;

import com.elevanda.school_client_backend.model.ClassSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClassSubjectRepository extends JpaRepository<ClassSubject, Long> {
    
    @Query("SELECT cs FROM ClassSubject cs WHERE cs.schoolClass.id = :classId AND cs.subject.id = :subjectId")
    Optional<ClassSubject> findByClassIdAndSubjectId(@Param("classId") Long classId, @Param("subjectId") Long subjectId);
}
