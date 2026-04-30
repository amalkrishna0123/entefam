"use client"
import { useNotesStore } from "@/store/notes-store"
import NoteCard from "./NoteCard"
import { AnimatePresence, motion } from "framer-motion"
import { NotebookPen, Sparkles } from "lucide-react"

interface NoteListProps {
  onEdit: (note: any) => void
}

export default function NoteList({ onEdit }: NoteListProps) {
  const notes = useNotesStore((state) => state.notes)

  if (notes.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center', backgroundColor: '#fafafa', border: '2px dashed #e5e5e5', borderRadius: '24px' }}>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '50%', marginBottom: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', display: 'inline-flex' }}
        >
          <NotebookPen size={48} color="#000000" />
        </motion.div>
        <motion.h3 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111111', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          No notes yet <Sparkles size={20} color="#000000" />
        </motion.h3>
        <motion.p 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          style={{ color: '#666666', maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}
        >
          Create your first note to start organizing your thoughts, lists, and important information.
        </motion.p>
      </div>
    )
  }

  return (
    <motion.div 
      layout 
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}
    >
      <AnimatePresence>
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onEdit={onEdit} />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
