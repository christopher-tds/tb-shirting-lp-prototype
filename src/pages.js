// Page configs: one array of blocks per concept, in page order. Each entry names a block and its
// options, the same names and options as the Figma component sets ("LP / Story", Layout=A, ...).
// A new campaign page is a new array here plus its copy in content.js.

export const CONCEPTS = {
  v3: [
    { block: "hero" },
    { block: "intro", eyebrow: false },
    { block: "startHere", header: true },
    { block: "story", family: "PS" },
    { block: "productRow", family: "PS", display: "carousel" },
    { block: "story", family: "HT" },
    { block: "productRow", family: "HT", display: "carousel" },
    { block: "story", family: "TS" },
    { block: "productRow", family: "TS", display: "carousel" },
    { block: "band" },
    { block: "fit" },
    { block: "details", display: "carousel" },
  ],
  v4: [
    { block: "intro", eyebrow: true },
    { block: "startHere", header: false },
    { block: "story", family: "PS" },
    { block: "productRow", family: "PS", display: "carousel" },
    { block: "story", family: "HT" },
    { block: "productRow", family: "HT", display: "carousel" },
    { block: "story", family: "TS" },
    { block: "productRow", family: "TS", display: "carousel" },
    { block: "details", display: "carousel" },
    { block: "band" },
  ],
  v5: [
    { block: "intro", eyebrow: true },
    { block: "startHere", header: false },
    { block: "story", family: "PS" },
    { block: "story", family: "HT" },
    { block: "story", family: "TS" },
    { block: "productRow", family: "PS", display: "grid" },
    { block: "productRow", family: "HT", display: "grid" },
    { block: "productRow", family: "TS", display: "grid" },
    { block: "details", display: "tabs" },
    { block: "band" },
  ],
};

const params = new URLSearchParams(location.search);
// Concepts hidden from the picker. Their configs stay here so they can come back.
export const HIDDEN = ["v3"];
export const VISIBLE = Object.keys(CONCEPTS).filter((v) => !HIDDEN.includes(v));
export const initialConcept = VISIBLE.includes(params.get("v")) ? params.get("v") : VISIBLE[0];
if (params.has("v") && params.get("v") !== initialConcept) {
  const url = new URL(location.href);
  url.searchParams.set("v", initialConcept);
  history.replaceState(null, "", url); // an old ?v=v3 link lands on the first visible concept
}
