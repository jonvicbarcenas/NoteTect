package com.appdev.notetect.backend.service;

import com.appdev.notetect.backend.entity.Folder;
import com.appdev.notetect.backend.repository.FolderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FolderService {
    @Autowired
    private FolderRepository folderRepository;

    public List<Folder> getAllFolders() {
        return folderRepository.findAll();
    }

    public Optional<Folder> getFolderById(int id) {
        return folderRepository.findById(id);
    }

    public Folder saveFolder(Folder folder) {
        return folderRepository.save(folder);
    }

    public void deleteFolder(int id) {
        folderRepository.deleteById(id);
    }
}
