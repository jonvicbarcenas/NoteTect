import { NoteType } from './types';
import { FileText, BookOpen, Zap, CheckSquare, CreditCard } from 'lucide-react';

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
    },
    {
        id: NoteType.FLASHCARD,
        label: 'Flashcard',
        icon: CreditCard,
        prompt: `Create flashcards from the following content. Generate question and answer pairs that help with memorization and understanding. 

Output ONLY valid JSON in this exact format (no additional text, no markdown code blocks, no explanations):

{
  "flashcards": [
    {
      "front": "Question or concept to remember",
      "back": "Answer or explanation"
    },
    {
      "front": "Another question",
      "back": "Another answer"
    }
  ]
}

Example output:
{
  "flashcards": [
    {
      "front": "What is photosynthesis?",
      "back": "The process by which plants use sunlight, water, and carbon dioxide to produce oxygen and energy in the form of sugar."
    },
    {
      "front": "What are the main stages of photosynthesis?",
      "back": "Light-dependent reactions and the Calvin cycle (light-independent reactions)."
    }
  ]
}

Generate 5-10 flashcards based on the key concepts in the content. Output ONLY the JSON, nothing else.`
    }
];
