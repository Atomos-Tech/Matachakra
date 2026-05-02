import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { getMapsApiKey } from "@/actions/chat";

interface PollingBoothLocatorProps {
  location?: string;
}

export function PollingBoothLocator({ location = "New Delhi, India" }: PollingBoothLocatorProps) {
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    getMapsApiKey().then((key) => {
      if (key) setApiKey(key);
    });
  }, []);

  if (!apiKey) {
    return (
      <div className="mt-4 flex h-64 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground shadow-sm">
        <span className="animate-pulse">Loading Map...</span>
      </div>
    );
  }

  // Use a generic query if none provided, but ideally we'd search for polling stations
  const query = encodeURIComponent(`polling stations in ${location}`);
  const mapUrl = `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=${query}`;

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-cyan-300">
        <MapPin className="h-4 w-4" aria-hidden="true" />
        <span>Polling Booth Locator (Google Maps)</span>
      </div>
      <div className="relative h-64 w-full rounded-lg overflow-hidden border border-white/5">
        <iframe
          title="Google Maps showing polling stations"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={mapUrl}
          aria-label="Interactive map showing nearby polling stations"
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Showing approximate locations based on your area. Always verify your exact booth on the
        official ECI portal.
      </p>
    </div>
  );
}
