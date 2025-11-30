package com.appdevg4.krazyrapidboots.notetect.repository;

import com.appdevg4.krazyrapidboots.notetect.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Integer> {
    List<Note> findByUserUserId(Integer userId);
}
