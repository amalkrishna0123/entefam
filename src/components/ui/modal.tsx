"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose?: () => void
  title?: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function Modal({ isOpen, onClose, title, children, className, style }: ModalProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.()
    }
    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleEscape)
    }
    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div style={{padding:"15px"}} className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div 
        className={cn(
          "relative w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden animate-fade-up",
          className
        )}
        style={{ padding: "20px", ...style }}
      >
        {(title || onClose) && (
          <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
            {title && <h3 className="text-lg font-semibold text-[var(--text-primary)]" style={{marginBottom:"10px"}}>{title}</h3>}
            {onClose && (
              <button 
                onClick={onClose}
                className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors" 
                style={{marginBottom:"10px"}}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="p-6 max-h-[65vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
