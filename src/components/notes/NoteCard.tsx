"use client"
import { Note, useNotesStore } from "@/store/notes-store"
import { format } from "date-fns"
import { Edit2, Trash2, AlignLeft, List as ListIcon, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useState } from "react"
import NoteExpandedModal from "./NoteExpandedModal"
import { ShoppingCart, CheckSquare, Maximize2 } from "lucide-react"

interface NoteCardProps {
  note: Note
  onEdit: (note: Note) => void
}

const priorityColors = {
  Low: "bg-[#f5f5f5] text-[#666666] border-[#e0e0e0]",
  Medium: "bg-[#e0e0e0] text-[#333333] border-[#cccccc]",
  High: "bg-[#999999] text-[#ffffff] border-[#888888]",
  Critical: "bg-[#000000] text-[#ffffff] border-[#000000]",
}

export default function NoteCard({ note, onEdit }: NoteCardProps) {
  const deleteNote = useNotesStore((state) => state.deleteNote)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNote(note.id)
    }
  }

  const renderContent = () => {
    if (note.format === 'list') {
      const isSpecialList = note.listType === 'shopping' || note.listType === 'reminder';
      const itemsToDisplay = note.listItems && note.listItems.length > 0 
        ? note.listItems 
        : note.content.split('\n').filter(item => item.trim() !== '').map(text => ({ text, isPurchased: false, id: crypto.randomUUID() }));

      return (
        <ul style={{ paddingLeft: isSpecialList ? '0' : '20px', margin: '0', listStyleType: isSpecialList ? 'none' : 'disc' }} className="space-y-2 text-[#666666] text-sm">
          {itemsToDisplay.map((item, idx) => (
            <li key={item.id || idx} style={{ marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              {isSpecialList && (
                <span style={{ color: item.isPurchased ? '#10b981' : '#cbd5e1', marginTop: '2px' }}>
                  {item.isPurchased ? '✓' : '○'}
                </span>
              )}
              <span style={{ textDecoration: item.isPurchased ? 'line-through' : 'none', color: item.isPurchased ? '#94a3b8' : 'inherit' }}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      )
    }
    return (
      <p className="text-sm whitespace-pre-wrap text-[#666666]" style={{ lineHeight: '1.6' }}>
        {note.content}
      </p>
    )
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
      style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#ffffff', border: '1px solid #e5e5e5', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden', cursor: 'pointer', height: '280px' }}
      className="group transition-all duration-300"
      onClick={() => setIsExpanded(true)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111111', margin: '0', lineHeight: '1.4' }} className="line-clamp-2">
            {note.title}
          </h3>
          {note.listType === 'shopping' && <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontWeight: '500' }}><ShoppingCart size={12} /> Shopping List</span>}
          {note.listType === 'reminder' && <span style={{ fontSize: '0.75rem', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontWeight: '500' }}><CheckSquare size={12} /> Reminder List</span>}
        </div>
        <Badge variant="outline" className={`whitespace-nowrap ${priorityColors[note.priority]}`} style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '500', border: '1px solid', borderColor: 'inherit' }}>
          {note.priority}
        </Badge>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {renderContent()}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'linear-gradient(transparent, #ffffff)' }}></div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888888', fontSize: '0.75rem' }}>
          {note.format === 'list' ? <ListIcon size={14} /> : <AlignLeft size={14} />}
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {format(new Date(note.updatedAt), 'MMM d, yyyy')}</span>
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
            style={{ padding: '6px', borderRadius: '6px', border: 'none', backgroundColor: 'transparent', color: '#666666', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5'; e.currentTarget.style.color = '#111111'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
            title="Expand Note"
          >
            <Maximize2 size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(note); }}
            style={{ padding: '6px', borderRadius: '6px', border: 'none', backgroundColor: 'transparent', color: '#666666', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5'; e.currentTarget.style.color = '#111111'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
            title="Edit Note"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            style={{ padding: '6px', borderRadius: '6px', border: 'none', backgroundColor: 'transparent', color: '#666666', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#e0e0e0'; e.currentTarget.style.color = '#000000'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
            title="Delete Note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <NoteExpandedModal note={note} onClose={() => setIsExpanded(false)} />
      )}
    </motion.div>
  )
}
