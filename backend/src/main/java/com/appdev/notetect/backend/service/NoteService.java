package com.appdev.notetect.backend.service;

import com.appdev.notetect.backend.entity.NoteEntity;
import com.appdev.notetect.backend.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    public NoteEntity createNote(NoteEntity note) {
        return noteRepository.save(note);
    }

    public List<NoteEntity> getAllNotes() {
        return noteRepository.findAll();
    }

    public List<NoteEntity> getNotesByUserId(Long userId) {
        return noteRepository.findByUserId(userId);
    }

    public NoteEntity getNoteById(Long noteId) {
        return noteRepository.findById(noteId).orElse(null);
    }

    public NoteEntity updateNote(NoteEntity note) {
        return noteRepository.save(note);
    }

    public void deleteNote(Long noteId) {
        noteRepository.deleteById(noteId);
    }
}
