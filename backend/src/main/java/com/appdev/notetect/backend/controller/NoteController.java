package com.appdev.notetect.backend.controller;

import com.appdev.notetect.backend.entity.NoteEntity;
import com.appdev.notetect.backend.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @PostMapping("/create")
    public ResponseEntity<NoteEntity> createNote(@RequestBody NoteEntity note) {
        return ResponseEntity.ok(noteService.createNote(note));
    }

    @GetMapping("/all")
    public ResponseEntity<List<NoteEntity>> getAllNotes() {
        return ResponseEntity.ok(noteService.getAllNotes());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NoteEntity>> getNotesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(noteService.getNotesByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoteEntity> getNoteById(@PathVariable Long id) {
        return ResponseEntity.ok(noteService.getNoteById(id));
    }

    @PutMapping("/update")
    public ResponseEntity<NoteEntity> updateNote(@RequestBody NoteEntity note) {
        return ResponseEntity.ok(noteService.updateNote(note));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.ok("Note deleted successfully");
    }
}
