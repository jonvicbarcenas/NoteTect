package com.appdev.notetect.backend.service;

import com.appdev.notetect.backend.entity.DocumentEntity;
import com.appdev.notetect.backend.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    public DocumentEntity uploadDocument(DocumentEntity document) {
        return documentRepository.save(document);
    }

    public List<DocumentEntity> getAllDocuments() {
        return documentRepository.findAll();
    }

    public List<DocumentEntity> getDocumentsByUserId(Long userId) {
        return documentRepository.findByUserId(userId);
    }

    public void deleteDocument(Long documentId) {
        documentRepository.deleteById(documentId);
    }
}
