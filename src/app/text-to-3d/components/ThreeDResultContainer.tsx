import React, { useState } from 'react'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import ModelViewer from '@/components/ModelViewer'
import { Download, Share2 } from 'lucide-react'
import { CustomLoader } from '@/components/CustomLoader'
import { useNotification } from '@/contexts/NotificationContext'
import { useRouter } from 'next/navigation'
import { Button, TextField, Dialog, DialogContent, DialogActions } from '@mui/material'

interface ThreeDResultContainerProps {
  modelUrl: string
  loading: boolean
  progress: number
  prompt: string
  thumbnailUrl?: string
}

export const ThreeDResultContainer = ({
  modelUrl,
  loading,
  progress,
  prompt,
  thumbnailUrl
}: ThreeDResultContainerProps) => {
  const [publishDialogOpen, setPublishDialogOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const { showNotification } = useNotification()
  const router = useRouter()

  const handleDownload = async (format: 'glb' | 'obj' | 'fbx' | 'usdz') => {
    try {
      // Extract the original URL if it's already proxied
      const originalUrl = modelUrl.startsWith('/api/proxy') ? 
        decodeURIComponent(modelUrl.split('url=')[1]) : 
        modelUrl;

      // Create the URL for the desired format
      const formatUrl = originalUrl.replace('.glb', `.${format}`);
      
      // Create a fresh proxy URL
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(formatUrl)}`;
      
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(`Failed to download ${format} model: ${response.status} ${response.statusText}`);
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

      showNotification(`${format.toUpperCase()} model downloaded successfully!`, 'success');
    } catch (error) {
      console.error(`Error downloading ${format} model:`, error);
      showNotification(`Failed to download ${format.toUpperCase()} model. Please try again.`, 'error');
    }
  };

  const handlePublish = async () => {
    try {
      if (!modelUrl) {
        showNotification('Model not fully generated yet', 'error');
        return;
      }

      const publishData = {
        title: title || 'My 3D Model',
        description: description || 'Generated using ShapeShift.AI',
        prompt: prompt,
        thumbnailUrl: thumbnailUrl || '',
        modelUrl: modelUrl,
        tags: ['text-to-3d'],
        type: 'text-to-3d'
      };

      console.log('Publishing with data:', publishData);

      const response = await fetch('/api/community/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(publishData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to publish model');
      }

      showNotification('Model published successfully! You can view it in the Community Forum.', 'success');
      setPublishDialogOpen(false);
      router.push('/forum');
    } catch (error) {
      console.error('Error publishing model:', error);
      showNotification(error instanceof Error ? error.message : 'Failed to publish model', 'error');
    }
  };
  
  return (
    <div className="result-container">
      <h2 className="result-title">3D Model Preview</h2>
      <div className="viewer-container">
        {loading ? (
          <div className="loading-container">
            <CustomLoader progress={progress} message="Generating 3D model..." />
          </div>
        ) : modelUrl ? (
          <ModelViewer modelUrl={`/api/proxy?url=${encodeURIComponent(modelUrl)}`} />
        ) : (
          <p className="empty-state-message">
            No model generated yet. Enter a prompt and click Generate to create a 3D model.
          </p>
        )}
      </div>

      {modelUrl && !loading && (
        <>
          <div className="download-section">
            <h3 className="download-title">Download Model</h3>
            <div className="download-grid">
              <button 
                onClick={() => handleDownload('glb')}
                className="download-button download-button-glb"
              >
                <Download size={16} />
                GLB
              </button>
              <button 
                onClick={() => handleDownload('fbx')}
                className="download-button download-button-fbx"
              >
                <Download size={16} />
                FBX
              </button>
              <button 
                onClick={() => handleDownload('obj')}
                className="download-button download-button-obj"
              >
                <Download size={16} />
                OBJ
              </button>
              <button 
                onClick={() => handleDownload('usdz')}
                className="download-button download-button-usdz"
              >
                <Download size={16} />
                USDZ
              </button>
            </div>
          </div>

          <div className="action-buttons">
            <button 
              className="publish-button"
              onClick={() => setPublishDialogOpen(true)}
            >
              <Share2 size={20} />
              Publish to Community
            </button>
          </div>
        </>
      )}

      <Dialog 
        open={publishDialogOpen} 
        onClose={() => setPublishDialogOpen(false)}
        PaperProps={{
          className: 'publish-dialog'
        }}
      >
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="dialog-input"
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="dialog-input"
          />
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button 
            onClick={() => setPublishDialogOpen(false)}
            className="dialog-button-secondary"
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePublish} 
            variant="contained" 
            className="dialog-button-primary"
          >
            Publish
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
} 