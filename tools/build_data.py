"""Build src/data/products.json from a Shopify collection's public products.json.

Usage:
  python3 tools/build_data.py --store https://example.com --collection shirts \
      [--type Shirts] [--facet category="Category: "] [--group-prefix "Collab A" ...]

  --store         Live storefront origin (product links point here).
  --collection    Collection handle. Pages are fetched until one comes back empty.
  --type          Keep only this product_type (optional).
  --facet         field="Tag prefix: ". Adds a filter field from tags, e.g. fit="Fit: ".
                  Field names must match FILTER_GROUPS keys in src/brand.js.
  --group-prefix  Colorways starting with or containing this text get their own swatch group
                  (collabs and prints), separate from the style's solids. Repeatable.
  --title-prefix  Text stripped from the start of titles, e.g. "Men's ". Repeatable.

Titles are split as "<Style> - <Colorway>". Check the brand's title convention first and adjust
split_title() if it differs. Flat lays are detected by white corners, on-figure shots by studio
backdrops; spot-check the result in the prototype. Needs Pillow (pip install pillow).
"""
import argparse
import io
import json
import re
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
UA = {"User-Agent": "Mozilla/5.0 (TDS prototype data build)"}


def get_json(url):
    req = urllib.request.Request(url, headers=UA)
    return json.load(urllib.request.urlopen(req, timeout=30))


def fetch_img(url, width=160):
    req = urllib.request.Request(url.split("?")[0] + f"?width={width}", headers=UA)
    return Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=30).read())).convert("RGB")


def corners(im):
    w, h = im.size
    return [im.getpixel((2, 2)), im.getpixel((w - 3, 2)), im.getpixel((2, h - 3)), im.getpixel((w - 3, h - 3))]


def is_white(im):
    return min(min(c) for c in corners(im)) >= 235


def is_studio(im):
    cs = corners(im)
    sat = max(max(c) - min(c) for c in cs)
    spread = max(max(abs(a[i] - b[i]) for i in range(3)) for a in cs for b in cs)
    return sat < 28 and spread < 40


def garment_hex(im):
    w, h = im.size
    px = [im.getpixel((x, y)) for x in range(int(w * .3), int(w * .7), 3) for y in range(int(h * .3), int(h * .7), 3)]
    px = [p for p in px if min(p) < 235] or [(240, 240, 240)]
    px.sort(key=sum)
    return "#%02X%02X%02X" % px[len(px) // 2]


def classify(p):
    """Return (flat image, on-figure image or None, swatch hex)."""
    flat = hexv = studio = lifestyle = None
    for im in p["images"][:8]:
        try:
            small = fetch_img(im["src"])
        except Exception:
            continue
        rec = {"src": im["src"].split("?")[0], "w": im["width"], "h": im["height"]}
        if is_white(small):
            if flat is None:
                flat, hexv = rec, garment_hex(small)
        elif studio is None and is_studio(small) and im["height"] >= im["width"]:
            studio = rec
        elif lifestyle is None and im["height"] >= im["width"]:
            lifestyle = rec
    if flat is None and p["images"]:
        im = p["images"][0]
        flat = {"src": im["src"].split("?")[0], "w": im["width"], "h": im["height"]}
    return flat, studio or lifestyle, hexv or "#BBBDC0"


def split_title(title, prefixes):
    t = re.sub(r"\s+", " ", title.strip())
    for pre in prefixes:
        if t.startswith(pre):
            t = t[len(pre):]
    m = re.match(r"(.*?)\s+-\s+(.*)$", t)
    return (m.group(1).strip(), m.group(2).strip()) if m else (t, "")


def group_key(style, colorway, prefixes):
    for c in prefixes:
        if c.lower() in colorway.lower():
            return f"{style} · {c}"
    return style


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--store", required=True)
    ap.add_argument("--collection", required=True)
    ap.add_argument("--type")
    ap.add_argument("--facet", action="append", default=[])
    ap.add_argument("--group-prefix", action="append", default=[])
    ap.add_argument("--title-prefix", action="append", default=[])
    a = ap.parse_args()
    store = a.store.rstrip("/")
    facets = [f.split("=", 1) for f in a.facet]

    products, page = [], 1
    while True:
        batch = get_json(f"{store}/collections/{a.collection}/products.json?limit=250&page={page}")["products"]
        if not batch:
            break
        products += batch
        page += 1
    if a.type:
        products = [p for p in products if p["product_type"] == a.type]

    with ThreadPoolExecutor(max_workers=12) as ex:
        imgs = list(ex.map(classify, products))

    out = []
    for p, (flat, figure, hexv) in zip(products, imgs):
        style, colorway = split_title(p["title"], a.title_prefix)
        v = p["variants"]
        price = min(float(x["price"]) for x in v)
        cmp_ = max((float(x["compare_at_price"] or 0) for x in v), default=0)
        rec = {
            "id": p["id"], "handle": p["handle"], "url": f"{store}/products/{p['handle']}",
            "style": style, "colorway": colorway, "price": price,
            "compare": cmp_ if cmp_ > price else None,
            "available": any(x["available"] for x in v),
            "group": group_key(style, colorway, a.group_prefix), "swatch": hexv,
            "flat": flat, "figure": figure,
        }
        for field, prefix in facets:
            rec[field] = next((t[len(prefix):] for t in p["tags"] if t.startswith(prefix)), None)
        out.append(rec)

    out.sort(key=lambda x: not x["available"])  # stable: keeps merch order, sold out last
    (ROOT / "src/data/products.json").write_text(json.dumps(out, indent=1, ensure_ascii=False))
    print(f"{len(out)} products · {sum(1 for x in out if x['figure'])} with on-figure · "
          f"{sum(1 for x in out if not x['available'])} sold out · {sum(1 for x in out if x['compare'])} on sale")


if __name__ == "__main__":
    main()
