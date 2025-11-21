package com.appdev.notetect.backend.controller;

import com.appdev.notetect.backend.entity.Folder;
import com.appdev.notetect.backend.service.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/folders")
public class FolderController {
    @Autowired
    private FolderService folderService;

    @GetMapping
    public List<Folder> getAllFolders() {
        return folderService.getAllFolders();
    }

    @GetMapping("/{id}")
    public Optional<Folder> getFolderById(@PathVariable int id) {
        return folderService.getFolderById(id);
    }

    @PostMapping
    public Folder createFolder(@RequestBody Folder folder) {
        return folderService.saveFolder(folder);
    }

    @DeleteMapping("/{id}")
    public void deleteFolder(@PathVariable int id) {
        folderService.deleteFolder(id);
    }
}
