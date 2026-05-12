"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, User as UserIcon } from "lucide-react"
import DocumentManager from "@/components/members/document-manager"

interface DocumentImage {
  url: string
  label: string
}

interface MemberDocument {
  id: string
  name: string
  images: DocumentImage[]
  updatedAt?: string
}

interface Member {
  id: string
  name: string
  avatarUrl?: string | null
  relationship: string
  documents?: MemberDocument[]
}

export default function MemberDocumentsPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id, locale } = use(params)
  const router = useRouter()
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchMember = async () => {
    try {
      const res = await fetch(`/api/members`)
      const data: Member[] = await res.json()
      const found = data.find(m => m.id === id)
      if (found) {
        setMember(found)
      } else {
        router.push(`/${locale}/members`)
      }
    } catch (error) {
      console.error("Failed to fetch member:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMember()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!member) return null

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-0 bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[#e0e0e099] rounded-lg">
        <div 
          className="max-w-6xl mx-auto flex items-center justify-between"
          style={{ height: '64px', paddingLeft: '16px', paddingRight: '16px' }}
        >
          <Button 
            variant="ghost" 
            onClick={() => router.push(`/${locale}/members/${id}`)}
            className="rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-all group"
            style={{ paddingLeft: '12px', paddingRight: '12px', height: '40px' }}
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5" style={{ marginRight: '8px' }} /> 
            <span className="font-bold text-sm tracking-tight">Back</span>
          </Button>

          <div 
            className="flex items-center gap-3 bg-[var(--bg-subtle)]/50 rounded-xl border border-[var(--border-strong)]"
            style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '6px', paddingBottom: '6px' }}
          >
            <div className="w-7 h-7 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-strong)] flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              {member.avatarUrl ? (
                <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={14} className="text-[var(--accent)] opacity-40" />
              )}
            </div>
            <span className="font-bold text-xs text-[var(--text-primary)] tracking-tight">{member.name}</span>
          </div>
        </div>
      </div>

      <div 
        className="max-w-6xl mx-auto animate-fade-in"
        style={{ paddingTop: '32px', paddingBottom: '32px', paddingLeft: '16px', paddingRight: '16px' }}
      >
        <DocumentManager 
          member={member} 
          onUpdate={fetchMember}
        />
      </div>
    </div>
  )
}
