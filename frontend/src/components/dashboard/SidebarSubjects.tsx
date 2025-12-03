import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { subjectsService } from '../../services/subjects';
import { Subject } from '../../types';

interface SidebarSubjectsProps {
    refreshTrigger?: number;
    onSubjectSelect: (subject: Subject) => void;
}

function SidebarSubjects({ refreshTrigger = 0, onSubjectSelect }: SidebarSubjectsProps) {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isExpanded, setIsExpanded] = useState(true);
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

    const handleDeleteSubject = async (id: number) => {
        try {
            await subjectsService.delete(id);
            setSubjects(subjects.filter(s => s.id !== id));
        } catch (error) {
            console.error('Failed to delete subject:', error);
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
                    Subjects
                </span>
                <span className="flex items-center gap-2">
                    <Plus
                        className="w-4 h-4 hover:text-indigo-400 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsAdding(true);
                            setIsExpanded(true);
                        }}
                    />
                    <span className="text-xs font-normal normal-case text-slate-600">{subjects.length}</span>
                </span>
            </button>

            {isExpanded && (
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
                            <div
                                key={subject.id}
                                className="group flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                                onClick={() => onSubjectSelect(subject)}
                            >
                                <span className="flex items-center gap-2 flex-1 truncate">
                                    <BookOpen className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                                    {subject.name}
                                </span>
                                <Trash2
                                    className="w-4 h-4 cursor-pointer text-slate-400 hover:text-red-400"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteSubject(subject.id);
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

export default SidebarSubjects;
