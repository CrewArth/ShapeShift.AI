'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import Navbar from '@/components/Navbar'
import AuthCheck from '@/components/auth-check'
import './forum.css'

interface Model {
  id: string
  title: string
  prompt: string
  thumbnail: string
  modelUrl: string
  userName: string
  userId: string
  createdAt: string
}

export default function Forum() {
  const { user } = useUser()
  const [searchQuery, setSearchQuery] = useState('')
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      const response = await fetch('/api/models/public')
      const data = await response.json()
      setModels(data.models)
    } catch (error) {
      console.error('Error fetching models:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredModels = models.filter(model =>
    model.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <AuthCheck />
      <div className="min-h-screen bg-[var(--background)]">
        <Navbar />
        
        <main className="container mx-auto px-4 pt-24 pb-12">
          {/* Search Section */}
          <div className="search-section">
            <motion.h1 
              className="forum-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Community Models
            </motion.h1>
            <motion.div 
              className="search-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <input
                type="text"
                placeholder="Search models by prompt or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </motion.div>
          </div>

          {/* Models Grid */}
          <motion.div 
            className="models-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {loading ? (
              <div className="loading-state">Loading models...</div>
            ) : filteredModels.length > 0 ? (
              filteredModels.map((model) => (
                <Link href={`/forum/model/${model.id}`} key={model.id}>
                  <motion.div 
                    className="model-card"
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="model-thumbnail">
                      <Image
                        src={model.thumbnail}
                        alt={model.title}
                        width={300}
                        height={300}
                        className="rounded-t-lg object-cover"
                      />
                    </div>
                    <div className="model-info">
                      <h3 className="model-title">{model.title}</h3>
                      <p className="model-creator">
                        by <span className="creator-name">{model.userName}</span>
                      </p>
                      <p className="model-prompt">{model.prompt.slice(0, 100)}...</p>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="no-results">
                No models found matching your search.
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </>
  )
} 