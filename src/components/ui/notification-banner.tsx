"use client"

import { useNotifications } from "@/hooks/use-notifications"
import { Bell, BellOff, X } from "lucide-react"
import { useState } from "react"

interface NotificationBannerProps {
  onGranted?: () => void
}

export default function NotificationBanner({ onGranted }: NotificationBannerProps) {
  const { permission, requestPermission } = useNotifications()
  const [dismissed, setDismissed] = useState(false)

  // Nothing to show if already granted, denied, unsupported, or dismissed
  if (dismissed || permission === "granted" || permission === "denied" || permission === "unsupported") {
    return null
  }

  const handleAllow = async () => {
    const granted = await requestPermission()
    if (granted) {
      onGranted?.()
    }
  }

  return (
    <div className="notif-banner" role="alert">
      <div className="notif-banner__icon">
        <Bell size={18} />
      </div>
      <div className="notif-banner__content">
        <p className="notif-banner__title">Enable notifications</p>
        <p className="notif-banner__body">
          Get real-time OS alerts for upcoming events and EMI due dates.
        </p>
      </div>
      <div className="notif-banner__actions">
        <button id="notif-allow-btn" className="notif-banner__btn notif-banner__btn--primary" onClick={handleAllow}>
          Allow
        </button>
        <button id="notif-dismiss-btn" className="notif-banner__btn notif-banner__btn--ghost" onClick={() => setDismissed(true)}>
          <X size={15} />
        </button>
      </div>
    </div>
  )
}

/** Small inline pill shown when notifications are already granted */
export function NotificationGrantedPill() {
  const { permission } = useNotifications()
  if (permission !== "granted") return null
  return (
    <span className="notif-granted-pill">
      <Bell size={12} />
      Notifications on
    </span>
  )
}

/** Small inline pill shown when notifications are denied */
export function NotificationDeniedPill() {
  const { permission } = useNotifications()
  if (permission !== "denied") return null
  return (
    <span className="notif-denied-pill">
      <BellOff size={12} />
      Notifications blocked
    </span>
  )
}
