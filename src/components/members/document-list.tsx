"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit3, Eye, FileText, ChevronRight, Plus, X } from "lucide-react"
import { Modal } from "@/components/ui/modal"

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

interface DocumentListProps {
  documents: MemberDocument[]
  onEdit: (doc: MemberDocument) => void
  onDelete: (id: string) => void
}

export default function DocumentList({ documents, onEdit, onDelete }: DocumentListProps) {
  const [previewDoc, setPreviewDoc] = useState<MemberDocument | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft
    const width = e.currentTarget.clientWidth
    const newIndex = Math.round(scrollLeft / width)
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex)
    }
  }

  if (documents.length === 0) {
    return (
      <div 
        className="flex flex-col items-center justify-center bg-[var(--bg-surface)] rounded-[2.5rem] border-2 border-dashed border-[var(--border-strong)] text-center animate-fade-in"
        style={{ paddingTop: '96px', paddingBottom: '96px', paddingLeft: '24px', paddingRight: '24px' }}
      >
        <div 
          className="w-24 h-24 rounded-3xl bg-[var(--bg-subtle)] flex items-center justify-center shadow-inner"
          style={{ marginBottom: '24px' }}
        >
          <FileText size={40} className="text-[var(--text-tertiary)] opacity-20" />
        </div>
        <h5 className="text-xl font-bold text-[var(--text-primary)]" style={{ marginBottom: '8px' }}>No documents found</h5>
        <p className="text-[var(--text-tertiary)] max-w-xs mx-auto text-sm leading-relaxed">
          It looks like you haven't uploaded any documents for this member yet. Start by adding an ID card or bank record.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((doc) => (
        <Card 
          key={doc.id} 
          className="group relative flex flex-col bg-[var(--bg-surface)] border-[var(--border-strong)] hover:border-[var(--accent)] hover:shadow-2xl hover:shadow-[var(--accent)]/5 transition-all duration-500 rounded-[2rem] overflow-hidden"
        >
          {/* Card Header/Icon Area */}
          <div style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '24px' }}>
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--accent)] border border-[var(--border-strong)] shadow-sm group-hover:scale-110 group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-500">
                <FileText size={24} />
              </div>
              
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-0 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--accent)] transition-all"
                  onClick={() => onEdit(doc)}
                  style={{ height: '36px', width: '36px' }}
                >
                  <Edit3 size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-0 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] transition-all"
                  onClick={() => onDelete(doc.id)}
                  style={{ height: '36px', width: '36px' }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <h5 
                className="font-bold text-[var(--text-primary)] text-lg leading-tight group-hover:text-[var(--accent)] transition-colors"
                style={{ marginBottom: '4px' }}
              >
                {doc.name}
              </h5>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className="uppercase tracking-wider font-bold bg-[var(--bg-subtle)] border-[var(--border-strong)]"
                  style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '2px', paddingBottom: '2px', fontSize: '9px' }}
                >
                  {doc.images.length} {doc.images.length === 1 ? 'Page' : 'Pages'}
                </Badge>
                {doc.updatedAt && (
                  <span className="text-[10px] text-[var(--text-tertiary)] font-medium">
                    {new Date(doc.updatedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Image Preview Strip */}
          <div style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '24px', marginTop: '24px' }}>
            <div 
              className="flex gap-2 overflow-x-auto custom-scrollbar"
              style={{ paddingBottom: '8px' }}
            >
              {doc.images.map((img, idx) => (
                <div 
                  key={idx} 
                  className="relative shrink-0 cursor-pointer group/img"
                  onClick={() => { setPreviewDoc(doc); setActiveIndex(idx); }}
                >
                  <div className="w-16 h-16 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-strong)] overflow-hidden shadow-sm">
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity rounded-xl">
                    <Eye size={16} className="text-white" />
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => onEdit(doc)}
                className="w-16 h-16 rounded-xl border-2 border-dashed border-[var(--border-strong)] flex flex-col items-center justify-center text-[var(--text-tertiary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all group/add"
              >
                <Plus size={16} className="group-hover/add:scale-110 transition-transform" />
                <span className="text-[8px] font-bold uppercase" style={{ marginTop: '4px' }}>Add</span>
              </button>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--accent)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        </Card>
      ))}

      <Modal 
        isOpen={!!previewDoc} 
        onClose={() => setPreviewDoc(null)} 
        className="fixed top-0 bottom-0 left-0 right-0 inset-0 z-[999] p-0 m-0 w-full h-full max-w-none bg-black border-none shadow-none rounded-none overflow-hidden"
      >
        {previewDoc && (
          <div className="relative w-full h-full flex flex-col bg-black animate-zoom-in">
            {/* Close Button */}
            <button 
              onClick={() => setPreviewDoc(null)}
              className="absolute z-[1001] w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all"
              style={{ top: '24px', right: '24px' }}
            >
              <X size={24} />
            </button>

            {/* Main Slider Container */}
            <div 
              className="flex-1 w-full h-full overflow-x-auto snap-x snap-mandatory flex no-scrollbar"
              onScroll={handleScroll}
              style={{ scrollBehavior: 'smooth' }}
            >
              {previewDoc.images.map((img, idx) => (
                <div 
                  key={idx} 
                  className="w-full h-full shrink-0 snap-center flex items-center justify-center"
                  style={{ padding: '20px' }}
                >
                  <img 
                    src={img.url} 
                    alt={img.label} 
                    className="max-w-full w-full max-h-[100svh] h-[95svh] object-contain shadow-2xl transition-all duration-500"
                  />
                </div>
              ))}
            </div>

            {/* Bottom Controls / Indicators */}
            <div 
              className="absolute bottom-10 left-0 right-0 z-[1001] flex flex-col items-center gap-4 pointer-events-none"
            >
              {previewDoc.images.length > 1 && (
                <div className="flex gap-2 pointer-events-auto">
                  {previewDoc.images.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-8 bg-white' : 'w-4 bg-white/20'}`}
                    />
                  ))}
                </div>
              )}
              <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">
                  {previewDoc.images[activeIndex]?.label || `Page ${activeIndex + 1}`}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
