"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Sidebar from "./sidebar"
import NotificationCenter from "./notification-center"
import { useAuthStore } from "@/store/auth-store"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, profile } = useAuthStore()

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-base)" }}>
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`sidebar-mobile-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <Sidebar isMobile onClose={() => setIsSidebarOpen(false)} />
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Mobile Header */}
        <header
          className="mobile-header"
          style={{
            height: "60px",
            background: "var(--bg-surface)",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            position: "sticky",
            top: 0,
            zIndex: 40,
            borderRadius:"18px",
            width:"89%",
            margin:"0 auto",
            marginTop:"10px",
            backdropFilter: "blur(10px)",
          }}
        >
          <button
            onClick={() => setIsSidebarOpen(true)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              cursor: "pointer",
              padding: "8px",
              marginLeft: "-8px",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div style={{ marginLeft: "12px", display: "flex", alignItems: "center" }}>
            <img 
              src="/asset/logo.png" 
              alt="FamilyOS Logo" 
              style={{ 
                height: "32px", 
                width: "auto",
                display: "block",
                objectFit: "contain"
              }} 
            />
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "16px" }}>
            <NotificationCenter />
            <Link href="/settings">
              <div 
                style={{ 
                  width: "32px", 
                  height: "32px", 
                  borderRadius: "50%", 
                  background: "var(--bg-subtle)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "var(--text-primary)",
                  overflow: "hidden",
                  border: "1px solid var(--border-strong)"
                }}
              >
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  user?.displayName ? user.displayName[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : '?')
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Desktop Header (Top Bar) */}
        <header
          className="desktop-header"
          style={{
            height: "80px",
            display: "none",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 80px",
            position: "sticky",
            top: 0,
            zIndex: 40,
            background: "rgba(var(--bg-base-rgb), 0.8)",
            backdropFilter: "blur(10px)",
          }}
        >
          <NotificationCenter />
        </header>

        <main
          className="main-content"
          style={{
            flex: 1,
            padding: "0px 64px 80px",
            overflowY: "auto",
            minWidth: 0,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
