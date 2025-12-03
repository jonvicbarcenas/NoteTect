import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, ChevronDown, ChevronRight, Pencil } from 'lucide-react';
import { subjectsService } from '../../services/subjects';
import { foldersService } from '../../services/folders';
import { notesService } from '../../services/notes';
import { Subject, Note, Folder } from '../../types';
import SidebarFolders from './SidebarFolders';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface SidebarSubjectsProps {
    refreshTrigger?: number;
    onSubjectSelect: (subject: Subject | null) => void; 
    selectedSubject: Subject | null;
    onNoteSelect?: (note: Note) => void;
}

interface DeleteDialogState {
    isOpen: boolean;
    subject: Subject | null;
    foldersCount: number;
    notesCount: number;
}

function SidebarSubjects({ refreshTrigger = 0, onSubjectSelect, selectedSubject, onNoteSelect }: SidebarSubjectsProps) {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isSubjectsExpanded, setIsSubjectsExpanded] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
        isOpen: false,
        subject: null,
        foldersCount: 0,
        notesCount: 0,
    });

    useEffect(() => {
        loadSubjects();
    }, [refreshTrigger]);

    const loadSubjects = async () => {
        setIsLoading(true);
        try {
            const data = await subjectsService.getAll();
            setSubjects(data);
        } catch (error) {
            console.error('Failed to load subjects:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSubject = async () => {
        if (!newSubjectName.trim()) return;
        setIsLoading(true);
        try {
            const newSubject = await subjectsService.create({ name: newSubjectName.trim() });
            setSubjects([...subjects, newSubject]);
            setNewSubjectName('');
            setIsAdding(false);
        } catch (error) {
            console.error('Failed to create subject:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = async (e: React.MouseEvent, subject: Subject) => {
        e.stopPropagation();
        
        try {
            // Fetch folders for this subject
            const folders = await foldersService.getBySubject(subject.id);
            
            // Count total notes across all folders
            let totalNotes = 0;
            for (const folder of folders) {
                const notes = await notesService.getByFolder(folder.id);
                totalNotes += notes.length;
            }
            
            setDeleteDialog({
                isOpen: true,
                subject,
                foldersCount: folders.length,
                notesCount: totalNotes,
            });
        } catch (error) {
            console.error('Failed to fetch subject contents:', error);
            // Still show dialog even if we can't get counts
            setDeleteDialog({
                isOpen: true,
                subject,
                foldersCount: 0,
                notesCount: 0,
            });
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteDialog.subject) return;
        
        setIsDeleting(true);
        try {
            await subjectsService.delete(deleteDialog.subject.id);
            setSubjects(subjects.filter(s => s.id !== deleteDialog.subject!.id));
            if (selectedSubject && selectedSubject.id === deleteDialog.subject.id) {
                onSubjectSelect(null); 
            }
            setDeleteDialog({ isOpen: false, subject: null, foldersCount: 0, notesCount: 0 });
        } catch (error) {
            console.error('Failed to delete subject:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialog({ isOpen: false, subject: null, foldersCount: 0, notesCount: 0 });
    };

    const handleRenameSubject = async (id: number) => {
        if (!editingName.trim()) {
            setEditingId(null);
            return;
        }
        try {
            // Note: You may need to add a rename/update method to subjectsService
            const updated = await subjectsService.update(id, editingName.trim());
            setSubjects(subjects.map(s => s.id === id ? updated : s));
            setEditingId(null);
            setEditingName('');
        } catch (error) {
            console.error('Failed to rename subject:', error);
            setEditingId(null);
            setEditingName('');
        }
    };

    return (
        <div className="px-4 py-2">
            <button
                onClick={() => setIsSubjectsExpanded(!isSubjectsExpanded)}
                className="flex items-center justify-between w-full px-2 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
            >
                <span className="flex items-center gap-2">
                    {isSubjectsExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    Subjects
                </span>
                <span className="flex items-center gap-2">
                    <Plus
                        className="w-4 h-4 hover:text-indigo-400 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsAdding(true);
                            setIsSubjectsExpanded(true);
                        }}
                    />
                    <span className="text-xs font-normal normal-case text-slate-600">{subjects.length}</span>
                </span>
            </button>

            {isSubjectsExpanded && (
                <div className="space-y-1 mt-1">
                    {isAdding && (
                        <div className="flex items-center gap-2 px-4 py-2">
                            <input
                                type="text"
                                value={newSubjectName}
                                onChange={(e) => setNewSubjectName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddSubject();
                                    if (e.key === 'Escape') {
                                        setIsAdding(false);
                                        setNewSubjectName('');
                                    }
                                }}
                                placeholder="New subject name"
                                className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                                autoFocus
                                disabled={isLoading}
                            />
                        </div>
                    )}

                    {isLoading ? (
                        <p className="px-4 py-2 text-xs text-slate-600">Loading...</p>
                    ) : subjects.length === 0 ? (
                        <p className="px-4 py-2 text-xs text-slate-600">No subjects yet</p>
                    ) : (
                        subjects.map((subject) => (
                            <div key={subject.id}>
                                {/* Subject Item */}
                                <div
                                    className={`group flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                                        selectedSubject?.id === subject.id
                                            ? 'bg-indigo-900 text-white'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                                    onClick={() => {
                                        if (editingId !== subject.id) {
                                            onSubjectSelect(selectedSubject?.id === subject.id ? null : subject);
                                        }
                                    }}
                                >
                                    <span className="flex items-center gap-2 flex-1 truncate">
                                        <BookOpen 
                                            className={`w-4 h-4 flex-shrink-0 ${selectedSubject?.id === subject.id ? 'text-indigo-300' : 'text-slate-500 group-hover:text-indigo-400'}`} 
                                        />
                                        {editingId === subject.id ? (
                                            <input
                                                type="text"
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    e.stopPropagation();
                                                    if (e.key === 'Enter') handleRenameSubject(subject.id);
                                                    if (e.key === 'Escape') {
                                                        setEditingId(null);
                                                        setEditingName('');
                                                    }
                                                }}
                                                onBlur={() => handleRenameSubject(subject.id)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="truncate">{subject.name}</span>
                                        )}
                                    </span>
                                    <Pencil
                                        className="w-3 h-3 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-indigo-400 transition-opacity cursor-pointer flex-shrink-0"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingId(subject.id);
                                            setEditingName(subject.name);
                                        }}
                                    />
                                    <Trash2
                                        className="w-3 h-3 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity cursor-pointer flex-shrink-0"
                                        onClick={(e) => handleDeleteClick(e, subject)}
                                    />
                                </div>
                                
                                {/* Nested Folders with Notes */}
                                {selectedSubject?.id === subject.id && (
                                    <div className="pl-4 pt-1 pb-2">
                                        <SidebarFolders 
                                            subjectId={subject.id}
                                            refreshTrigger={refreshTrigger}
                                            onNoteSelect={onNoteSelect}
                                        />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                isOpen={deleteDialog.isOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Delete Subject"
                itemType="subject"
                itemName={deleteDialog.subject?.name || ''}
                childFoldersCount={deleteDialog.foldersCount}
                childNotesCount={deleteDialog.notesCount}
                isDeleting={isDeleting}
            />
        </div>
    );
}

export default SidebarSubjects;