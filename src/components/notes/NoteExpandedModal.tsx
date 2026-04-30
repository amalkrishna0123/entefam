"use client"
import { useState, useEffect } from "react"
import { Note, NoteListItem, useNotesStore } from "@/store/notes-store"
import { useExpenseStore } from "@/store/expense-store"
import { X, ShoppingCart, CheckCircle2, Circle, AlertCircle } from "lucide-react"

interface NoteExpandedModalProps {
  note: Note
  onClose: () => void
}

import { createPortal } from "react-dom"

export default function NoteExpandedModal({ note, onClose }: NoteExpandedModalProps) {
  const updateNote = useNotesStore((state) => state.updateNote)
  const addExpense = useExpenseStore((state) => state.addExpense)
  const [localItems, setLocalItems] = useState<NoteListItem[]>(note.listItems || [])
  const [mounted, setMounted] = useState(false)

  // Handle mounting and body scroll locking
  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Update store when localItems change to persist immediately (optional)
  useEffect(() => {
    updateNote(note.id, { listItems: localItems })
  }, [localItems, note.id, updateNote])

  const handleTogglePurchased = (id: string) => {
    setLocalItems(prev => prev.map(item => 
      item.id === id ? { ...item, isPurchased: !item.isPurchased, reason: undefined } : item
    ))
    if (note.expenseAdded) updateNote(note.id, { expenseAdded: false })
  }

  const handlePriceChange = (id: string, price: number) => {
    setLocalItems(prev => prev.map(item => 
      item.id === id ? { ...item, price } : item
    ))
    if (note.expenseAdded) updateNote(note.id, { expenseAdded: false })
  }

  const handleReasonChange = (id: string, reason: string) => {
    setLocalItems(prev => prev.map(item => 
      item.id === id ? { ...item, reason, isPurchased: false } : item
    ))
    if (note.expenseAdded) updateNote(note.id, { expenseAdded: false })
  }

  const isShoppingList = note.listType === 'shopping'
  const isReminderList = note.listType === 'reminder'

  const totalCost = localItems.reduce((sum, item) => sum + (item.isPurchased && item.price ? item.price : 0), 0)
  
  // Check if all items are processed (either purchased or has a reason)
  const allProcessed = localItems.length > 0 && localItems.every(item => item.isPurchased || item.reason)

  const [isAddingExpense, setIsAddingExpense] = useState(false)

  const handleAddExpense = async () => {
    if (note.expenseAdded || isAddingExpense) return;
    
    setIsAddingExpense(true)
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalCost.toString(),
          description: `Shopping: ${note.title}`,
          category: 'Shopping',
          date: new Date().toISOString().split('T')[0],
        })
      });

      if (res.ok) {
        updateNote(note.id, { expenseAdded: true })
        onClose()
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setIsAddingExpense(false)
    }
  }

  if (!mounted) return null;

  const modalContent = (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={(e) => { e.stopPropagation(); if(e.target === e.currentTarget) onClose(); }}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e5e5e5' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111111', margin: '0' }}>{note.title}</h2>
            {isShoppingList && <span style={{ fontSize: '0.875rem', color: '#666666', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><ShoppingCart size={14} /> Shopping List</span>}
          </div>
          <button onClick={onClose} style={{ padding: '8px', borderRadius: '50%', border: 'none', backgroundColor: '#f5f5f5', color: '#666666', cursor: 'pointer', transition: 'all 0.2s' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {note.format === 'paragraph' ? (
            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#333333', margin: 0 }}>{note.content}</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {localItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', backgroundColor: item.isPurchased ? '#f8fafc' : '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', transition: 'all 0.2s' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    {(isShoppingList || isReminderList) && (
                      <button 
                         onClick={() => handleTogglePurchased(item.id)}
                         style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginTop: '2px', color: item.isPurchased ? '#10b981' : '#cbd5e1' }}
                      >
                        {item.isPurchased ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                      </button>
                    )}
                    <span style={{ flex: 1, fontSize: '1rem', color: item.isPurchased ? '#64748b' : '#0f172a', textDecoration: item.isPurchased ? 'line-through' : 'none', fontWeight: '500', lineHeight: '1.4' }}>
                      {item.text}
                    </span>
                  </div>

                  {isShoppingList && !item.isPurchased && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '36px', marginTop: '4px' }}>
                      <AlertCircle size={14} color="#64748b" />
                      <select 
                        value={item.reason || ""} 
                        onChange={(e) => handleReasonChange(item.id, e.target.value)}
                        style={{ fontSize: '0.875rem', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#475569', outline: 'none' }}
                      >
                        <option value="">Select reason if skipped...</option>
                        <option value="Unavailable">Unavailable</option>
                        <option value="Too Expensive">Too Expensive</option>
                        <option value="Postponed">Postponed</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  )}

                  {isShoppingList && item.isPurchased && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '36px', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>Price: ₹</span>
                      <input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        value={item.price || ""}
                        onChange={(e) => handlePriceChange(item.id, parseFloat(e.target.value))}
                        placeholder="0.00"
                        style={{ width: '100px', fontSize: '0.875rem', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none', color: '#0f172a' }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer for Shopping List */}
        {isShoppingList && (
          <div style={{ padding: '20px 24px', backgroundColor: '#f8fafc', borderTop: '1px solid #e5e5e5', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1rem', fontWeight: '600', color: '#475569' }}>Total Spent:</span>
              <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>₹{totalCost.toFixed(2)}</span>
            </div>
            
            {allProcessed && !note.expenseAdded && (
              <button 
                onClick={handleAddExpense}
                disabled={isAddingExpense}
                style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '1rem', cursor: isAddingExpense ? 'not-allowed' : 'pointer', opacity: isAddingExpense ? 0.7 : 1, transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                {isAddingExpense ? 'Processing...' : 'Add to Expenses'}
              </button>
            )}
            {note.expenseAdded && (
              <div style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={20} /> Added to Expenses
              </div>
            )}
          </div>
        )}


      </div>
    </div>
  )

  return createPortal(modalContent, document.body);
}
