import { FOOTER } from "../brand.js";

// Live thetiebar.com footer, measured 2026-11-08 at 1440, 820 and 393 (leaf-dark background).
// 1440: logo 162 × 62 with a rule to its right; subscribe, chat and contact on the left; three link
//   columns from x 664; follow row under the columns; legal bar and consumer notice below a rule. 48px margins.
// 820: logo 120 × 46; subscribe beside chat + contact; three columns below; legal centered. 48px margins.
// 393: logo centered between two rules; everything stacked; chat + contact side by side. 20px margins.
// Icons are Phosphor Regular (C16), drawn as masks so they take the text color; the live site uses its own set.
const glyph = (name, size) => (
  <span className="glyph" aria-hidden="true" style={{ "--glyph": `url(assets/icons/${name}.svg)`, "--size": `${size}px` }} />
);
const label = (l) => (typeof l === "string" ? { label: l } : l);
const NewTab = () => <><span className="sr-only"> (opens in a new tab)</span>{glyph("arrow-square-out", 16)}</>;

export default function SiteFooter() {
  const { subscribe, columns, social, copyright, legal, notice } = FOOTER;
  return (
    <footer className="site-footer">
      <div className="ft__brand">
        <a className="ft__logo" href="#" aria-label="The Tie Bar home" />
      </div>

      <div className="ft__main">
        <div className="ft__lead">
          <form className="ft__subscribe" onSubmit={(e) => e.preventDefault()}>
            <h2 className="ft__title">{subscribe.title}</h2>
            <p className="ft__note" id="ft-note">{subscribe.note}</p>
            <div className="ft__field">
              <label className="sr-only" htmlFor="ft-email">{subscribe.placeholder}</label>
              <input id="ft-email" type="email" placeholder={subscribe.placeholder} aria-describedby="ft-note" autoComplete="email" />
              <button type="submit" aria-label="Subscribe to newsletter">{glyph("arrow-right", 32)}</button>
            </div>
          </form>
          <div className="ft__help">
            <button type="button" className="ft__contact"><span className="ft__disc">{glyph("chat-circle", 32)}</span>Chat</button>
            <a href="#" className="ft__contact"><span className="ft__disc">{glyph("envelope-simple", 32)}</span>Contact</a>
          </div>
        </div>

        <div className="ft__cols">
          {columns.map((c) => (
            <nav key={c.title} className="ft__col" aria-label={c.title}>
              <h2 className="ft__title">{c.title}</h2>
              <ul>
                {c.links.map(label).map((l) => (
                  <li key={l.label}><a href="#">{l.label}{l.external && <NewTab />}</a></li>
                ))}
              </ul>
              {c.region && (
                <a className="ft__region" href="#"><img src="assets/flag-ca.svg" alt="" width="25" height="14" />{c.region}</a>
              )}
            </nav>
          ))}
          <div className="ft__follow">
            <h2 className="ft__title">Follow Us:</h2>
            <ul>
              {social.map((s) => (
                <li key={s}><a href="#" aria-label={`${s} (opens in a new tab)`}>{glyph(`${s.toLowerCase()}-logo`, 32)}</a></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="ft__legal">
        <p className="ft__copy">{copyright}</p>
        <ul>
          {legal.map(label).map((l) => (
            <li key={l.label}><a href="#">{l.label}{l.external && <NewTab />}</a></li>
          ))}
        </ul>
      </div>
      <p className="ft__notice"><strong>Notice to Consumers:</strong> {notice}&nbsp;<a href="#">Privacy Policy.</a></p>
    </footer>
  );
}
