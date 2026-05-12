"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Plus, X, Search, FileText } from "lucide-react"
import DocumentList from "./document-list"
import DocumentForm from "./document-form"
import { Input } from "@/components/ui/input"

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
  documents?: MemberDocument[]
}

interface DocumentManagerProps {
  member: Member
  onUpdate: () => void
}

export default function DocumentManager({ member, onUpdate }: DocumentManagerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingDoc, setEditingDoc] = useState<MemberDocument | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const documents = member.documents || []
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSaveDocument = async (data: Omit<MemberDocument, "id"> & { id?: string }) => {
    setIsSaving(true)
    try {
      let updatedDocuments: MemberDocument[]
      
      if (data.id) {
        // Edit existing
        updatedDocuments = documents.map(doc => 
          doc.id === data.id ? { ...doc, ...data, updatedAt: new Date().toISOString() } as MemberDocument : doc
        )
      } else {
        // Add new
        const newDoc: MemberDocument = {
          ...data,
          id: Math.random().toString(36).substr(2, 9),
          updatedAt: new Date().toISOString()
        }
        updatedDocuments = [...documents, newDoc]
      }

      const res = await fetch(`/api/members/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documents: updatedDocuments })
      })

      if (res.ok) {
        onUpdate()
        setIsAdding(false)
        setEditingDoc(null)
      } else {
        throw new Error("Failed to save document")
      }
    } catch (error) {
      console.error(error)
      alert("Failed to save document. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteDocument = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return
    
    try {
      const updatedDocuments = documents.filter(doc => doc.id !== id)
      const res = await fetch(`/api/members/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documents: updatedDocuments })
      })

      if (res.ok) {
        onUpdate()
      } else {
        throw new Error("Failed to delete document")
      }
    } catch (error) {
      console.error(error)
      alert("Failed to delete document.")
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3" style={{ marginBottom: '4px' }}>
            <h4 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
              Documents
            </h4>
            <Badge 
              variant="outline" 
              className="rounded-lg bg-[var(--accent)]/5 text-[var(--accent)] border-[var(--accent)]/20 font-bold text-[10px]"
              style={{ height: '24px', paddingLeft: '8px', paddingRight: '8px' }}
            >
              {documents.length} Total
            </Badge>
          </div>
          <p className="text-sm text-[var(--text-tertiary)] font-medium">
            Manage and organize {member.name}'s official identification and records.
          </p>
        </div>
        
        {!isAdding && !editingDoc && (
          <Button 
            onClick={() => setIsAdding(true)} 
            className="rounded-xl shadow-xl shadow-[var(--accent)]/20 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ height: '48px', paddingLeft: '24px', paddingRight: '24px', marginBottom: '10px' }}
          >
            <Plus size={20} style={{ marginRight: '8px' }} /> 
            <span className="font-bold text-white" style={{color:"white"}}>Add Document</span>
          </Button>
        )}
      </div>

      {(isAdding || editingDoc) ? (
        <div className="animate-fade-up">
          <Card className="bg-[var(--bg-surface)] border-[var(--border-strong)] rounded-3xl overflow-hidden shadow-2xl shadow-black/5">
            <div 
              className="flex items-center justify-between border-b border-[var(--border-strong)] bg-[var(--bg-subtle)]/30"
              style={{ padding: '24px' }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--accent)] text-white flex items-center justify-center shadow-lg shadow-[var(--accent)]/20">
                  <FileText size={22} />
                </div>
                <div>
                  <h5 className="font-black text-[var(--text-primary)] leading-tight text-lg">
                    {editingDoc ? 'Edit Document' : 'New Document'}
                  </h5>
                  <p className="text-xs text-[var(--text-tertiary)] font-medium" style={{ marginTop: '2px' }}>
                    {editingDoc ? 'Update document information and images' : 'Upload a new identification or record'}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => { setIsAdding(false); setEditingDoc(null); }}
                className="p-0 rounded-xl hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] transition-colors"
                style={{ height: '40px', width: '40px' }}
              >
                <X size={20} />
              </Button>
            </div>
            
            <div style={{ padding: '32px' }}>
              <DocumentForm 
                initialData={editingDoc || undefined} 
                onSave={handleSaveDocument}
                onCancel={() => { setIsAdding(false); setEditingDoc(null); }}
              />
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4" style={{marginBottom:"10px"}}>
            <div className="relative group flex-1">
              <Search 
                className="absolute top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] group-focus-within:text-[var(--accent)] transition-colors" 
                size={18} 
                style={{ left: '16px' }}
              />
              <Input 
                placeholder="Search documents by name..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[var(--bg-surface)] border-[var(--border-strong)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10 rounded-2xl text-base transition-all shadow-sm"
                style={{ height: '56px', paddingLeft: '48px' }}
              />
            </div>
          </div>

          <DocumentList 
            documents={filteredDocuments} 
            onEdit={setEditingDoc}
            onDelete={handleDeleteDocument}
          />
        </div>
      )}
    </div>
  )
}
