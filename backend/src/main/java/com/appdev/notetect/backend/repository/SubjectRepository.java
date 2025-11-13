package com.appdev.notetect.backend.repository;

import com.appdev.notetect.backend.entity.SubjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<SubjectEntity, Long> {
    // Find subjects by user ID
    List<SubjectEntity> findByUserId(Long userId);
}
