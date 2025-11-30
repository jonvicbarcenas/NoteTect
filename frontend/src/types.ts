// ============ Enums ============
export enum NoteType {
    SUMMARY = 'SUMMARY',
    STUDY_GUIDE = 'STUDY_GUIDE',
    FLASHCARDS = 'FLASHCARDS',
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
}

export interface Note {
    id: number;
    content: string;
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
    filename: string;
    createdAt: string;
    folder?: { id: number };
    subject?: { id: number };
}

export interface CreateFolderRequest {
    name: string;
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
