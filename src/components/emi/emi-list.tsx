"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"
import { formatDate } from "@/lib/date-utils"
import { addMonths, differenceInDays, isPast, isToday, parseISO, format, isValid, setDate } from "date-fns"
import "./emi-list.css"

interface EMI {
  id: string
  emiName: string
  amount: string
  dueDate: string
  financeProvider?: string
  tenure?: string
  paidInstallments?: number
  status?: "Active" | "Closed"
}

export default function EmiList() {
  const [emis, setEmis] = useState<EMI[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editEmi, setEditEmi] = useState<EMI | null>(null)
  const [viewEmi, setViewEmi] = useState<EMI | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isPaying, setIsPaying] = useState<string | null>(null)

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

  const handlePayInstallment = async (emi: EMI) => {
    setIsPaying(emi.id)
    try {
      const currentPaid = emi.paidInstallments || 0
      const totalTenure = parseInt(emi.tenure || "12")
      const nextPaid = currentPaid + 1
      
      const currentDueDate = getNormalizedDate(emi.dueDate)
      const nextDueDate = addMonths(currentDueDate, 1)
      
      const payload: Partial<EMI> = {
        paidInstallments: nextPaid,
        dueDate: nextDueDate.toISOString(),
      }

      if (nextPaid >= totalTenure) {
        payload.status = "Closed"
      }

      const res = await fetch(`/api/emi/${emi.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const updatedEmi = { ...emi, ...payload };
        setEmis(emis.map((e) => (e.id === emi.id ? updatedEmi : e)))
        if (viewEmi?.id === emi.id) {
          setViewEmi(updatedEmi)
        }
      }
    } catch (error) {
      console.error("Failed to pay installment:", error)
    } finally {
      setIsPaying(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/emi/${deleteId}`, { method: "DELETE" })
      if (res.ok) {
        setEmis(emis.filter((e) => e.id !== deleteId))
        setDeleteId(null)
        setViewEmi(null)
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
          tenure: editEmi.tenure,
          paidInstallments: editEmi.paidInstallments,
          status: editEmi.status,
        }),
      })
      if (res.ok) {
        setEmis(emis.map((e) => (e.id === editEmi.id ? editEmi : e)))
        if (viewEmi?.id === editEmi.id) {
          setViewEmi(editEmi)
        }
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
    
    if (/^\d+$/.test(dateStr)) {
      const day = parseInt(dateStr);
      return setDate(new Date(), day);
    }
    
    const parsed = parseISO(dateStr);
    if (isValid(parsed)) return parsed;
    
    return new Date();
  }

  const getStatus = (dueDateStr: string, emiStatus?: string) => {
    if (emiStatus === "Closed") return { label: "Closed", type: "closed", date: new Date() };
    
    try {
      const dueDate = getNormalizedDate(dueDateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const diff = differenceInDays(dueDate, today);

      if (isToday(dueDate)) return { label: "Due Today", type: "today", date: dueDate };
      if (isPast(dueDate) && !isToday(dueDate)) return { label: "Overdue", type: "overdue", date: dueDate };
      if (diff >= 0 && diff <= 7) return { label: `Due in ${diff} days`, type: "pending", date: dueDate };
      if (diff > 7) return { label: `In ${diff} days`, type: "future", date: dueDate };
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
    <div className="emi-list-container">
      {emis.map((emi) => {
        const isClosed = emi.status === "Closed";

        return (
          <div 
            key={emi.id} 
            className={`emi-item-card ${isClosed ? 'opacity-70 grayscale-[0.3]' : ''}`}
            onClick={() => setViewEmi(emi)}
          >
            <div className="emi-item-info">
              <div className="emi-item-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 8h20M2 16h20M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                </svg>
              </div>
              <div className="emi-item-text">
                <h4 className="emi-item-name">{emi.emiName}</h4>
                {emi.financeProvider && <span className="emi-item-provider">{emi.financeProvider}</span>}
              </div>
            </div>
            <div className="emi-item-amount">
              {formatCurrency(parseFloat(emi.amount))}
            </div>
          </div>
        );
      })}

      {/* Details Modal */}
      <Modal 
        isOpen={!!viewEmi} 
        onClose={() => setViewEmi(null)} 
        title={viewEmi?.emiName || "EMI Details"}
        className="max-w-xl"
      >
        {viewEmi && (
          <div className="emi-detail-view">
            {(() => {
              const status = getStatus(viewEmi.dueDate, viewEmi.status);
              const tenure = parseInt(viewEmi.tenure || "12");
              const paid = viewEmi.paidInstallments || 0;
              const remaining = tenure - paid;
              const isClosed = viewEmi.status === "Closed";
              const progress = Math.min(100, Math.round((paid / tenure) * 100));

              let statusClass = "status-active";
              if (isClosed) statusClass = "status-closed";
              else if (status.type === "overdue" || status.type === "today") statusClass = "status-overdue";
              else if (status.type === "pending") statusClass = "status-warning";

              return (
                <>
                  <div className="emi-detail-header">
                    <div className="emi-detail-amount">{formatCurrency(parseFloat(viewEmi.amount))}</div>
                    <div className={`emi-detail-status ${statusClass}`}>
                      {status.label}
                    </div>
                  </div>

                  <div className="emi-detail-grid">
                    <div className="emi-detail-item">
                      <span className="emi-detail-label">Provider</span>
                      <span className="emi-detail-value">{viewEmi.financeProvider || "Not Specified"}</span>
                    </div>
                    <div className="emi-detail-item">
                      <span className="emi-detail-label">Next Due Date</span>
                      <span className="emi-detail-value">{formatDate(status.date)}</span>
                    </div>
                    <div className="emi-detail-item">
                      <span className="emi-detail-label">Monthly Amount</span>
                      <span className="emi-detail-value">{formatCurrency(parseFloat(viewEmi.amount))}</span>
                    </div>
                    <div className="emi-detail-item">
                      <span className="emi-detail-label">Total Tenure</span>
                      <span className="emi-detail-value">{tenure} Months</span>
                    </div>
                  </div>

                  <div className="emi-progress-section">
                    <div className="emi-progress-header">
                      <span className="emi-progress-title">Repayment Progress</span>
                      <span className="emi-progress-percentage">{progress}%</span>
                    </div>
                    <div className="emi-progress-bar-bg">
                      <div className="emi-progress-bar-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="emi-progress-stats">
                      <span>{paid} / {tenure} Paid</span>
                      {!isClosed && remaining > 0 && (
                        <span className="emi-progress-pending">
                          {remaining} Left (₹{(parseFloat(viewEmi.amount) * remaining).toLocaleString("en-IN")})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="emi-actions-container">
                    <div className="emi-primary-actions">
                      {!isClosed && (
                        <button 
                          className="emi-btn emi-btn-pay" 
                          onClick={() => handlePayInstallment(viewEmi)}
                          disabled={isPaying === viewEmi.id}
                        >
                          {isPaying === viewEmi.id ? (
                            <span className="animate-pulse">Processing...</span>
                          ) : (
                            <>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              Mark Installment as Paid
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    <div className="emi-secondary-actions">
                      <button 
                        className="emi-btn emi-btn-edit" 
                        onClick={() => {
                          setEditEmi(viewEmi);
                          setViewEmi(null);
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                        </svg>
                        Edit Details
                      </button>
                      <button 
                        className="emi-btn emi-btn-delete" 
                        onClick={() => setDeleteId(viewEmi.id)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </Modal>

      {/* Edit Form Modal */}
      <Modal isOpen={!!editEmi} onClose={() => setEditEmi(null)} title="Edit EMI">
        {editEmi && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">EMI Name</Label>
              <Input id="edit-name" value={editEmi.emiName} onChange={(e) => setEditEmi({...editEmi, emiName: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-amount">Monthly Amount</Label>
                <Input id="edit-amount" type="number" step="0.01" value={editEmi.amount} onChange={(e) => setEditEmi({...editEmi, amount: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tenure">Tenure (Months)</Label>
                <Input id="edit-tenure" type="number" value={editEmi.tenure || ""} onChange={(e) => setEditEmi({...editEmi, tenure: e.target.value})} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-due">EMI Date</Label>
                <Input 
                  id="edit-due" 
                  type="date" 
                  value={/^\d+$/.test(editEmi.dueDate) ? "" : editEmi.dueDate.split('T')[0]} 
                  onChange={(e) => setEditEmi({...editEmi, dueDate: e.target.value})} 
                  required 
                  className="block w-full rounded-xl border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2.5 text-[var(--text-primary)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-paid">Paid Installments</Label>
                <Input id="edit-paid" type="number" value={editEmi.paidInstallments || 0} onChange={(e) => setEditEmi({...editEmi, paidInstallments: parseInt(e.target.value) || 0})} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <select 
                  id="edit-status" 
                  value={editEmi.status || "Active"} 
                  onChange={(e) => setEditEmi({...editEmi, status: e.target.value as any})}
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
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
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
