import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Copy, Download, X, Pencil } from 'lucide-react';
import { Input } from '../ui/input';

interface OutputViewProps {
  id?: number;
  title: string;
  content: string;
  isLoading: boolean;
  isSaving?: boolean;
  saveMessage?: string | null;
  handleSaveNote?: () => void;
  onClose: () => void;
  isGenerated: boolean;
  onTitleChange?: (id: number, newTitle: string) => void;
}

const OutputView: React.FC<OutputViewProps> = ({
  id,
  title,
  content,
  isLoading,
  isSaving,
  saveMessage,
  handleSaveNote,
  onClose,
  isGenerated,
  onTitleChange,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);

  useEffect(() => {
    setCurrentTitle(title);
  }, [title]);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (onTitleChange && id && currentTitle.trim() && currentTitle.trim() !== title) {
      onTitleChange(id, currentTitle.trim());
    }
  };

  return (
    <Card className="h-full min-h-[80vh] border-border/50 shadow-xl shadow-black/5 flex flex-col animate-in fade-in zoom-in-95 duration-500">
      <CardHeader className="bg-card border-b border-border/50 pb-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className={`w-2 h-6 ${isGenerated ? 'bg-green-500' : 'bg-blue-500'} rounded-full`} />
            {isEditingTitle ? (
              <Input
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                onBlur={handleTitleBlur}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleBlur()}
                className="text-2xl font-bold h-9"
                autoFocus
              />
            ) : (
              <span onClick={() => !isGenerated && setIsEditingTitle(true)} className="cursor-pointer">{title || 'Untitled Note'}</span>
            )}
            {!isGenerated && !isEditingTitle && (
              <Pencil
                className="w-4 h-4 ml-2 cursor-pointer text-muted-foreground hover:text-foreground"
                onClick={() => setIsEditingTitle(true)}
              />
            )}
          </CardTitle>
          <div className="flex gap-2 items-center">
            {isGenerated && handleSaveNote && (
              <>
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
              </>
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
