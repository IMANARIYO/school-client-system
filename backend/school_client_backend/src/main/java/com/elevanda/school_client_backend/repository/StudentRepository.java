package com.elevanda.school_client_backend.repository;

import com.elevanda.school_client_backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    @Query("SELECT s FROM Student s WHERE s.schoolClass.id = :classId AND s.deletedAt IS NULL")
    List<Student> findByClassId(@Param("classId") Long classId);
    
    @Query("SELECT s FROM Student s WHERE s.user.id = :userId")
    Optional<Student> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT s FROM Student s WHERE s.parent.id = :parentId AND s.deletedAt IS NULL")
    List<Student> findByParentId(@Param("parentId") Long parentId);
}
