'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useNotification } from '@/contexts/NotificationContext'
import './image-to-3d.css'

export default function ImageTo3D() {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const { showNotification } = useNotification()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setImage(file)
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    multiple: false
  })

  const handleGenerate = async () => {
    if (!image) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', image)

      const response = await fetch('/api/image-to-3d', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to generate 3D model')

      const data = await response.json()
      showNotification('3D model generated successfully!', 'success')
      // Handle the generated model data
    } catch (error) {
      console.error('Error:', error)
      showNotification('Failed to generate 3D model', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="workspace-container">
        <h1 className="workspace-title">Image to 3D Model</h1>
        <p className="workspace-subtitle">
          Upload an image and we'll convert it into a detailed 3D model
        </p>

        <div className="dropzone-container">
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <div className="dropzone-icon">📸</div>
            {isDragActive ? (
              <p className="dropzone-text">Drop your image here...</p>
            ) : (
              <p className="dropzone-text">
                Drag & drop an image here, or <strong>click to select</strong>
              </p>
            )}
          </div>
        </div>

        {preview && (
          <div className="preview-container">
            <h2 className="preview-title">Image Preview</h2>
            <Image
              src={preview}
              alt="Preview"
              width={400}
              height={300}
              className="preview-image"
            />
            <div className="button-container">
              <button
                className="generate-button"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Generating...
                  </>
                ) : (
                  'Generate 3D Model'
                )}
              </button>
              <button
                className="cancel-button"
                onClick={() => {
                  setImage(null)
                  setPreview('')
                }}
                disabled={loading}
              >
                Clear Image
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="loading-container">
            <div className="loading-content">
              <LoadingSpinner size={40} />
              <p className="loading-text">Generating your 3D model...</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
} 