"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"
import { differenceInDays, isPast, isToday, parseISO, format, isValid, setDate } from "date-fns"

interface EMI {
  id: string
  emiName: string
  amount: string
  dueDate: string
  financeProvider?: string
}

export default function EmiList() {
  const [emis, setEmis] = useState<EMI[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editEmi, setEditEmi] = useState<EMI | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchEmis = async () => {
    try {
      const res = await fetch("/api/emi")
      const data = await res.json()
      setEmis(data)
    } catch (error) {
      console.error("Failed to fetch EMIs:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmis()
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/emi/${deleteId}`, { method: "DELETE" })
      if (res.ok) {
        setEmis(emis.filter((e) => e.id !== deleteId))
        setDeleteId(null)
      }
    } catch (error) {
      console.error("Failed to delete EMI:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editEmi) return
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/emi/${editEmi.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emiName: editEmi.emiName,
          amount: editEmi.amount,
          dueDate: editEmi.dueDate,
          financeProvider: editEmi.financeProvider,
        }),
      })
      if (res.ok) {
        setEmis(emis.map((e) => (e.id === editEmi.id ? editEmi : e)))
        setEditEmi(null)
      }
    } catch (error) {
      console.error("Failed to update EMI:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getNormalizedDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    
    // Check if it's a simple number (legacy day of month)
    if (/^\d+$/.test(dateStr)) {
      const day = parseInt(dateStr);
      return setDate(new Date(), day);
    }
    
    const parsed = parseISO(dateStr);
    if (isValid(parsed)) return parsed;
    
    return new Date(); // Fallback
  }

  const getStatus = (dueDateStr: string) => {
    try {
      const dueDate = getNormalizedDate(dueDateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const diff = differenceInDays(dueDate, today);

      if (isToday(dueDate)) return { label: "Due Today", type: "today", date: dueDate };
      if (isPast(dueDate) && !isToday(dueDate)) return { label: "Overdue", type: "overdue", date: dueDate };
      if (diff >= 0 && diff <= 3) return { label: `Due in ${diff} days`, type: "approaching", date: dueDate };
      if (diff > 3) return { label: `Due in ${diff} days`, type: "future", date: dueDate };
      return { label: "Overdue", type: "overdue", date: dueDate };
    } catch {
      return { label: "Invalid Date", type: "error", date: new Date() };
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-[var(--bg-elevated)] animate-pulse rounded-xl" />
        ))}
      </div>
    )
  }

  if (emis.length === 0) {
    return (
      <div className="text-center py-12 bg-[var(--bg-elevated)] rounded-2xl border border-dashed border-[var(--border)]" style={{padding:"30px"}}>
        <p className="text-[var(--text-tertiary)]">No EMI alerts set.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {emis.map((emi) => {
        const status = getStatus(emi.dueDate);
        return (
          <Card key={emi.id} style={{marginBottom:"10px"}} className="p-4 hover:border-[var(--border-accent)] transition-colors group">
            <div className="flex items-center justify-between gap-4" style={{padding:"20px"}}>
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-muted)] flex items-center justify-center text-[var(--accent)] shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 8h20M2 16h20M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-[var(--text-primary)] truncate">{emi.emiName}</h4>
                    {status.type === "today" && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[var(--warning-muted)] text-[var(--warning)] border border-[var(--warning)] uppercase tracking-tight">Due Today</span>
                    )}
                    {status.type === "overdue" && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[var(--danger-muted)] text-[var(--danger)] border border-[var(--danger)] uppercase tracking-tight">Overdue</span>
                    )}
                    {status.type === "approaching" && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-600 border border-orange-200 uppercase tracking-tight">Approaching</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] mt-0.5">
                    <span>{status.label} · {format(status.date, 'MMM dd, yyyy')}</span>
                    {emi.financeProvider && (
                      <>
                        <span>·</span>
                        <span className="font-bold text-[var(--accent)]">{emi.financeProvider}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="font-semibold text-[var(--text-primary)]">
                    {formatCurrency(parseFloat(emi.amount))}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" style={{ width: "32px", padding: 0 }} onClick={() => setEditEmi(emi)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                  </Button>
                  <Button variant="ghost" size="sm" style={{ width: "32px", padding: 0, color: "var(--danger)" }} onClick={() => setDeleteId(emi.id)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}

      <Modal isOpen={!!editEmi} onClose={() => setEditEmi(null)} title="Edit EMI">
        {editEmi && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">EMI Name</Label>
              <Input id="edit-name" value={editEmi.emiName} onChange={(e) => setEditEmi({...editEmi, emiName: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Monthly Amount</Label>
              <Input id="edit-amount" type="number" step="0.01" value={editEmi.amount} onChange={(e) => setEditEmi({...editEmi, amount: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-due">EMI Date</Label>
              <Input 
                id="edit-due" 
                type="date" 
                value={/^\d+$/.test(editEmi.dueDate) ? "" : editEmi.dueDate} 
                onChange={(e) => setEditEmi({...editEmi, dueDate: e.target.value})} 
                required 
                className="block w-full rounded-xl border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2.5 text-[var(--text-primary)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-provider">Finance Provider</Label>
              <select 
                id="edit-provider" 
                value={editEmi.financeProvider || "Bajaj Finserv"} 
                onChange={(e) => setEditEmi({...editEmi, financeProvider: e.target.value})}
                style={{
                  display: 'block',
                  width: '100%',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-elevated)',
                  padding: '0.625rem 1rem',
                  color: 'var(--text-primary)',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                }}
              >
                <option>Bajaj Finserv</option>
                <option>HDB Financial Services</option>
                <option>Muthoot Finance</option>
                <option>Manappuram Finance</option>
                <option>Kerala State Financial Enterprises (KSFE)</option>
                <option>Federal Bank</option>
                <option>South Indian Bank</option>
                <option>Kerala Gramin Bank</option>
                <option>Canara Bank</option>
                <option>SBI</option>
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>Other</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" type="button" onClick={() => setEditEmi(null)}>Cancel</Button>
              <Button type="submit" loading={isUpdating}>Update EMI</Button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete EMI"
        description="Are you sure you want to delete this EMI alert?"
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
