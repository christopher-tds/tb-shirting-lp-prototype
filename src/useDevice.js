import { useSyncExternalStore } from "react";

// Which layout applies: "desktop" ≥ 1000 (md), "tablet" 800–999 (sm-md), "mobile" < 800 (base).
// Keep in step with brand.js BREAKPOINTS and the styles.css media queries.
const mqDesktop = matchMedia("(min-width: 1000px)");
const mqTablet = matchMedia("(min-width: 800px)");

function subscribe(cb) {
  mqDesktop.addEventListener("change", cb);
  mqTablet.addEventListener("change", cb);
  return () => {
    mqDesktop.removeEventListener("change", cb);
    mqTablet.removeEventListener("change", cb);
  };
}
const snapshot = () => (mqDesktop.matches ? "desktop" : mqTablet.matches ? "tablet" : "mobile");

export default function useDevice() {
  return useSyncExternalStore(subscribe, snapshot);
}
