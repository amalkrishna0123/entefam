// ─── Weather Code Mapping ────────────────────────────────────────────────────
// Based on WMO Weather interpretation codes (WW)
// https://open-meteo.com/en/docs#weathervariables

export interface WeatherCondition {
  label: string;
  emoji: string;
  description: string;
}

export function getWeatherCondition(code: number): WeatherCondition {
  if (code === 0) return { label: "Clear Sky", emoji: "☀️", description: "Clear sky" };
  if (code === 1) return { label: "Mainly Clear", emoji: "🌤️", description: "Mainly clear" };
  if (code === 2) return { label: "Partly Cloudy", emoji: "⛅", description: "Partly cloudy" };
  if (code === 3) return { label: "Overcast", emoji: "☁️", description: "Overcast" };
  if (code === 45) return { label: "Foggy", emoji: "🌫️", description: "Fog" };
  if (code === 48) return { label: "Icy Fog", emoji: "🌫️", description: "Depositing rime fog" };
  if (code >= 51 && code <= 53) return { label: "Drizzle", emoji: "🌦️", description: "Light drizzle" };
  if (code >= 55 && code <= 57) return { label: "Heavy Drizzle", emoji: "🌦️", description: "Dense drizzle" };
  if (code >= 61 && code <= 63) return { label: "Rain", emoji: "🌧️", description: "Moderate rain" };
  if (code === 65) return { label: "Heavy Rain", emoji: "🌧️", description: "Heavy rain" };
  if (code === 66 || code === 67) return { label: "Freezing Rain", emoji: "🌨️", description: "Freezing rain" };
  if (code >= 71 && code <= 73) return { label: "Snow", emoji: "❄️", description: "Moderate snowfall" };
  if (code === 75) return { label: "Heavy Snow", emoji: "❄️", description: "Heavy snowfall" };
  if (code === 77) return { label: "Snow Grains", emoji: "🌨️", description: "Snow grains" };
  if (code >= 80 && code <= 82) return { label: "Rain Showers", emoji: "🌧️", description: "Rain showers" };
  if (code === 85 || code === 86) return { label: "Snow Showers", emoji: "🌨️", description: "Snow showers" };
  if (code === 95) return { label: "Thunderstorm", emoji: "⛈️", description: "Thunderstorm" };
  if (code === 96 || code === 99) return { label: "Heavy Thunderstorm", emoji: "⛈️", description: "Thunderstorm with hail" };
  return { label: "Unknown", emoji: "🌡️", description: "Unknown condition" };
}

// ─── Caching ─────────────────────────────────────────────────────────────────

const CACHE_KEY = "familyos_weather_cache";
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

export interface WeatherCache {
  timestamp: number;
  latitude: number;
  longitude: number;
  data: WeatherData;
}

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  condition: WeatherCondition;
  /** Reverse-geocoded display name, e.g. "Thrissur, Kerala" */
  locationName: string;
}

export function getCachedWeather(lat: number, lon: number): WeatherData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cache: WeatherCache = JSON.parse(raw);
    const isExpired = Date.now() - cache.timestamp > CACHE_TTL_MS;
    // Check proximity (~0.1 degree ≈ 11 km) to avoid stale data for a very different location
    const sameLocation =
      Math.abs(cache.latitude - lat) < 0.1 &&
      Math.abs(cache.longitude - lon) < 0.1;
    if (!isExpired && sameLocation) return cache.data;
  } catch {
    // ignore parse errors
  }
  return null;
}

export function setCachedWeather(lat: number, lon: number, data: WeatherData): void {
  try {
    const cache: WeatherCache = { timestamp: Date.now(), latitude: lat, longitude: lon, data };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // ignore storage errors (e.g. private browsing quota)
  }
}

// ─── Reverse Geocoding ────────────────────────────────────────────────────────

/**
 * Fetch the human-readable location name for the given coordinates using
 * the Open-Meteo Geocoding API (reverse mode).
 * Returns a string like "Thrissur, Kerala" or falls back to the raw coords.
 */
export async function fetchLocationName(lat: number, lon: number): Promise<string> {
  try {
    // Open-Meteo does not have a reverse geocoding endpoint.
    // Switching to BigDataCloud (Free Client-side API, no key required).
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Geocoding error: ${res.status}`);

    const json = await res.json();
    
    /**
     * Build a detailed location string: {Local Place}, {Locality}, {District}, {State}
     * BigDataCloud provides 'locality', 'city', and a hierarchy in 'localityInfo.administrative'.
     */
    const parts: string[] = [];

    // 1. Most granular locality (Village/Place)
    if (json.locality) parts.push(json.locality);

    // 2. City or Town
    if (json.city && !parts.includes(json.city)) parts.push(json.city);

    // 3. District & State from administrative hierarchy
    if (json.localityInfo?.administrative) {
      // Sort administrative parts by order (descending for granularity)
      // and filter for relevant levels (District, State)
      const relevantAdmins = json.localityInfo.administrative
        .filter((a: any) => {
          // Level 4 is State, Level 5 is usually District
          return a.adminLevel === 5 || a.adminLevel === 4;
        })
        .sort((a: any, b: any) => b.adminLevel - a.adminLevel); // Granular first (District before State)

      relevantAdmins.forEach((admin: any) => {
        // Clean up "District" suffix for a cleaner string if desired
        const name = admin.name.replace(/ District$/i, "");
        if (!parts.includes(name)) parts.push(name);
      });
    }

    // fallback if everything else is empty
    if (parts.length === 0) return "Current Location";

    // join and return, removing any duplicates that might have slipped through
    return Array.from(new Set(parts)).join(", ");
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return "Current Location"; // non-fatal fallback
  }
}

// ─── Weather Fetch (weather + location name in parallel) ─────────────────────

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m` +
    `&timezone=auto`;

  // Fetch weather and location name in parallel for speed
  const [res, locationName] = await Promise.all([
    fetch(weatherUrl),
    fetchLocationName(lat, lon),
  ]);

  if (!res.ok) throw new Error(`Open-Meteo API error: ${res.status}`);

  const json = await res.json();
  const current = json.current;

  const data: WeatherData = {
    temperature: Math.round(current.temperature_2m),
    weatherCode: current.weather_code,
    humidity: current.relative_humidity_2m,
    windSpeed: Math.round(current.wind_speed_10m),
    condition: getWeatherCondition(current.weather_code),
    locationName,
  };

  return data;
}

// ─── Geolocation ──────────────────────────────────────────────────────────────

/** Fallback location: Eranellur, Kechery, Thrissur, Kerala, India */
export const FALLBACK_LOCATION = { latitude: 10.6000, longitude: 76.1167 };

export function getUserLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) => reject(err),
      { timeout: 10_000, maximumAge: 5 * 60 * 1000 }
    );
  });
}
