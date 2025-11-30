import { Sparkles } from 'lucide-react';

function SidebarHeader() {
  return (
    <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-900/20">
        <Sparkles className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">NoteTect</h1>
        <p className="text-xs text-slate-400">AI Note Assistant</p>
      </div>
    </div>
  );
}

export default SidebarHeader;
