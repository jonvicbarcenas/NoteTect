package com.appdev.notetect.backend.entity;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // The subject name (can be anything, not just educational)
    private String name;

    // A subject can have many notes assigned to it
    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
    private List<Note> notes;
}
