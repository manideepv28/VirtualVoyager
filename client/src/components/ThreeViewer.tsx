import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import type { Model } from '@shared/schema';
import { getModelColor, createGeometry } from '@/lib/models';

interface ThreeViewerProps {
  selectedModel: Model | null;
  onResetCamera: () => void;
  onToggleWireframe: () => void;
  onToggleFullscreen: () => void;
}

export default function ThreeViewer({ 
  selectedModel, 
  onResetCamera, 
  onToggleWireframe, 
  onToggleFullscreen 
}: ThreeViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const controlsRef = useRef<any>();
  const currentModelRef = useRef<THREE.Mesh>();
  const [isWireframe, setIsWireframe] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0F0F23);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 5);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Import and setup OrbitControls
    import('three/examples/jsm/controls/OrbitControls.js').then(({ OrbitControls }) => {
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxDistance = 20;
      controls.minDistance = 2;
      controlsRef.current = controls;
    });

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x6366F1, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x06B6D4, 0.6, 50);
    pointLight.position.set(-10, 10, -10);
    scene.add(pointLight);

    // Load default model
    loadDefaultModel();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (currentModelRef.current) {
        currentModelRef.current.rotation.y += 0.005;
      }
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const loadDefaultModel = () => {
    if (!sceneRef.current) return;

    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x6366F1,
      shininess: 100
    });

    if (currentModelRef.current) {
      sceneRef.current.remove(currentModelRef.current);
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    sceneRef.current.add(mesh);
    currentModelRef.current = mesh;

    // Add wireframe edges
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x06B6D4 });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    mesh.add(wireframe);
  };

  const loadModel = (model: Model) => {
    if (!sceneRef.current) return;

    const geometryType = createGeometry(model.title.toLowerCase());
    let geometry: THREE.BufferGeometry;

    switch (geometryType) {
      case 'sphere':
        geometry = new THREE.SphereGeometry(1.5, 32, 32);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
        break;
      default:
        geometry = new THREE.BoxGeometry(2, 2, 2);
    }

    const material = new THREE.MeshPhongMaterial({ 
      color: getModelColor(model.color),
      shininess: 100,
      wireframe: isWireframe
    });

    if (currentModelRef.current) {
      sceneRef.current.remove(currentModelRef.current);
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    sceneRef.current.add(mesh);
    currentModelRef.current = mesh;

    // Add wireframe edges if not in wireframe mode
    if (!isWireframe) {
      const edges = new THREE.EdgesGeometry(geometry);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x06B6D4 });
      const wireframe = new THREE.LineSegments(edges, lineMaterial);
      mesh.add(wireframe);
    }
  };

  // Update model when selectedModel changes
  useEffect(() => {
    if (selectedModel) {
      loadModel(selectedModel);
    }
  }, [selectedModel, isWireframe]);

  // Control handlers
  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(5, 5, 5);
      controlsRef.current.reset();
    }
    onResetCamera();
  };

  const handleToggleWireframe = () => {
    setIsWireframe(!isWireframe);
    if (currentModelRef.current) {
      (currentModelRef.current.material as THREE.MeshPhongMaterial).wireframe = !isWireframe;
    }
    onToggleWireframe();
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    onToggleFullscreen();
  };

  return (
    <div className="relative">
      <div 
        ref={mountRef} 
        className="w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      />
      
      {/* Model Info Panel */}
      <div className="absolute bottom-6 left-6 glass-effect rounded-2xl p-6 max-w-sm">
        <h3 className="text-xl font-bold text-white mb-2">
          {selectedModel?.title || 'Default Model'}
        </h3>
        <p className="text-gray-300 text-sm mb-4">
          {selectedModel?.description || 'A sample 3D model demonstrating the viewer capabilities.'}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-cyan-400 font-medium">Interactive 3D Model</span>
          <div className="flex space-x-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>
      </div>

      {/* Controls Help */}
      <div className="fixed bottom-6 right-6 glass-effect rounded-2xl p-4 max-w-xs z-30">
        <h4 className="font-semibold text-white mb-2">Controls</h4>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
            <span>Mouse: Rotate & Zoom</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
            <span>Touch: Pinch & Drag</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            <span>Right Click: Pan View</span>
          </div>
        </div>
      </div>
    </div>
  );
}
