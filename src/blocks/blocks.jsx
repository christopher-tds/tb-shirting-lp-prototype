import { useEffect, useRef, useState } from "react";
import { BAND, DETAILS, FAMILIES, FIT, HERO, INTRO, START_HERE, STORIES, products } from "../content.js";
import { Arrows, DetailCard, KickoffCard, Progress, ProductCard, TextLink } from "../parts/parts.jsx";
import useTrack from "../parts/useTrack.js";
import { motionOff } from "../motion.js";

// One component per Figma block component set ("LP / Hero", "LP / Story", ...). Options arrive as props
// from pages.js. Layout per breakpoint lives in styles.css.

export function Hero() {
  return (
    <section className="hero">
      <img className="hero__img" src={HERO.image} alt={HERO.alt} fetchPriority="high" />
      <div className="hero__copy">
        <h1 className="hero__headline">{HERO.headline}</h1>
        <p className="hero__line">{HERO.line}</p>
      </div>
    </section>
  );
}

export function Intro({ eyebrow, isFirst }) {
  const Line = isFirst ? "h1" : "p";
  return (
    <section className="intro">
      {eyebrow && <p className="eyebrow">{INTRO.eyebrow}</p>}
      <Line className="intro__line">{INTRO.line}</Line>
    </section>
  );
}

export function StartHere({ header }) {
  const track = useTrack();
  return (
    <section className="start-here" aria-label={header ? undefined : START_HERE.title}>
      {header && (
        <div className="block-head">
          <h2 className="title">{START_HERE.title}</h2>
          <TextLink>{START_HERE.link}</TextLink>
        </div>
      )}
      <div className="track track--kickoff" ref={track.ref}>
        {START_HERE.cards.map((c, i) => <KickoffCard key={i} c={c} />)}
      </div>
      <div className="track-foot"><Progress track={track} /></div>
    </section>
  );
}

export function Story({ family }) {
  const s = STORIES[family];
  const [main, second] = s.images;
  return (
    <section className={`story story--${s.layout}`}>
      <div className="story__panel">
        <p className="eyebrow">{s.eyebrow}</p>
        <h2 className="story__headline">{s.headline}</h2>
        <p className="story__body">{s.body}</p>
        <TextLink href={s.href}>{s.link}</TextLink>
      </div>
      {/* Images go where the CTA goes. Kept out of the tab order and hidden from screen readers so each
          story has one announced link (the CTA), not three to the same place. */}
      <a className="story__img story__img--main ratio-4x5" href={s.href} tabIndex={-1} aria-hidden="true"><img src={main.src} alt="" loading="lazy" /></a>
      <a className="story__img story__img--second ratio-4x5" href={s.href} tabIndex={-1} aria-hidden="true"><img src={second.src} alt="" loading="lazy" /></a>
    </section>
  );
}

