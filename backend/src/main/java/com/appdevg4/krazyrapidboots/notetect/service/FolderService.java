package com.appdevg4.krazyrapidboots.notetect.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdevg4.krazyrapidboots.notetect.entity.Folder;
import com.appdevg4.krazyrapidboots.notetect.entity.Subject;
import com.appdevg4.krazyrapidboots.notetect.repository.FolderRepository;
import com.appdevg4.krazyrapidboots.notetect.repository.SubjectRepository;

@Service
public class FolderService {
    @Autowired
    private FolderRepository folderRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    // Get all folders for a user (through subject relationship)
    public List<Folder> getAllFoldersByUserId(Integer userId) {
        return folderRepository.findByUserId(userId);
    }

    // Get all folders for a specific subject
    public List<Folder> getAllFoldersBySubjectId(Integer subjectId) {
        return folderRepository.findBySubjectId(subjectId);
    }

    public Optional<Folder> getFolderById(int id) {
        return folderRepository.findById(id);
    }

    // Save folder with subject association
    public Folder saveFolder(Folder folder, Integer subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        folder.setSubject(subject);
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
