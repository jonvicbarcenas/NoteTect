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

    @GetMapping
    public List<Folder> getAllFolders(Authentication authentication) {
        Integer userId = (Integer) authentication.getPrincipal();
        return folderService.getAllFoldersByUserId(userId);
    }

    @GetMapping("/{id}")
    public Optional<Folder> getFolderById(@PathVariable int id) {
        return folderService.getFolderById(id);
    }

    @PostMapping
    public Folder createFolder(@RequestBody Folder folder, Authentication authentication) {
        Integer userId = (Integer) authentication.getPrincipal();
        return folderService.saveFolder(folder, userId);
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
