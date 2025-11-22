import { NoteType } from './types';
import { FileText, BookOpen, Layers, Zap, CheckSquare } from 'lucide-react';

export const NOTE_TYPES = [
    {
        id: NoteType.SUMMARY,
        label: 'Summary',
        icon: FileText,
        prompt: 'Summarize the following text or image. Capture the main points and key details. Output clean, well-structured Markdown. Do not include any conversational filler or introductory text. Start directly with the summary.'
    },
    {
        id: NoteType.STUDY_GUIDE,
        label: 'Study Guide',
        icon: BookOpen,
        prompt: 'Create a comprehensive study guide from the following content. Include key concepts, definitions, and review questions. Format as Markdown. Provide ONLY the study guide content, no other text. Do not say "Here is a study guide".'
    },
    {
        id: NoteType.FLASHCARDS,
        label: 'Flashcards',
        icon: Layers,
        prompt: 'Generate a set of flashcards from the content. Format as a list of "Question: [Question] \n Answer: [Answer]". Do not include any intro or outro text. Output ONLY the flashcards.'
    },
    {
        id: NoteType.SIMPLIFY,
        label: 'Simplify',
        icon: Zap,
        prompt: 'Explain the following content in simple terms, suitable for a beginner. Use analogies if helpful. Output only the explanation. Do not include conversational filler.'
    },
    {
        id: NoteType.ACTION_ITEMS,
        label: 'Action Items',
        icon: CheckSquare,
        prompt: 'Extract actionable items and key takeaways that require user attention. Format as a markdown checklist. Output only the checklist. Do not include conversational filler.'
    }
];
