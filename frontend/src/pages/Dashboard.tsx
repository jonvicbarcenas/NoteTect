import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';

function Dashboard() {
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Work', 'Personal', 'Learning', 'Health'];

  const onGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Generate notes for: ${topic}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6 flex flex-col">
        <div className="flex items-center mb-8">
          <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold mr-3">
            NT
          </div>
          <h1 className="text-xl font-bold">NoteTect</h1>
        </div>

        <div className="space-y-1 mb-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</h2>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <Button className="mt-auto bg-blue-600 hover:bg-blue-700">
          + New Note
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create</h1>
          <div className="text-gray-500 cursor-pointer">⋮</div>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Generate Notes</CardTitle>
            <CardDescription>
              Enter a topic and context to generate comprehensive notes.
            </CardDescription>
          </CardHeader>
          <form onSubmit={onGenerate}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="Enter your topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="context">Context (Optional)</Label>
                <Textarea
                  id="context"
                  placeholder="Add any additional context or specific points you want to include"
                  className="min-h-[120px]"
                  value={context}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setContext(e.target.value)
                  }
                />
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Drag and drop files here, or click to upload
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supports PDF, DOCX, and TXT (max 10MB)
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t px-6 py-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Generate Notes
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;