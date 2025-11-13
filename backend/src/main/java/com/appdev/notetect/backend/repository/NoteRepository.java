package com.appdev.notetect.backend.repository;

import com.appdev.notetect.backend.entity.NoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<NoteEntity, Long> {
    // Find notes by user ID
    List<NoteEntity> findByUserId(Long userId);
    
    // Optional: find notes by folder or subject
    List<NoteEntity> findByFolderId(Long folderId);
    List<NoteEntity> findBySubjectId(Long subjectId);
}
