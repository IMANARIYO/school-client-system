package com.elevanda.school_client_backend.repository;

import com.elevanda.school_client_backend.model.Subject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {

    @Query("SELECT s FROM Subject s WHERE s.deletedAt IS NULL")
    Page<Subject> findAllActive(Pageable pageable);

    @Query("SELECT s FROM Subject s WHERE s.deletedAt IS NULL AND " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Subject> searchSubjects(@Param("search") String search, Pageable pageable);

    @Query("SELECT s FROM Subject s WHERE s.id = :id AND s.deletedAt IS NULL")
    Optional<Subject> findByIdAndNotDeleted(@Param("id") Long id);
    
    @Query("SELECT s FROM Subject s JOIN s.classSubjects cs WHERE cs.schoolClass.id = :classId AND s.deletedAt IS NULL")
    Page<Subject> findByClassId(@Param("classId") Long classId, Pageable pageable);
}
