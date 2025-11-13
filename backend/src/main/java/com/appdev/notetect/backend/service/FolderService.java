// FolderService.java
package com.appdev.notetect.backend.service;

import com.appdev.notetect.backend.entity.FolderEntity;
import com.appdev.notetect.backend.repository.FolderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FolderService {
    @Autowired
    private FolderRepository folderRepository;

    public FolderEntity createFolder(FolderEntity folder) {
        return folderRepository.save(folder);
    }

    public List<FolderEntity> getFoldersByUser(Long userId) {
        return folderRepository.findByUserId(userId);
    }

    public void deleteFolder(Long folderId) {
        folderRepository.deleteById(folderId);
    }
}
