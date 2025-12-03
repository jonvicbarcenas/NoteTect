import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { subjectsService } from '../../services/subjects';
import { Subject } from '../../types';
// Import the component that displays the folders
import SidebarFolders from './SidebarFolders'; 

interface SidebarSubjectsProps {
    refreshTrigger?: number;
    // Handler now accepts Subject OR null (for deselection)
    onSubjectSelect: (subject: Subject | null) => void; 
    selectedSubject: Subject | null; // Prop for visual highlighting and nesting logic
}

function SidebarSubjects({ refreshTrigger = 0, onSubjectSelect, selectedSubject }: SidebarSubjectsProps) {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isSubjectsExpanded, setIsSubjectsExpanded] = useState(true); // Renamed for clarity
    const [isAdding, setIsAdding] = useState(false);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

    const handleDeleteSubject = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); 
        try {
            await subjectsService.delete(id);
            setSubjects(subjects.filter(s => s.id !== id));
            if (selectedSubject && selectedSubject.id === id) {
                onSubjectSelect(null); 
            }
        } catch (error) {
            console.error('Failed to delete subject:', error);
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
                                    // Apply conditional styling for selection
                                    className={`group flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                                        selectedSubject?.id === subject.id
                                            ? 'bg-indigo-900 text-white' // Active style
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white' // Default style
                                    }`}
                                    // Handle selection (toggle on/off)
                                    onClick={() => onSubjectSelect(selectedSubject?.id === subject.id ? null : subject)}
                                >
                                    <span className="flex items-center gap-2 flex-1 truncate">
                                        <BookOpen 
                                            className={`w-4 h-4 ${selectedSubject?.id === subject.id ? 'text-indigo-300' : 'text-slate-500 group-hover:text-indigo-400'}`} 
                                        />
                                        {subject.name}
                                    </span>
                                    <Trash2
                                        className="w-4 h-4 cursor-pointer text-slate-400 hover:text-red-400"
                                        onClick={(e) => {
                                            handleDeleteSubject(e, subject.id);
                                        }}
                                    />
                                </div>
                                
                                {/* 2. Conditional Rendering for Nested Folders */}
                                {selectedSubject?.id === subject.id && (
                                    <div className="pl-4 pt-1 pb-2">
                                        <SidebarFolders 
                                            // Pass the ID of the selected subject
                                            subjectId={subject.id}
                                        />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default SidebarSubjects;