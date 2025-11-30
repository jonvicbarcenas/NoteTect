import SidebarHeader from './SidebarHeader';
import SidebarFooter from './SidebarFooter';
import SidebarFolders from './SidebarFolders';
import SidebarSubjects from './SidebarSubjects';
import { User } from '../../types';

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
}

function Sidebar({ user, onLogout }: SidebarProps) {
  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col shadow-xl z-10 text-slate-300">
      <SidebarHeader />
      
      <div className="flex-1 overflow-y-auto">
        <SidebarFolders />
        <SidebarSubjects />
      </div>
      
      <SidebarFooter user={user} onLogout={onLogout} />
    </aside>
  );
}

export default Sidebar;
