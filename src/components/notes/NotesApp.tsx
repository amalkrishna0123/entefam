"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import NoteList from "./NoteList"
import NoteForm from "./NoteForm"
import { Note, useNotesStore } from "@/store/notes-store"

export default function NotesApp() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const setNotes = useNotesStore(state => state.setNotes)

  useEffect(() => {
    setIsMounted(true)
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setNotes(data)
      })
      .catch(err => console.error("Failed to fetch notes:", err))
  }, [setNotes])

  const handleOpenForm = (note?: Note) => {
    setEditingNote(note || null)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setTimeout(() => setEditingNote(null), 300) // Clear after animation
  }

  if (!isMounted) return null // Or a loading skeleton

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#000000', letterSpacing: '-0.03em', margin: '0' }}>Notes</h1>
          <p className="hidden md:block" style={{ color: '#666666', marginTop: '8px', fontSize: '1.125rem' }}>Capture your thoughts, ideas, and tasks.</p>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button onClick={() => handleOpenForm()} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#000000', color: '#ffffff', border: 'none', padding: '12px 24px', borderRadius: '999px', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)', transition: 'box-shadow 0.2s' }} onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.1)'} onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'}>
            <Plus size={20} />
            <span className="hidden sm:inline text-white" style={{color:"white"}}>Add Note</span>
          </button>
        </motion.div>
      </div>

      <div style={{ position: 'relative', minHeight: '500px' }}>
        <NoteList onEdit={handleOpenForm} />
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', padding: '24px' }}>
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px' }}
            >
              <NoteForm initialData={editingNote} onClose={handleCloseForm} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
