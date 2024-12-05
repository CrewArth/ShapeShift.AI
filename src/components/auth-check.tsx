'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCheck() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/?sign-in=true')
    }
  }, [isLoaded, isSignedIn, router])

  // Don't render anything - this is just a guard
  return null
} 