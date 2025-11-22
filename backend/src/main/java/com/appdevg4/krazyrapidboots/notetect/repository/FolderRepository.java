package com.appdevg4.krazyrapidboots.notetect.repository;

import com.appdevg4.krazyrapidboots.notetect.entity.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Integer> {
}
