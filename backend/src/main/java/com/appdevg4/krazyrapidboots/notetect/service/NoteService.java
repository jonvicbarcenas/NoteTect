package com.appdevg4.krazyrapidboots.notetect.service;

import com.appdevg4.krazyrapidboots.notetect.entity.Folder;
import com.appdevg4.krazyrapidboots.notetect.entity.Note;
import com.appdevg4.krazyrapidboots.notetect.entity.User;
import com.appdevg4.krazyrapidboots.notetect.repository.FolderRepository;
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

    @Autowired
    private FolderRepository folderRepository;

    public List<Note> getAllNotesByUserId(Integer userId) {
        return noteRepository.findByUserUserId(userId);
    }

    // Get all notes in a specific folder
    public List<Note> getAllNotesByFolderId(Integer folderId) {
        return noteRepository.findByFolderId(folderId);
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

    // Save note with folder association
    public Note saveNoteWithFolder(Note note, Integer userId, Integer folderId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));
        note.setUser(user);
        note.setFolder(folder);
        return noteRepository.save(note);
    }

    public void deleteNote(int id) {
        noteRepository.deleteById(id);
    }

    public Note updateNoteTitle(int id, String title, Integer userId) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found with id " + id));

        if (!note.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("User not authorized to update this note.");
        }

        note.setTitle(title);
        return noteRepository.save(note);
    }

    // Move note to a different folder
    public Note moveNoteToFolder(int noteId, Integer folderId, Integer userId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found with id " + noteId));

        if (!note.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("User not authorized to move this note.");
        }

        if (folderId != null) {
            Folder folder = folderRepository.findById(folderId)
                    .orElseThrow(() -> new RuntimeException("Folder not found"));
            note.setFolder(folder);
        } else {
            note.setFolder(null);
        }

        return noteRepository.save(note);
    }

    // Update note content (for action items completion status, etc.)
    public Note updateNoteContent(int id, String content, Integer userId) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found with id " + id));

        if (!note.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("User not authorized to update this note.");
        }

        note.setContent(content);
        return noteRepository.save(note);
    }
}
