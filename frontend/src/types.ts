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
    folders?: Folder[];
}

export interface Folder {
    id: number;
    name: string;
    notes?: Note[];
    // Subject ID for the folder (User → Subject → Folder hierarchy)
    subjectId?: number;
}

export interface Note {
    id: number;
    content: string;
    title: string;
    filename: string;
    createdAt: string;
    folder?: Folder;
    // Note: subject is now accessed through folder.subject (via Folder)
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
}

/**
 * @interface CreateFolderRequest
 * Links the new folder to the active subject via subjectId query param
 */
export interface CreateFolderRequest {
    name: string;
    subjectId: number;
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
