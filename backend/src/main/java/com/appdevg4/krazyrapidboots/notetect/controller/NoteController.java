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

    // Get all notes in a specific folder
    @GetMapping("/folder/{folderId}")
    public List<Note> getNotesByFolder(@PathVariable Integer folderId) {
        return noteService.getAllNotesByFolderId(folderId);
    }

    @GetMapping("/{id}")
    public Optional<Note> getNoteById(@PathVariable int id) {
        return noteService.getNoteById(id);
    }

    @PostMapping
    public Note createNote(@RequestBody Note note, 
                          @RequestParam(required = false) Integer folderId,
                          Authentication authentication) {
        Integer userId = (Integer) authentication.getPrincipal();
        if (folderId != null) {
            return noteService.saveNoteWithFolder(note, userId, folderId);
        }
        return noteService.saveNote(note, userId);
    }

    @DeleteMapping("/{id}")
    public void deleteNote(@PathVariable int id) {
        noteService.deleteNote(id);
    }

    @PutMapping("/{id}")
    public Note updateNote(@PathVariable int id, @RequestBody java.util.Map<String, String> payload, Authentication authentication) {
        Integer userId = (Integer) authentication.getPrincipal();
        String title = payload.get("title");
        return noteService.updateNoteTitle(id, title, userId);
    }

    // Move note to a different folder
    @PutMapping("/{id}/move")
    public Note moveNote(@PathVariable int id, 
                        @RequestParam(required = false) Integer folderId,
                        Authentication authentication) {
        Integer userId = (Integer) authentication.getPrincipal();
        return noteService.moveNoteToFolder(id, folderId, userId);
    }

    // Update note content (for action items, etc.)
    @PutMapping("/{id}/content")
    public Note updateNoteContent(@PathVariable int id, 
                                  @RequestBody java.util.Map<String, String> payload,
                                  Authentication authentication) {
        Integer userId = (Integer) authentication.getPrincipal();
        String content = payload.get("content");
        return noteService.updateNoteContent(id, content, userId);
    }
}
