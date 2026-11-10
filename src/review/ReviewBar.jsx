import ViewportSwitcher from "./ViewportSwitcher.jsx";
import Tuner from "./Tuner.jsx";
import { VISIBLE } from "../pages.js";

// Top-right review bar: concept picker, viewport picker, then the line-height tuner. Hidden in frames and on ?clean.
export default function ReviewBar({ concept, onConcept }) {
  return (
    <div className="review-bar">
      <div className="vp-panel" role="group" aria-label="Concept">
        {VISIBLE.map((v) => (
          <button key={v} type="button" aria-pressed={v === concept} onClick={() => onConcept(v)}>{v}</button>
        ))}
      </div>
      <ViewportSwitcher concept={concept} />
      <Tuner />
    </div>
  );
}
