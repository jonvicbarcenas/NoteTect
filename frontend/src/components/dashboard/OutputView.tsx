import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Settings2, Copy, Download, X, Pencil, Check } from 'lucide-react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { NoteType } from '../../types';
import FlashcardView from './FlashcardView';
import ActionItemsView from './ActionItemsView';

interface OutputViewProps {
  id?: number;
  title: string;
  content: string;
  isLoading: boolean;
  isSaving?: boolean;
  saveMessage?: string | null;
  onSaveClick?: () => void;
  onConfigureClick?: () => void;
  onClose: () => void;
  isGenerated: boolean;
  isSaved?: boolean; // Track if the generated note has been saved
  onTitleChange?: (id: number, newTitle: string) => void;
  onContentChange?: (id: number, newContent: string) => void;
  noteType?: NoteType; // Add noteType prop to determine rendering mode
  onActionItemsContentChange?: (noteId: number | undefined, newContent: string) => void;
}

const OutputView: React.FC<OutputViewProps> = ({
  id,
  title,
  content,
  isLoading,
  isSaving,
  saveMessage,
  onSaveClick,
  onConfigureClick,
  onClose,
  isGenerated,
  isSaved = false,
  onTitleChange,
  onContentChange,
  noteType,
  onActionItemsContentChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentContent, setCurrentContent] = useState(content);

  useEffect(() => {
    setCurrentTitle(title);
  }, [title]);

  useEffect(() => {
    setCurrentContent(content);
  }, [content]);

  const handleSaveEdit = () => {
    setIsEditing(false);
    if (id) {
      if (onTitleChange && currentTitle.trim() && currentTitle.trim() !== title) {
        onTitleChange(id, currentTitle.trim());
      }
      if (onContentChange && currentContent !== content) {
        onContentChange(id, currentContent);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentTitle(title);
    setCurrentContent(content);
  };

  // Auto-detect if content is flashcard JSON
  const isFlashcardContent = (content: string): boolean => {
    if (!content) return false;
    try {
      const trimmed = content.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('```')) {
        const cleaned = trimmed.replace(/^```json?\s*/i, '').replace(/```\s*$/g, '');
        const jsonStart = cleaned.indexOf('{');
        const jsonEnd = cleaned.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
          const json = JSON.parse(cleaned.substring(jsonStart, jsonEnd + 1));
          return json.flashcards && Array.isArray(json.flashcards);
        }
      }
    } catch {
      return false;
    }
    return false;
  };

  // Auto-detect if content is action items JSON
  const isActionItemsContent = (content: string): boolean => {
    if (!content) return false;
    try {
      const trimmed = content.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('```')) {
        const cleaned = trimmed.replace(/^```json?\s*/i, '').replace(/```\s*$/g, '');
        const jsonStart = cleaned.indexOf('{');
        const jsonEnd = cleaned.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
          const json = JSON.parse(cleaned.substring(jsonStart, jsonEnd + 1));
          return json.actionItems && Array.isArray(json.actionItems);
        }
      }
    } catch {
      return false;
    }
    return false;
  };

  const shouldRenderAsFlashcard = noteType === NoteType.FLASHCARD || isFlashcardContent(content);
  const shouldRenderAsActionItems = noteType === NoteType.ACTION_ITEMS || isActionItemsContent(content);

  return (
    <Card className="h-full min-h-[80vh] border-border/50 shadow-xl shadow-black/5 flex flex-col animate-in fade-in zoom-in-95 duration-500">
      <CardHeader className="bg-card border-b border-border/50 pb-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className={`w-2 h-6 ${isGenerated ? 'bg-green-500' : 'bg-blue-500'} rounded-full`} />
            {isEditing ? (
              <Input
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                className="text-2xl font-bold h-9"
                autoFocus
              />
            ) : (
              <span onClick={() => !isGenerated && setIsEditing(true)} className="cursor-pointer">{title || 'Untitled Note'}</span>
            )}
            {!isGenerated && !isEditing && (
              <Pencil
                className="w-4 h-4 ml-2 cursor-pointer text-muted-foreground hover:text-foreground"
                onClick={() => setIsEditing(true)}
              />
            )}
            {isEditing && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                  onClick={handleSaveEdit}
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
                  onClick={handleCancelEdit}
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            )}
          </CardTitle>
          <div className="flex gap-2 items-center">
            {saveMessage && (
              <span className={`text-xs ${saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                {saveMessage}
              </span>
            )}
            {/* Show Save button for unsaved generated notes */}
            {isGenerated && !isSaved && onSaveClick && (
              <Button
                variant="default"
                size="sm"
                className="text-xs h-8 bg-green-600 hover:bg-green-700"
                onClick={onSaveClick}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Save className="w-3 h-3 mr-1" />
                )}
                Save
              </Button>
            )}
            {/* Show Configure button for saved notes (to move/transfer) */}
            {((isGenerated && isSaved) || !isGenerated) && onConfigureClick && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={onConfigureClick}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Settings2 className="w-3 h-3 mr-1" />
                )}
                Configure
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8"
              onClick={() => navigator.clipboard.writeText(content)}
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8"
              onClick={() => {
                const blob = new Blob([content], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${title.replace(/\s+/g, '_') || 'note'}.md`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="w-3 h-3 mr-1" />
              Download
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-6 md:p-12 bg-white/50 dark:bg-black/20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-lg font-medium text-muted-foreground animate-pulse">
              {isGenerated ? 'Generating your note...' : 'Loading note...'}
            </p>
          </div>
        ) : shouldRenderAsFlashcard ? (
          <FlashcardView 
            content={content} 
            isLoading={isLoading} 
            isEditing={isEditing}
            onContentChange={(newContent) => setCurrentContent(newContent)}
          />
        ) : shouldRenderAsActionItems ? (
          <ActionItemsView 
            noteId={id}
            content={content} 
            isLoading={isLoading}
            isEditing={isEditing}
            onContentChange={(newContent) => {
              setCurrentContent(newContent);
              onActionItemsContentChange?.(id, newContent);
            }}
          />
        ) : isEditing ? (
          <Textarea
            value={currentContent}
            onChange={(e) => setCurrentContent(e.target.value)}
            className="min-h-[500px] w-full max-w-4xl mx-auto font-mono text-sm"
            placeholder="Enter note content..."
          />
        ) : (
          <div className="prose prose-slate dark:prose-invert max-w-4xl mx-auto prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-p:text-lg prose-p:leading-relaxed prose-li:text-lg">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OutputView;
