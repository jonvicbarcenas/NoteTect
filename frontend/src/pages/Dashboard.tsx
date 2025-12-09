import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Loader2, FileText, Sparkles, Menu } from 'lucide-react';
import { generateContent } from '../services/geminiService';
import { notesService } from '../services/notes';
import { Note, NoteType } from '../types';
import { useAuth } from '../context/AuthContext';
import { Sidebar, GenerationTools, SaveNotePopup } from '../components/dashboard';
import OutputView from '../components/dashboard/OutputView';


function Dashboard() {
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  const [activeType, setActiveType] = useState<NoteType>(NoteType.SUMMARY);
  const [generatedNoteType, setGeneratedNoteType] = useState<NoteType>(NoteType.SUMMARY); // Track type of generated note
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | undefined>(undefined);
  const [fileMimeType, setFileMimeType] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [notesRefreshTrigger, setNotesRefreshTrigger] = useState(0);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [savedNoteId, setSavedNoteId] = useState<number | null>(null); // Track if generated note was saved
  const [popupMode, setPopupMode] = useState<'save' | 'configure'>('save');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Open popup for first-time save
  const handleSaveClick = () => {
    setPopupMode('save');
    setShowSavePopup(true);
  };

  // Open popup for configuring/moving existing note
  const handleConfigureClick = () => {
    setPopupMode('configure');
    setShowSavePopup(true);
  };

  // Handle saving a new note
  const handleSaveNote = async (subjectId?: number, folderId?: number) => {
    if (!generatedOutput) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const savedNote = await notesService.create({
        content: generatedOutput,
        filename: fileName || 'Untitled Note',
        title: topic || 'Untitled',
        createdAt: new Date().toISOString(),
        noteType: generatedNoteType,
      }, folderId);
      setSavedNoteId(savedNote.id); // Mark as saved
      setSaveMessage('Note saved successfully!');
      setNotesRefreshTrigger(prev => prev + 1);
      setShowSavePopup(false);
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save note:', error);
      setSaveMessage('Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle moving an existing note to a different folder
  const handleMoveNote = async (subjectId?: number, folderId?: number) => {
    const noteId = savedNoteId || selectedNote?.id;
    if (!noteId) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      await notesService.moveToFolder(noteId, folderId);
      setSaveMessage('Note moved successfully!');
      setNotesRefreshTrigger(prev => prev + 1);
      setShowSavePopup(false);
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Failed to move note:', error);
      setSaveMessage('Failed to move note');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle action items content changes (for completion status)
  const handleActionItemsContentChange = async (noteId: number | undefined, newContent: string) => {
    // Always keep local UI in sync
    if (selectedNote) {
      setSelectedNote({ ...selectedNote, content: newContent });
    } else {
      // Generated-but-not-selected path
      setGeneratedOutput(newContent);
    }

    // If the note is not yet saved in DB, do NOT call the API
    if (!noteId) return;

    try {
      await notesService.updateContent(noteId, newContent);
      // No need to refresh notes list - content changes don't affect the sidebar
    } catch (err) {
      console.error('Failed to update note content:', err);
      // Optionally show toast/error
    }
  };
  
  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
    setGeneratedOutput(null);
    setTopic('');
    setContext('');
    setSelectedFile(undefined);
    setFileName(undefined);
  };
  
  const handleCloseOutput = () => {
    setSelectedNote(null);
    setGeneratedOutput(null);
    setSavedNoteId(null); // Reset saved state
    setIsLoading(false);
    // Keep topic/context so user doesn't lose their work
  };

  const handleTitleChange = async (id: number, newTitle: string) => {
    try {
      const updatedNote = await notesService.update(id, newTitle);
      if (selectedNote && selectedNote.id === id) {
        setSelectedNote(updatedNote);
      }
      setNotesRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Failed to update note title:", error);
      // Optionally, show an error message to the user
    }
  };

  const handleContentChange = async (id: number, newContent: string) => {
    // Update local state immediately
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote({ ...selectedNote, content: newContent });
    } else {
      setGeneratedOutput(newContent);
    }

    // Persist to database
    try {
      await notesService.updateContent(id, newContent);
    } catch (error) {
      console.error("Failed to update note content:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      setSelectedFile(base64Data);
      setFileMimeType(file.type);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const onGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic && !context && !selectedFile) return;

    setIsLoading(true);
    setGeneratedOutput('');
    setSelectedNote(null);
    setGeneratedNoteType(activeType); // Store the type of note being generated

    try {
      const prompt = `Topic: ${topic}\nContext: ${context}`;
      await generateContent({
        text: prompt,
        type: activeType,
        imageBase64: selectedFile,
        imageMimeType: fileMimeType
      }, (chunk) => {
        setGeneratedOutput(prev => (prev || '') + chunk);
      });
    } catch (error) {
      console.error(error);
      setGeneratedOutput('Error generating content. Please check your API key in .env file.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const showInputForm = !isLoading && !selectedNote && !generatedOutput;
  const showOutput = isLoading || selectedNote || generatedOutput;

  return (
    <div className="min-h-screen bg-background flex font-sans text-foreground">
      {/* Sidebar */}
      <Sidebar user={user} onLogout={handleLogout} refreshTrigger={notesRefreshTrigger} onNoteSelect={handleNoteSelect} onUserUpdate={updateUser} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-secondary/30">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-card border-b border-border flex items-center px-4 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold">NoteTect</span>
          </div>
          <Button variant="ghost" size="icon">
            <Menu className="w-5 h-5" />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {showInputForm ? 'Create New Note' : (selectedNote ? 'Viewing Note' : 'Generated Note')}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {showInputForm 
                    ? 'Select a tool and let AI generate comprehensive notes for you.'
                    : (selectedNote ? `Viewing "${selectedNote.title}" created on ${new Date(selectedNote.createdAt).toLocaleDateString()}` : 'Review your newly generated content.')
                  }
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
              {/* Input Section */}
              {showInputForm && (
                <div className="lg:col-span-5 space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                  <Card className="border-border/50 shadow-xl shadow-black/5 overflow-hidden">
                    <CardHeader className="bg-card border-b border-border/50 pb-4">
                      <CardTitle className="flex items-center gap-2">
                        <span className="w-2 h-6 bg-primary rounded-full" />
                        Input Details
                      </CardTitle>
                      <CardDescription>
                        Provide the source material for your notes.
                      </CardDescription>
                    </CardHeader>
                    <form onSubmit={onGenerate}>
                      <CardContent className="pt-6 border-b border-border/50">
                        <GenerationTools activeType={activeType} onTypeChange={setActiveType} />
                      </CardContent>
                      <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                          <Label htmlFor="topic" className="text-sm font-medium">Topic / Title</Label>
                          <Input
                            id="topic"
                            placeholder="e.g., Photosynthesis, World War II"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="h-11 bg-secondary/30 border-border focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="context" className="text-sm font-medium">Context & Instructions</Label>
                          <Textarea
                            id="context"
                            placeholder="Paste text, or add instructions..."
                            className="min-h-[150px] bg-secondary/30 border-border focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                          />
                        </div>

                        <div
                          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 group ${isDragging
                            ? 'border-primary bg-primary/5 scale-[0.99]'
                            : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                            }`}
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <div className="flex flex-col items-center justify-center gap-3">
                            {fileName ? (
                              <div className="w-full">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                                  <FileText className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-medium text-foreground truncate max-w-[200px] mx-auto">{fileName}</p>
                                <p className="text-xs text-primary mt-1 font-medium group-hover:underline">Click to replace</p>
                              </div>
                            ) : (
                              <>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground group-hover:text-primary group-hover:bg-primary/10'}`}>
                                  <Upload className="w-6 h-6" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">
                                    {isDragging ? 'Drop file now' : 'Click to upload or drag & drop'}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Images, PDF, DOCX, TXT (max 10MB)
                                  </p>
                                </div>
                              </>
                            )}
                            <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              accept="image/*,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              onChange={handleFileChange}
                            />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end border-t border-border/50 px-6 py-4 bg-secondary/20">
                        <Button
                          type="submit"
                          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                          )}
                          Generate Note
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </div>
              )}

              {/* Output Section */}
              <div className={`${showInputForm ? 'lg:col-span-7' : 'lg:col-span-12'} h-full transition-all duration-500 ease-in-out`}>
                {showOutput ? (
                   <OutputView
                    id={savedNoteId || selectedNote?.id}
                    title={selectedNote?.title || topic || 'Result'}
                    content={selectedNote?.content || generatedOutput || ''}
                    isLoading={isLoading}
                    isSaving={isSaving}
                    saveMessage={saveMessage}
                    onSaveClick={handleSaveClick}
                    onConfigureClick={handleConfigureClick}
                    onClose={handleCloseOutput}
                    isGenerated={!selectedNote && !!generatedOutput}
                    isSaved={!!savedNoteId}
                    onTitleChange={handleTitleChange}
                    onContentChange={handleContentChange}
                    noteType={generatedOutput ? generatedNoteType : undefined}
                    onActionItemsContentChange={handleActionItemsContentChange}
                  />
                ) : (
                  <div className="h-full min-h-[400px] border-2 border-dashed border-border/60 rounded-xl flex flex-col items-center justify-center text-center p-8 text-muted-foreground bg-secondary/10">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Ready to Generate</h3>
                    <p className="max-w-md text-sm">
                      Select a tool, provide your content, and watch the AI craft your notes instantly.
                    </p>
                  </div>
                )}
              </div>

              {/* Floating Action Button */}
              {showOutput && !isLoading && (
                <div className="fixed bottom-8 right-8 animate-in fade-in slide-in-from-bottom-4 duration-500 z-50">
                  <Button
                    size="lg"
                    className="rounded-full shadow-2xl shadow-primary/30 h-14 px-6 text-base font-semibold"
                    onClick={handleCloseOutput}
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Create New Note
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Save Note Popup */}
      <SaveNotePopup
        isOpen={showSavePopup}
        onClose={() => setShowSavePopup(false)}
        onSave={popupMode === 'save' ? handleSaveNote : handleMoveNote}
        isSaving={isSaving}
        noteTitle={selectedNote?.title || topic || 'Untitled'}
        mode={popupMode}
        currentFolderId={selectedNote?.folder?.id}
      />
    </div>
  );
}

export default Dashboard;