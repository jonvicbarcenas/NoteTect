import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, AlertCircle, AlertTriangle, Info, CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import { ActionItem, ActionItemsData } from '../../types';

interface ActionItemsViewProps {
  noteId?: number;
  content: string;
  isLoading?: boolean;
  isEditing?: boolean;
  onContentChange?: (newContent: string) => void;
}

const ActionItemsView: React.FC<ActionItemsViewProps> = ({ 
  noteId,
  content, 
  isLoading = false,
  isEditing = false,
  onContentChange 
}) => {
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'status'>('priority');

  useEffect(() => {
    if (isLoading || !content || content.trim().length === 0 || isEditing) {
      return;
    }

    setIsParsing(true);

    const parseTimeout = setTimeout(() => {
      try {
        console.log('Raw action items content:', content);
        
        let cleanContent = content.trim();
        cleanContent = cleanContent.replace(/^```json?\s*/i, '').replace(/```\s*$/g, '');
        
        const jsonStart = cleanContent.indexOf('{');
        const jsonEnd = cleanContent.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1) {
          cleanContent = cleanContent.substring(jsonStart, jsonEnd + 1);
        }
        
        console.log('Cleaned content:', cleanContent);
        
        const parsed: ActionItemsData = JSON.parse(cleanContent);
        
        console.log('Parsed action items:', parsed);
        
        if (parsed.actionItems && Array.isArray(parsed.actionItems) && parsed.actionItems.length > 0) {
          setActionItems(parsed.actionItems);
          setError(null);
        } else {
          setError('No action items found in the generated content.');
        }
      } catch (err) {
        console.error('Failed to parse action items content:', err);
        console.error('Content that failed to parse:', content);
        setError('Failed to parse action items content. Please regenerate.');
      } finally {
        setIsParsing(false);
      }
    }, 500);

    return () => clearTimeout(parseTimeout);
  }, [content, isLoading, isEditing]);

  // Debounced effect for updating parent
  useEffect(() => {
    // Only trigger updates if editing is enabled
    if (!isEditing) return;

    const handler = setTimeout(() => {
      const newContent = JSON.stringify({ actionItems: actionItems }, null, 2);
      onContentChange?.(newContent);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [actionItems, isEditing, onContentChange]);


  const toggleComplete = (id: string) => {
    setActionItems(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      
      // Immediately save changes when toggling completion
      if (onContentChange) {
        const newContent = JSON.stringify({ actionItems: updated }, null, 2);
        onContentChange(newContent);
      }
      
      return updated;
    });
  };

  // Editing functions
  const updateActionItem = (id: string, field: 'text' | 'priority', value: string) => {
    setActionItems(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addActionItem = () => {
    const newItem: ActionItem = {
      id: `item-${Date.now()}`,
      text: '',
      priority: 'medium',
      completed: false,
    };
    setActionItems(prev => [...prev, newItem]);
  };

  const removeActionItem = (id: string) => {
    if (actionItems.length <= 1) return;
    setActionItems(prev => prev.filter(item => item.id !== id));
  };

  const getPriorityIcon = (priority: ActionItem['priority']) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityBadge = (priority: ActionItem['priority']) => {
    const styles = {
        high: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
        medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
        low: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    };

    return (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${styles[priority]}`}>
            {priority.toUpperCase()}
        </span>
    );
};

const getFilteredAndSortedItems = () => {
    let filtered = actionItems;

    // Apply filter
    if (filter === 'active') {
        filtered = filtered.filter(item => !item.completed);
    } else if (filter === 'completed') {
        filtered = filtered.filter(item => item.completed);
    }

    // Apply sort
    if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        filtered = [...filtered].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === 'status') {
        filtered = [...filtered].sort((a, b) => Number(a.completed) - Number(b.completed));
    }

    return filtered;
};

const completedCount = actionItems.filter(item => item.completed).length;
const totalCount = actionItems.length;
const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

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

if (isParsing || actionItems.length === 0) {
    return (
        <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <div className="text-muted-foreground">
                    {isParsing ? 'Processing action items...' : 'Loading action items...'}
                </div>
            </div>
        </div>
    );
}

const filteredItems = getFilteredAndSortedItems();

// Editing mode view
if (isEditing) {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Edit Action Items</h2>
        <Button onClick={addActionItem} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Add Item
        </Button>
      </div>

      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 space-y-4 border-border"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {item.completed ? 'Completed' : 'Active'}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                onClick={() => removeActionItem(item.id)}
                disabled={actionItems.length <= 1}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Action Item Text
              </label>
              <Input
                value={item.text}
                onChange={(e) => updateActionItem(item.id, 'text', e.target.value)}
                placeholder="Enter the action item..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Priority
              </label>
              <div className="flex gap-2">
                {(['high', 'medium', 'low'] as const).map((priority) => (
                  <Button
                    key={priority}
                    variant={item.priority === priority ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateActionItem(item.id, 'priority', priority)}
                    className={item.priority === priority ? (
                      priority === 'high' ? 'bg-red-500 hover:bg-red-600' :
                      priority === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' :
                      'bg-blue-500 hover:bg-blue-600'
                    ) : ''}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Normal view mode
return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
        {/* Header with Progress */}
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Action Items</h2>
                <div className="text-sm text-muted-foreground">
                    {completedCount} of {totalCount} completed
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                    className="bg-gradient-to-r from-primary to-primary/80 h-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-wrap gap-3 items-center justify-between border-b border-border pb-4">
            <div className="flex gap-2">
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                >
                    All ({totalCount})
                </Button>
                <Button
                    variant={filter === 'active' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('active')}
                >
                    Active ({totalCount - completedCount})
                </Button>
                <Button
                    variant={filter === 'completed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('completed')}
                >
                    Completed ({completedCount})
                </Button>
            </div>

            <div className="flex gap-2 items-center">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Button
                    variant={sortBy === 'priority' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('priority')}
                >
                    Priority
                </Button>
                <Button
                    variant={sortBy === 'status' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('status')}
                >
                    Status
                </Button>
            </div>
        </div>

        {/* Action Items List */}
        <div className="space-y-3">
            {filteredItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    No {filter !== 'all' ? filter : ''} action items found.
                </div>
            ) : (
                filteredItems.map((item) => (
                    <div
                        key={item.id}
                        className={`group relative border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${item.completed
                            ? 'bg-muted/30 border-muted'
                            : 'bg-card border-border hover:border-primary/50'
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            {/* Checkbox */}
                            <button
                                onClick={() => toggleComplete(item.id)}
                                className="flex-shrink-0 mt-0.5 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                            >
                                {item.completed ? (
                                    <CheckCircle2 className="w-6 h-6 text-primary" />
                                ) : (
                                    <Circle className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                )}
                            </button>

                            {/* Content */}
                            <div className="flex-1 space-y-2">
                                <p
                                    className={`text-base leading-relaxed ${item.completed
                                        ? 'line-through text-muted-foreground'
                                        : 'text-foreground'
                                        }`}
                                >
                                    {item.text}
                                </p>

                                {/* Priority Badge */}
                                <div className="flex items-center gap-2">
                                    {getPriorityIcon(item.priority)}
                                    {getPriorityBadge(item.priority)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Summary Stats */}
        {totalCount > 0 && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="text-center p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {actionItems.filter(i => i.priority === 'high').length}
                    </div>
                    <div className="text-xs text-muted-foreground">High Priority</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {actionItems.filter(i => i.priority === 'medium').length}
                    </div>
                    <div className="text-xs text-muted-foreground">Medium Priority</div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {actionItems.filter(i => i.priority === 'low').length}
                    </div>
                    <div className="text-xs text-muted-foreground">Low Priority</div>
                </div>
            </div>
        )}
    </div>
);
};

export default ActionItemsView;