export function ProductRow({ family, display }) {
  const f = FAMILIES[family];
  const items = products(family);
  const track = useTrack();
  const head = (
    <div className="row-head">
      <h2 className="row-head__family">{f.name}</h2>
      <span className="row-head__count">{f.count} styles</span>
      {display === "carousel" && <Arrows track={track} label={`${f.name} styles`} />}
    </div>
  );
  if (display === "grid") {
    return (
      <section className="product-row product-row--grid">
        {head}
        <div className="grid">{items.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>
    );
  }
  return (
    <section className="product-row">
      {head}
      <div className="track track--products" ref={track.ref}>{items.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      <div className="track-foot"><Progress track={track} /></div>
    </section>
  );
}

export function Band() {
  return (
    <section className="band">
      <img className="band__img" src={BAND.image} alt={BAND.alt} loading="lazy" />
      <div className="band__copy">
        <p className="eyebrow">{BAND.eyebrow}</p>
        <p className="band__quote">{BAND.quote}</p>
      </div>
    </section>
  );
}

export function Fit() {
  return (
    <section className="fit">
      <div className="fit__head">
        <div>
          <h2 className="title">{FIT.title}</h2>
          <p className="fit__note">{FIT.note}</p>
        </div>
        <TextLink tone="light">{FIT.link}</TextLink>
      </div>
      <div className="fit__list">
        {FIT.fits.map((x) => (
          <div className="fit__item" key={x.name}>
            <div className="ratio-4x5"><img src={x.image} alt={x.alt} loading="lazy" /></div>
            <h3 className="fit__name">{x.name}</h3>
            <p className="fit__body">{x.body}</p>
            <TextLink tone="light">{x.link}</TextLink>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Details({ display }) {
  return display === "tabs" ? <DetailsTabs /> : <DetailsCarousel />;
}

function DetailsCarousel() {
  const track = useTrack();
  return (
    <section className="details">
      <div className="block-head">
        <h2 className="title">{DETAILS.title}</h2>
        <Arrows track={track} label="details" />
      </div>
      <div className="track track--details" ref={track.ref}>{DETAILS.items.map((d) => <DetailCard key={d.name} d={d} />)}</div>
      <div className="track-foot"><Progress track={track} /></div>
    </section>
  );
}

// Auto-rotate tabs, ported from the playground's auto-rotating tabs
// (christopher-tds.github.io/playground/auto-rotating-tabs): the image comes into focus from a blur
// while the old one blurs out on top, the open tab's line expands and fades up, and the timer is
// time-based so pause holds the bar where it is and play resumes it. Rotation runs 6s per item, only
// while a quarter of the block is in view. Picking a tab stops it for good; it never starts with
// reduced motion (C14, WCAG 2.2.2).
const ROTATE_MS = 6000;
const FOCUS_MS = 900; // keep in step with --focus-ms in styles.css
function DetailsTabs() {
  const n = DETAILS.items.length;
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState(null);
  const [playing, setPlaying] = useState(() => !motionOff());
  const [held, setHeld] = useState(false); // a tab was picked: its bar shows full
  const [visible, setVisible] = useState(false);
  const root = useRef(null);
  const bars = useRef([]);
  const activeRef = useRef(0);
  const elapsed = useRef(0);
  const leaveTimer = useRef(null);

  const go = (i) => {
    const prev = activeRef.current;
    elapsed.current = 0;
    if (i === prev) return;
    activeRef.current = i;
    setActive(i);
    if (motionOff()) return;
    setLeaving(prev);
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setLeaving(null), FOCUS_MS);
  };

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(root.current);
    return () => { io.disconnect(); clearTimeout(leaveTimer.current); };
  }, []);

  // A new tab starts its bar empty.
  useEffect(() => {
    bars.current.forEach((b) => { if (b) b.style.transform = "scaleX(0)"; });
  }, [active]);

  // The timer loop only runs while rotating. Coming back to a hidden browser tab restarts the
  // frame clock, so the time away doesn't count.
  useEffect(() => {
    if (!playing || !visible) return;
    let last = 0;
    let frame;
    const onHidden = () => { last = 0; };
    document.addEventListener("visibilitychange", onHidden);
    const tick = (now) => {
      elapsed.current += last ? now - last : 0;
      last = now;
      if (elapsed.current >= ROTATE_MS) go((activeRef.current + 1) % n);
      const bar = bars.current[activeRef.current];
      if (bar) bar.style.transform = `scaleX(${Math.min(elapsed.current / ROTATE_MS, 1)})`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); document.removeEventListener("visibilitychange", onHidden); };
  }, [playing, visible, n]);

  const pick = (i) => { setPlaying(false); setHeld(true); go(i); };
  const toggle = () => { setHeld(false); setPlaying((p) => !p); };
  const full = !playing && (held || motionOff());
  return (
    <section className="details-tabs" ref={root}>
      <h2 className="title details-tabs__title">{DETAILS.title}</h2>
      <div className="details-tabs__media ratio-4x5">
        {DETAILS.items.map((d, i) => (
          <img key={d.name} src={d.image} alt={i === active ? d.alt : ""} loading="lazy"
            className={i === active ? "is-active" : i === leaving ? "is-leaving" : ""} />
        ))}
        <button className="pause" type="button" onClick={toggle}
          aria-label={playing ? "Pause rotation" : "Play rotation"}>
          <span className="glyph" aria-hidden="true" style={{ "--size": "24px", "--glyph": `url(assets/icons/${playing ? "pause-fill" : "play-fill"}.svg)` }} />
        </button>
      </div>
      <div className="details-tabs__list" role="tablist" aria-label={DETAILS.title}>
        {DETAILS.items.map((d, i) => {
          const on = i === active;
          return (
            <div className={`tab${on ? " is-active" : ""}`} key={d.name}>
              <span className="tab__bar" aria-hidden="true">
                <span className={`tab__fill${on && full ? " is-full" : ""}`} ref={(el) => { bars.current[i] = el; }} />
              </span>
              <button type="button" role="tab" aria-selected={on} onClick={() => pick(i)}>{d.name}</button>
              <div className="tab__body" inert={!on}><div><p className="tab__desc">{d.body}</p></div></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
