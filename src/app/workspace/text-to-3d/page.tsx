'use client'

import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import AuthCheck from '@/components/auth-check'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import '../workspace.css'
import ModelViewer from '@/components/ModelViewer'

export default function TextTo3D() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [modelUrl, setModelUrl] = useState('')
  const [progress, setProgress] = useState(0)
  const [generationMessage, setGenerationMessage] = useState('Initializing...')

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError('');
    setModelUrl('');
    setProgress(0);
    setGenerationMessage('Submitting your request...');

    try {
      console.log('Sending request to generate 3D model...');
      const response = await fetch('/api/text-to-3d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: prompt,
          negative_text: "low quality, bad geometry, distorted"
        })
      });

      const data = await response.json();
      console.log('Generation response:', data);

      if (!response.ok) {
        console.error('Error response:', data);
        throw new Error(data.error || 'Failed to generate 3D model');
      }
      
      if (data.modelUrl) {
        setModelUrl(data.modelUrl);
        setGenerationMessage('3D model generated successfully!');
        setProgress(100);
      } else {
        throw new Error('No model URL received from the server');
      }
      
    } catch (error) {
      console.error('Error generating 3D model:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate 3D model. Please try again.');
      setProgress(0);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <>
      <AuthCheck />
      <div className="workspace-container">
        <Navbar />
        
        <main className="workspace-main">
          <div className="workspace-content">
            <div className="workspace-grid">
              {/* Input Section */}
              <div className="workspace-sidebar">
                <div className="workspace-panel">
                  <h2 className="workspace-panel-title">
                    Text to 3D Model
                  </h2>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your 3D model in detail..."
                    className="workspace-input"
                    rows={6}
                  />
                  {error && (
                    <p className="text-red-500 mb-4">{error}</p>
                  )}
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="workspace-button"
                  >
                    {isGenerating ? 'Generating...' : 'Generate 3D Model'}
                  </button>
                </div>

                <div className="workspace-panel">
                  <h3 className="tips-title">
                    Tips for Best Results
                  </h3>
                  <ul className="tips-list">
                    <li>• Be specific about materials and textures</li>
                    <li>• Include details about shape and form</li>
                    <li>• Mention size relationships</li>
                    <li>• Describe the style you want</li>
                  </ul>
                </div>
              </div>

              {/* Preview Section */}
              <div className="workspace-preview">
                <div className="preview-panel">
                  {isGenerating ? (
                    <div className="loading-overlay">
                      <LoadingSpinner progress={progress} message={generationMessage} />
                    </div>
                  ) : modelUrl ? (
                    <div className="model-viewer">
                      <ModelViewer modelUrl={modelUrl} />
                      <a 
                        href={modelUrl} 
                        download 
                        className="download-button mt-4"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download Model
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-[var(--text-secondary)]">
                        Enter a description and click Generate to create your 3D model
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
} 