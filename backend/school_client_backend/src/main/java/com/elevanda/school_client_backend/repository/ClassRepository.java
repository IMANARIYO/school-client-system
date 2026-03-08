package com.elevanda.school_client_backend.repository;

import com.elevanda.school_client_backend.model.SchoolClass;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClassRepository extends JpaRepository<SchoolClass, Long> {

    @Query("SELECT c FROM SchoolClass c WHERE c.deletedAt IS NULL")
    Page<SchoolClass> findAllActive(Pageable pageable);

    @Query("SELECT c FROM SchoolClass c WHERE c.deletedAt IS NULL AND " +
           "(LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.gradeLevel) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.section) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<SchoolClass> searchClasses(@Param("search") String search, Pageable pageable);

    @Query("SELECT c FROM SchoolClass c WHERE c.id = :id AND c.deletedAt IS NULL")
    Optional<SchoolClass> findByIdAndNotDeleted(@Param("id") Long id);
}
