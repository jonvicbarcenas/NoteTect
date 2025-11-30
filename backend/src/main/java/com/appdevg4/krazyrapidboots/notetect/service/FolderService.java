package com.appdevg4.krazyrapidboots.notetect.service;

import com.appdevg4.krazyrapidboots.notetect.entity.Folder;
import com.appdevg4.krazyrapidboots.notetect.entity.User;
import com.appdevg4.krazyrapidboots.notetect.repository.FolderRepository;
import com.appdevg4.krazyrapidboots.notetect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FolderService {
    @Autowired
    private FolderRepository folderRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Folder> getAllFoldersByUserId(Integer userId) {
        return folderRepository.findByUserUserId(userId);
    }

    public Optional<Folder> getFolderById(int id) {
        return folderRepository.findById(id);
    }

    public Folder saveFolder(Folder folder, Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        folder.setUser(user);
        return folderRepository.save(folder);
    }

    public void deleteFolder(int id) {
        folderRepository.deleteById(id);
    }

    public Folder renameFolder(int id, String newName) {
        Folder folder = folderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Folder not found"));
        folder.setName(newName);
        return folderRepository.save(folder);
    }
}
