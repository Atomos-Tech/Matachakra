import { useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";

const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman & Nicobar Islands",
  "Chandigarh",
  "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export function StateSelect() {
  const [value, setValue] = useState("");

  return (
    <div className="mx-auto mb-10 max-w-md">
      <label
        htmlFor="state-select"
        className="mb-2 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
      >
        <MapPin className="h-3.5 w-3.5 text-coral" aria-hidden />
        Personalize by location
      </label>
      <div className="glass relative rounded-2xl transition-all hover:border-primary/30 focus-within:border-primary/50">
        <select
          id="state-select"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Select your State or Union Territory"
          className="w-full cursor-pointer appearance-none rounded-2xl bg-transparent px-5 py-3.5 pr-12 text-sm text-foreground focus:outline-none"
        >
          <option value="" className="bg-background text-foreground">
            Select your State/Territory (e.g., Karnataka)
          </option>
          {STATES.map((s) => (
            <option key={s} value={s} className="bg-background text-foreground">
              {s}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
      </div>
    </div>
  );
}
