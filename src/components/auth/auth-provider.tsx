"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const { setUser, setProfile } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        // Fetch profile
        try {
          const res = await fetch(`/api/profile?userId=${user.uid}`)
          const data = await res.json()
          setProfile(data)
        } catch (error) {
          console.error('Failed to fetch profile in AuthProvider:', error)
        }
      } else {
        setProfile(null)
      }
      
      const isAuthPage = pathname.includes("/login") || pathname.includes("/register")
      
      if (!user && !isAuthPage) {
        // Find the current locale from the pathname
        const segments = pathname.split('/')
        const locale = segments[1] || 'en'
        router.push(`/${locale}/login`)
      } else if (user && isAuthPage) {
        const segments = pathname.split('/')
        const locale = segments[1] || 'en'
        router.push(`/${locale}/dashboard`)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [setUser, router, pathname])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-base)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[var(--text-secondary)] font-medium">Loading FamilyOS...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
