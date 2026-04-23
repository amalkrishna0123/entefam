"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Modal } from "@/components/ui/modal"
import MemberForm from "@/components/forms/member-form"
import { Badge } from "@/components/ui/badge"

interface Member {
  id: string
  name: string
  relationship: string
  dob: string
  aadhaar?: string
  mobile?: string
  email?: string
}

export default function MemberList() {
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
    <div className="grid gap-6 sm:grid-cols-2 stagger">
      {members.map((member) => (
        <Card key={member.id} className="p-0 border-[var(--border-strong)] hover:border-[var(--accent)] hover:shadow-lg group transition-all duration-500 bg-[var(--bg-surface)] overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="p-6" style={{padding:"20px"}}>
              <div className="flex items-start justify mb-6" style={{width:"100%"}}>
                <div className="flex items-center gap-4" style={{width:"100%"}}>
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--text-primary)] border border-[var(--border-strong)] group-hover:scale-105 transition-transform duration-500">
                      <span className="text-xl font-bold tracking-tighter opacity-80">
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-strong)] flex items-center justify-center shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
                    </div>
                  </div>
                  <div style={{width:"100%"}}>
                    <h4 className="font-bold text-[var(--text-primary)] text-lg leading-none tracking-tight mb-1.5" style={{width:"100%"}}>{member.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="px-1.5 py-0 text-[9px] uppercase tracking-widest font-black bg-[var(--bg-subtle)]/50 border-[var(--border-strong)]">
                        {member.relationship}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                
              </div>
<div className="flex gap-1.5 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <Button variant="ghost" size="sm" className="h-9 w-9 rounded-xl hover:bg-[var(--bg-subtle)]" onClick={() => setEditMember(member)} style={{color:"black"}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-9 w-9 rounded-xl hover:bg-[var(--danger-muted)] text-[var(--danger)]" onClick={() => setDeleteId(member.id)} style={{color:"black"}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{color:"black"}}>
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </Button>
                </div>
              <div className="grid gap-3" style={{marginTop:"10px"}}>
                <div className="flex items-center justify-between text-xs py-2 border-b border-[var(--border)] border-dashed">
                  <span className="text-[var(--text-tertiary)] font-medium">Date of Birth</span>
                  <span className="text-[var(--text-secondary)] font-bold">{new Date(member.dob).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                
                {member.mobile && (
                  <div className="flex items-center justify-between text-xs py-2 border-b border-[var(--border)] border-dashed">
                    <span className="text-[var(--text-tertiary)] font-medium">Mobile</span>
                    <span className="text-[var(--text-secondary)] font-bold">{member.mobile}</span>
                  </div>
                )}

                {member.email && (
                  <div className="flex items-center justify-between text-xs py-2 border-b border-[var(--border)] border-dashed">
                    <span className="text-[var(--text-tertiary)] font-medium">Email</span>
                    <span className="text-[var(--text-secondary)] font-bold truncate max-w-[140px]">{member.email}</span>
                  </div>
                )}

                {member.aadhaar && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[var(--text-tertiary)] font-medium">Aadhaar</span>
                    <span className="text-[var(--text-secondary)] font-mono font-medium tracking-widest bg-[var(--bg-subtle)] px-2 py-0.5 rounded text-[10px]">
                      •••• •••• {member.aadhaar.slice(-4)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-auto h-1.5 w-full bg-[var(--bg-subtle)] relative overflow-hidden">
              <div className="absolute inset-0 bg-[var(--accent)] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-1000 ease-out opacity-20" />
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
