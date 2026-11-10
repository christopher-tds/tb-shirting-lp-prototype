// Base components. Each matches a Figma base component in "Shirting LP · Components".
import useTrack from "./useTrack.js";

const icon = (name, size = 24) => <img src={`assets/icons/${name}.svg`} alt="" width={size} height={size} />;
export { icon };

// LP / Text link: verb-first, underlined, 24px tall hit area (C6, C10). Tone "light" on photos and leaf.
export function TextLink({ children, tone = "dark", href = "#" }) {
  return <a className={`text-link text-link--${tone}`} href={href}>{children}</a>;
}

// LP / Product card: 1:1 image on gray-20, one badge at most (C15). When the product has an on-model
// photo (p.lifestyle), desktop dissolves to it on hover; below 800 or on touch it's a two-image swipe
// with a 1px position bar under the image (styles.css decides which).
export function ProductCard({ p }) {
  const soldOut = p.state === "sold-out";
  const badge = p.state && <span className="badge">{soldOut ? "Sold out" : "Sale"}</span>;
  return (
    // draggable={false}: a link starts a native drag after a few pixels, which cancels the mouse
    // swipe on the image (and on carousel rows).
    <a className={`product-card${soldOut ? " is-sold-out" : ""}`} href={p.url || "#"} draggable={false}>
      {p.lifestyle ? <CardMedia p={p} badge={badge} /> : (
        <div className="product-card__image">
          <img src={p.image} alt={p.alt} loading="lazy" draggable="false" />
          {badge}
        </div>
      )}
      <div className="product-card__text">
        <p className="product-card__name">{p.name}</p>
        <p className="product-card__color">{p.color}</p>
        <p className="product-card__price">
          <span>{p.price}</span>
          {p.compareAt && <s className="product-card__compare"><span className="visually-hidden">Was </span>{p.compareAt}</s>}
        </p>
      </div>
    </a>
  );
}

function CardMedia({ p, badge }) {
  const track = useTrack({ nested: true });
  return (
    <div className="product-card__media">
      <div className="product-card__image product-card__slides" ref={track.ref}>
        <img src={p.image} alt={p.alt} loading="lazy" draggable="false" />
        <img className="product-card__alt" src={p.lifestyle} alt="" aria-hidden="true" loading="lazy" draggable="false" />
      </div>
      {badge}
      <Progress track={track} thin />
    </div>
  );
}

// LP / Kickoff card: on-model 4:5. On hover (pointer devices only) it dissolves to the folded flat lay.
export function KickoffCard({ c }) {
  return (
    <a className="kickoff-card" href={c.url || "#"} draggable={false}>
      <div className="ratio-4x5">
        <img src={c.image} alt={c.alt} loading="lazy" draggable="false" />
        {c.flatLay && <img className="kickoff-card__flat" src={c.flatLay} alt="" aria-hidden="true" loading="lazy" draggable="false" />}
      </div>
      <div className="product-card__text">
        <p className="product-card__name">{c.name}</p>
        <p className="product-card__color">{c.color}</p>
        <p className="product-card__price">{c.price}</p>
      </div>
    </a>
  );
}

// LP / Detail card: 4:5 crop, name and one line.
export function DetailCard({ d }) {
  return (
    <div className="detail-card">
      <div className="ratio-4x5"><img src={d.image} alt={d.alt} loading="lazy" draggable="false" /></div>
      <p className="detail-card__name">{d.name}</p>
      <p className="detail-card__body">{d.body}</p>
    </div>
  );
}

// LP / Progress: 2px position bar for swipe rows, only when the row overflows (C14).
export function Progress({ track, thin }) {
  if (!track.overflow) return null;
  return (
    <div className={`progress${thin ? " progress--thin" : ""}`} aria-hidden="true">
      <span style={{ width: `${track.thumb * 100}%`, transform: `translateX(${(track.left / track.thumb) * 100}%)` }} />
    </div>
  );
}

// Desktop arrows, 32px hit areas, only when the row overflows.
export function Arrows({ track, label }) {
  if (!track.overflow) return null;
  return (
    <div className="arrows">
      <button type="button" aria-label={`Previous ${label}`} disabled={track.start} onClick={() => track.step(-1)}>{icon("arrow-left")}</button>
      <button type="button" aria-label={`Next ${label}`} disabled={track.end} onClick={() => track.step(1)}>{icon("arrow-right")}</button>
    </div>
  );
}
