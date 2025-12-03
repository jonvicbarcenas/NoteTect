import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { 
  X, 
  FolderPlus, 
  BookOpen, 
  Loader2, 
  Check, 
  ChevronDown, 
  Plus, 
  Trash2,
  FileText
} from 'lucide-react';
import { Subject, Folder } from '@/types';
import { subjectsService } from '@/services/subjects';
import { foldersService } from '@/services/folders';

interface SaveNotePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subjectId?: number, folderId?: number) => void;
  isSaving: boolean;
  noteTitle: string;
  mode?: 'save' | 'configure';
  currentFolderId?: number;
}

type SaveOption = 'uncategorized' | 'subject';

const SaveNotePopup: React.FC<SaveNotePopupProps> = ({
  isOpen,
  onClose,
  onSave,
  isSaving,
  noteTitle,
  mode = 'save',
  currentFolderId,
}) => {
  const [saveOption, setSaveOption] = useState<SaveOption>('uncategorized');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  
  // New subject/folder creation
  const [showNewSubject, setShowNewSubject] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingSubject, setIsCreatingSubject] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  // Dropdown states
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);

  // Fetch subjects on mount and set default option based on mode
  useEffect(() => {
    if (isOpen) {
      fetchSubjects();
      // In configure mode, always default to subject selection
      if (mode === 'configure') {
        setSaveOption('subject');
      }
    }
  }, [isOpen, mode]);

  // Fetch folders when subject changes
  useEffect(() => {
    if (selectedSubject) {
      fetchFolders(selectedSubject.id);
    } else {
      setFolders([]);
      setSelectedFolder(null);
    }
  }, [selectedSubject]);

  const fetchSubjects = async () => {
    setIsLoadingSubjects(true);
    try {
      const data = await subjectsService.getAll();
      setSubjects(data);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
    } finally {
      setIsLoadingSubjects(false);
    }
  };

  const fetchFolders = async (subjectId: number) => {
    setIsLoadingFolders(true);
    try {
      const data = await foldersService.getBySubject(subjectId);
      setFolders(data);
    } catch (error) {
      console.error('Failed to fetch folders:', error);
    } finally {
      setIsLoadingFolders(false);
    }
  };

  const handleCreateSubject = async () => {
    if (!newSubjectName.trim()) return;
    
    setIsCreatingSubject(true);
    try {
      const newSubject = await subjectsService.create({ name: newSubjectName.trim() });
      setSubjects(prev => [...prev, newSubject]);
      setSelectedSubject(newSubject);
      setNewSubjectName('');
      setShowNewSubject(false);
    } catch (error) {
      console.error('Failed to create subject:', error);
    } finally {
      setIsCreatingSubject(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !selectedSubject) return;
    
    setIsCreatingFolder(true);
    try {
      const newFolder = await foldersService.create({ 
        name: newFolderName.trim(),
        subjectId: selectedSubject.id 
      });
      setFolders(prev => [...prev, newFolder]);
      setSelectedFolder(newFolder);
      setNewFolderName('');
      setShowNewFolder(false);
    } catch (error) {
      console.error('Failed to create folder:', error);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleDeleteSubject = async (e: React.MouseEvent, subjectId: number) => {
    e.stopPropagation();
    try {
      await subjectsService.delete(subjectId);
      setSubjects(prev => prev.filter(s => s.id !== subjectId));
      if (selectedSubject?.id === subjectId) {
        setSelectedSubject(null);
        setSelectedFolder(null);
      }
    } catch (error) {
      console.error('Failed to delete subject:', error);
    }
  };

  const handleDeleteFolder = async (e: React.MouseEvent, folderId: number) => {
    e.stopPropagation();
    try {
      await foldersService.delete(folderId);
      setFolders(prev => prev.filter(f => f.id !== folderId));
      if (selectedFolder?.id === folderId) {
        setSelectedFolder(null);
      }
    } catch (error) {
      console.error('Failed to delete folder:', error);
    }
  };

  const handleSave = () => {
    if (saveOption === 'uncategorized') {
      onSave(undefined, undefined);
    } else {
      onSave(selectedSubject?.id, selectedFolder?.id);
    }
  };

  const resetState = () => {
    setSaveOption('uncategorized');
    setSelectedSubject(null);
    setSelectedFolder(null);
    setShowNewSubject(false);
    setShowNewFolder(false);
    setNewSubjectName('');
    setNewFolderName('');
    setShowSubjectDropdown(false);
    setShowFolderDropdown(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <Card className="w-full max-w-lg mx-4 shadow-2xl border-border/50 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <CardHeader className="relative pb-4 border-b border-border/50">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 h-8 w-8 rounded-full"
            onClick={handleClose}
          >
            <X className="w-4 h-4" />
          </Button>
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className={`w-2 h-6 rounded-full ${mode === 'save' ? 'bg-green-500' : 'bg-primary'}`} />
            {mode === 'save' ? 'Save Note' : 'Move Note'}
          </CardTitle>
          <CardDescription>
            {mode === 'save' 
              ? <>Choose where to save "<span className="font-medium text-foreground">{noteTitle || 'Untitled'}</span>"</>
              : <>Move "<span className="font-medium text-foreground">{noteTitle || 'Untitled'}</span>" to a different folder</>
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Save Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground">
              {mode === 'save' ? 'Save Location' : 'Move To'}
            </Label>
            
            {/* Uncategorized Option - Only show in save mode */}
            {mode === 'save' && (
              <div
                onClick={() => {
                  setSaveOption('uncategorized');
                  setSelectedSubject(null);
                  setSelectedFolder(null);
                }}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  saveOption === 'uncategorized'
                    ? 'border-green-500 bg-green-500/5 shadow-sm'
                    : 'border-border/50 hover:border-border hover:bg-secondary/30'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  saveOption === 'uncategorized' ? 'bg-green-500 text-white' : 'bg-secondary text-muted-foreground'
                }`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">My Notes</p>
                  <p className="text-sm text-muted-foreground">Save without categorization</p>
                </div>
                {saveOption === 'uncategorized' && (
                  <Check className="w-5 h-5 text-green-500" />
                )}
              </div>
            )}

            {/* Subject Option */}
            <div
              onClick={() => setSaveOption('subject')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                saveOption === 'subject'
                  ? mode === 'save' ? 'border-green-500 bg-green-500/5 shadow-sm' : 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border/50 hover:border-border hover:bg-secondary/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  saveOption === 'subject' 
                    ? mode === 'save' ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground'
                }`}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{mode === 'save' ? 'Save to Subject' : 'Select Destination'}</p>
                  <p className="text-sm text-muted-foreground">
                    {mode === 'save' ? 'Organize with subjects and folders' : 'Choose a subject and folder'}
                  </p>
                </div>
                {saveOption === 'subject' && (
                  <Check className={`w-5 h-5 ${mode === 'save' ? 'text-green-500' : 'text-primary'}`} />
                )}
              </div>

              {/* Subject Selection - Only show when subject option is selected */}
              {saveOption === 'subject' && (
                <div className="mt-4 space-y-4 pt-4 border-t border-border/50">
                  {/* Subject Dropdown */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Subject</Label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowSubjectDropdown(!showSubjectDropdown);
                          setShowFolderDropdown(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-background hover:bg-secondary/50 transition-colors text-left"
                      >
                        <span className={selectedSubject ? 'text-foreground' : 'text-muted-foreground'}>
                          {selectedSubject?.name || 'Select a subject...'}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showSubjectDropdown ? 'rotate-180' : ''}`} />
                      </button>

                      {showSubjectDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 flex flex-col" style={{ maxHeight: '200px' }}>
                          {isLoadingSubjects ? (
                            <div className="flex items-center justify-center py-4">
                              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                            </div>
                          ) : (
                            <>
                              {/* Scrollable subject list */}
                              <div className="overflow-y-auto flex-1" style={{ maxHeight: '140px' }}>
                                {subjects.length === 0 ? (
                                  <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                                    No subjects yet. Create one below.
                                  </div>
                                ) : (
                                  subjects.map(subject => (
                                    <div
                                      key={subject.id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedSubject(subject);
                                        setSelectedFolder(null);
                                        setShowSubjectDropdown(false);
                                      }}
                                      className="flex items-center justify-between px-4 py-2.5 hover:bg-secondary/50 cursor-pointer group"
                                    >
                                      <span className="flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                                        {subject.name}
                                      </span>
                                      <button
                                        onClick={(e) => handleDeleteSubject(e, subject.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all"
                                      >
                                        <Trash2 className="w-3 h-3 text-destructive" />
                                      </button>
                                    </div>
                                  ))
                                )}
                              </div>
                              
                              {/* Create new subject - sticky at bottom */}
                              <div className="border-t border-border/50 bg-card sticky bottom-0">
                                {showNewSubject ? (
                                  <div className="p-2">
                                    <div className="flex gap-2">
                                      <Input
                                        placeholder="Subject name..."
                                        value={newSubjectName}
                                        onChange={(e) => setNewSubjectName(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => {
                                          e.stopPropagation();
                                          if (e.key === 'Enter') handleCreateSubject();
                                          if (e.key === 'Escape') setShowNewSubject(false);
                                        }}
                                        className="h-8 text-sm"
                                        autoFocus
                                      />
                                      <Button 
                                        size="sm" 
                                        className="h-8 px-3"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCreateSubject();
                                        }}
                                        disabled={isCreatingSubject || !newSubjectName.trim()}
                                      >
                                        {isCreatingSubject ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowNewSubject(true);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2.5 text-primary hover:bg-primary/5 cursor-pointer"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Create new subject
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Folder Dropdown - Only show if subject is selected */}
                  {selectedSubject && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">Folder <span className="text-destructive">*</span></Label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowFolderDropdown(!showFolderDropdown);
                            setShowSubjectDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border bg-background hover:bg-secondary/50 transition-colors text-left ${
                            !selectedFolder ? 'border-amber-500/50' : 'border-border'
                          }`}
                        >
                          <span className={selectedFolder ? 'text-foreground' : 'text-muted-foreground'}>
                            {selectedFolder?.name || 'Select a folder...'}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showFolderDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showFolderDropdown && (
                          <div className="absolute bottom-full left-0 right-0 mb-1 bg-card border border-border rounded-lg shadow-lg z-20 flex flex-col-reverse" style={{ maxHeight: '220px' }}>
                            {isLoadingFolders ? (
                              <div className="flex items-center justify-center py-4">
                                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                              </div>
                            ) : (
                              <>
                                {/* Create new folder - at bottom */}
                                <div className="border-t border-border/50 bg-card rounded-b-lg">
                                  {showNewFolder ? (
                                    <div className="p-2">
                                      <div className="flex gap-2">
                                        <Input
                                          placeholder="Folder name..."
                                          value={newFolderName}
                                          onChange={(e) => setNewFolderName(e.target.value)}
                                          onClick={(e) => e.stopPropagation()}
                                          onKeyDown={(e) => {
                                            e.stopPropagation();
                                            if (e.key === 'Enter') handleCreateFolder();
                                            if (e.key === 'Escape') setShowNewFolder(false);
                                          }}
                                          className="h-8 text-sm"
                                          autoFocus
                                        />
                                        <Button 
                                          size="sm" 
                                          className="h-8 px-3"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleCreateFolder();
                                          }}
                                          disabled={isCreatingFolder || !newFolderName.trim()}
                                        >
                                          {isCreatingFolder ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowNewFolder(true);
                                      }}
                                      className="flex items-center gap-2 px-4 py-2.5 text-primary hover:bg-primary/5 cursor-pointer rounded-b-lg"
                                    >
                                      <Plus className="w-4 h-4" />
                                      Create new folder
                                    </div>
                                  )}
                                </div>

                                {/* Scrollable folder list */}
                                <div className="overflow-y-auto" style={{ maxHeight: '160px' }}>
                                  {folders.length === 0 ? (
                                    <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                                      No folders yet. Create one below.
                                    </div>
                                  ) : (
                                    folders.map(folder => (
                                      <div
                                        key={folder.id}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedFolder(folder);
                                          setShowFolderDropdown(false);
                                        }}
                                        className={`flex items-center justify-between px-4 py-2.5 hover:bg-secondary/50 cursor-pointer group ${
                                          selectedFolder?.id === folder.id ? 'bg-primary/10' : ''
                                        }`}
                                      >
                                        <span className="flex items-center gap-2">
                                          <FolderPlus className="w-4 h-4 text-muted-foreground" />
                                          {folder.name}
                                        </span>
                                        <button
                                          onClick={(e) => handleDeleteFolder(e, folder.id)}
                                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all"
                                        >
                                          <Trash2 className="w-3 h-3 text-destructive" />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-3 pt-4 border-t border-border/50">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            className={`flex-1 shadow-lg ${mode === 'save' ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20' : 'bg-primary hover:bg-primary/90 shadow-primary/20'}`}
            onClick={handleSave}
            disabled={isSaving || (saveOption === 'subject' && (!selectedSubject || !selectedFolder))}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {mode === 'save' ? 'Saving...' : 'Moving...'}
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                {mode === 'save' ? 'Save Note' : 'Move Note'}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SaveNotePopup;

