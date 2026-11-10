import { useState } from "react";
import SiteHeader from "./components/SiteHeader.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import { Band, Details, Fit, Hero, Intro, ProductRow, StartHere, Story } from "./blocks/blocks.jsx";
import { CONCEPTS, initialConcept } from "./pages.js";
import ReviewBar from "./review/ReviewBar.jsx";
import { showReviewBar } from "./review/config.js";

const BLOCKS = { hero: Hero, intro: Intro, startHere: StartHere, story: Story, productRow: ProductRow, band: Band, fit: Fit, details: Details };

// Renders one concept's page config. The concept comes from ?v= so the device frames match the page.
export default function App() {
  const [concept, setConcept] = useState(initialConcept);
  const choose = (v) => {
    setConcept(v);
    const url = new URL(location.href);
    url.searchParams.set("v", v);
    history.replaceState(null, "", url);
    scrollTo(0, 0);
  };
  const page = CONCEPTS[concept];
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">
        {page.map(({ block, ...opts }, i) => {
          const Block = BLOCKS[block];
          return <Block key={`${concept}-${i}`} {...opts} isFirst={i === 0} />;
        })}
      </main>
      <SiteFooter />
      {showReviewBar && <ReviewBar concept={concept} onConcept={choose} />}
    </>
  );
}
