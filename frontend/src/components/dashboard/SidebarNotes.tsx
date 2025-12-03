import { useState, useEffect } from 'react';
import { FileText, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { notesService } from '../../services/notes';
import { Note } from '../../types';

interface SidebarNotesProps {
    refreshTrigger?: number;
    onNoteSelect: (note: Note) => void;
}

function SidebarNotes({ refreshTrigger = 0, onNoteSelect }: SidebarNotesProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isExpanded, setIsExpanded] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadNotes();
    }, [refreshTrigger]);

    const loadNotes = async () => {
        setIsLoading(true);
        try {
            const data = await notesService.getAll();
            // Filter to only show uncategorized notes (notes without a folder)
            const uncategorizedNotes = data.filter(note => !note.folder);
            setNotes(uncategorizedNotes);
        } catch (error) {
            console.error('Failed to load notes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteNote = async (id: number) => {
        try {
            await notesService.delete(id);
            setNotes(notes.filter(n => n.id !== id));
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="px-4 py-2">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full px-2 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
            >
                <span className="flex items-center gap-2">
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    My Notes
                </span>
                <span className="text-xs font-normal normal-case text-slate-600">{notes.length}</span>
            </button>

            {isExpanded && (
                <div className="space-y-1 mt-1">
                    {isLoading ? (
                        <p className="px-4 py-2 text-xs text-slate-600">Loading...</p>
                    ) : notes.length === 0 ? (
                        <p className="px-4 py-2 text-xs text-slate-600">No notes yet</p>
                    ) : (
                        notes.map((note) => (
                            <div
                                key={note.id}
                                className="group flex items-start gap-2 px-4 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                                onClick={() => onNoteSelect(note)}
                            >
                                <FileText className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate text-slate-300 group-hover:text-white">
                                        {note.title || note.filename || 'Untitled'}
                                    </p>
                                    <p className="text-xs text-slate-600 truncate">
                                        {formatDate(note.createdAt)}
                                    </p>
                                </div>
                                <Trash2
                                    className="w-3 h-3 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity cursor-pointer flex-shrink-0 mt-1"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteNote(note.id);
                                    }}
                                />
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default SidebarNotes;
