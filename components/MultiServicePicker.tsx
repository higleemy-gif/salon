"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X, Plus, Search, Check } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/data/services";

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  error?: string;
  label?: string;
};

/**
 * Chip-input service picker.
 * - Selected services show as removable gold chips at the top.
 * - Below, a search box filters the full catalog grouped by category.
 * - Click a row to toggle. Click a chip's × to remove.
 * - Popular category shortcuts appear when nothing is selected yet.
 */
export function MultiServicePicker({ value, onChange, error, label = "Services" }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Close panel on outside click.
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SERVICE_CATEGORIES.map((cat) => {
      const items = cat.services
        .map((s) => s.name)
        .filter((n) => (q ? n.toLowerCase().includes(q) : true));
      return { title: cat.title, items };
    }).filter((g) => g.items.length > 0);
  }, [query]);

  const toggle = (name: string) => {
    if (value.includes(name)) onChange(value.filter((v) => v !== name));
    else onChange([...value, name]);
  };

  const removeChip = (name: string) =>
    onChange(value.filter((v) => v !== name));

  const clearAll = () => onChange([]);

  const popular = ["Haircut & styling", "Professional facial", "Bridal makeover", "HD makeup"];

  return (
    <div ref={boxRef}>
      <label className="label-field flex items-center justify-between">
        <span>{label} · Pick as many as you like</span>
        {value.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-[10px] uppercase tracking-[0.18em] text-gold-pale/60 hover:text-gold transition"
          >
            Clear all
          </button>
        )}
      </label>

      {/* Chip bin + search input, all in one box */}
      <div
        className={`min-h-[56px] rounded-md border bg-black-pure/60 px-3 py-2 transition ${
          error ? "border-red-500/60" : "border-gold/30 focus-within:border-gold"
        }`}
      >
        {value.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {value.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 pl-3 pr-1.5 py-1 text-xs text-gold-light"
              >
                <span>{name}</span>
                <button
                  type="button"
                  onClick={() => removeChip(name)}
                  aria-label={`Remove ${name}`}
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-black/30 hover:bg-gold hover:text-black transition"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gold/60 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={
              value.length === 0
                ? "Search & add services…"
                : "Add another service…"
            }
            className="w-full bg-transparent text-sm text-gold-pale placeholder:text-gold-pale/40 focus:outline-none"
            aria-label="Search services"
          />
        </div>
      </div>

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}

      {/* Popular quick-adds (only when nothing selected and panel closed) */}
      {value.length === 0 && !open && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gold-pale/50 mr-1 self-center">
            Popular:
          </span>
          {popular.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => toggle(p)}
              className="inline-flex items-center gap-1 rounded-full border border-gold/25 px-3 py-1 text-[11px] text-gold-pale/80 hover:border-gold hover:text-gold transition"
            >
              <Plus className="h-3 w-3" />
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Suggestions panel */}
      {open && (
        <div className="mt-2 max-h-72 overflow-y-auto rounded-md border border-gold/30 bg-charcoal shadow-gold-glow">
          {filteredGroups.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-gold-pale/60">
              No matches. Try a different keyword or add
              <button
                type="button"
                onClick={() => {
                  toggle("Other / Not sure");
                  setQuery("");
                }}
                className="ml-1 underline decoration-gold/40 hover:text-gold"
              >
                &ldquo;Other / Not sure&rdquo;
              </button>
              .
            </p>
          ) : (
            filteredGroups.map((g) => (
              <div key={g.title}>
                <div className="sticky top-0 bg-charcoal px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-gold/80 border-b border-gold/15">
                  {g.title}
                </div>
                <ul>
                  {g.items.map((name) => {
                    const selected = value.includes(name);
                    return (
                      <li key={name}>
                        <button
                          type="button"
                          onClick={() => toggle(name)}
                          className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition ${
                            selected
                              ? "bg-gold/10 text-gold-light"
                              : "text-gold-pale/80 hover:bg-gold/[0.05] hover:text-gold-light"
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-sm border shrink-0 ${
                              selected
                                ? "border-gold bg-gold text-black"
                                : "border-gold/40"
                            }`}
                            aria-hidden
                          >
                            {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                          </span>
                          <span className="flex-1">{name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      )}

      {value.length > 0 && (
        <p className="mt-2 text-[11px] text-gold-pale/60">
          {value.length} service{value.length === 1 ? "" : "s"} selected
        </p>
      )}
    </div>
  );
}
