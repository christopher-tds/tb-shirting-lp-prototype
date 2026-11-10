// Tie Bar shirting landing page. Every value here has a source:
// - Header: measured on thetiebar.com at 393, 820 and 1440 (2026-11-08).
// - Breakpoints: tb-shopify-hydrogen/app/styles/config.css (sm 600, sm-md 800, md 1000, lg 1440).
// - Copy, images and layout: Figma xvrPbRTCGNwxpVMM01q5K0, sections "Shirting LP · Components" and "Pages".

export const BRAND = {
  name: "The Tie Bar",
  storeUrl: "https://www.thetiebar.com",
};

// Live header, 2026-11-08. The announcement bar rotates three messages on the live site; the
// prototype shows the one that matches this campaign.
export const HEADER = {
  announcement: { text: "Signature Dress Shirts: 3 for $160", link: "Shop Now" },
  nav: ["New", "Ties", "Bow Ties", "Dress Shirts", "Polos & Sweaters", "Suits & Jackets", "Accessories", "Wedding"],
  current: "Dress Shirts",
  secondary: "Support",
};

// Live thetiebar.com footer, copied 2026-11-08. Copy is kept exactly as live (title case included),
// like the header nav.
export const FOOTER = {
  subscribe: { title: "Subscribe", note: "Sign up and save 10% off your first purchase", placeholder: "Email address" },
  columns: [
    { title: "Help Links", links: ["Contact Us", "FAQ", "Shipping & Delivery", "Returns & Exchanges", "Tie Care"] },
    { title: "Quick Links", links: ["Promotions", "Wholesale", "Custom/Logo Neckties", "Gift Cards", "Tie Size Guide", "Shirt Size Guide", "Jackets Size Guide"] },
    { title: "About The Tie Bar", links: ["About Us", { label: "Careers", external: true }, "Chicago Store"], region: "Canada" },
  ],
  social: ["Facebook", "Instagram", "Pinterest", "YouTube"],
  copyright: "The Tie Bar Copyright © 2026 All Rights Reserved",
  legal: ["Accessibility", { label: "Do Not Sell or Share My Personal Information/Your Privacy Choices", external: true }, "Terms of Use", "Privacy Notice"],
  notice: "The Tie Bar may collect “identifiers”, “characteristics of protected classifications” under California, federal or other applicable law, “Commercial information”, “Internet or other electronic network activity”, and/or “Geolocation data” when you visit this website, and may use such information to draw inferences and for other operational and commercial purposes. For more information, please see our",
};

// Layout switches at sm-md (800) and md (1000). Same numbers in useDevice.js and styles.css.
export const BREAKPOINTS = { tablet: 800, desktop: 1000 };
