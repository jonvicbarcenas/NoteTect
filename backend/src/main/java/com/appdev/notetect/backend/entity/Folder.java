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
public class Folder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    // A folder consists of many notes
    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL)
    private List<Note> notes;
}
