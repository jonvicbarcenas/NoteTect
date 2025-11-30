package com.appdevg4.krazyrapidboots.notetect.service;

import com.appdevg4.krazyrapidboots.notetect.entity.Note;
import com.appdevg4.krazyrapidboots.notetect.entity.User;
import com.appdevg4.krazyrapidboots.notetect.repository.NoteRepository;
import com.appdevg4.krazyrapidboots.notetect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {
    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Note> getAllNotesByUserId(Integer userId) {
        return noteRepository.findByUserUserId(userId);
    }

    public Optional<Note> getNoteById(int id) {
        return noteRepository.findById(id);
    }

    public Note saveNote(Note note, Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        note.setUser(user);
        return noteRepository.save(note);
    }

    public void deleteNote(int id) {
        noteRepository.deleteById(id);
    }

    public Note updateNoteTitle(int id, String title, Integer userId) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found with id " + id));

        if (!note.getUser().getUserId().equals(userId)) {
            // In a real app, you might throw a more specific, permission-denied exception
            throw new RuntimeException("User not authorized to update this note.");
        }

        note.setTitle(title);
        return noteRepository.save(note);
    }
}
