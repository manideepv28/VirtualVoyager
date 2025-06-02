import { RotateCcw, Grid3X3, Maximize } from 'lucide-react';

interface ControlPanelProps {
  onResetCamera: () => void;
  onToggleWireframe: () => void;
  onToggleFullscreen: () => void;
}

export default function ControlPanel({ 
  onResetCamera, 
  onToggleWireframe, 
  onToggleFullscreen 
}: ControlPanelProps) {
  return (
    <div className="fixed top-1/2 right-5 transform -translate-y-1/2 z-10">
      <div className="glass-effect rounded-2xl p-4 space-y-4 w-16">
        <button 
          onClick={onResetCamera}
          className="w-full p-3 rounded-xl bg-indigo-500 hover:bg-purple-500 transition-colors" 
          title="Reset Camera"
        >
          <RotateCcw className="w-5 h-5 mx-auto text-white" />
        </button>
        
        <button 
          onClick={onToggleWireframe}
          className="w-full p-3 rounded-xl bg-slate-600 hover:bg-indigo-500 transition-colors" 
          title="Toggle Wireframe"
        >
          <Grid3X3 className="w-5 h-5 mx-auto text-white" />
        </button>
        
        <button 
          onClick={onToggleFullscreen}
          className="w-full p-3 rounded-xl bg-slate-600 hover:bg-indigo-500 transition-colors" 
          title="Fullscreen"
        >
          <Maximize className="w-5 h-5 mx-auto text-white" />
        </button>
      </div>
    </div>
  );
}
