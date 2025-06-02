interface LoadingOverlayProps {
  isVisible: boolean;
}

export default function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 z-20">
      <div className="text-center">
        <div className="loading-spinner mx-auto mb-4"></div>
        <p className="text-lg font-medium text-cyan-400">Loading 3D Experience...</p>
        <p className="text-sm text-gray-400 mt-2">Preparing immersive content</p>
      </div>
    </div>
  );
}
