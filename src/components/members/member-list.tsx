"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Modal } from "@/components/ui/modal"
import MemberForm from "@/components/forms/member-form"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/date-utils"
import DocumentManager from "./document-manager"
import { Briefcase, Droplets, MapPin, ChevronRight, Edit3 } from "lucide-react"
import { useRouter, useParams } from "next/navigation"

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
  relationship: string
  dob: string
  aadhaar?: string
  mobile?: string
  email?: string
  avatarUrl?: string
  bloodGroup?: string
  occupation?: string
  address?: string
  documents?: MemberDocument[]
}

export default function MemberList() {
  const router = useRouter()
  const params = useParams()
  const locale = params?.locale || 'en'
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editMember, setEditMember] = useState<Member | null>(null)

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/members")
      const data = await res.json()
      setMembers(data)
    } catch (error) {
      console.error("Failed to fetch members:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/members/${deleteId}`, { method: "DELETE" })
      if (res.ok) {
        setMembers(members.filter((m) => m.id !== deleteId))
        setDeleteId(null)
      }
    } catch (error) {
      console.error("Failed to delete member:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-[var(--bg-elevated)] animate-pulse rounded-2xl" />
        ))}
      </div>
    )
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-16 bg-[var(--bg-elevated)] rounded-2xl border border-dashed border-[var(--border)]">
        <p className="text-[var(--text-tertiary)]">No family members added yet.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 stagger">
      {members.map((member) => (
        <Card 
          key={member.id} 
          className="p-0 border-[var(--border-strong)] hover:border-[var(--accent)] hover:shadow-2xl group transition-all duration-500 bg-[var(--bg-surface)] overflow-hidden cursor-pointer rounded-[2rem]"
          onClick={() => router.push(`/${locale}/members/${member.id}`)}
        >
          <div className="flex flex-col h-full">
            <div className="p-7" style={{padding:"10px"}}>
              <div className="flex items-start justify-between mb-8" style={{marginBottom:"10px"}}>
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--text-primary)] border border-[var(--border-strong)] group-hover:scale-105 transition-transform duration-500 overflow-hidden shadow-sm">
                      {member.avatarUrl ? (
                        <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[var(--bg-subtle)] to-[var(--bg-base)] flex items-center justify-center text-[var(--accent)] font-black text-xl tracking-tighter opacity-40">
                          {member.name ? member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-[var(--bg-surface)] border-2 border-[var(--bg-surface)] shadow-md flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[var(--success)]" />
                    </div>
                  </div>
                  <div className="space-y-1" style={{}}>
                    <h4 className="font-black text-[var(--text-primary)] text-xl tracking-tight leading-tight">{member.name}</h4>
                    <div className="flex items-center gap-2" style={{marginTop:"10px"}}>
                      <Badge variant="outline" className="px-2 py-0.5 text-[9px] uppercase tracking-widest font-black bg-[var(--accent)]/5 border-[var(--accent)]/10 text-[var(--accent)] rounded-full">
                        {member.relationship}
                      </Badge>
                      {member.documents && member.documents.length > 0 && (
                        <Badge className="bg-[var(--success)]/10 text-[var(--success)] border-none h-5 px-2 text-[9px] font-black uppercase tracking-tighter rounded-full">
                          {member.documents.length} Docs
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-9 w-9 rounded-xl hover:bg-[var(--bg-subtle)] border border-transparent hover:border-[var(--border-strong)]" 
                    onClick={(e) => { e.stopPropagation(); setEditMember(member); }}
                  >
                    <Edit3 size={15} className="text-[var(--text-secondary)]" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div style={{padding:"10px"}} className="space-y-1 p-3 rounded-2xl bg-[var(--bg-subtle)]/30 border border-transparent group-hover:border-[var(--border-strong)] transition-all">
                  <span className="block text-[9px] text-[var(--text-tertiary)] font-black uppercase tracking-widest">Born</span>
                  <span className="block text-[13px] text-[var(--text-secondary)] font-bold">{formatDate(member.dob)}</span>
                </div>
                
                {member.bloodGroup ? (
                  <div style={{padding:"10px"}} className="space-y-1 p-3 rounded-2xl bg-[var(--bg-subtle)]/30 border border-transparent group-hover:border-[var(--border-strong)] transition-all">
                    <span className="block text-[9px] text-[var(--text-tertiary)] font-black uppercase tracking-widest">Blood</span>
                    <div className="flex items-center gap-1.5">
                      <Droplets size={12} className="text-red-500" />
                      <span className="text-[13px] text-[var(--text-secondary)] font-bold">{member.bloodGroup}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{padding:"10px"}} className="space-y-1 p-3 rounded-2xl bg-[var(--bg-subtle)]/30 border border-transparent group-hover:border-[var(--border-strong)] transition-all">
                    <span className="block text-[9px] text-[var(--text-tertiary)] font-black uppercase tracking-widest">Mobile</span>
                    <span className="block text-[13px] text-[var(--text-secondary)] font-bold truncate">{member.mobile || "N/A"}</span>
                  </div>
                )}
              </div>

              <div style={{marginTop:"10px",padding:"10px"}} className="mt-6 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)] pt-4 border-t border-[var(--border)] border-dashed opacity-60 group-hover:opacity-100 transition-all">
                View Full Profile
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
            <div className="h-1.5 w-full bg-[var(--bg-subtle)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-1000 ease-out" />
            </div>
          </div>
        </Card>
      ))}

      <Modal isOpen={!!editMember} onClose={() => setEditMember(null)} title="Edit Family Member">
        {editMember && (
          <MemberForm 
            initialData={editMember} 
            onSuccess={() => {
              setEditMember(null);
              fetchMembers();
            }} 
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Remove Member"
        description="Are you sure you want to remove this family member? This action cannot be undone."
        confirmText="Remove"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
