import { useState, useEffect } from 'react';
import { FolderIcon, FolderOpen, Plus, Trash2, ChevronDown, ChevronRight, Pencil, FileText } from 'lucide-react';
import { foldersService } from '../../services/folders';
import { notesService } from '../../services/notes';
import { Folder, Note } from '../../types';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface SidebarFoldersProps {
    subjectId: number;
    refreshTrigger?: number;
    onNoteSelect?: (note: Note) => void;
}

interface DeleteDialogState {
    isOpen: boolean;
    folder: Folder | null;
    notesCount: number;
}

function SidebarFolders({ subjectId, refreshTrigger = 0, onNoteSelect }: SidebarFoldersProps) {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [isExpanded, setIsExpanded] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');
    const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());
    const [folderNotes, setFolderNotes] = useState<Record<number, Note[]>>({});
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
        isOpen: false,
        folder: null,
        notesCount: 0,
    });

    useEffect(() => {
        loadFolders(subjectId);
    }, [subjectId, refreshTrigger]);

    const loadFolders = async (id: number) => {
        try {
            const data = await foldersService.getAll(id); 
            setFolders(data);
            // Load notes for all folders
            data.forEach(folder => loadNotesForFolder(folder.id));
        } catch (error) {
            console.error('Failed to load folders:', error);
        }
    };

    const loadNotesForFolder = async (folderId: number) => {
        try {
            const notes = await notesService.getByFolder(folderId);
            setFolderNotes(prev => ({ ...prev, [folderId]: notes }));
        } catch (error) {
            console.error('Failed to load notes for folder:', error);
        }
    };

    const toggleFolderExpanded = (folderId: number) => {
        setExpandedFolders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(folderId)) {
                newSet.delete(folderId);
            } else {
                newSet.add(folderId);
                // Load notes when expanding if not already loaded
                if (!folderNotes[folderId]) {
                    loadNotesForFolder(folderId);
                }
            }
            return newSet;
        });
    };

    const handleDeleteNote = async (e: React.MouseEvent, noteId: number, folderId: number) => {
        e.stopPropagation();
        try {
            await notesService.delete(noteId);
            setFolderNotes(prev => ({
                ...prev,
                [folderId]: prev[folderId]?.filter(n => n.id !== noteId) || []
            }));
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

    const handleAddFolder = async () => {
        if (!newFolderName.trim()) return;
        
        setIsLoading(true);
        try {
            // ASSUMPTION: foldersService.create now accepts subjectId to link the folder
            const newFolder = await foldersService.create({ name: newFolderName.trim(), subjectId }); 
            setFolders([...folders, newFolder]);
            setNewFolderName('');
            setIsAdding(false);
        } catch (error) {
            console.error('Failed to create folder:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (e: React.MouseEvent, folder: Folder) => {
        e.stopPropagation();
        const notes = folderNotes[folder.id] || [];
        setDeleteDialog({
            isOpen: true,
            folder,
            notesCount: notes.length,
        });
    };

    const handleConfirmDelete = async () => {
        if (!deleteDialog.folder) return;
        
        setIsDeleting(true);
        try {
            await foldersService.delete(deleteDialog.folder.id);
            setFolders(folders.filter(f => f.id !== deleteDialog.folder!.id));
            // Clean up folderNotes state
            setFolderNotes(prev => {
                const newState = { ...prev };
                delete newState[deleteDialog.folder!.id];
                return newState;
            });
            setDeleteDialog({ isOpen: false, folder: null, notesCount: 0 });
        } catch (error) {
            console.error('Failed to delete folder:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialog({ isOpen: false, folder: null, notesCount: 0 });
    };

    const handleRenameFolder = async (id: number) => {
        if (!editingName.trim()) {
            setEditingId(null);
            return;
        }
        try {
            const updated = await foldersService.rename(id, editingName.trim());
            setFolders(folders.map(f => f.id === id ? updated : f));
            setEditingId(null);
            setEditingName('');
        } catch (error) {
            console.error('Failed to rename folder:', error);
        }
    };

    return (
        <div className="px-4 py-2">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full px-2 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
            >
                <span className="flex items-center gap-2">
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    Folders
                </span>
                <Plus
                    className="w-4 h-4 hover:text-indigo-400 cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsAdding(true);
                        setIsExpanded(true);
                    }}
                />
            </button>

            {isExpanded && (
                <div className="space-y-1 mt-1">
                    {isAdding && (
                        <div className="flex items-center gap-2 px-2">
                            <input
                                type="text"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddFolder();
                                    if (e.key === 'Escape') {
                                        setIsAdding(false);
                                        setNewFolderName('');
                                    }
                                }}
                                placeholder="Folder name"
                                className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                                autoFocus
                                disabled={isLoading}
                            />
                        </div>
                    )}

                    {folders.map((folder) => {
                        const isOpen = expandedFolders.has(folder.id);
                        const notes = folderNotes[folder.id] || [];
                        
                        return (
                            <div key={folder.id}>
                                <div
                                    className="group flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                                    onClick={() => toggleFolderExpanded(folder.id)}
                                >
                                    {isOpen ? (
                                        <ChevronDown className="w-3 h-3 text-slate-500" />
                                    ) : (
                                        <ChevronRight className="w-3 h-3 text-slate-500" />
                                    )}
                                    {isOpen ? (
                                        <FolderOpen className="w-4 h-4 text-indigo-400" />
                                    ) : (
                                        <FolderIcon className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                                    )}
                                    {editingId === folder.id ? (
                                        <input
                                            type="text"
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            onKeyDown={(e) => {
                                                e.stopPropagation();
                                                if (e.key === 'Enter') handleRenameFolder(folder.id);
                                                if (e.key === 'Escape') {
                                                    setEditingId(null);
                                                    setEditingName('');
                                                }
                                            }}
                                            onBlur={() => handleRenameFolder(folder.id)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                                            autoFocus
                                        />
                                    ) : (
                                        <span className="flex-1 truncate">{folder.name}</span>
                                    )}
                                    <span className="text-xs text-slate-600 mr-1">{notes.length}</span>
                                    <Pencil
                                        className="w-3 h-3 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-indigo-400 transition-opacity cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingId(folder.id);
                                            setEditingName(folder.name);
                                        }}
                                    />
                                    <Trash2
                                        className="w-3 h-3 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity cursor-pointer"
                                        onClick={(e) => handleDeleteClick(e, folder)}
                                    />
                                </div>
                                
                                {/* Notes inside folder */}
                                {isOpen && (
                                    <div className="ml-6 pl-2 border-l border-slate-700/50 space-y-1 mt-1">
                                        {notes.length === 0 ? (
                                            <p className="px-2 py-1 text-xs text-slate-600">No notes in this folder</p>
                                        ) : (
                                            notes.map((note) => (
                                                <div
                                                    key={note.id}
                                                    className="group flex items-start gap-2 px-2 py-1.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onNoteSelect?.(note);
                                                    }}
                                                >
                                                    <FileText className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 mt-0.5 flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-medium truncate text-slate-300 group-hover:text-white">
                                                            {note.title || 'Untitled'}
                                                        </p>
                                                        <p className="text-[10px] text-slate-600">
                                                            {formatDate(note.createdAt)}
                                                        </p>
                                                    </div>
                                                    <Trash2
                                                        className="w-3 h-3 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity cursor-pointer flex-shrink-0"
                                                        onClick={(e) => handleDeleteNote(e, note.id, folder.id)}
                                                    />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {folders.length === 0 && !isAdding && (
                        <p className="px-4 py-2 text-xs text-slate-600">No folders yet in this subject.</p>
                    )}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                isOpen={deleteDialog.isOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Delete Folder"
                itemType="folder"
                itemName={deleteDialog.folder?.name || ''}
                childNotesCount={deleteDialog.notesCount}
                isDeleting={isDeleting}
            />
        </div>
    );
}

export default SidebarFolders;