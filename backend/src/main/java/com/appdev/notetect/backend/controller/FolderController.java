
package com.appdev.notetect.backend.controller;

import com.appdev.notetect.backend.entity.FolderEntity;
import com.appdev.notetect.backend.service.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/folders")
public class FolderController {
    @Autowired
    private FolderService folderService;

    @PostMapping("/create")
    public ResponseEntity<FolderEntity> createFolder(@RequestBody FolderEntity folder) {
        return ResponseEntity.ok(folderService.createFolder(folder));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FolderEntity>> getFoldersByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(folderService.getFoldersByUser(userId));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteFolder(@PathVariable Long id) {
        folderService.deleteFolder(id);
        return ResponseEntity.ok("Folder deleted successfully");
    }
}
