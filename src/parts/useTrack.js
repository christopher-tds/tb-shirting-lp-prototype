import { useCallback, useEffect, useRef, useState } from "react";
import { motionOff } from "../motion.js";

// A horizontal row that scrolls by swipe, trackpad, arrows, or mouse drag (so rows can be swiped in
// the Tablet and Mobile frames on a desktop). Reports whether it overflows (C14: controls only show
// when it does) and its position for the 2px progress bar.
// `nested`: a track inside another track (the product card's image swipe inside a carousel row).
// Its mouse drag stops there so the row doesn't drag too.
export default function useTrack({ nested = false } = {}) {
  const ref = useRef(null);
  const [state, setState] = useState({ overflow: false, start: true, end: false, thumb: 1, left: 0 });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setState({
      overflow: max > 1,
      start: el.scrollLeft <= 1,
      end: el.scrollLeft >= max - 1,
      thumb: el.clientWidth / el.scrollWidth,
      left: el.scrollLeft / el.scrollWidth,
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return; // grid display: no swipe row
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.addEventListener("scroll", measure, { passive: true });

    // Mouse drag. Touch and trackpads scroll natively.
    let drag = null;
    const down = (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0 || el.scrollWidth <= el.clientWidth + 1) return;
      if (nested) e.stopPropagation();
      drag = { x: e.clientX, left: el.scrollLeft, moved: false, dx: 0 };
      addEventListener("pointermove", move);
      addEventListener("pointerup", up, { once: true });
      addEventListener("pointercancel", up, { once: true });
    };
    const move = (e) => {
      const dx = e.clientX - drag.x;
      drag.dx = dx;
      if (!drag.moved && Math.abs(dx) < 6) return;
      if (!drag.moved) { drag.moved = true; el.classList.add("is-dragging"); }
      el.scrollLeft = drag.left - dx;
    };
    const up = () => {
      removeEventListener("pointermove", move);
      removeEventListener("pointerup", up);
      removeEventListener("pointercancel", up);
      if (!drag) return;
      const { moved, dx, left } = drag;
      drag = null;
      el.classList.remove("is-dragging");
      // Nested image swipes page one image per drag, like a flick on a phone, instead of needing
      // to be dragged past halfway.
      if (nested && moved) {
        const w = el.clientWidth;
        const page = Math.round(left / w) + (dx < -24 ? 1 : dx > 24 ? -1 : 0);
        el.scrollTo({ left: Math.max(0, page) * w, behavior: motionOff() ? "auto" : "smooth" });
      }
      if (moved) {
        // Swallow the click that ends a drag so a card link doesn't open.
        const stop = (ev) => { ev.preventDefault(); ev.stopPropagation(); };
        el.addEventListener("click", stop, { capture: true, once: true });
        setTimeout(() => el.removeEventListener("click", stop, { capture: true }), 0);
      }
    };
    el.addEventListener("pointerdown", down);
    return () => {
      removeEventListener("pointerup", up);
      removeEventListener("pointercancel", up);
      ro.disconnect();
      el.removeEventListener("scroll", measure);
      el.removeEventListener("pointerdown", down);
      removeEventListener("pointermove", move);
    };
  }, [measure, nested]);

  // Arrows move by most of a screen, keeping one card in view for context.
  const step = useCallback((dir) => {
    const el = ref.current;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: motionOff() ? "auto" : "smooth" });
  }, []);

  return { ref, ...state, step };
}
