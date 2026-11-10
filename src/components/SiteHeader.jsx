import { BRAND, HEADER } from "../brand.js";
import { icon } from "../parts/parts.jsx";

// Live thetiebar.com header, measured 2026-11-08:
// 1440: 38px announcement + 66px nav row, logo 105 × 40 left, Poynter Condensed Bold 16 nav, 24px icons.
// 820 / 393: 36px announcement + 64px row, logo 110 × 40 centered, menu + search left, account + bag right,
// 28px icons in 40px targets, 24px (820) / 20px (393) side margins.
// Icons are Phosphor Regular (C16); the live site uses its own set.
export default function SiteHeader() {
  const { announcement, nav, current, secondary } = HEADER;
  return (
    <header className="site-header">
      <div className="announce">
        <a href="#">{announcement.text} <span className="announce__cta">{announcement.link}</span></a>
      </div>
      <nav className="nav" aria-label="Main">
        <div className="nav__start">
          <button className="icon-btn nav__touch" type="button" aria-label="Open menu">{icon("list", 28)}</button>
          <button className="icon-btn nav__touch" type="button" aria-label="Search">{icon("search", 28)}</button>
        </div>
        <a className="logo" href={BRAND.storeUrl} aria-label={`${BRAND.name} home`}>
          <img src="assets/tie-bar-logo.svg" alt="" />
        </a>
        <ul className="nav__list">
          {nav.map((label) => (
            <li key={label}><a href="#" aria-current={label === current ? "page" : undefined}>{label}</a></li>
          ))}
        </ul>
        <div className="nav__end">
          <a className="nav__text" href="#">{secondary}</a>
          <button className="icon-btn nav__wide" type="button" aria-label="Search">{icon("search")}</button>
          <a className="icon-btn" href="#" aria-label="Account"><span className="icon-24">{icon("account")}</span><span className="icon-28">{icon("account", 28)}</span></a>
          <a className="icon-btn" href="#" aria-label="Shopping bag"><span className="icon-24">{icon("cart")}</span><span className="icon-28">{icon("cart", 28)}</span></a>
        </div>
      </nav>
    </header>
  );
}
