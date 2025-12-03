package com.appdevg4.krazyrapidboots.notetect.repository;

import com.appdevg4.krazyrapidboots.notetect.entity.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Integer> {
    // Find all folders belonging to a specific subject
    List<Folder> findBySubjectId(Integer subjectId);

    // Find all folders for a user (through subject relationship)
    @Query("SELECT f FROM Folder f WHERE f.subject.user.userId = :userId")
    List<Folder> findByUserId(@Param("userId") Integer userId);
}
