package com.appdev.notetect.backend.repository;

import com.appdev.notetect.backend.entity.FolderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FolderRepository extends JpaRepository<FolderEntity, Long> {
    // Find folders by user ID
    List<FolderEntity> findByUserId(Long userId);
}
