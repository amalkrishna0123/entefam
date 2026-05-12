"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { DocumentImageUpload } from "@/components/ui/document-image-upload"
import { Plus, Trash2, Save, X } from "lucide-react"

interface DocumentImage {
  url: string
  label: string
}

interface MemberDocument {
  id: string
  name: string
  images: DocumentImage[]
}

interface DocumentFormProps {
  initialData?: MemberDocument
  onSave: (data: Omit<MemberDocument, "id"> & { id?: string }) => void
  onCancel: () => void
}

const COMMON_DOCS = [
  "Aadhaar Card",
  "PAN Card",
  "Passport",
  "Bank Account 1",
  "Bank Account 2",
  "Ration Card",
  "Voter ID",
  "Driving License",
  "Insurance Documents",
  "Custom"
]

export default function DocumentForm({ initialData, onSave, onCancel }: DocumentFormProps) {
  const [name, setName] = useState(initialData?.name || COMMON_DOCS[0])
  const [customName, setCustomName] = useState(initialData?.name && !COMMON_DOCS.includes(initialData.name) ? initialData.name : "")
  const [images, setImages] = useState<DocumentImage[]>(initialData?.images || [{ url: "", label: "" }])

  const handleAddImage = () => {
    setImages([...images, { url: "", label: "" }])
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleImageChange = (index: number, data: { url: string | null; label: string }) => {
    const newImages = [...images]
    newImages[index] = { url: data.url || "", label: data.label }
    setImages(newImages)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const documentName = name === "Custom" ? customName : name
    if (!documentName) {
      alert("Please provide a document name")
      return
    }
    
    // Filter out empty images
    const validImages = images.filter(img => img.url)
    if (validImages.length === 0) {
      alert("Please upload at least one image")
      return
    }

    onSave({
      id: initialData?.id,
      name: documentName,
      images: validImages
    })
  }
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Label 
            className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2"
            style={{ marginLeft: '4px' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            Document Type
          </Label>
          <Select 
            value={COMMON_DOCS.includes(name) ? name : "Custom"} 
            onChange={(e) => setName(e.target.value)}
            className="bg-[var(--bg-subtle)]/50 border-[var(--border-strong)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10 rounded-xl transition-all"
            style={{ height: '48px' }}
          >
            {COMMON_DOCS.map(doc => (
              <option key={doc} value={doc}>{doc}</option>
            ))}
          </Select>
        </div>

        {(name === "Custom" || !COMMON_DOCS.includes(name)) && (
          <div className="animate-fade-down" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Label 
              className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2"
              style={{ marginLeft: '4px' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              Custom Name
            </Label>
            <Input 
              placeholder="e.g. Birth Certificate" 
              value={customName} 
              onChange={(e) => setCustomName(e.target.value)}
              className="bg-[var(--bg-subtle)]/50 border-[var(--border-strong)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10 rounded-xl transition-all"
              style={{ height: '48px' }}
            />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="flex items-center justify-between" style={{ marginLeft: '4px' }}>
          <Label className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            Document Pages
          </Label>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={handleAddImage}
            className="text-xs font-bold text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded-xl transition-all"
            style={{ height: '36px', paddingLeft: '12px', paddingRight: '12px' }}
          >
            <Plus size={14} style={{ marginRight: '6px' }} /> Add New Page
          </Button>
        </div>

        <div 
          className="grid grid-cols-1 gap-4 max-h-[450px] overflow-y-auto custom-scrollbar"
          style={{ padding: '4px', paddingRight: '8px' }}
        >
          {images.map((img, index) => (
            <div key={index} className="relative group/field animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
              <div 
                className="bg-[var(--bg-subtle)]/30 border border-[var(--border-strong)] rounded-2xl transition-all hover:bg-[var(--bg-subtle)]/50 hover:border-[var(--accent)]/30"
                style={{ padding: '16px' }}
              >
                <DocumentImageUpload 
                  url={img.url}
                  label={img.label}
                  onChange={(data) => handleImageChange(index, data)}
                  onDelete={() => handleRemoveImage(index)}
                />
              </div>
              
              {images.length > 1 && (
                <button 
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border border-[var(--border-strong)] text-[var(--danger)] flex items-center justify-center shadow-lg hover:bg-[var(--danger)] hover:text-white hover:scale-110 transition-all z-10 opacity-0 group-hover/field:opacity-100"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div 
        className="flex gap-4 border-t border-[var(--border-strong)]"
        style={{ paddingTop: '24px' }}
      >
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onCancel} 
          className="flex-1 rounded-xl font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
          style={{ height: '48px' }}
        >
          Discard
        </Button>
        <Button 
          type="submit" 
          className="flex-1 rounded-xl font-black bg-[var(--accent)] text-white shadow-xl shadow-[var(--accent)]/20 hover:bg-[var(--accent)]/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
          style={{ height: '48px' }}
        >
          <Save size={18} style={{ marginRight: '8px' }} /> 
          {initialData ? 'Update' : 'Save'}
        </Button>
      </div>
    </form>
  )
}
