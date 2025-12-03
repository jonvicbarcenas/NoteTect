import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings } from 'lucide-react';
import { User as UserType } from '../../types';
import UserProfilePopup from './UserProfilePopup';

interface SidebarFooterProps {
  user: UserType | null;
  onLogout: () => void;
  onUserUpdate?: (user: UserType) => void;
}

function SidebarFooter({ user, onLogout, onUserUpdate }: SidebarFooterProps) {
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const handleUserUpdate = (updatedUser: UserType) => {
    onUserUpdate?.(updatedUser);
  };

  return (
    <div className="p-4 border-t border-slate-800/50 space-y-3 flex-shrink-0 bg-slate-900">
      {user && (
        <div 
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 cursor-pointer hover:bg-slate-800/80 hover:border-indigo-500/50 transition-all group"
          onClick={() => setShowProfilePopup(true)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
            <Settings className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
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

      {/* User Profile Popup */}
      {user && (
        <UserProfilePopup
          isOpen={showProfilePopup}
          onClose={() => setShowProfilePopup(false)}
          user={user}
          onUserUpdate={handleUserUpdate}
        />
      )}
    </div>
  );
}

export default SidebarFooter;
