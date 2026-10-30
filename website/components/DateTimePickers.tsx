"use client";

import { useMemo, useState } from "react";
import { Calendar, Clock, ChevronDown } from "lucide-react";

/* ---------- helpers ---------- */

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/** yyyy-mm-dd (local timezone, safe for date inputs and message templates) */
function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Build the next N days starting today. */
function nextDays(count: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
}

function labelForDay(d: Date, index: number): { top: string; date: string } {
  if (index === 0) return { top: "Today", date: `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}` };
  if (index === 1) return { top: "Tomorrow", date: `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}` };
  return { top: DAY_NAMES[d.getDay()], date: `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}` };
}

/* ---------- DateQuickPicker ---------- */

export function DateQuickPicker({
  value,
  onChange
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [showCustom, setShowCustom] = useState(false);
  const days = useMemo(() => nextDays(14), []);
  const todayISO = toISODate(new Date());
  const minISO = todayISO;

  // If the value is outside the quick-pick range, auto-show the custom input.
  const inQuickRange = days.some((d) => toISODate(d) === value);
  const customVisible = showCustom || (value && !inQuickRange);

  return (
    <div>
      <label className="label-field">
        <span className="inline-flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5" /> Preferred date
        </span>
      </label>

      {/* Horizontal-scroll day pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1 snap-x snap-mandatory">
        {days.map((d, i) => {
          const iso = toISODate(d);
          const selected = iso === value;
          const { top, date } = labelForDay(d, i);
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onChange(iso)}
              aria-pressed={selected}
              className={`snap-start shrink-0 flex flex-col items-center justify-center rounded-lg border min-w-[84px] px-2 py-2.5 transition ${
                selected
                  ? "border-gold bg-gold/15 shadow-gold-glow"
                  : "border-gold/25 bg-black-pure/40 hover:border-gold/60"
              }`}
            >
              <span
                className={`text-[10px] font-medium uppercase tracking-[0.1em] whitespace-nowrap ${
                  selected ? "text-gold" : "text-gold-pale/60"
                }`}
              >
                {top}
              </span>
              <span
                className={`mt-1 font-display text-lg ${
                  selected ? "text-gold-light" : "text-gold-pale"
                }`}
              >
                {date.split(" ")[1]}
              </span>
              <span
                className={`text-[9px] uppercase tracking-[0.2em] ${
                  selected ? "text-gold/80" : "text-gold-pale/50"
                }`}
              >
                {date.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Later date fallback */}
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowCustom((v) => !v)}
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-gold-pale/70 hover:text-gold transition"
        >
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${
              customVisible ? "rotate-180" : ""
            }`}
          />
          Pick a later date
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[10px] uppercase tracking-[0.2em] text-gold-pale/50 hover:text-gold transition"
          >
            Clear
          </button>
        )}
      </div>

      {customVisible && (
        <input
          type="date"
          min={minISO}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field mt-2"
        />
      )}
    </div>
  );
}

/* ---------- TimeQuickPicker ---------- */

/** Generate half-hour slots between 09:00 and 21:00 (inclusive). */
function generateSlots(): string[] {
  const slots: string[] = [];
  for (let h = 9; h <= 21; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 21) slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

function formatTime(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  const h = Number(hStr);
  const suffix = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mStr} ${suffix}`;
}

const PERIODS: { label: string; range: [number, number] }[] = [
  { label: "Morning", range: [9, 11] },  // 9:00 – 11:30
  { label: "Afternoon", range: [12, 16] }, // 12:00 – 4:30
  { label: "Evening", range: [17, 21] }   // 5:00 – 9:00
];

export function TimeQuickPicker({
  value,
  onChange
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const slots = useMemo(() => generateSlots(), []);
  const grouped = useMemo(() => {
    return PERIODS.map((p) => ({
      label: p.label,
      items: slots.filter((s) => {
        const h = Number(s.split(":")[0]);
        return h >= p.range[0] && h <= p.range[1];
      })
    }));
  }, [slots]);

  return (
    <div>
      <label className="label-field flex items-center justify-between">
        <span className="inline-flex items-center gap-2">
          <Clock className="h-3.5 w-3.5" /> Preferred time
        </span>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[10px] uppercase tracking-[0.2em] text-gold-pale/60 hover:text-gold transition"
          >
            Clear
          </button>
        )}
      </label>

      <div className="rounded-md border border-gold/25 bg-black-pure/40 p-3 space-y-3">
        {grouped.map((g) => (
          <div key={g.label}>
            <p className="text-[10px] uppercase tracking-[0.22em] text-gold/75 mb-1.5">
              {g.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((slot) => {
                const selected = slot === value;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => onChange(slot)}
                    aria-pressed={selected}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-medium tracking-wide transition ${
                      selected
                        ? "text-black shadow-gold-glow"
                        : "border border-gold/30 text-gold-pale/85 hover:border-gold hover:text-gold-light"
                    }`}
                    style={
                      selected
                        ? { backgroundImage: "var(--gradient-gold)" }
                        : undefined
                    }
                  >
                    {formatTime(slot)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
