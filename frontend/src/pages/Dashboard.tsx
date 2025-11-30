import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Loader2, FileText, Sparkles, Menu, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateContent } from '../services/geminiService';
import { notesService } from '../services/notes';
import { NoteType } from '../types';
import { useAuth } from '../context/AuthContext';
import { Sidebar, GenerationTools } from '../components/dashboard';

function Dashboard() {
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  const [activeType, setActiveType] = useState<NoteType>(NoteType.SUMMARY);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [output, setOutput] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | undefined>(undefined);
  const [fileMimeType, setFileMimeType] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSaveNote = async () => {
    if (!output) return;
    
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      await notesService.create({
        content: output,
        filename: topic || 'Untitled Note',
        createdAt: new Date().toISOString(),
      });
      setSaveMessage('Note saved successfully!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save note:', error);
      setSaveMessage('Failed to save note');
    } finally {
      setIsSaving(false);
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
    if (!topic && !context) return;

    setIsLoading(true);
    setOutput('');

    try {
      const prompt = `Topic: ${topic}\nContext: ${context}`;
      await generateContent({
        text: prompt,
        type: activeType,
        imageBase64: selectedFile,
        imageMimeType: fileMimeType
      }, (chunk) => {
        setOutput(chunk);
      });
    } catch (error) {
      console.error(error);
      setOutput('Error generating content. Please check your API key in .env file.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex font-sans text-foreground">
      {/* Sidebar */}
      <Sidebar user={user} onLogout={handleLogout} />

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
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Create New Note</h1>
                <p className="text-muted-foreground mt-1">
                  Select a tool and let AI generate comprehensive notes for you.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
              {/* Input Section */}
              {(!output && !isLoading) && (
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
                            placeholder="e.g., Photosynthesis, World War II, Project Management"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="h-11 bg-secondary/30 border-border focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="context" className="text-sm font-medium">Context & Instructions</Label>
                          <Textarea
                            id="context"
                            placeholder="Paste text content here, or add specific instructions for the AI..."
                            className="min-h-[150px] bg-secondary/30 border-border focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                            value={context}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                              setContext(e.target.value)
                            }
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
                                    PDF, DOCX, TXT, Images (max 10MB)
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
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating Note...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-4 w-4" />
                              Generate Note
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </div>
              )}

              {/* Output Section */}
              <div className={`${(!output && !isLoading) ? 'lg:col-span-7' : 'lg:col-span-12'} h-full transition-all duration-500 ease-in-out`}>
                {(output || isLoading) ? (
                  <Card className="h-full min-h-[80vh] border-border/50 shadow-xl shadow-black/5 flex flex-col animate-in fade-in zoom-in-95 duration-500">
                    <CardHeader className="bg-card border-b border-border/50 pb-4 sticky top-0 z-10">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <span className="w-2 h-6 bg-green-500 rounded-full" />
                          Generated Result
                        </CardTitle>
                        <div className="flex gap-2 items-center">
                          {saveMessage && (
                            <span className={`text-xs ${saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                              {saveMessage}
                            </span>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8"
                            onClick={handleSaveNote}
                            disabled={isSaving}
                          >
                            {isSaving ? (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <Save className="w-3 h-3 mr-1" />
                            )}
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8"
                            onClick={() => {
                              navigator.clipboard.writeText(output);
                            }}
                          >
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8"
                            onClick={() => {
                              const blob = new Blob([output], { type: 'text/plain' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${topic.replace(/\s+/g, '_') || 'generated_note'}.txt`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);
                            }}
                          >
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-6 md:p-12 bg-white/50 dark:bg-black/20">
                      {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-4">
                          <Loader2 className="w-12 h-12 animate-spin text-primary" />
                          <p className="text-lg font-medium text-muted-foreground animate-pulse">Generating your note...</p>
                        </div>
                      ) : (
                        <div className="prose prose-slate dark:prose-invert max-w-4xl mx-auto prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-p:text-lg prose-p:leading-relaxed prose-li:text-lg">
                          <ReactMarkdown>{output}</ReactMarkdown>
                        </div>
                      )}
                    </CardContent>
                  </Card>
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
              {(output && !isLoading) && (
                <div className="fixed bottom-8 right-8 animate-in fade-in slide-in-from-bottom-4 duration-500 z-50">
                  <Button
                    size="lg"
                    className="rounded-full shadow-2xl shadow-primary/30 h-14 px-6 text-base font-semibold"
                    onClick={() => {
                      setOutput('');
                      setIsLoading(false);
                    }}
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate New Note
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;