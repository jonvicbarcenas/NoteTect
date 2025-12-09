import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, RotateCcw, Loader2, Plus, Trash2 } from 'lucide-react';
import { FlashcardData } from '../../types';

interface FlashcardViewProps {
  content: string;
  isLoading?: boolean;
  isEditing?: boolean;
  onContentChange?: (newContent: string) => void;
}

const FlashcardView: React.FC<FlashcardViewProps> = ({ 
  content, 
  isLoading = false,
  isEditing = false,
  onContentChange,
}) => {
  const [flashcards, setFlashcards] = useState<FlashcardData['flashcards']>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  useEffect(() => {
    // Only parse when not loading (generation complete) and content exists
    if (isLoading || !content || content.trim().length === 0) {
      return;
    }

    // Show parsing state briefly
    setIsParsing(true);

    // Small delay to ensure streaming is complete
    const parseTimeout = setTimeout(() => {
      try {
        // Log the raw content for debugging
        console.log('Raw flashcard content:', content);
        
        // Remove markdown code blocks if present
        let cleanContent = content.trim();
        
        // Remove ```json and ``` if present (more aggressive cleaning)
        cleanContent = cleanContent.replace(/^```json?\s*/i, '').replace(/```\s*$/g, '');
        
        // Remove any leading/trailing non-JSON characters
        const jsonStart = cleanContent.indexOf('{');
        const jsonEnd = cleanContent.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1) {
          cleanContent = cleanContent.substring(jsonStart, jsonEnd + 1);
        }
        
        console.log('Cleaned content:', cleanContent);
        
        const parsed: FlashcardData = JSON.parse(cleanContent);
        
        console.log('Parsed flashcards:', parsed);
        
        if (parsed.flashcards && Array.isArray(parsed.flashcards) && parsed.flashcards.length > 0) {
          setFlashcards(parsed.flashcards);
          setError(null);
        } else {
          setError('No flashcards found in the generated content.');
        }
      } catch (err) {
        console.error('Failed to parse flashcard content:', err);
        console.error('Content that failed to parse:', content);
        setError('Failed to parse flashcard content. Please regenerate.');
      } finally {
        setIsParsing(false);
      }
    }, 500); // Wait 500ms after content stops changing

    return () => clearTimeout(parseTimeout);
  }, [content, isLoading]);

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0));
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Editing functions
  const updateFlashcard = (index: number, field: 'front' | 'back', value: string) => {
    const updated = flashcards.map((card, i) =>
      i === index ? { ...card, [field]: value } : card
    );
    setFlashcards(updated);
    onContentChange?.(JSON.stringify({ flashcards: updated }, null, 2));
  };

  const addFlashcard = () => {
    const newCard = { front: '', back: '' };
    const updated = [...flashcards, newCard];
    setFlashcards(updated);
    setCurrentIndex(updated.length - 1);
    onContentChange?.(JSON.stringify({ flashcards: updated }, null, 2));
  };

  const removeFlashcard = (index: number) => {
    if (flashcards.length <= 1) return;
    const updated = flashcards.filter((_, i) => i !== index);
    setFlashcards(updated);
    if (currentIndex >= updated.length) {
      setCurrentIndex(updated.length - 1);
    }
    onContentChange?.(JSON.stringify({ flashcards: updated }, null, 2));
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] p-4">
        <div className="text-center space-y-4 max-w-2xl">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">{error}</h3>
          <p className="text-sm text-muted-foreground">
            The AI response wasn't in the expected format. Try generating again.
          </p>
          <details className="text-left bg-muted/50 p-4 rounded-lg text-xs">
            <summary className="cursor-pointer font-medium mb-2">Show raw content (for debugging)</summary>
            <pre className="whitespace-pre-wrap break-words overflow-auto max-h-60 text-muted-foreground">
              {content}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  if (isParsing || flashcards.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <div className="text-muted-foreground">
            {isParsing ? 'Parsing flashcards...' : 'Loading flashcards...'}
          </div>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  // Editing mode view
  if (isEditing) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Edit Flashcards</h2>
          <Button onClick={addFlashcard} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Card
          </Button>
        </div>

        <div className="space-y-4">
          {flashcards.map((card, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 space-y-4 ${
                index === currentIndex ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Card {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFlashcard(index);
                  }}
                  disabled={flashcards.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Question (Front)
                </label>
                <Textarea
                  value={card.front}
                  onChange={(e) => updateFlashcard(index, 'front', e.target.value)}
                  placeholder="Enter the question..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Answer (Back)
                </label>
                <Textarea
                  value={card.back}
                  onChange={(e) => updateFlashcard(index, 'back', e.target.value)}
                  placeholder="Enter the answer..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Normal view mode
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[500px] p-4 space-y-8">
      {/* Card Counter */}
      <div className="text-sm font-medium text-muted-foreground">
        Card {currentIndex + 1} of {flashcards.length}
      </div>

      {/* Flashcard */}
      <div className="w-full max-w-2xl h-[400px] perspective-1000">
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={handleFlip}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front of card */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-primary/90 to-primary p-8 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider mb-4">
              Question
            </div>
            <p className="text-2xl font-bold text-primary-foreground leading-relaxed">
              {currentCard.front}
            </p>
            <div className="absolute bottom-6 text-xs text-primary-foreground/60">
              Click to flip
            </div>
          </div>

          {/* Back of card */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-secondary to-secondary/80 p-8 flex flex-col items-center justify-center text-center"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-4">
              Answer
            </div>
            <p className="text-xl text-foreground leading-relaxed">
              {currentCard.back}
            </p>
            <div className="absolute bottom-6 text-xs text-muted-foreground">
              Click to flip back
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={handlePrevious}
          disabled={flashcards.length <= 1}
          className="px-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Previous
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          className="rounded-full"
          title="Reset to first card"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={handleNext}
          disabled={flashcards.length <= 1}
          className="px-6"
        >
          Next
          <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="flex gap-1.5">
        {flashcards.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 bg-primary'
                : 'w-1.5 bg-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FlashcardView;
