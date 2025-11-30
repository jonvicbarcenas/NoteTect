package com.appdevg4.krazyrapidboots.notetect.controller;

import com.appdevg4.krazyrapidboots.notetect.entity.Note;
import com.appdevg4.krazyrapidboots.notetect.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notes")
public class NoteController {
    @Autowired
    private NoteService noteService;

    @GetMapping
    public List<Note> getAllNotes(Authentication authentication) {
        Integer userId = (Integer) authentication.getPrincipal();
        return noteService.getAllNotesByUserId(userId);
    }

    @GetMapping("/{id}")
    public Optional<Note> getNoteById(@PathVariable int id) {
        return noteService.getNoteById(id);
    }

    @PostMapping
    public Note createNote(@RequestBody Note note, Authentication authentication) {
        Integer userId = (Integer) authentication.getPrincipal();
        return noteService.saveNote(note, userId);
    }

    @DeleteMapping("/{id}")
    public void deleteNote(@PathVariable int id) {
        noteService.deleteNote(id);
    }
}
