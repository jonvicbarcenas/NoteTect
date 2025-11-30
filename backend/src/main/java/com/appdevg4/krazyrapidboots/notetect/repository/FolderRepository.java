package com.appdevg4.krazyrapidboots.notetect.repository;

import com.appdevg4.krazyrapidboots.notetect.entity.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Integer> {
    List<Folder> findByUserUserId(Integer userId);
}
