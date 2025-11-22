export enum NoteType {
    SUMMARY = 'SUMMARY',
    STUDY_GUIDE = 'STUDY_GUIDE',
    FLASHCARDS = 'FLASHCARDS',
    SIMPLIFY = 'SIMPLIFY',
    ACTION_ITEMS = 'ACTION_ITEMS'
}

export interface GenerateNoteParams {
    text: string;
    imageBase64?: string;
    imageMimeType?: string;
    type: NoteType;
}

export interface HistoryItem {
    id: string;
    timestamp: number;
    title: string;
    type: NoteType;
    content: string;
}
