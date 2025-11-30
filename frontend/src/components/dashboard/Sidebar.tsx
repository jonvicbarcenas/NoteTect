import SidebarHeader from './SidebarHeader';
import SidebarFooter from './SidebarFooter';
import SidebarNotes from './SidebarNotes';
import { User, Note } from '../../types';

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
  refreshTrigger?: number;
  onNoteSelect: (note: Note) => void;
}

function Sidebar({ user, onLogout, refreshTrigger, onNoteSelect }: SidebarProps) {
  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col shadow-xl z-10 text-slate-300">
      <SidebarHeader />

      <div className="flex-1 overflow-y-auto">
        <SidebarNotes refreshTrigger={refreshTrigger} onNoteSelect={onNoteSelect} />
      </div>

      <SidebarFooter user={user} onLogout={onLogout} />
    </aside>
  );
}

export default Sidebar;
