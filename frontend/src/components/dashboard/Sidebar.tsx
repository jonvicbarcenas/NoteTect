import { useState } from 'react';
import SidebarHeader from './SidebarHeader';
import SidebarFooter from './SidebarFooter';
import SidebarNotes from './SidebarNotes';
import SidebarSubjects from './SidebarSubjects';
import SidebarFolders from './SidebarFolders'; // Still imported, but no longer directly rendered here
import { User, Note, Subject } from '../../types';

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
  refreshTrigger?: number;
  onNoteSelect: (note: Note) => void;
}

function Sidebar({ user, onLogout, refreshTrigger, onNoteSelect }: SidebarProps) {
  // State to track the currently selected Subject
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Handler to update the selected subject state
  const handleSubjectSelect = (subject: Subject | null) => {
    setSelectedSubject(subject);
  };

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col shadow-xl z-10 text-slate-300">
      <SidebarHeader />

      {/* 1. Subjects section: Now handles selection AND nested rendering of folders */}
      <SidebarSubjects 
        refreshTrigger={refreshTrigger} 
        onSubjectSelect={handleSubjectSelect} // Pass the selection handler
        selectedSubject={selectedSubject} // Pass the selected state for highlighting and nesting
      />
      
      {/* 2. REMOVED: The previous conditional rendering for SidebarFolders is removed. 
            The SidebarFolders component is now rendered inside the SidebarSubjects 
            component to achieve the nested dropdown effect.
            
      {selectedSubject && (
        <div className="flex-0 border-t border-slate-800">
          <SidebarFolders 
            subjectId={selectedSubject.id} 
          />
        </div>
      )}
      */}

      {/* Notes section */}
      <div className="flex-1 overflow-y-auto">
        <SidebarNotes refreshTrigger={refreshTrigger} onNoteSelect={onNoteSelect} />
      </div>

      <SidebarFooter user={user} onLogout={onLogout} />
    </aside>
  );
}

export default Sidebar;