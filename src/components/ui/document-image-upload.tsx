"use client"

import { useState, useRef } from "react"
import { Camera, Trash2, Loader2, Upload, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DocumentImageUploadProps {
  url?: string | null
  label?: string
  onChange: (data: { url: string | null; label: string }) => void
  onDelete?: () => void
  userId?: string
}

export function DocumentImageUpload({ url, label = "", onChange, onDelete, userId }: DocumentImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 800 * 1024) {
      alert("Maximum size allowed is 800KB")
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId || 'anonymous')
    formData.append('folder', 'documents')

    try {
      const res = await fetch('/api/profile/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.url) {
        onChange({ url: data.url, label })
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div 
      className="flex flex-col group"
      style={{ gap: '16px' }}
    >
      <div 
        className="flex items-start"
        style={{ gap: '20px' }}
      >
        <div 
          className="relative cursor-pointer shrink-0"
          onClick={() => fileInputRef.current?.click()}
        >
          <div 
            className="rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--border-strong)] shadow-sm flex items-center justify-center overflow-hidden relative group/img-box hover:border-[var(--accent)]/50 transition-all duration-300"
            style={{ width: '80px', height: '80px' }}
          >
            {url ? (
              <img src={url} alt="Document" className="w-full h-full object-cover group-hover/img-box:scale-110 transition-transform duration-500" />
            ) : (
              <div className="flex flex-col items-center gap-1 opacity-20">
                <Camera size={24} />
                <span className="text-[8px] font-black uppercase tracking-tighter">Upload</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover/img-box:opacity-100 transition-opacity duration-300">
              <Camera size={18} style={{ marginBottom: '4px' }} />
              <span className="text-[8px] text-white font-bold uppercase tracking-widest">Change</span>
            </div>
            
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                <Loader2 className="text-white animate-spin" size={20} />
              </div>
            )}
          </div>
        </div>

        <div 
          className="flex-1 min-w-0"
          style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <div className="relative">
            <Label 
              className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest block"
              style={{ marginLeft: '4px', marginBottom: '6px' }}
            >
              Page Label
            </Label>
            <div className="relative group/input">
              <Type className="absolute top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] group-focus-within/input:text-[var(--accent)] transition-colors" size={14} style={{ left: '14px' }} />
              <Input 
                placeholder="e.g. Front View, Back View" 
                value={label} 
                onChange={(e) => onChange({ url: url || null, label: e.target.value })}
                className="bg-[var(--bg-surface)] border-[var(--border-strong)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/5 rounded-xl text-xs font-medium transition-all"
                style={{ height: '40px', paddingLeft: '40px' }}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="button"
              variant="outline" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="rounded-xl border-[var(--border-strong)] text-[11px] font-bold bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] hover:border-[var(--accent)] transition-all"
              style={{ height: '36px', paddingLeft: '16px', paddingRight: '16px' }}
            >
              {isUploading ? <Loader2 className="animate-spin mr-2" size={12} /> : <Upload className="mr-2" size={12} />}
              {url ? 'Replace' : 'Choose'}
            </Button>
            
            {url && (
              <Button 
                type="button"
                variant="ghost" 
                size="sm" 
                onClick={onDelete}
                className="p-0 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] transition-all"
                style={{ height: '36px', width: '36px' }}
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  )
}
