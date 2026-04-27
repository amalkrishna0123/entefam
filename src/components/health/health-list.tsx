"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

interface HealthRecord {
  id: string
  memberId: string
  metric: string
  value: string
  date: string
}

interface Member {
  id: string
  name: string
}

export default function HealthList() {
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editRecord, setEditRecord] = useState<HealthRecord | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchData = async () => {
    try {
      const [recordsRes, membersRes] = await Promise.all([
        fetch("/api/health"),
        fetch("/api/members")
      ])
      const recordsData = await recordsRes.json()
      const membersData = await membersRes.json()
      setRecords(recordsData)
      setMembers(membersData)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/health/${deleteId}`, { method: "DELETE" })
      if (res.ok) {
        setRecords(records.filter((r) => r.id !== deleteId))
        setDeleteId(null)
      }
    } catch (error) {
      console.error("Failed to delete health record:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editRecord) return
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/health/${editRecord.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: editRecord.memberId,
          metric: editRecord.metric,
          value: editRecord.value,
          date: editRecord.date,
        }),
      })
      if (res.ok) {
        setRecords(records.map((r) => (r.id === editRecord.id ? editRecord : r)))
        setEditRecord(null)
      }
    } catch (error) {
      console.error("Failed to update health record:", error)
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

  if (records.length === 0) {
    return (
      <div className="text-center py-12 bg-[var(--bg-elevated)] rounded-2xl border border-dashed border-[var(--border)]" style={{padding:"30px"}}>
        <p className="text-[var(--text-tertiary)]">No health records logged.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <Card key={record.id} className="p-4 hover:border-[var(--border-accent)] transition-colors group" style={{padding:"20px",marginBottom:"10px"}}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-muted)] flex items-center justify-center text-[var(--accent)] shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div className="min-w-0">
                <h4 className="font-medium text-[var(--text-primary)] truncate">{record.metric}</h4>
                <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] mt-0.5">
                  <span className="font-semibold text-[var(--text-secondary)]">
                    {members.find(m => m.id === record.memberId)?.name || 'Unknown Member'}
                  </span>
                  <span>•</span>
                  <span>{new Date(record.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className="font-semibold text-[var(--text-primary)]">
                  {record.value}
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" style={{ width: "32px", padding: 0 }} onClick={() => setEditRecord(record)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                  </svg>
                </Button>
                <Button variant="ghost" size="sm" style={{ width: "32px", padding: 0, color: "var(--danger)" }} onClick={() => setDeleteId(record.id)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}

      <Modal isOpen={!!editRecord} onClose={() => setEditRecord(null)} title="Edit Health Record">
        {editRecord && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-member">Family Member</Label>
              <Select id="edit-member" value={editRecord.memberId} onChange={(e) => setEditRecord({...editRecord, memberId: e.target.value})}>
                <option value="">Select a member</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-metric">Metric Type</Label>
              <Select id="edit-metric" value={editRecord.metric} onChange={(e) => setEditRecord({...editRecord, metric: e.target.value})}>
                <option>Weight</option>
                <option>Height</option>
                <option>BMI</option>
                <option>Blood Pressure</option>
                <option>Heart Rate</option>
                <option>Steps</option>
                <option>Sleep</option>
                <option>Fasting Blood Sugar</option>
                <option>Post-Meal Blood Sugar</option>
                <option>Temperature</option>
                <option>Blood Oxygen</option>
                <option>Other</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-value">Value</Label>
              <Input id="edit-value" value={editRecord.value} onChange={(e) => setEditRecord({...editRecord, value: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input id="edit-date" type="date" value={editRecord.date} onChange={(e) => setEditRecord({...editRecord, date: e.target.value})} required />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" type="button" onClick={() => setEditRecord(null)}>Cancel</Button>
              <Button type="submit" loading={isUpdating}>Update Record</Button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Health Record"
        description="Are you sure you want to delete this health record?"
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
