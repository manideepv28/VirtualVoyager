import { useState } from 'react';
import { Monitor } from 'lucide-react';
import ThreeViewer from '@/components/ThreeViewer';
import ModelSidebar from '@/components/ModelSidebar';
import ControlPanel from '@/components/ControlPanel';
import LoadingOverlay from '@/components/LoadingOverlay';
import type { Model } from '@shared/schema';

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading time
  useState(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  });

  const handleModelSelect = (model: Model) => {
    setSelectedModel(model);
  };

  const handleResetCamera = () => {
    // Camera reset is handled in ThreeViewer
  };

  const handleToggleWireframe = () => {
    // Wireframe toggle is handled in ThreeViewer
  };

  const handleToggleFullscreen = () => {
    // Fullscreen toggle is handled in ThreeViewer
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 hero-gradient rounded-xl flex items-center justify-center animate-glow">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              ImmersiveVR
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#models" className="hover:text-cyan-400 transition-colors">Models</a>
            <a href="#tours" className="hover:text-cyan-400 transition-colors">Virtual Tours</a>
            <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
            <button className="vr-button px-6 py-2 rounded-lg text-white font-medium">
              Get Started
            </button>
          </div>
          
          <button className="md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative pt-20">
        <LoadingOverlay isVisible={isLoading} />
        
        <ThreeViewer 
          selectedModel={selectedModel}
          onResetCamera={handleResetCamera}
          onToggleWireframe={handleToggleWireframe}
          onToggleFullscreen={handleToggleFullscreen}
        />
        
        <ModelSidebar onModelSelect={handleModelSelect} />
        
        <ControlPanel 
          onResetCamera={handleResetCamera}
          onToggleWireframe={handleToggleWireframe}
          onToggleFullscreen={handleToggleFullscreen}
        />
      </main>
    </div>
  );
}
