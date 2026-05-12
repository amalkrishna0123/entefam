"use client";

import { useEffect, useState, useCallback } from "react";
import { MapPin, Loader2 } from "lucide-react";
import {
  fetchWeather,
  getCachedWeather,
  setCachedWeather,
  getUserLocation,
  FALLBACK_LOCATION,
  type WeatherData,
} from "@/lib/weather";

type Status = "loading" | "success" | "denied" | "error";

interface WeatherState {
  status: Status;
  data: WeatherData | null;
  usingFallback: boolean;
  permissionStatus: PermissionState | "unknown";
}

export default function WeatherWidget() {
  const [state, setState] = useState<WeatherState>({
    status: "loading",
    data: null,
    usingFallback: false,
    permissionStatus: "unknown",
  });
  const [locating, setLocating] = useState(false);

  // ── Permission Status Listener ─────────────────────────────
  useEffect(() => {
    if (!navigator.permissions) return;
    let cancelled = false;

    async function checkPermission() {
      try {
        const result = await navigator.permissions.query({ name: "geolocation" as any });
        if (cancelled) return;
        setState((s) => ({ ...s, permissionStatus: result.state }));

        result.onchange = () => {
          if (!cancelled) setState((s) => ({ ...s, permissionStatus: result.state }));
        };
      } catch (e) {
        console.error("Permission query failed", e);
      }
    }

    checkPermission();
    return () => { cancelled = true; };
  }, []);

  // ── Core fetch helper ──────────────────────────────────────
  async function load(lat: number, lon: number, fallback: boolean, bustCache = false) {
    if (!bustCache) {
      const cached = getCachedWeather(lat, lon);
      if (cached) {
        setState((s) => ({ ...s, status: "success", data: cached, usingFallback: fallback }));
        return;
      }
    }
    try {
      const data = await fetchWeather(lat, lon);
      setCachedWeather(lat, lon, data);
      setState((s) => ({ ...s, status: "success", data, usingFallback: fallback }));
    } catch {
      setState((s) => ({ ...s, status: "error", data: null, usingFallback: fallback }));
    }
  }

  // ── Initial load on mount ──────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const { latitude, longitude } = await getUserLocation();
        if (!cancelled) await load(latitude, longitude, false);
      } catch {
        if (!cancelled) {
          setState((s) => ({ ...s, status: "denied" }));
          const { latitude, longitude } = FALLBACK_LOCATION;
          await load(latitude, longitude, true);
        }
      }
    }

    init();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Click: re-request live GPS & refresh weather ───────────
  const handleLocate = useCallback(async () => {
    if (locating) return;
    setLocating(true);
    try {
      const { latitude, longitude } = await getUserLocation();
      await load(latitude, longitude, false, true); // bust cache
    } catch {
      // Still denied → silently refresh fallback
      const { latitude, longitude } = FALLBACK_LOCATION;
      await load(latitude, longitude, true, true);
    } finally {
      setLocating(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locating]);

  /* ── Render ─────────────────────────────────────────────── */

  if (state.status === "loading") {
    return (
      <div className="weather-widget weather-widget--loading" aria-label="Loading weather">
        <div className="weather-widget__skeleton" />
      </div>
    );
  }

  if (state.status === "error" || !state.data) return null;

  const { data, usingFallback } = state;

  return (
    <div
      className="weather-widget"
      aria-label={`Current weather: ${data.condition.label}, ${data.temperature}°C`}
    >
      {/* Weather emoji */}
      <span className="weather-widget__emoji" role="img" aria-hidden>
        {data.condition.emoji}
      </span>

      {/* Temperature */}
      <span className="weather-widget__temp">{data.temperature}°C,</span>

      {/* Detailed Location Name */}
      {data.locationName && (
        <span className="weather-widget__location">{data.locationName}</span>
      )}

      {/* Clickable MapPin icon — always visible, orange when using fallback */}
      <button
        className={`weather-widget__locate-btn${usingFallback ? " weather-widget__locate-btn--fallback" : ""}`}
        onClick={handleLocate}
        disabled={locating}
        title={
          state.permissionStatus === "denied"
            ? "Location access is blocked by your browser. Click the lock/tune icon in the address bar to reset permission."
            : usingFallback
              ? "Using fallback location (Thrissur) — click to try using your current location"
              : "Click to refresh your location"
        }
        aria-label="Fetch current location"
      >
        {locating
          ? <Loader2 size={13} className="weather-widget__spin" />
          : <MapPin size={13} />
        }
      </button>
    </div>
  );
}
