'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaLinkedin, FaGithub, FaYoutube, FaInstagram } from 'react-icons/fa'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import './home.css'
import '../components/footer.css'
import AboutUsImage from '../assets/AboutUsImage.png'

// Animation variants
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

const gradientTextVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3,
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-pattern" />
        <div className="floating-shapes">
          <div className="floating-shape" />
          <div className="floating-shape" />
          <div className="floating-shape" />
        </div>
        <div className="hero-content">
          <motion.div 
            className="hero-title-container"
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={textVariants}
              className="hero-title-top"
            >
              Transform Ideas into
            </motion.h1>
            <motion.h1
              variants={gradientTextVariants}
              className="hero-title-gradient"
            >
              3D Reality
            </motion.h1>
          </motion.div>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Create stunning 3D models from text descriptions or images using advanced AI technology.
            Perfect for designers, developers, and creators.
          </motion.p>
          <motion.div 
            className="flex gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Link href="/workspace/text-to-3d">
              <motion.button
                className="button-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Text to 3D
              </motion.button>
            </Link>
            <Link href="/workspace/image-to-3d">
              <motion.button
                className="button-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Image to 3D
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-spacing">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <h3 className="feature-title">Text to 3D</h3>
            <p className="feature-description">
              Describe your vision in words and watch as AI transforms it into a detailed 3D model.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="feature-title">Image to 3D</h3>
            <p className="feature-description">
              Upload an image and let our AI convert it into a detailed, textured 3D model instantly.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="feature-title">Multiple Formats</h3>
            <p className="feature-description">
              Export your 3D models in various formats including GLB, FBX, and OBJ for any use case.
            </p>
          </div>
        </div>
      </section>

      {/* About Developer Section */}
      <section className="about-section">
        <div className="about-pattern" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="about-title text-center mb-12">About Developer</h2>
          <div className="about-developer-grid">
            {/* Image Column */}
            <div className="about-image-container">
              <div className="about-image-wrapper">
                <Image
                  src={AboutUsImage}
                  alt="Arth Vala"
                  width={400}
                  height={400}
                  className="about-image"
                  priority
                />
              </div>
            </div>

            {/* Content Column */}
            <div className="about-content">
              <div className="about-text">
                <p>
                  My name is <span className="font-bold">Arth Vala</span>, and I am a final-year student at <span className="font-bold">Parul University</span>,
                  pursuing an Integrated MCA with a specialization in Artificial Intelligence.
                  Set to graduate in 2025, I am deeply passionate about advancing technologies 
                  in Artificial Intelligence, Computer Vision, Deep Learning, and Machine Learning.
                </p>
                <p>
                  My academic journey has been driven by a strong interest in exploring the potential 
                  of AI and its transformative impact on real-world applications.
                </p>
                <p>
                  I'm currently focused on building AI-powered applications, 
                  contributing to open-source projects, and mentoring aspiring developers. 
                  Feel free to connect with me on my journey!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="contact-title">Get in Touch</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="form-textarea"
                rows={5}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="form-submit"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
            {submitStatus === 'success' && (
              <p className="text-green-500 mt-4">Message sent successfully!</p>
            )}
            {submitStatus === 'error' && (
              <p className="text-red-500 mt-4">Failed to send message. Please try again.</p>
            )}
          </form>
        </div>
      </section>

      {/* Follow Me Section */}
      <section className="follow-section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            className="follow-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Follow Me
          </motion.h2>
          <motion.div 
            className="social-icons-grid"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.a
              href="https://linkedin.com/in/arthvala"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon linkedin"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaLinkedin size={24} />
              <span>LinkedIn</span>
            </motion.a>

            <motion.a
              href="https://github.com/CrewArth"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon github"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaGithub size={24} />
              <span>GitHub</span>
            </motion.a>

            <motion.a
              href="https://youtube.com/c/CricketGuruji15"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon youtube"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaYoutube size={24} />
              <span>YouTube</span>
            </motion.a>

            <motion.a
              href="https://instagram.com/arthvala.15"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon instagram"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaInstagram size={24} />
              <span>Instagram</span>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div>
              <h3 className="footer-brand">
                ShapeShift AI
              </h3>
              <p className="footer-description">
                Transform your ideas into stunning 3D models using AI technology.
              </p>
            </div>
            <div>
              <h4 className="footer-section-title">Quick Links</h4>
              <ul className="footer-links">
                <li>
                  <Link href="/workspace/text-to-3d" className="footer-link">
                    Text to 3D
                  </Link>
                </li>
                <li>
                  <Link href="/workspace/image-to-3d" className="footer-link">
                    Image to 3D
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="footer-link">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="footer-section-title">Contact</h4>
              <ul className="footer-links">
                <li>
                  <a href="mailto:arthvala@gmail.com" className="footer-link">
                    
                    support@shapeshiftai.com
                  </a>
                </li>
                <li>
                  <Link href="/contact" className="footer-link">
                    Contact Form
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 ShapeShift AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 