
# NoteTect - Entity Relationship Diagram (ERD)

## Overview

This ERD represents the database structure for NoteTect, an AI-powered note-taking application designed to manage users, folders, subjects, and generated notes.

## Entities and Attributes

### 1. User

**Primary Key:** user_id

- user_id (PK) - INT, AUTO_INCREMENT
- name - VARCHAR(255), NOT NULL
- email - VARCHAR(255), UNIQUE, NOT NULL
- password - VARCHAR(255), NOT NULL

### 2. Folder

**Primary Key:** id

- id (PK) - INT, AUTO_INCREMENT
- name - VARCHAR(255), NOT NULL
- user_id (FK) - INT, NOT NULL

### 3. Subject

**Primary Key:** id

- id (PK) - INT, AUTO_INCREMENT
- name - VARCHAR(255), NOT NULL
- user_id (FK) - INT, NOT NULL

### 4. Note

**Primary Key:** id

- id (PK) - INT, AUTO_INCREMENT
- content - TEXT
- filename - VARCHAR(255)
- created_at - VARCHAR(255)
- folder_id (FK) - INT
- subject_id (FK) - INT
- user_id (FK) - INT, NOT NULL

## Relationships

### One-to-Many Relationships:

1.  **User → Folder** (1:N)
    - One user can create many folders
    - Foreign Key: folder.user_id → user.user_id

2.  **User → Subject** (1:N)
    - One user can create many subjects
    - Foreign Key: subject.user_id → user.user_id

3.  **User → Note** (1:N)
    - One user can create many notes
    - Foreign Key: note.user_id → user.user_id

4.  **Folder → Note** (1:N)
    - One folder can contain many notes
    - Foreign Key: note.folder_id → folder.id

5.  **Subject → Note** (1:N)
    - One subject can categorize many notes
    - Foreign Key: note.subject_id → subject.id

## Business Rules and Constraints

1.  **Ownership Rules:**
    - Users can only access their own notes, folders, and subjects.
    - Data is isolated per user (Multi-tenancy by column).

2.  **Organization Rules:**
    - A note can belong to one folder.
    - A note can be assigned to one subject.
    - Deleting a folder or subject may cascade delete associated notes (based on `CascadeType.ALL` in code).

3.  **User Rules:**
    - Users must have a unique email address.fhh

## Visual Representation

```mermaid
erDiagram
    User ||--o{ Folder : creates
    User ||--o{ Subject : creates
    User ||--o{ Note : creates
    Folder ||--o{ Note : contains
    Subject ||--o{ Note : categorizes

    User {
        int user_id PK
        string name
        string email
        string password
    }

    Folder {
        int id PK
        string name
        int user_id FK
    }

    Subject {
        int id PK
        string name
        int user_id FK
    }

    Note {
        int id PK
        string title
        string content
        string filename
        string created_at
        int folder_id FK
        int subject_id FK
        int user_id FK
    }
```


## Class Diagram || UML Diagram

```mermaid
classDiagram
    class User {
        -Int user_id
        -String name
        -String email
        -String password
        +registerAccount() User
        +loginAccount() User
        +updateProfile() void
    }

    class Note {
        -Int note_id
        -Int user_id
        -Int folder_id
        -Int subject_id
        -String title
        -String content
        -String filename
        -DateTime created_at
        +assignSubject(subject : Subject) void
        +getNoteDetails() String
        +deleteNote(note_id : int) void
        +viewNotes() List~Note~
    }

    class Folder {
        -Int folder_id
        -Int user_id
        -String name
        +addNote(note : Note) void
        +viewNotes() List~Note~
        +renameFolder(newName : String) void
    }


    class Subject {
        -Int subject_id
        -Int user_id
        -String name
        +addNote(note : Note) void
        +viewNotes() List~Note~
    }

    %% Associations with multiplicities
    User "1" --> "0..*" Note : creates
    User "1" --> "0..*" Folder : owns
    User "1" --> "0..*" Subject : creates
    Folder "1" --> "0..*" Note : contains
    Subject "1" --> "0..*" Note : categorizes
```

