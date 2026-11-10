// Motion helpers. All motion is off with prefers-reduced-motion (C14).
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
export const motionOff = () => reduceMotion.matches;
