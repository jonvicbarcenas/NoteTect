import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { User as UserType } from '../../types';

interface SidebarFooterProps {
  user: UserType | null;
  onLogout: () => void;
}

function SidebarFooter({ user, onLogout }: SidebarFooterProps) {
  return (
    <div className="p-4 border-t border-slate-800/50 space-y-3">
      {user && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}
      <Button
        variant="ghost"
        className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800"
        onClick={onLogout}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}

export default SidebarFooter;
