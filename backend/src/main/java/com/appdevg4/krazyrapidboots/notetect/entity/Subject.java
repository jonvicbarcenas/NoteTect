package com.appdevg4.krazyrapidboots.notetect.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;

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
