import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { 
  X, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Circle,
  Loader2,
  Save
} from 'lucide-react';
import { User } from '@/types';
import { authService } from '@/services/auth';

interface UserProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUserUpdate: (user: User) => void;
}

const UserProfilePopup: React.FC<UserProfilePopupProps> = ({
  isOpen,
  onClose,
  user,
  onUserUpdate,
}) => {
  // Name state
  const [name, setName] = useState(user.name);
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [nameMessage, setNameMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password validation
  const hasLength = newPassword.length >= 8;
  const hasCaseMix = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setNameMessage(null);
      setPasswordMessage(null);
    }
  }, [isOpen, user.name]);

  const ReqItem = ({ met, children }: { met: boolean; children: React.ReactNode }) => (
    <div className={`flex items-center gap-2 ${met ? 'text-green-600' : 'text-gray-500'}`}>
      {met ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
      <span>{children}</span>
    </div>
  );

  const handleUpdateName = async () => {
    if (!name.trim()) {
      setNameMessage({ type: 'error', text: 'Name cannot be empty' });
      return;
    }

    if (name.trim() === user.name) {
      setNameMessage({ type: 'error', text: 'Name is the same as current' });
      return;
    }

    setIsUpdatingName(true);
    setNameMessage(null);

    try {
      const updatedUser = await authService.updateName(name.trim());
      onUserUpdate(updatedUser);
      setNameMessage({ type: 'success', text: 'Name updated successfully!' });
    } catch (error: any) {
      setNameMessage({ type: 'error', text: error.message || 'Failed to update name' });
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleUpdatePassword = async () => {
    setPasswordMessage(null);

    if (!currentPassword) {
      setPasswordMessage({ type: 'error', text: 'Please enter your current password' });
      return;
    }

    if (!hasLength || !hasCaseMix || !hasNumber) {
      setPasswordMessage({ type: 'error', text: 'Please meet all password requirements' });
      return;
    }

    if (!passwordsMatch) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const updatedUser = await authService.updatePassword(currentPassword, newPassword);
      onUserUpdate(updatedUser);
      setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setPasswordMessage({ type: 'error', text: error.message || 'Failed to update password' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (!isOpen) return null;

  const dialogContent = (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200 p-4">
      <Card className="w-full max-w-lg shadow-2xl border-border/50 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative pb-4 border-b border-border/50">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 h-8 w-8 rounded-full"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Profile Settings</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-8">
          {/* Update Name Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-indigo-600 rounded-full" />
              <h3 className="font-semibold text-foreground">Update Name</h3>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Display Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="h-10"
                />
              </div>

              {nameMessage && (
                <p className={`text-sm ${nameMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {nameMessage.text}
                </p>
              )}

              <Button
                onClick={handleUpdateName}
                disabled={isUpdatingName || !name.trim() || name.trim() === user.name}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {isUpdatingName ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Name
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="border-t border-border/50" />

          {/* Update Password Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-amber-500 rounded-full" />
              <h3 className="font-semibold text-foreground">Change Password</h3>
            </div>
            
            <div className="space-y-3">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-sm font-medium">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {/* Password Requirements */}
                <div className="mt-2 space-y-1 text-[11px] leading-4">
                  <ReqItem met={hasLength}>At least 8 characters</ReqItem>
                  <ReqItem met={hasCaseMix}>Upper & lowercase letters</ReqItem>
                  <ReqItem met={hasNumber}>At least one number</ReqItem>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
                {passwordsMatch && (
                  <p className="text-xs text-green-600">Passwords match</p>
                )}
              </div>

              {passwordMessage && (
                <p className={`text-sm ${passwordMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {passwordMessage.text}
                </p>
              )}

              <Button
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword || !currentPassword || !hasLength || !hasCaseMix || !hasNumber || !passwordsMatch}
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                {isUpdatingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Change Password
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t border-border/50 pt-4">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Close
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  return createPortal(dialogContent, document.body);
};

export default UserProfilePopup;

