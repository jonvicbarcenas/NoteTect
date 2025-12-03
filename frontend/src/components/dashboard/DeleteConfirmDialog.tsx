import React from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemType: 'subject' | 'folder';
  itemName: string;
  childFoldersCount?: number;
  childNotesCount?: number;
  isDeleting?: boolean;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemType,
  itemName,
  childFoldersCount = 0,
  childNotesCount = 0,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  const hasChildren = childFoldersCount > 0 || childNotesCount > 0;

  const dialogContent = (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200">
      <Card className="w-full max-w-md mx-4 shadow-2xl border-red-500/20 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <CardHeader className="relative pb-4 border-b border-border/50">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 h-8 w-8 rounded-full"
            onClick={onClose}
            disabled={isDeleting}
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <CardTitle className="text-xl text-red-500">{title}</CardTitle>
              <CardDescription>This action cannot be undone</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          <p className="text-sm text-foreground">
            Are you sure you want to delete the {itemType}{' '}
            "<span className="font-semibold">{itemName}</span>"?
          </p>

          {hasChildren && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-red-500 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Warning: The following items will also be deleted
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                {itemType === 'subject' && childFoldersCount > 0 && (
                  <li className="list-disc">
                    <span className="font-medium text-foreground">{childFoldersCount}</span> folder{childFoldersCount !== 1 ? 's' : ''}
                  </li>
                )}
                {childNotesCount > 0 && (
                  <li className="list-disc">
                    <span className="font-medium text-foreground">{childNotesCount}</span> note{childNotesCount !== 1 ? 's' : ''}
                  </li>
                )}
              </ul>
            </div>
          )}

          {!hasChildren && (
            <p className="text-sm text-muted-foreground">
              This {itemType} is empty and can be safely deleted.
            </p>
          )}
        </CardContent>

        <CardFooter className="flex gap-3 pt-4 border-t border-border/50">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            className="flex-1 bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete {itemType === 'subject' ? 'Subject' : 'Folder'}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  // Use portal to render at document body level for proper stacking
  return createPortal(dialogContent, document.body);
};

export default DeleteConfirmDialog;

