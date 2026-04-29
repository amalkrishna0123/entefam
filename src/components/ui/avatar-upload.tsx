"use client"

import { useState, useRef } from "react"
import { Camera, Trash2, Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AvatarUploadProps {
  value?: string | null
  onChange: (url: string | null) => void
  onDelete?: () => void
  userId?: string
  folder?: string
}

export function AvatarUpload({ value, onChange, onDelete, userId, folder = 'avatars' }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 800K)
    if (file.size > 800 * 1024) {
      alert("Maximum size allowed is 800KB")
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId || 'anonymous')
    formData.append('folder', folder)

    try {
      const res = await fetch('/api/profile/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.url) {
        onChange(data.url)
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
    <div className="flex items-center gap-6">
      <div 
        className="relative group cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-20 h-20 rounded-2xl bg-[var(--bg-subtle)] border-2 border-[var(--border-strong)] shadow-sm flex items-center justify-center text-2xl font-bold text-[var(--text-primary)] overflow-hidden relative">
          {value ? (
            <img src={value} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <Camera className="opacity-20" size={32} />
          )}
          
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Camera className="text-white" size={20} />
          </div>
          
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Loader2 className="text-white animate-spin" size={20} />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Button 
            type="button"
            variant="outline" 
            size="sm" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="h-8 px-3 rounded-lg border-[var(--border-strong)] text-[12px]"
          >
            {isUploading ? <Loader2 className="animate-spin mr-2" size={12} /> : <Upload className="mr-2" size={12} />}
            {value ? 'Change' : 'Upload'}
          </Button>
          
          {value && (
            <Button 
              type="button"
              variant="ghost" 
              size="sm" 
              onClick={() => {
                if (onDelete) onDelete();
                else onChange(null);
              }}
              className="h-8 w-8 p-0 rounded-lg text-red-500 hover:bg-red-50"
            >
              <Trash2 size={14} />
            </Button>
          )}
        </div>
        <p className="text-[10px] text-[var(--text-tertiary)] font-medium">
          JPG, PNG. Max 800K
        </p>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
    </div>
  )
}
