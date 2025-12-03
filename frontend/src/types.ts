// ============ Enums ============
export enum NoteType {
    SUMMARY = 'SUMMARY',
    STUDY_GUIDE = 'STUDY_GUIDE',
    SIMPLIFY = 'SIMPLIFY',
    ACTION_ITEMS = 'ACTION_ITEMS'
}

// ============ Entity Interfaces ============
export interface User {
    userId: number;
    name: string;
    email: string;
}

export interface Subject {
    id: number;
    name: string;
}

export interface Folder {
    id: number;
    name: string;
    notes?: Note[];
    // Include the Subject ID on the Folder entity if needed for client side
    // subjectId: number; 
}

export interface Note {
    id: number;
    content: string;
    title: string;
    filename: string;
    createdAt: string;
    folder?: Folder;
    subject?: Subject;
}

// ============ Request/Response Interfaces ============
export interface GenerateNoteParams {
    text: string;
    imageBase64?: string;
    imageMimeType?: string;
    type: NoteType;
}

export interface CreateNoteRequest {
    content: string;
    title: string;
    filename: string;
    createdAt: string;
    folder?: { id: number };
    subject?: { id: number };
}

/**
 * @interface CreateFolderRequest
 * FIX: Added subjectId to link the new folder to the active subject.
 */
export interface CreateFolderRequest {
    name: string;
    subjectId: number; // 👈 FIX for Object literal error
}

export interface CreateSubjectRequest {
    name: string;
}

export interface ApiError {
    message: string;
    status?: number;
}

// ============ Legacy/Local Interfaces ============
export interface HistoryItem {
    id: string;
    timestamp: number;
    title: string;
    type: NoteType;
    content: string;
}