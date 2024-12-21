'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Credits from '@/components/Credits';
import { useNotification } from '@/contexts/NotificationContext';
import { ThreeDResultContainer } from './components/ThreeDResultContainer';
import { useAuth } from '@clerk/nextjs';
import AuthCheck from '@/components/auth-check';

export default function TextTo3D() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [artStyle, setArtStyle] = useState('realistic');
  const [loading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState<string>('');
  const [modelUrl, setModelUrl] = useState<string>('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>('');
  const { showNotification } = useNotification();
  const { getToken } = useAuth();

  const handleDownload = async (format: string) => {
    try {
      const downloadUrl = `/api/download-model?url=${encodeURIComponent(modelUrl)}&format=${format}`;
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `model.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading glb model:', error);
      showNotification(error instanceof Error ? error.message : 'Download failed', 'error');
    }
  };

  return (
    <>
      <AuthCheck />
      <div className="min-h-screen bg-[var(--background)]">
        <Navbar />
        <Credits />
        <div className="text-to-3d-container">
          <div className="input-container">
            {/* ... rest of your input container ... */}
          </div>

          <ThreeDResultContainer
            modelUrl={modelUrl}
            loading={loading}
            progress={progress}
            prompt={prompt}
            thumbnailUrl={thumbnailUrl}
          />
        </div>
      </div>
    </>
  );
} 