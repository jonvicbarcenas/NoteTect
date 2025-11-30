import { NOTE_TYPES } from '../../constants';
import { NoteType } from '../../types';

interface GenerationToolsProps {
  activeType: NoteType;
  onTypeChange: (type: NoteType) => void;
}

function GenerationTools({ activeType, onTypeChange }: GenerationToolsProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Generation Tools
      </p>
      <div className="flex flex-wrap gap-2">
        {NOTE_TYPES.map((type) => {
          const Icon = type.icon;
          const isActive = activeType === type.id;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onTypeChange(type.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-primary-foreground' : ''}`} />
              {type.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default GenerationTools;
