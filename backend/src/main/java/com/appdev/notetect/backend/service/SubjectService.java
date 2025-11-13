// SubjectService.java
package com.appdev.notetect.backend.service;

import com.appdev.notetect.backend.entity.SubjectEntity;
import com.appdev.notetect.backend.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SubjectService {
    @Autowired
    private SubjectRepository subjectRepository;

    public SubjectEntity createSubject(SubjectEntity subject) {
        return subjectRepository.save(subject);
    }

    public List<SubjectEntity> getSubjectsByUser(Long userId) {
        return subjectRepository.findByUserId(userId);
    }

    public void deleteSubject(Long subjectId) {
        subjectRepository.deleteById(subjectId);
    }
}
