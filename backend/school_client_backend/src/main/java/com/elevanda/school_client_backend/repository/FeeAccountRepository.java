package com.elevanda.school_client_backend.repository;

import com.elevanda.school_client_backend.model.FeeAccount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FeeAccountRepository extends JpaRepository<FeeAccount, Long> {

    @Query("SELECT f FROM FeeAccount f WHERE f.deletedAt IS NULL")
    Page<FeeAccount> findAllActive(Pageable pageable);

    @Query("SELECT f FROM FeeAccount f WHERE f.id = :id AND f.deletedAt IS NULL")
    Optional<FeeAccount> findByIdAndNotDeleted(@Param("id") Long id);

    @Query("SELECT f FROM FeeAccount f WHERE f.student.id = :studentId AND f.deletedAt IS NULL")
    Optional<FeeAccount> findByStudentId(@Param("studentId") Long studentId);
}
