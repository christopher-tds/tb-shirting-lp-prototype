import { useEffect, useState } from "react";
import { TUNE_KEY, applyTune } from "./config.js";

// TEMPORARY tuner. Every control snaps to on-scale values. Defaults are the current CSS values;
// Reset returns to them. Each control maps its value to one or more CSS custom properties.
const LH_SCALE = [16, 20, 24, 28, 32, 40, 48, 64];
const lh = (v, label, size, value) => ({
  id: v, label, value,
  stops: LH_SCALE.filter((x) => x >= size && x <= size * 2),
  show: (x) => `${x}px · ${(x / size).toFixed(2)}`,
  vars: (x) => ({ [v]: x + "px" }),
});
// 2-up split: the first photo's share of the row. The second gets the rest, so one grows as the other shrinks.
const split = (bp, label) => ({
  id: `two-up-split-${bp}`, label, value: 60,
  stops: [30, 35, 40, 45, 50, 55, 60, 65, 70],
  show: (x) => `${x} / ${100 - x}`,
  vars: (x) => ({ [`--two-up-main-${bp}`]: x + "fr", [`--two-up-second-${bp}`]: 100 - x + "fr" }),
});
const gap = (bp, label) => ({
  id: `--two-up-gap-${bp}`, label, value: 16,
  stops: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48], // base-4 spacing
  show: (x) => `${x}px`,
  vars: (x) => ({ [`--two-up-gap-${bp}`]: x + "px" }),
});

// Text link font size: on-scale sizes only (C3).
const linkSize = (v, label, value) => ({
  id: v, label, value,
  stops: [12, 14, 16, 20, 24],
  show: (x) => `${x}px`,
  vars: (x) => ({ [v]: x + "px" }),
});

const GROUPS = [
  { name: "Text link size", rows: [
    linkSize("--link-size-sm", "Mobile", 16), linkSize("--link-size-md", "Tablet", 16), linkSize("--link-size-lg", "Desktop", 16),
  ] },
  { name: "Story headline line height", rows: [
    lh("--story-lh-sm", "Mobile", 24, 32), lh("--story-lh-md", "Tablet", 32, 40), lh("--story-lh-lg", "Desktop", 32, 32),
  ] },
  { name: "Story 2-up size (first / second)", rows: [split("sm", "Mobile"), split("md", "Tablet")] },
  { name: "Story 2-up gap", rows: [gap("sm", "Mobile"), gap("md", "Tablet")] },
];
const ROWS = GROUPS.flatMap((g) => g.rows);
const DEFAULTS = Object.fromEntries(ROWS.map((r) => [r.id, r.value]));
const STATE_KEY = TUNE_KEY + "-state";
const OPEN_KEY = TUNE_KEY + "-open";

function load() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(STATE_KEY) || "null"); } catch (e) { /* storage blocked */ }
  const v = { ...DEFAULTS, ...(saved || {}) };
  for (const r of ROWS) if (!r.stops.includes(v[r.id])) v[r.id] = r.value;
  return v;
}

export default function Tuner() {
  const [values, setValues] = useState(load);
  const [open, setOpen] = useState(() => { try { return localStorage.getItem(OPEN_KEY) === "1"; } catch (e) { return false; } });
  const [copied, setCopied] = useState(false);

  // Write only the changed controls as CSS variables, so Reset leaves the CSS defaults in charge.
  useEffect(() => {
    const vars = {};
    for (const r of ROWS) if (values[r.id] !== r.value) Object.assign(vars, r.vars(values[r.id]));
    try {
      // Only values that differ from the defaults are kept, so a new default reaches everyone.
      localStorage.setItem(STATE_KEY, JSON.stringify(Object.fromEntries(Object.entries(values).filter(([k, x]) => x !== DEFAULTS[k]))));
      localStorage.setItem(TUNE_KEY, JSON.stringify(vars));
    } catch (e) { /* storage blocked */ }
    applyTune();
    // Storage events don't fire in the page that wrote the value, so nudge the device frame.
    document.querySelector(".vp-stage iframe")?.contentWindow?.dispatchEvent(new StorageEvent("storage", { key: TUNE_KEY }));
  }, [values]);
  useEffect(() => { try { localStorage.setItem(OPEN_KEY, open ? "1" : "0"); } catch (e) { /* storage blocked */ } }, [open]);

  const copy = () => {
    const lines = GROUPS.flatMap((g) => g.rows.flatMap((r) =>
      Object.entries(r.vars(values[r.id])).map(([k, x]) => `${k}: ${x}; /* ${g.name}, ${r.label} */`)));
    navigator.clipboard?.writeText(lines.join("\n")).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1200); });
  };

  return (
    <section className="tuner" aria-label="Tuner (temporary)">
      <button type="button" className="tuner__toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>Tuner</button>
      <div className="tuner__body" hidden={!open}>
        {GROUPS.map((g) => (
          <div key={g.name}>
            <p className="tuner__group">{g.name}</p>
            {g.rows.map((r) => (
              <label key={r.id} className="tuner__row">
                <span>{r.label}</span>
                <input type="range" min={0} max={r.stops.length - 1} step={1}
                  value={Math.max(0, r.stops.indexOf(values[r.id]))}
                  onChange={(e) => setValues((p) => ({ ...p, [r.id]: r.stops[+e.target.value] }))} />
                <output>{r.show(values[r.id])}</output>
              </label>
            ))}
          </div>
        ))}
        <div className="tuner__actions">
          <button type="button" onClick={() => setValues({ ...DEFAULTS })}>Reset</button>
          <button type="button" onClick={copy}>{copied ? "Copied" : "Copy CSS"}</button>
        </div>
      </div>
    </section>
  );
}
