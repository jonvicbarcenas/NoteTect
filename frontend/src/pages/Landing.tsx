import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Zap, BookOpen, Sparkles } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function Landing() {
  const { user, loading } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">NoteTect</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors text-sm">
              Features
            </a>
            <a href="#benefits" className="text-slate-300 hover:text-white transition-colors text-sm">
              Benefits
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-20 h-8 bg-slate-700/50 rounded-full animate-pulse" />
            ) : user ? (
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white transition-colors text-sm">
                  Log In
                </Link>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <div className="inline-block px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full">
            <span className="text-sm text-blue-400 font-medium">AI-Powered Note Generation</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-balance leading-tight">
            Generate Perfect{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Notes Instantly
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 text-balance max-w-2xl mx-auto leading-relaxed">
            Transform any topic into comprehensive, well-structured notes with our AI-powered generator. Save hours of
            study time.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-slate-400">Everything you need to create perfect study notes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Instant Generation",
                description: "Transform any topic into structured notes in seconds",
              },
              {
                icon: BookOpen,
                title: "Multiple Formats",
                description: "Get summaries, study guides, simplifications, and action items",
              },
              {
                icon: Sparkles,
                title: "AI-Powered",
                description: "Advanced AI ensures accurate, comprehensive, and well-organized notes",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-slate-600 transition-colors group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Students Love NoteTect</h2>
            <p className="text-xl text-slate-400">Join thousands who've transformed their study habits</p>
          </div>

          <div className="space-y-6">
            {[
              "Save 10+ hours every week on note-taking",
              "Generate notes for any subject or topic instantly",
              "Access your notes anytime, anywhere",
              "Improve retention with structured, well-organized content",
            ].map((benefit, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-6 bg-slate-800/30 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors"
              >
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <p className="text-lg text-slate-300">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-slate-400 text-sm">
          <p>&copy; 2025 NoteTect. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
