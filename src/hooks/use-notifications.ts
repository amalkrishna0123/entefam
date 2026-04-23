"use client"

import { useEffect, useState, useCallback } from "react"

export type NotificationPermissionState = "default" | "granted" | "denied" | "unsupported"

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermissionState>("default")

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported")
      return
    }
    setPermission(Notification.permission as NotificationPermissionState)
  }, [])

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined" || !("Notification" in window)) return false
    try {
      const result = await Notification.requestPermission()
      setPermission(result as NotificationPermissionState)
      return result === "granted"
    } catch {
      return false
    }
  }, [])

  const sendNotification = useCallback((
    title: string,
    body: string,
    options?: { icon?: string; tag?: string }
  ) => {
    if (typeof window === "undefined" || !("Notification" in window)) return
    if (Notification.permission !== "granted") return

    const n = new Notification(title, {
      body,
      icon: options?.icon ?? "/favicon.ico",
      tag: options?.tag,
    })
    setTimeout(() => n.close(), 6000)
    return n
  }, [])

  /** Fetch events from the API and notify for today & tomorrow */
  const checkAndNotifyEvents = useCallback(async () => {
    if (typeof window === "undefined" || Notification.permission !== "granted") return
    try {
      const res = await fetch("/api/events")
      const events: Array<{ id: string; title: string; date: string; location?: string }> = await res.json()
      const today = new Date()
      const todayStr = today.toISOString().split("T")[0]
      const tomorrowStr = new Date(today.getTime() + 86400000).toISOString().split("T")[0]

      for (const event of events) {
        const eventDate = (event.date ?? "").split("T")[0]
        if (eventDate === todayStr) {
          sendNotification(
            "📅 Event Today!",
            `${event.title}${event.location ? ` · ${event.location}` : ""}`,
            { tag: `event-today-${event.id}` }
          )
        } else if (eventDate === tomorrowStr) {
          sendNotification(
            "📅 Event Tomorrow",
            `Don't forget: ${event.title}`,
            { tag: `event-tomorrow-${event.id}` }
          )
        }
      }
    } catch (e) {
      console.error("Event notification check failed:", e)
    }
  }, [sendNotification])

  /** Fetch EMIs from the API and notify for due-today or overdue items */
  const checkAndNotifyEmis = useCallback(async () => {
    if (typeof window === "undefined" || Notification.permission !== "granted") return
    try {
      const res = await fetch("/api/emi")
      const emis: Array<{ id: string; emiName: string; amount: string; dueDate: string }> = await res.json()
      const todayDay = new Date().getDate()

      for (const emi of emis) {
        const dueDay = parseInt(emi.dueDate)
        if (dueDay === todayDay) {
          sendNotification(
            "💳 EMI Due Today!",
            `${emi.emiName} — ₹${parseFloat(emi.amount).toLocaleString("en-IN")} is due today`,
            { tag: `emi-due-${emi.id}` }
          )
        } else if (dueDay < todayDay) {
          sendNotification(
            "⚠️ EMI Overdue",
            `${emi.emiName} — ₹${parseFloat(emi.amount).toLocaleString("en-IN")} is overdue`,
            { tag: `emi-overdue-${emi.id}` }
          )
        }
      }
    } catch (e) {
      console.error("EMI notification check failed:", e)
    }
  }, [sendNotification])

  return {
    permission,
    requestPermission,
    sendNotification,
    checkAndNotifyEvents,
    checkAndNotifyEmis,
  }
}
