package com.elevanda.school_client_backend.repository;

import com.elevanda.school_client_backend.model.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParentRepository extends JpaRepository<Parent, Long> {
    
    @Query("SELECT p FROM Parent p WHERE p.user.id = :userId")
    Optional<Parent> findByUserId(@Param("userId") Long userId);
}
