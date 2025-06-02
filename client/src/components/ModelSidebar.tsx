import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { Model } from '@shared/schema';

interface ModelSidebarProps {
  onModelSelect: (model: Model) => void;
}

export default function ModelSidebar({ onModelSelect }: ModelSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: models = [], isLoading } = useQuery<Model[]>({
    queryKey: ['/api/models'],
  });

  const handleModelClick = (model: Model) => {
    onModelSelect(model);
    setIsOpen(false);
  };

  return (
    <>
      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full w-80 glass-effect transform transition-transform duration-300 z-30 pt-20 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            3D Models & Tours
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {models.map((model) => (
                <div 
                  key={model.id}
                  className="model-card glass-effect rounded-xl p-4 cursor-pointer" 
                  onClick={() => handleModelClick(model)}
                >
                  <img 
                    src={model.imageUrl} 
                    alt={model.title} 
                    className="w-full h-32 object-cover rounded-lg mb-3" 
                  />
                  <h3 className="font-semibold text-white">{model.title}</h3>
                  <p className="text-sm text-gray-400">{model.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span 
                      className={`text-xs px-2 py-1 rounded text-white ${
                        model.type === 'model' 
                          ? 'bg-indigo-500' 
                          : 'bg-gradient-to-r from-indigo-500 to-cyan-500'
                      }`}
                    >
                      {model.type === 'model' ? '3D Model' : 'Virtual Tour'}
                    </span>
                    <span className="text-xs text-cyan-400">Ready</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-6 top-1/2 transform -translate-y-1/2 z-40 glass-effect p-3 rounded-xl hover:bg-indigo-500 transition-colors"
        style={{
          transform: `translateY(-50%) ${isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}`,
        }}
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    </>
  );
}
