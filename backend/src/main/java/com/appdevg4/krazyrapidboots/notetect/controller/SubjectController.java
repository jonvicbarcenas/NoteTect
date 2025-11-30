package com.appdevg4.krazyrapidboots.notetect.controller;

import com.appdevg4.krazyrapidboots.notetect.entity.Subject;
import com.appdevg4.krazyrapidboots.notetect.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {
    @Autowired
    private SubjectService subjectService;

    @GetMapping
    public List<Subject> getAllSubjects(Authentication authentication) {
        Integer userId = (Integer) authentication.getPrincipal();
        return subjectService.getAllSubjectsByUserId(userId);
    }

    @GetMapping("/{id}")
    public Optional<Subject> getSubjectById(@PathVariable int id) {
        return subjectService.getSubjectById(id);
    }

    @PostMapping
    public Subject createSubject(@RequestBody Subject subject, Authentication authentication) {
        Integer userId = (Integer) authentication.getPrincipal();
        return subjectService.saveSubject(subject, userId);
    }

    @DeleteMapping("/{id}")
    public void deleteSubject(@PathVariable int id) {
        subjectService.deleteSubject(id);
    }
}
