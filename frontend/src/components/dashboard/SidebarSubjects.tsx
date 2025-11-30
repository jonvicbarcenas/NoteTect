import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { subjectsService } from '../../services/subjects';
import { Subject } from '../../types';

function SidebarSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const data = await subjectsService.getAll();
      setSubjects(data);
    } catch (error) {
      console.error('Failed to load subjects:', error);
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
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddSubject();
                  if (e.key === 'Escape') {
                    setIsAdding(false);
                    setNewSubjectName('');
                  }
                }}
                placeholder="Subject name"
                className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                autoFocus
                disabled={isLoading}
              />
            </div>
          )}

          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
              <span className="flex-1 truncate">{subject.name}</span>
              <Trash2
                className="w-3 h-3 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSubject(subject.id);
                }}
              />
            </div>
          ))}

          {subjects.length === 0 && !isAdding && (
            <p className="px-4 py-2 text-xs text-slate-600">No subjects yet</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SidebarSubjects;
