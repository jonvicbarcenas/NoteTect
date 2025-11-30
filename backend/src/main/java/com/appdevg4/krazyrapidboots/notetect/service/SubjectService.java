package com.appdevg4.krazyrapidboots.notetect.service;

import com.appdevg4.krazyrapidboots.notetect.entity.Subject;
import com.appdevg4.krazyrapidboots.notetect.entity.User;
import com.appdevg4.krazyrapidboots.notetect.repository.SubjectRepository;
import com.appdevg4.krazyrapidboots.notetect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubjectService {
    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Subject> getAllSubjectsByUserId(Integer userId) {
        return subjectRepository.findByUserUserId(userId);
    }

    public Optional<Subject> getSubjectById(int id) {
        return subjectRepository.findById(id);
    }

    public Subject saveSubject(Subject subject, Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        subject.setUser(user);
        return subjectRepository.save(subject);
    }

    public void deleteSubject(int id) {
        subjectRepository.deleteById(id);
    }
}
