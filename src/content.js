// Copy and images from the Figma desktop source (310:3895). Images are in public/assets/img.
// Products come from src/data/products.json.

import catalog from "./data/products.json";

const img = (name) => `assets/img/${name}.jpg`;

export const HERO = {
  headline: "Smart Shirting",
  line: "Three shirts to start with, and the rest of the range when you’re ready. Designed in Chicago for the workweek and the big nights.",
  image: img("hero"),
  alt: "Man in an olive double-breasted suit, white shirt and black knit tie on a Chicago sidewalk",
};

export const INTRO = {
  eyebrow: "Smart Shirting",
  line: "Every shirt here is 100% cotton, non-iron and cut long enough to stay tucked. The weave is what changes, so start there.",
};

// Start here card: catalog data for one product, with an on-model photo in place of the flat lay.
function kickoff(family, id, image, alt, line) {
  const p = catalog.families[family].products.find((x) => x.id === id);
  // No family heading above these cards, so the family leads and the fabric and collar follow on the second line
  // (editorial copy, not catalog data: the catalog names for Pinpoint and Textured are identical).
  // flatLay keeps the catalog's folded flat lay for the hover dissolve.
  return { ...p, name: catalog.families[family].name, color: line, image: `${image}&width=900`, flatLay: p.image, alt };
}

export const START_HERE = {
  title: "Three styles that get you in",
  link: "Shop all shirts",
  // One lead shirt per family, in story order. On-model photos from each product's gallery (square, cropped to 4:5).
  cards: [
    kickoff("PS", "shr-2952-0003", "https://cdn.shopify.com/s/files/1/0505/7019/9217/products/PDP_shr-2952-0003_main.jpg?v=1790879127", "Man in a white semi spread collar shirt, seated against a dark backdrop", "A fine, smooth weave with a semi spread collar that leaves room for any knot. Non-iron, so it comes out of the dryer ready."),
    kickoff("HT", "shr-5534-0003", "https://cdn.shopify.com/s/files/1/0505/7019/9217/files/PDP_Q124_shr-5534-0003_2_2.jpg?v=1790885547", "White pique bib tuxedo shirt worn with a black bow tie and dinner jacket", "A pique bib adds texture down the front. French cuffs come with removable buttons, so you can wear cufflinks or skip them."),
    kickoff("TS", "shr-3972-0201", "https://cdn.shopify.com/s/files/1/0505/7019/9217/products/shr-3972-0201_main.jpg?v=1790880986", "Smiling man in glasses wearing a light blue semi spread collar shirt", "A subtle textured weave gives you more depth than a plain solid, without committing to a pattern. Semi spread collar, non-iron."),
  ],
};

// One story per shirt family. `layout` picks the image/text arrangement (A, B, C).
export const STORIES = {
  PS: {
    layout: "A",
    eyebrow: "Pinpoint Solid",
    headline: "Monday through Friday, handled.",
    body: "A smooth pinpoint weave, a semi-spread collar that frames any knot, and a non-iron finish that comes out of the dryer ready to wear. The dress shirt the rest of the closet is built around.",
    link: "Shop Pinpoint Solid",
    href: "https://www.thetiebar.com/search?q=pinpoint%20solid%20shirt",
    images: [
      { src: img("story-a-1"), alt: "Man laughing in a white Pinpoint Solid shirt and navy knit tie in a workshop" },
      { src: img("story-a-2"), alt: "Close crop of a white Pinpoint Solid shirt with a navy knit tie" },
    ],
  },
  HT: {
    layout: "B",
    eyebrow: "Herringbone Tuxedo",
    headline: "For the nights that matter.",
    body: "A fine herringbone weave, a crisp point collar and French cuffs made for studs and cufflinks. Built for weddings, black tie and New Year’s Eve.",
    link: "Shop Herringbone Tuxedo",
    href: "https://www.thetiebar.com/search?q=herringbone%20tuxedo%20shirt",
    images: [
      { src: img("story-b-1"), alt: "Man in a dark suit and white Herringbone Tuxedo shirt against city towers" },
      { src: img("story-b-2"), alt: "Man in a dark suit standing among white hydrangeas in a city park" },
    ],
  },
  TS: {
    layout: "C",
    eyebrow: "Textured Solid",
    headline: "Texture you notice up close.",
    body: "A subtle weave gives the classic dress shirt more depth than a plain solid. Non-iron, in white, light blue and seasonal colors.",
    link: "Shop Textured Solid",
    href: "https://www.thetiebar.com/search?q=textured%20solid%20shirt",
    images: [
      { src: img("story-c-1"), alt: "Man in a gray suit, light shirt and dark tie in a studio" },
      { src: img("story-c-2"), alt: "Black and white close crop of a hand adjusting a tie over a Textured Solid shirt" },
    ],
  },
};

// Shirt families. `count` is the number of styles; the row shows that many cards.
// Real products from src/data/products.json: a hand-built snapshot of thetiebar.com (2026-11-08).
// Names and colors are shown as stored; prices and stock go stale, so refresh before a review.
export const FAMILIES = Object.fromEntries(
  Object.entries(catalog.families).map(([k, f]) => [k, { name: f.name, count: f.products.length }]),
);

export function products(family) {
  return catalog.families[family].products;
}

export const BAND = {
  eyebrow: "Classic Shirting",
  quote: "Every good wardrobe is built on a smart shirt. Ours hold a tie knot through a Monday meeting and still looks sharp at a Saturday wedding.",
  image: img("band"),
  alt: "Close crop of a man opening an olive suit jacket to show the Tie Bar label",
};

export const FIT = {
  title: "Find your fit",
  note: "Two fits across the range. Some newer styles come in Trim only.",
  link: "Size guide",
  fits: [
    { name: "Standard", body: "Room through the chest and body without the extra fabric. Easy to wear from the first meeting to the last call.", link: "Shop Standard fit", image: img("fit"), alt: "White dress shirt in the Standard fit, on a form" },
    { name: "Trim", body: "Tapered through the chest and waist for a close, clean line. Sharpest under a jacket.", link: "Shop Trim fit", image: img("fit"), alt: "White dress shirt in the Trim fit, on a form" },
  ],
};

// Detail names set in sentence case (C2); the Figma source has them in title case.
export const DETAILS = {
  title: "Details that matter",
  items: [
    { name: "Button-down collar", body: "A slightly longer collar point frames a tie knot cleanly and still sits right when you skip the tie.", image: img("detail-1"), alt: "Man in a white button-down collar shirt" },
    { name: "Barrel cuffs", body: "Clean, simple cuffs that keep the shirt looking casual and are easy to roll up once the day warms up.", image: img("detail-2"), alt: "Close crop of a white barrel cuff with two buttons" },
    { name: "Cut shorter", body: "The hem is shorter than a dress shirt's, so it looks intentional untucked and still stays in when tucked.", image: img("detail-3"), alt: "Man in a white shirt worn untucked, holding a dark jacket" },
    { name: "100% cotton", body: "Soft from the first wear and softer with every wash. It's machine washable, so a quick steam is all it needs before you head out.", image: img("detail-4"), alt: "Close crop of white cotton shirting" },
  ],
};
