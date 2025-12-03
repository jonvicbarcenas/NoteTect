package com.appdevg4.krazyrapidboots.notetect.controller;

import com.appdevg4.krazyrapidboots.notetect.entity.Folder;
import com.appdevg4.krazyrapidboots.notetect.service.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/folders")
public class FolderController {
    @Autowired
    private FolderService folderService;

    // Get all folders for the authenticated user (through subject relationship)
    @GetMapping
    public List<Folder> getAllFolders(Authentication authentication) {
        Integer userId = (Integer) authentication.getPrincipal();
        return folderService.getAllFoldersByUserId(userId);
    }

    // Get all folders for a specific subject
    @GetMapping("/subject/{subjectId}")
    public List<Folder> getFoldersBySubject(@PathVariable Integer subjectId) {
        return folderService.getAllFoldersBySubjectId(subjectId);
    }

    @GetMapping("/{id}")
    public Optional<Folder> getFolderById(@PathVariable int id) {
        return folderService.getFolderById(id);
    }

    // Create folder with subjectId parameter
    @PostMapping
    public Folder createFolder(@RequestBody Folder folder, @RequestParam Integer subjectId) {
        return folderService.saveFolder(folder, subjectId);
    }

    @DeleteMapping("/{id}")
    public void deleteFolder(@PathVariable int id) {
        folderService.deleteFolder(id);
    }

    @PutMapping("/{id}")
    public Folder renameFolder(@PathVariable int id, @RequestBody Folder folder) {
        return folderService.renameFolder(id, folder.getName());
    }
}
