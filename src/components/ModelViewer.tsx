'use client';

import { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { Download } from 'lucide-react';

interface ModelViewerProps {
  modelUrl: string;
  className?: string;
  onPublish?: () => void;
  isForumView?: boolean;
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const { camera, size } = useThree();
  
  useEffect(() => {
    // Reset scene
    scene.position.set(0, 0, 0);
    scene.rotation.set(0, 0, 0);
    scene.scale.set(1, 1, 1);
    
    // Calculate bounding box
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    
    // Get the largest dimension for scaling
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1.8 / maxDim; // Reduced scale for less zoom
    
    // Center and scale the model
    scene.scale.multiplyScalar(scale);
    scene.position.sub(center.multiplyScalar(scale));
    
    // Set up camera
    camera.position.set(0, 0, 3.8); // Moved camera back
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    
    // Enhance materials
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((material) => {
            if (material instanceof THREE.MeshStandardMaterial) {
              material.needsUpdate = true;
              material.side = THREE.DoubleSide;
              material.roughness = 0.5;
              material.metalness = 0.4;
              material.envMapIntensity = 1.0;
            }
          });
        }
      }
    });
  }, [scene, camera]);

  return (
    <group>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} castShadow />
      <directionalLight position={[-5, -5, -5]} intensity={0.6} />
      <primitive object={scene} />
    </group>
  );
}

export default function ModelViewer({ modelUrl, className = '', onPublish, isForumView = false }: ModelViewerProps) {
  const processModelUrl = (url: string) => {
    return url.startsWith('/api/proxy') ? url : `/api/proxy?url=${encodeURIComponent(url)}`;
  };

  const handleDownload = async (format: 'glb' | 'obj' | 'fbx') => {
    try {
      const url = modelUrl.replace('.glb', `.${format}`);
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `model.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading model:', error);
    }
  };

  return (
    <div className={`model-viewer-wrapper ${isForumView ? 'forum-view' : ''}`}>
      <style jsx>{`
        .model-viewer-wrapper {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .model-viewer-wrapper.forum-view {
          max-width: 100%;
        }

        .model-viewer-container {
          width: ${isForumView ? '100%' : '600px'};
          height: ${isForumView ? '100%' : '700px'};
          position: relative;
          background-color: var(--background);
          border-radius: 12px;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .model-viewer-container :global(canvas) {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
        }
      `}</style>
      
      <div className="model-viewer-container">
        <Canvas
          camera={{ 
            position: [0, 0, 3.8],
            fov: 42,
            near: 0.1,
            far: 1000
          }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '12px'
          }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.0} castShadow />
          <directionalLight position={[-5, -5, -5]} intensity={0.6} />
          
          <group>
            <Model url={processModelUrl(modelUrl)} />
          </group>
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={false}
            autoRotateSpeed={0.5}
            minDistance={2.8}
            maxDistance={5.5}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
            target={[0, 0, 0]}
          />
        </Canvas>
      </div>
    </div>
  );
} 