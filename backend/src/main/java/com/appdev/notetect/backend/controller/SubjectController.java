
package com.appdev.notetect.backend.controller;

import com.appdev.notetect.backend.entity.SubjectEntity;
import com.appdev.notetect.backend.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {
    @Autowired
    private SubjectService subjectService;

    @PostMapping("/create")
    public ResponseEntity<SubjectEntity> createSubject(@RequestBody SubjectEntity subject) {
        return ResponseEntity.ok(subjectService.createSubject(subject));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SubjectEntity>> getSubjectsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(subjectService.getSubjectsByUser(userId));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.ok("Subject deleted successfully");
    }
}
