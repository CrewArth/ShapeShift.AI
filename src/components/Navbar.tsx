'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import ThemeToggle from './ThemeToggle'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import ShapeShiftLogo from '@/assets/ShapeShiftLogo.png'
import './navbar.css'

export default function Navbar() {
  const { isSignedIn } = useUser()
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const [imageError, setImageError] = useState(false)

  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="navbar-container">
        <Link href="/" className="navbar-brand-container">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {!imageError ? (
              <Image 
                src={ShapeShiftLogo}
                alt="ShapeShift AI Logo" 
                width={40} 
                height={40}
                className="navbar-logo"
                onError={() => setImageError(true)}
                priority
              />
            ) : (
              <div className="navbar-logo-placeholder">
                S
              </div>
            )}
          </motion.div>
          <span className="navbar-brand-text">ShapeShift AI</span>
        </Link>

        <div className="navbar-links">
          <ThemeToggle />
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <div className="auth-buttons">
              <SignInButton mode="modal">
                <button className="navbar-button-secondary">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="navbar-button">
                  Get Started
                </button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  )
} 