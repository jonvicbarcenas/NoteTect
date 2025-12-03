import { useState, useEffect } from 'react';
import { FolderIcon, Plus, Trash2, ChevronDown, ChevronRight, Pencil } from 'lucide-react';
import { foldersService } from '../../services/folders';
import { Folder } from '../../types';

interface SidebarFoldersProps {
    // New prop to receive the active Subject ID
    subjectId: number; 
}

function SidebarFolders({ subjectId }: SidebarFoldersProps) {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [isExpanded, setIsExpanded] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');

    useEffect(() => {
        // Reload folders whenever the subjectId changes
        loadFolders(subjectId);
    }, [subjectId]);

    const loadFolders = async (id: number) => {
        try {
            // ASSUMPTION: foldersService.getAll now accepts an ID to filter by subject
            const data = await foldersService.getAll(id); 
            setFolders(data);
        } catch (error) {
            console.error('Failed to load folders:', error);
        }
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

    const handleDeleteFolder = async (id: number) => {
        try {
            await foldersService.delete(id);
            setFolders(folders.filter(f => f.id !== id));
        } catch (error) {
            console.error('Failed to delete folder:', error);
        }
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

                    {folders.map((folder) => (
                        <div
                            key={folder.id}
                            className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                        >
                            <FolderIcon className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                            {editingId === folder.id ? (
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleRenameFolder(folder.id);
                                        if (e.key === 'Escape') {
                                            setEditingId(null);
                                            setEditingName('');
                                        }
                                    }}
                                    onBlur={() => handleRenameFolder(folder.id)}
                                    className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                                    autoFocus
                                />
                            ) : (
                                <span className="flex-1 truncate">{folder.name}</span>
                            )}
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
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteFolder(folder.id);
                                }}
                            />
                        </div>
                    ))}

                    {folders.length === 0 && !isAdding && (
                        <p className="px-4 py-2 text-xs text-slate-600">No folders yet in this subject.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default SidebarFolders;