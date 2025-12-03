import SidebarHeader from './SidebarHeader';
import SidebarFooter from './SidebarFooter';
import SidebarNotes from './SidebarNotes';
import SidebarSubjects from './SidebarSubjects';
import { User, Note } from '../../types';
import { Subject } from '../../types';

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
  refreshTrigger?: number;
  onNoteSelect: (note: Note) => void;
  onSubjectSelect: (subject: Subject) => void; // added for SidebarSubjects
}

function Sidebar({ user, onLogout, refreshTrigger, onNoteSelect, onSubjectSelect }: SidebarProps) {
  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col shadow-xl z-10 text-slate-300">
      <SidebarHeader />

      {/* Subjects section */}
      <SidebarSubjects refreshTrigger={refreshTrigger} onSubjectSelect={onSubjectSelect} />

      {/* Notes section */}
      <div className="flex-1 overflow-y-auto">
        <SidebarNotes refreshTrigger={refreshTrigger} onNoteSelect={onNoteSelect} />
      </div>

      <SidebarFooter user={user} onLogout={onLogout} />
    </aside>
  );
}

export default Sidebar;
