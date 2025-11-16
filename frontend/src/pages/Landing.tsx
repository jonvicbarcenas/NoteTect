'use client';

import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-foreground">NoteTect</div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="text-foreground hover:text-muted-foreground transition-colors"
            >
              Log In
            </button>
            <Button 
              onClick={() => navigate('/signup')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6" style={{ backgroundColor: '#2D4A73' }}>
        <div className="max-w-2xl text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight text-balance">
            Generate Perfect Notes Instantly
          </h1>

          <p className="text-lg md:text-xl text-blue-100 text-balance max-w-xl mx-auto">
            Transform any topic into comprehensive, well-structured notes with our AI-powered generator
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button className="bg-white text-blue-900 hover:bg-gray-100 font-semibold px-8 py-6 text-base">
            Try Notes Generator
          </Button>
          <Button 
            variant="outline" 
            className="border-2 border-white text-blue-900 font-semibold px-8 py-6 text-base"
          >
            Learn More
          </Button>

          </div>
        </div>
      </section>
    </div>
  );
}
