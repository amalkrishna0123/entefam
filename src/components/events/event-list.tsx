"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Event {
  id: string
  title: string
  date: string
  location?: string
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editEvent, setEditEvent] = useState<Event | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events")
      const data = await res.json()
      setEvents(data)
    } catch (error) {
      console.error("Failed to fetch events:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/events/${deleteId}`, { method: "DELETE" })
      if (res.ok) {
        setEvents(events.filter((e) => e.id !== deleteId))
        setDeleteId(null)
      }
    } catch (error) {
      console.error("Failed to delete event:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editEvent) return
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/events/${editEvent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editEvent.title,
          date: editEvent.date,
          location: editEvent.location,
        }),
      })
      if (res.ok) {
        setEvents(events.map((e) => (e.id === editEvent.id ? editEvent : e)))
        setEditEvent(null)
      }
    } catch (error) {
      console.error("Failed to update event:", error)
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

  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-[var(--bg-elevated)] rounded-2xl border border-dashed border-[var(--border)]" style={{padding:"30px"}}>
        <p className="text-[var(--text-tertiary)]">No events scheduled.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3" style={{marginTop:"15px"}}>
      {events.map((event) => (
        <Card key={event.id} className="p-4 hover:border-[var(--border-accent)] transition-colors group" style={{padding:"15px",marginBottom:"10px"}}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-muted)] flex items-center justify-center text-[var(--accent)] shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              <div className="min-w-0">
                <h4 className="font-medium text-[var(--text-primary)] truncate">{event.title}</h4>
                <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] mt-0.5">
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                  {event.location && (
                    <>
                      <span>•</span>
                      <span className="truncate">{event.location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" style={{ width: "32px", padding: 0 }} onClick={() => setEditEvent(event)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                  </svg>
                </Button>
                <Button variant="ghost" size="sm" style={{ width: "32px", padding: 0, color: "var(--danger)" }} onClick={() => setDeleteId(event.id)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}

      <Modal isOpen={!!editEvent} onClose={() => setEditEvent(null)} title="Edit Event">
        {editEvent && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Event Title</Label>
              <Input id="edit-title" value={editEvent.title} onChange={(e) => setEditEvent({...editEvent, title: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input id="edit-date" type="date" value={editEvent.date} onChange={(e) => setEditEvent({...editEvent, date: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input id="edit-location" value={editEvent.location || ""} onChange={(e) => setEditEvent({...editEvent, location: e.target.value})} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" type="button" onClick={() => setEditEvent(null)}>Cancel</Button>
              <Button type="submit" loading={isUpdating}>Update Event</Button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Event"
        description="Are you sure you want to delete this event?"
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
