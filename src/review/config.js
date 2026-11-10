// Review tools (concept + viewport pickers). Not part of the design.
// Set to false to hide them. ?clean hides them for screenshots.
export const REVIEW_TOOLS = true;

const params = new URLSearchParams(location.search);
export const inFrame = window.self !== window.top; // inside the Tablet / Mobile frame
export const clean = params.has("clean");
export const showReviewBar = REVIEW_TOOLS && !inFrame && !clean;

// TEMPORARY: tuner (text link size, Story headline line height, Story 2-up). Values are CSS custom properties kept in localStorage;
// they apply to this page and, through storage events, to the Tablet / Mobile frames.
export const TUNE_KEY = "tb-lp-tuner";
const TUNE_VARS = [
  "--story-lh-sm", "--story-lh-md", "--story-lh-lg",
  "--two-up-main-sm", "--two-up-second-sm", "--two-up-gap-sm", "--two-up-main-md", "--two-up-second-md", "--two-up-gap-md",
  "--link-size-sm", "--link-size-md", "--link-size-lg",
];
export function applyTune() {
  if (!REVIEW_TOOLS) return;
  let t = null;
  try { t = JSON.parse(localStorage.getItem(TUNE_KEY) || "null"); } catch (e) { /* storage blocked */ }
  const root = document.documentElement;
  for (const k of TUNE_VARS) {
    if (t?.[k] !== undefined) root.style.setProperty(k, t[k]); else root.style.removeProperty(k);
  }
}
window.addEventListener("storage", (e) => { if (e.key === TUNE_KEY) applyTune(); });
applyTune();
