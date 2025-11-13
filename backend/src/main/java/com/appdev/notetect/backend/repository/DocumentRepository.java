package com.appdev.notetect.backend.repository;

import com.appdev.notetect.backend.entity.DocumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<DocumentEntity, Long> {
    // Find documents by user ID
    List<DocumentEntity> findByUserId(Long userId);
}
