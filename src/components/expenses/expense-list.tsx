"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"

interface Expense {
  id: string
  amount: string
  description: string
  category: string
  date: string
  createdAt: string
}

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editExpense, setEditExpense] = useState<Expense | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/expenses")
      const data = await res.json()
      setExpenses(data)
    } catch (error) {
      console.error("Failed to fetch expenses:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/expenses/${deleteId}`, { method: "DELETE" })
      if (res.ok) {
        setExpenses(expenses.filter((e) => e.id !== deleteId))
        setDeleteId(null)
      }
    } catch (error) {
      console.error("Failed to delete expense:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editExpense) return
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/expenses/${editExpense.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: editExpense.amount,
          description: editExpense.description,
          category: editExpense.category,
          date: editExpense.date,
        }),
      })
      if (res.ok) {
        setExpenses(expenses.map((e) => (e.id === editExpense.id ? editExpense : e)))
        setEditExpense(null)
      }
    } catch (error) {
      console.error("Failed to update expense:", error)
    } finally {
      setIsUpdating(false)
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

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 bg-[var(--bg-elevated)] rounded-2xl border border-dashed border-[var(--border)]" style={{padding:"30px 20px"}}>
        <p className="text-[var(--text-tertiary)]">No expenses found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <Card key={expense.id} className="p-4 hover:border-[var(--border-accent)] transition-colors group" style={{padding:"20px",marginBottom:"10px"}}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-muted)] flex items-center justify-center text-[var(--accent)] shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 6v12M9 9.5c0-1 1.343-2 3-2s3 1 3 2-1.343 2-3 2-3 1-3 2 1.343 2 3 2 3-1 3-2" />
                </svg>
              </div>
              <div className="min-w-0">
                <h4 className="font-medium text-[var(--text-primary)] truncate">{expense.description}</h4>
                <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] mt-0.5">
                  <span className="px-1.5 py-0.5 bg-[var(--bg-subtle)] rounded text-[var(--text-secondary)]">
                    {expense.category}
                  </span>
                  <span>•</span>
                  <span>{new Date(expense.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className="font-semibold text-[var(--text-primary)]">
                  {formatCurrency(parseFloat(expense.amount))}
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  style={{ width: "32px", padding: 0 }}
                  onClick={() => setEditExpense(expense)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                  </svg>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  style={{ width: "32px", padding: 0, color: "var(--danger)" }}
                  onClick={() => setDeleteId(expense.id)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}

      {/* Edit Modal */}
      <Modal 
        isOpen={!!editExpense} 
        onClose={() => setEditExpense(null)} 
        title="Edit Expense"
      >
        {editExpense && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount</Label>
              <Input 
                id="edit-amount" 
                type="number" 
                step="0.01" 
                value={editExpense.amount}
                onChange={(e) => setEditExpense({...editExpense, amount: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input 
                id="edit-description" 
                value={editExpense.description}
                onChange={(e) => setEditExpense({...editExpense, description: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select 
                id="edit-category" 
                value={editExpense.category}
                onChange={(e) => setEditExpense({...editExpense, category: e.target.value})}
              >
                <option>Food</option>
                <option>Transport</option>
                <option>Rent</option>
                <option>Utilities</option>
                <option>Entertainment</option>
                <option>Other</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input 
                id="edit-date" 
                type="date" 
                value={editExpense.date}
                onChange={(e) => setEditExpense({...editExpense, date: e.target.value})}
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" type="button" onClick={() => setEditExpense(null)}>
                Cancel
              </Button>
              <Button type="submit" loading={isUpdating}>
                Update Expense
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Expense"
        description="Are you sure you want to delete this expense? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
