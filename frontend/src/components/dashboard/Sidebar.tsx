import { useState } from 'react';
import SidebarHeader from './SidebarHeader';
import SidebarFooter from './SidebarFooter';
import SidebarNotes from './SidebarNotes';
import SidebarSubjects from './SidebarSubjects';
import { User, Note, Subject } from '../../types';

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
  refreshTrigger?: number;
  onNoteSelect: (note: Note) => void;
  onUserUpdate?: (user: User) => void;
}

function Sidebar({ user, onLogout, refreshTrigger, onNoteSelect, onUserUpdate }: SidebarProps) {
  // State to track the currently selected Subject
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Handler to update the selected subject state
  const handleSubjectSelect = (subject: Subject | null) => {
    setSelectedSubject(subject);
  };

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col shadow-xl z-10 text-slate-300 h-screen">
      {/* Fixed Header */}
      <SidebarHeader />

      {/* Scrollable Middle Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Subjects section: handles selection AND nested rendering of folders with notes */}
        <SidebarSubjects 
          refreshTrigger={refreshTrigger} 
          onSubjectSelect={handleSubjectSelect}
          selectedSubject={selectedSubject}
          onNoteSelect={onNoteSelect}
        />

        {/* Uncategorized Notes section */}
        <SidebarNotes refreshTrigger={refreshTrigger} onNoteSelect={onNoteSelect} />
      </div>

      {/* Fixed Footer */}
      <SidebarFooter user={user} onLogout={onLogout} onUserUpdate={onUserUpdate} />
    </aside>
  );
}

export default Sidebar;