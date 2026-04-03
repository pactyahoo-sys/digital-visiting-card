import { Toaster } from "@/components/ui/sonner";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Card } from "./backend";
import { createActorWithConfig } from "./config";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { getSecretParameter } from "./utils/urlParams";

const AdminModal = lazy(() => import("./components/AdminModal"));

const DEFAULT_PROFILE_IMG = `${import.meta.env.BASE_URL}assets/uploads/nagarajan-profile.png`;
const ADMIN_TOKEN =
  "1e581627646314b614bb87163831cc22942989b99300e6114068c0d2ca77185a";
const EXTERNAL_WEBSITE = "https://instasite.in";

const FALLBACK_CARD: Card = {
  name: "Nagarajan",
  jobTitle: "Sales Officer",
  company: "InstaSite Kerala",
  bio: "Premium Digital Business Cards & Websites",
  phone: "+918838510443",
  email: "cynorlux@gmail.com",
  location: "Thiruvananthapuram, Kerala",
  website: EXTERNAL_WEBSITE,
  profilePhotoUrl: "",
};

// ── Translations ─────────────────────────────────────────────────────────────
const t = {
  en: {
    brandName: "InstaSite Kerala",
    tagline: "Kerala's Fastest Digital Business Cards",
    buildLaunchGrow: "Ready in 30 Minutes. No Coding. No Hassle.",
    happyClients: "500+ Kerala Businesses Trust Us",
    trustedBadge: "✓ Trusted by 500+ Kerala Businesses",
    saveContact: "Save Contact",
    callNow: "Call Now",
    whatsapp: "WhatsApp",
    location: "Location",
    visitWebsite: "Visit Website",
    shareCard: "Share this Card",
    showQR: "Show QR Code",
    hideQR: "Hide QR Code",
    scanQR: "Scan to Save Contact Instantly",
    ourServices: "Our Services",
    ourWork: "Our Work",
    findUs: "Find Us",
    bookDemo: "Book a Free Demo",
    yourName: "Your Name",
    phoneNumber: "Phone Number",
    message: "Message (optional)",
    sendMessage: "Book Free Demo via WhatsApp",
    contactUs: "Contact Us",
    whatsappCta: "Chat on WhatsApp – Get Free Card",
    footerCta: "Create Your Free Website Now – No Coding Needed",
    adminLogin: "Admin Login",
    loggingIn: "Logging in...",
    salesOfficer: "Sales Officer",
    jobTitle: "Sales Officer",
    navHome: "Home",
    navServices: "Services",
    navGallery: "Gallery",
    navContact: "Contact",
    liveDemoTitle: "See Live Examples",
    liveDemoSubtitle: "Real cards built for Kerala businesses",
    viewDemo: "View Demo",
    testimonialsTitle: "What Our Clients Say",
    whyChooseTitle: "Why Choose InstaSite Kerala",
    pricingTitle: "Simple, Honest Pricing",
    pricingSubtitle: "Start free — upgrade anytime",
    freeTierName: "Free Trial",
    freeTierPrice: "₹0",
    freeTierDesc: "Try your digital card for 7 days free",
    freeTierCta: "Start Free",
    proTierName: "Pro",
    proTierPrice: "₹999",
    proTierPeriod: "/year",
    proTierPopular: "Most Popular",
    proTierDesc: "Digital Card + Website + QR Code + WhatsApp CTA + SEO",
    proTierCta: "Get Pro",
    bizTierName: "Business",
    bizTierPrice: "₹1,999",
    bizTierPeriod: "/year",
    bizTierDesc:
      "Everything in Pro + Gallery + Maps + Booking Form + Priority Support",
    bizTierCta: "Get Business",
    galleryItems: [
      "Digital Card",
      "Business Website",
      "Social Media",
      "Branding",
      "SEO Campaign",
      "Local Business",
    ],
    services: [
      {
        icon: "📇",
        title: "Digital Business Cards",
        desc: "Get more clients — share your card via WhatsApp in one tap",
      },
      {
        icon: "🌐",
        title: "Business Websites",
        desc: "Rank on Google and get found by local Kerala customers",
      },
      {
        icon: "📱",
        title: "Social Media Branding",
        desc: "Look professional on Instagram, Facebook, and WhatsApp",
      },
      {
        icon: "📈",
        title: "SEO & Marketing",
        desc: "Be the first result when customers search your business in Kerala",
      },
    ],
    testimonials: [
      {
        name: "Priya R.",
        role: "Boutique Owner, Kochi",
        text: "Got my digital card in 30 minutes. My customers love tapping to save my contact!",
        stars: 5,
      },
      {
        name: "Suresh M.",
        role: "Real Estate Agent, Trivandrum",
        text: "Best investment for my business. Clients find me on Google now thanks to the SEO setup.",
        stars: 5,
      },
      {
        name: "Anitha K.",
        role: "Salon Owner, Kozhikode",
        text: "The WhatsApp button alone doubled my bookings. Totally worth it!",
        stars: 5,
      },
    ],
    whyChoose: [
      {
        icon: "⚡",
        title: "Ready in 30 Minutes",
        desc: "Your digital card goes live the same day, no waiting",
      },
      {
        icon: "📱",
        title: "Works on Any Phone",
        desc: "Share via WhatsApp, SMS, or QR — no app download needed",
      },
      {
        icon: "🔍",
        title: "Google-Ready SEO",
        desc: "Built-in SEO so local customers find you on Google search",
      },
      {
        icon: "🛡️",
        title: "Lifetime Free Updates",
        desc: "We update your card whenever you need, no extra charge",
      },
    ],
    demoPreviews: [
      {
        label: "Doctor Card",
        sub: "Dr. Ramesh Kumar",
        gradient: "linear-gradient(135deg, #0b3d91 0%, #00e5ff 100%)",
      },
      {
        label: "Shop Owner",
        sub: "Anand Textiles",
        gradient: "linear-gradient(135deg, #7c3aed 0%, #f97316 100%)",
      },
      {
        label: "Freelancer",
        sub: "Priya Designs",
        gradient: "linear-gradient(135deg, #0d7849 0%, #22c55e 100%)",
      },
    ],
  },
  ml: {
    brandName: "ഇൻസ്റ്റ സൈറ്റ് കേരള",
    tagline: "കേരളത്തിലെ ഏറ്റവും വേഗമേറിയ ഡിജിറ്റൽ ബിസിനസ് കാർഡ്",
    buildLaunchGrow: "30 മിനിറ്റിൽ തയ്യാർ. കോഡിംഗ് ഇല്ല. ഝടുതിയില്ല.",
    happyClients: "500+ കേരള ബിസിനസുകൾ ഞങ്ങളിൽ വിശ്വസിക്കുന്നു",
    trustedBadge: "✓ 500+ കേരള ബിസിനസുകൾ വിശ്വസിക്കുന്നു",
    saveContact: "കോൺടാക്ട് സേവ് ചെയ്യുക",
    callNow: "ഇപ്പോൾ വിളിക്കൂ",
    whatsapp: "വാട്സ്ആപ്പ്",
    location: "ലൊക്കേഷൻ",
    visitWebsite: "വെബ്സൈറ്റ് സന്ദർശിക്കൂ",
    shareCard: "ഈ കാർഡ് ഷെയർ ചെയ്യൂ",
    showQR: "QR കോഡ് കാണൂ",
    hideQR: "QR കോഡ് മറയ്ക്കൂ",
    scanQR: "കോൺടാക്ട് സേവ് ചെയ്യാൻ സ്കാൻ ചെയ്യൂ",
    ourServices: "ഞങ്ങളുടെ സേവനങ്ങൾ",
    ourWork: "ഞങ്ങളുടെ പ്രവർത്തനം",
    findUs: "ഞങ്ങളെ കണ്ടെത്തൂ",
    bookDemo: "സൗജന്യ ഡെമോ ബുക്ക് ചെയ്യൂ",
    yourName: "നിങ്ങളുടെ പേര്",
    phoneNumber: "ഫോൺ നമ്പർ",
    message: "സന്ദേശം (ഐച്ഛികം)",
    sendMessage: "WhatsApp വഴി ഡെമോ ബുക്ക് ചെയ്യൂ",
    contactUs: "ഞങ്ങളെ ബന്ധപ്പെടൂ",
    whatsappCta: "WhatsApp-ൽ ചാറ്റ് ചെയ്യൂ – സൗജന്യ കാർഡ് നേടൂ",
    footerCta: "ഇപ്പോൾ നിങ്ങളുടെ സൗജന്യ വെബ്സൈറ്റ് ഉണ്ടാക്കൂ – കോഡിംഗ് ആവശ്യമില്ല",
    adminLogin: "അഡ്മിൻ ലോഗിൻ",
    loggingIn: "ലോഗിൻ ചെയ്യുന്നു...",
    salesOfficer: "സെയിൽസ് ഓഫീസർ",
    jobTitle: "സെയിൽസ് ഓഫീസർ",
    navHome: "ഹോം",
    navServices: "സേവനങ്ങൾ",
    navGallery: "ഗാലറി",
    navContact: "ബന്ധപ്പെടൂ",
    liveDemoTitle: "ലൈവ് ഉദാഹരണങ്ങൾ കാണൂ",
    liveDemoSubtitle: "കേരള ബിസിനസുകൾക്കായി നിർമ്മിച്ച യഥാർത്ഥ കാർഡുകൾ",
    viewDemo: "ഡെമോ കാണൂ",
    testimonialsTitle: "ക്ലയൻ്റുകൾ പറയുന്നത്",
    whyChooseTitle: "InstaSite Kerala തിരഞ്ഞെടുക്കാൻ കാരണം",
    pricingTitle: "ലളിതമായ, സത്യസന്ധമായ വില",
    pricingSubtitle: "സൗജന്യമായി ആരംഭിക്കൂ — എപ്പോൾ വേണമെങ്കിലും അപ്‌ഗ്രേഡ് ചെയ്യൂ",
    freeTierName: "ഫ്രീ ട്രയൽ",
    freeTierPrice: "₹0",
    freeTierDesc: "7 ദിവസം സൗജന്യമായി ട്രൈ ചെയ്യൂ",
    freeTierCta: "ഫ്രീ ആരംഭിക്കൂ",
    proTierName: "പ്രോ",
    proTierPrice: "₹999",
    proTierPeriod: "/വർഷം",
    proTierPopular: "ഏറ്റവും ജനപ്രിയം",
    proTierDesc: "ഡിജിറ്റൽ കാർഡ് + വെബ്സൈറ്റ് + QR കോഡ് + WhatsApp CTA + SEO",
    proTierCta: "പ്രോ നേടൂ",
    bizTierName: "ബിസിനസ്",
    bizTierPrice: "₹1,999",
    bizTierPeriod: "/വർഷം",
    bizTierDesc: "Pro-ൽ ഉള്ളതെല്ലാം + ഗാലറി + Maps + ബുക്കിംഗ് ഫോം + Priority Support",
    bizTierCta: "ബിസിനസ് നേടൂ",
    galleryItems: [
      "ഡിജിറ്റൽ കാർഡ്",
      "ബിസിനസ് വെബ്സൈറ്റ്",
      "സോഷ്യൽ മീഡിയ",
      "ബ്രാൻഡിംഗ്",
      "SEO ക്യാംപെയ്ൻ",
      "ലോക്കൽ ബിസിനസ്",
    ],
    services: [
      {
        icon: "📇",
        title: "ഡിജിറ്റൽ ബിസിനസ് കാർഡുകൾ",
        desc: "WhatsApp-ൽ ഒറ്റ ടാപ്പിൽ കാർഡ് ഷെയർ ചെയ്ത് കൂടുതൽ ക്ലയൻ്റുകളെ നേടൂ",
      },
      {
        icon: "🌐",
        title: "ബിസിനസ് വെബ്സൈറ്റുകൾ",
        desc: "Google-ൽ റാങ്ക് ചെയ്ത് കേരളത്തിലെ ലോക്കൽ കസ്റ്റമേഴ്‌സിനെ ആകർഷിക്കൂ",
      },
      {
        icon: "📱",
        title: "സോഷ്യൽ മീഡിയ ബ്രാൻഡിംഗ്",
        desc: "Instagram, Facebook, WhatsApp-ൽ പ്രൊഫഷണലായി കാണപ്പെടൂ",
      },
      {
        icon: "📈",
        title: "SEO & മാർക്കറ്റിംഗ്",
        desc: "കേരളത്തിൽ നിങ്ങളുടെ ബിസിനസ് തിരയുമ്പോൾ ആദ്യ ഫലമായി കാണപ്പെടൂ",
      },
    ],
    testimonials: [
      {
        name: "പ്രിയ ആർ.",
        role: "ബൂട്ടിക് ഉടമ, കൊച്ചി",
        text: "30 മിനിറ്റിൽ ഡിജിറ്റൽ കാർഡ് കിട്ടി. ഉപഭോക്താക്കൾ ടാപ്പ് ചെയ്ത് കോൺടാക്ട് സേവ് ചെയ്യുന്നു!",
        stars: 5,
      },
      {
        name: "സുരേഷ് എം.",
        role: "റിയൽ എസ്റ്റേറ്റ് ഏജൻ്റ്, തിരുവനന്തപുരം",
        text: "ബിസിനസിനുള്ള ഏറ്റവും നല്ല നിക്ഷേപം. SEO കൊണ്ട് ക്ലയൻ്റുകൾ Google-ൽ കണ്ടെത്തുന്നു.",
        stars: 5,
      },
      {
        name: "അനിത കെ.",
        role: "സലൂൺ ഉടമ, കോഴിക്കോട്",
        text: "WhatsApp ബട്ടൺ ഒറ്റയ്ക്ക് ബുക്കിംഗ് ഇരട്ടിയാക്കി. തീർച്ചയായും ഇത് വേണം!",
        stars: 5,
      },
    ],
    whyChoose: [
      {
        icon: "⚡",
        title: "30 മിനിറ്റിൽ തയ്യാർ",
        desc: "അതേ ദിവസം തന്നെ ഡിജിറ്റൽ കാർഡ് ലൈവ്, കാത്തിരിക്കൽ ഇല്ല",
      },
      {
        icon: "📱",
        title: "ഏത് ഫോണിലും പ്രവർത്തിക്കും",
        desc: "WhatsApp, SMS, QR വഴി ഷെയർ ചെയ്യൂ — ആപ്പ് ഡൗൺലോഡ് ആവശ്യമില്ല",
      },
      {
        icon: "🔍",
        title: "Google SEO ഉൾക്കൊള്ളിച്ചത്",
        desc: "ലോക്കൽ ഉപഭോക്താക്കൾ Google-ൽ നിങ്ങളെ കണ്ടെത്തുന്നു",
      },
      {
        icon: "🛡️",
        title: "ലൈഫ്ടൈം ഫ്രീ അപ്‌ഡേറ്റ്സ്",
        desc: "ആവശ്യമുള്ളപ്പോഴെല്ലാം കാർഡ് അപ്ഡേറ്റ് ചെയ്യും, അധിക ചാർജ് ഇല്ല",
      },
    ],
    demoPreviews: [
      {
        label: "ഡോക്ടർ കാർഡ്",
        sub: "ഡോ. രാമേഷ് കുമാർ",
        gradient: "linear-gradient(135deg, #0b3d91 0%, #00e5ff 100%)",
      },
      {
        label: "ഷോപ്പ് ഉടമ",
        sub: "ആനന്ദ് ടെക്‌സ്‌റ്റൈൽസ്",
        gradient: "linear-gradient(135deg, #7c3aed 0%, #f97316 100%)",
      },
      {
        label: "ഫ്രീലാൻസർ",
        sub: "പ്രിയ ഡിസൈൻസ്",
        gradient: "linear-gradient(135deg, #0d7849 0%, #22c55e 100%)",
      },
    ],
  },
};

type Lang = "en" | "ml";
type Translations = typeof t.en;

// ── Helpers ──────────────────────────────────────────────────────────────────
function getSafeWebsiteUrl(website: string): string {
  if (!website) return EXTERNAL_WEBSITE;
  try {
    const url = new URL(website);
    if (url.hostname === window.location.hostname) return EXTERNAL_WEBSITE;
    return website;
  } catch {
    return EXTERNAL_WEBSITE;
  }
}

function buildVCard(card: Card): string {
  return `BEGIN:VCARD
VERSION:3.0
FN:${card.name}
N:${card.name};;;;
ORG:${card.company}
TITLE:${card.jobTitle}
TEL;TYPE=CELL:${card.phone}
EMAIL:${card.email}
URL:${EXTERNAL_WEBSITE}
END:VCARD`;
}

function saveContact(card: Card) {
  const vcard = buildVCard(card);
  const blob = new Blob([vcard], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${card.name.replace(/\s+/g, "-")}-${card.company.replace(/\s+/g, "-")}.vcf`;
  a.click();
  URL.revokeObjectURL(url);
}

async function shareCard(card: Card) {
  const shareData = {
    title: `${card.name} | ${card.company}`,
    text: `${card.bio || `${card.jobTitle} at ${card.company}`} — ${card.name}`,
    url: window.location.href,
  };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch {
      // user cancelled
    }
  } else {
    const msg = encodeURIComponent(`${shareData.text}\n${shareData.url}`);
    window.open(`https://wa.me/?text=${msg}`, "_blank", "noopener,noreferrer");
  }
}

// ── Gallery colors ────────────────────────────────────────────────────────────
const GALLERY_GRADIENTS = [
  "linear-gradient(135deg, #0b3d91 0%, #00e5ff 100%)",
  "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)",
  "linear-gradient(135deg, #6c3fc8 0%, #a855f7 100%)",
  "linear-gradient(135deg, #0d7849 0%, #22c55e 100%)",
  "linear-gradient(135deg, #dc2626 0%, #f97316 100%)",
  "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
];

// ── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="section-header">
      <div className="section-accent" />
      <h2 className="section-title">{title}</h2>
    </div>
  );
}

// ── Navigation Bar ────────────────────────────────────────────────────────────
function NavBar({ txt }: { txt: Translations }) {
  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      className="nav-bar"
      data-ocid="nav.section"
      aria-label="Main navigation"
    >
      <button
        type="button"
        className="nav-item"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        data-ocid="nav.home.link"
      >
        <span className="nav-icon">🏠</span>
        <span className="nav-label">{txt.navHome}</span>
      </button>
      <button
        type="button"
        className="nav-item"
        onClick={() => scrollTo("services-section")}
        data-ocid="nav.services.link"
      >
        <span className="nav-icon">⚙️</span>
        <span className="nav-label">{txt.navServices}</span>
      </button>
      <button
        type="button"
        className="nav-item"
        onClick={() => scrollTo("gallery-section")}
        data-ocid="nav.gallery.link"
      >
        <span className="nav-icon">🖼️</span>
        <span className="nav-label">{txt.navGallery}</span>
      </button>
      <button
        type="button"
        className="nav-item"
        onClick={() => scrollTo("contact-section")}
        data-ocid="nav.contact.link"
      >
        <span className="nav-icon">📞</span>
        <span className="nav-label">{txt.navContact}</span>
      </button>
    </nav>
  );
}

// ── Live Demo Previews ────────────────────────────────────────────────────────
function LiveDemoSection({ txt }: { txt: Translations }) {
  return (
    <section className="live-demo-section" data-ocid="demo.section">
      <div className="demo-header">
        <p className="demo-title">{txt.liveDemoTitle}</p>
        <p className="demo-subtitle">{txt.liveDemoSubtitle}</p>
      </div>
      <div className="demo-cards-row">
        {txt.demoPreviews.map((demo, i) => (
          <a
            key={demo.label}
            href={EXTERNAL_WEBSITE}
            target="_blank"
            rel="noopener noreferrer"
            className="demo-mini-card"
            style={{ background: demo.gradient }}
            data-ocid={`demo.item.${i + 1}` as any}
          >
            <span className="demo-badge">{txt.viewDemo}</span>
            <div className="demo-card-inner">
              <div className="demo-avatar" />
              <span className="demo-card-label">{demo.label}</span>
              <span className="demo-card-sub">{demo.sub}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ── Testimonials ─────────────────────────────────────────────────────────────
function TestimonialsSection({ txt }: { txt: Translations }) {
  return (
    <section className="card-section" data-ocid="testimonials.section">
      <SectionHeader title={txt.testimonialsTitle} />
      <div className="testimonials-list">
        {txt.testimonials.map((item, i) => (
          <div
            key={item.name}
            className="testimonial-card"
            data-ocid={`testimonials.item.${i + 1}` as any}
          >
            <div className="testimonial-stars">
              {Array.from({ length: item.stars }).map((_, si) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static star count
                <span key={si} className="testimonial-star">
                  ★
                </span>
              ))}
            </div>
            <p className="testimonial-text">"{item.text}"</p>
            <div className="testimonial-author">
              <span className="testimonial-name">{item.name}</span>
              <span className="testimonial-role">{item.role}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Why Choose Us ─────────────────────────────────────────────────────────────
function WhyChooseUsSection({ txt }: { txt: Translations }) {
  return (
    <section className="card-section" data-ocid="whychoose.section">
      <SectionHeader title={txt.whyChooseTitle} />
      <div className="why-choose-grid">
        {txt.whyChoose.map((item, i) => (
          <div
            key={item.title}
            className="why-choose-card"
            data-ocid={`whychoose.item.${i + 1}` as any}
          >
            <span className="why-choose-icon">{item.icon}</span>
            <div className="why-choose-body">
              <h3 className="why-choose-title">{item.title}</h3>
              <p className="why-choose-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Pricing ──────────────────────────────────────────────────────────────────
function PricingSection({ txt }: { txt: Translations }) {
  const freeMsg = encodeURIComponent(
    "Hi, I want to start my Free 7-day Trial for a digital card!",
  );
  const proMsg = encodeURIComponent(
    "Hi, I'm interested in the Pro plan (₹999/year) for my digital card.",
  );
  const bizMsg = encodeURIComponent(
    "Hi, I'm interested in the Business plan (₹1,999/year) for my digital card.",
  );

  return (
    <section className="card-section" data-ocid="pricing.section">
      <SectionHeader title={txt.pricingTitle} />
      <p className="pricing-subtitle">{txt.pricingSubtitle}</p>

      {/* Free Tier */}
      <div className="pricing-card" data-ocid="pricing.item.1">
        <div className="pricing-top">
          <span className="pricing-tier-name">{txt.freeTierName}</span>
          <div className="pricing-price-row">
            <span className="pricing-price">{txt.freeTierPrice}</span>
          </div>
        </div>
        <p className="pricing-desc">{txt.freeTierDesc}</p>
        <a
          href={`https://wa.me/918838510443?text=${freeMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="pricing-cta pricing-cta-free"
          data-ocid="pricing.free.primary_button"
        >
          {txt.freeTierCta}
        </a>
      </div>

      {/* Pro Tier – highlighted */}
      <div className="pricing-card pricing-card-pro" data-ocid="pricing.item.2">
        <div className="pricing-popular-badge">{txt.proTierPopular}</div>
        <div className="pricing-top">
          <span className="pricing-tier-name">{txt.proTierName}</span>
          <div className="pricing-price-row">
            <span className="pricing-price">{txt.proTierPrice}</span>
            <span className="pricing-period">{txt.proTierPeriod}</span>
          </div>
        </div>
        <p className="pricing-desc">{txt.proTierDesc}</p>
        <a
          href={`https://wa.me/918838510443?text=${proMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="pricing-cta pricing-cta-pro"
          data-ocid="pricing.pro.primary_button"
        >
          {txt.proTierCta}
        </a>
      </div>

      {/* Business Tier */}
      <div className="pricing-card" data-ocid="pricing.item.3">
        <div className="pricing-top">
          <span className="pricing-tier-name">{txt.bizTierName}</span>
          <div className="pricing-price-row">
            <span className="pricing-price">{txt.bizTierPrice}</span>
            <span className="pricing-period">{txt.bizTierPeriod}</span>
          </div>
        </div>
        <p className="pricing-desc">{txt.bizTierDesc}</p>
        <a
          href={`https://wa.me/918838510443?text=${bizMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="pricing-cta pricing-cta-biz"
          data-ocid="pricing.biz.primary_button"
        >
          {txt.bizTierCta}
        </a>
      </div>
    </section>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const year = new Date().getFullYear();
  const [lang, setLang] = useState<Lang>("en");
  const [showQR, setShowQR] = useState(false);
  const [card, setCard] = useState<Card>(FALLBACK_CARD);
  const [showAdmin, setShowAdmin] = useState(false);
  const [_isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(false);
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formMsg, setFormMsg] = useState("");
  const hasAdminToken = useRef(false);

  const { login, isLoggingIn, identity } = useInternetIdentity();
  const { actor, isFetching } = useActor();

  const txt = t[lang];

  // Check admin token on load
  useEffect(() => {
    const token = getSecretParameter("caffeineAdminToken");
    if (token === ADMIN_TOKEN) {
      hasAdminToken.current = true;
    }
  }, []);

  // Load public card data in background
  useEffect(() => {
    let cancelled = false;
    async function fetchCard() {
      try {
        const anonActor = await createActorWithConfig();
        const data = await anonActor.getPublicCard();
        if (!cancelled) setCard(data);
      } catch {
        // keep showing fallback data silently
      }
    }
    fetchCard();
    return () => {
      cancelled = true;
    };
  }, []);

  // Check admin role after login
  useEffect(() => {
    if (!identity || !actor || isFetching) return;
    let cancelled = false;
    async function checkAdmin() {
      setCheckingAdmin(true);
      try {
        // If admin token is present, attempt to init access control first
        if (hasAdminToken.current) {
          try {
            await actor!._initializeAccessControlWithSecret(ADMIN_TOKEN);
          } catch {
            // may already be initialized, continue
          }
        }
        const adminStatus = await actor!.isCallerAdmin();
        if (!cancelled) {
          if (adminStatus) {
            setIsAdmin(true);
            setShowAdmin(true);
          } else {
            setIsAdmin(false);
            toast.error("Not authorized as admin");
          }
        }
      } catch {
        if (!cancelled) setIsAdmin(false);
      } finally {
        if (!cancelled) setCheckingAdmin(false);
      }
    }
    checkAdmin();
    return () => {
      cancelled = true;
    };
  }, [identity, actor, isFetching]);

  // Reset admin state on logout
  useEffect(() => {
    if (!identity) setIsAdmin(false);
  }, [identity]);

  const profileImg = card.profilePhotoUrl
    ? card.profilePhotoUrl
    : DEFAULT_PROFILE_IMG;
  const vcard = buildVCard(card);
  const whatsappPhone = card.phone.replace(/[^0-9]/g, "");
  const safeWebsiteUrl = getSafeWebsiteUrl(card.website);

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Hi, I'm ${formName} (📞 ${formPhone}).${formMsg ? ` ${formMsg}` : ""}`,
    );
    window.open(
      `https://wa.me/918838510443?text=${msg}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div className="card-page" data-ocid="card.page">
      <Toaster position="top-center" richColors />

      {/* Language Toggle */}
      <button
        type="button"
        className="lang-toggle"
        onClick={() => setLang((l) => (l === "en" ? "ml" : "en"))}
        data-ocid="card.toggle"
        aria-label="Toggle language"
      >
        <span className={lang === "en" ? "lang-active" : ""}>EN</span>
        <span className="lang-sep">|</span>
        <span className={lang === "ml" ? "lang-active" : ""}>ML</span>
      </button>

      {/* Navigation Bar */}
      <NavBar txt={txt} />

      <main className="card-wrapper">
        <div className="glass-card fade-in-card">
          {/* ── Hero Header ── */}
          <div className="brand-header fade-in-up">
            <h2 className="brand-title">
              {txt.brandName}
              <span className="brand-title-underline" aria-hidden="true" />
            </h2>
            <p className="brand-tagline-main">{txt.tagline}</p>
            <p className="brand-tagline">{txt.buildLaunchGrow}</p>
            <div className="star-row">
              <span className="stars">⭐⭐⭐⭐⭐</span>
              <span className="star-label">{txt.happyClients}</span>
            </div>
            <div className="trusted-badge" data-ocid="card.card">
              {txt.trustedBadge}
            </div>
          </div>

          <div className="divider" />

          {/* ── Live Demo Preview ── */}
          <LiveDemoSection txt={txt} />

          <div className="divider" />

          {/* ── Profile Photo ── */}
          <div className="profile-ring fade-in-up fade-in-up-d1">
            <img
              src={profileImg}
              alt={`${card.name} — ${card.jobTitle}, ${card.company}`}
              className="profile-img"
              width={110}
              height={110}
              fetchPriority="high"
            />
          </div>

          {/* ── Identity ── */}
          <div className="identity fade-in-up fade-in-up-d2">
            <h1 className="name">{card.name}</h1>
            <p className="job-title">
              {lang === "ml" ? txt.jobTitle : card.jobTitle}
            </p>
          </div>

          {/* ── Contact Info ── */}
          <div className="contact-info fade-in-up fade-in-up-d3">
            {card.phone && (
              <a
                href={`tel:${card.phone}`}
                className="contact-row"
                data-ocid="card.link"
              >
                <span className="contact-icon">📞</span>
                <span>{card.phone}</span>
              </a>
            )}
            {card.email && (
              <a
                href={`mailto:${card.email}`}
                className="contact-row"
                data-ocid="card.link"
              >
                <span className="contact-icon">📧</span>
                <span>{card.email}</span>
              </a>
            )}
            {card.location && (
              <div className="contact-row">
                <span className="contact-icon">📍</span>
                <span>{card.location}</span>
              </div>
            )}
          </div>

          <div className="divider" />

          {/* ── PRIMARY WhatsApp CTA ── */}
          <div
            className="whatsapp-cta-wrapper fade-in-up fade-in-up-d3"
            data-ocid="card.section"
          >
            {card.phone && (
              <a
                href={`https://wa.me/${whatsappPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-cta-btn"
                data-ocid="card.whatsapp.primary_button"
              >
                <span className="whatsapp-cta-icon">💬</span>
                <span>{txt.whatsappCta}</span>
              </a>
            )}
          </div>

          {/* ── Secondary Action Buttons ── */}
          <div
            className="actions-list fade-in-up fade-in-up-d4"
            data-ocid="card.section"
          >
            <button
              type="button"
              onClick={() => saveContact(card)}
              className="action-pill action-pill-amber"
              data-ocid="card.save.button"
            >
              <span className="pill-icon">💾</span>
              <span>{txt.saveContact}</span>
            </button>

            {card.phone && (
              <a
                href={`tel:${card.phone}`}
                className="action-pill action-pill-blue"
                data-ocid="card.call.button"
              >
                <span className="pill-icon">📞</span>
                <span>{txt.callNow}</span>
              </a>
            )}

            {card.location && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${card.location},India`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="action-pill action-pill-red"
                data-ocid="card.location.button"
              >
                <span className="pill-icon">📍</span>
                <span>{txt.location}</span>
              </a>
            )}

            <a
              href={safeWebsiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="action-pill action-pill-purple"
              data-ocid="card.website.button"
            >
              <span className="pill-icon">🌐</span>
              <span>{txt.visitWebsite}</span>
            </a>

            <button
              type="button"
              onClick={() => shareCard(card)}
              className="action-pill action-pill-teal"
              data-ocid="card.share.button"
            >
              <span className="pill-icon">🔗</span>
              <span>{txt.shareCard}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowQR((v) => !v)}
              className="action-pill action-pill-cyan"
              data-ocid="card.qr.button"
            >
              <span className="pill-icon">📱</span>
              <span>{showQR ? txt.hideQR : txt.showQR}</span>
            </button>
          </div>

          {/* ── QR Code ── */}
          {showQR && (
            <div
              className="qr-section"
              style={{ minHeight: "164px" }}
              data-ocid="card.panel"
            >
              <p className="qr-label">{txt.scanQR}</p>
              <div className="qr-box">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(vcard)}&color=0b3d91&bgcolor=ffffff`}
                  alt={`QR Code to save ${card.name} contact`}
                  width={140}
                  height={140}
                  loading="lazy"
                  style={{ display: "block" }}
                />
              </div>
            </div>
          )}

          <div className="divider" />

          {/* ── Testimonials ── */}
          <TestimonialsSection txt={txt} />

          <div className="divider" />

          {/* ── Why Choose Us ── */}
          <WhyChooseUsSection txt={txt} />

          <div className="divider" />

          {/* ── Pricing ── */}
          <PricingSection txt={txt} />

          <div className="divider" />

          {/* ── Services Section ── */}
          <section
            className="card-section"
            id="services-section"
            data-ocid="services.section"
          >
            <SectionHeader title={txt.ourServices} />
            <div className="services-grid">
              {txt.services.map((svc, i) => (
                <div
                  key={svc.title}
                  className="service-card"
                  data-ocid={`services.item.${i + 1}` as any}
                >
                  <span className="service-icon">{svc.icon}</span>
                  <h3 className="service-title">{svc.title}</h3>
                  <p className="service-desc">{svc.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="divider" />

          {/* ── Gallery Section ── */}
          <section
            className="card-section"
            id="gallery-section"
            data-ocid="gallery.section"
          >
            <SectionHeader title={txt.ourWork} />
            <div className="gallery-grid">
              {txt.galleryItems.map((label, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static list of gallery items
                  key={i}
                  className="gallery-item"
                  style={{ background: GALLERY_GRADIENTS[i] }}
                  data-ocid={`gallery.item.${i + 1}` as any}
                >
                  <span className="gallery-label">{label}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="divider" />

          {/* ── Google Maps ── */}
          <section className="card-section" data-ocid="map.section">
            <SectionHeader title={txt.findUs} />
            <div className="map-wrapper">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.35393254012!2d76.85270099999999!3d8.524139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05bba81d0c2dfd%3A0xb44b2d10fbd7ae96!2sThiruvananthapuram%2C%20Kerala!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="220"
                style={{ border: 0, borderRadius: "1rem" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="InstaSite Kerala Location"
              />
            </div>
          </section>

          <div className="divider" />

          {/* ── Contact / Booking Form ── */}
          <section
            className="card-section"
            id="contact-section"
            data-ocid="contact.section"
          >
            <SectionHeader title={txt.bookDemo} />
            <form
              className="contact-form"
              onSubmit={handleFormSubmit}
              data-ocid="contact.modal"
            >
              <div className="form-field">
                <input
                  type="text"
                  placeholder={txt.yourName}
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  className="form-input"
                  data-ocid="contact.input"
                />
              </div>
              <div className="form-field">
                <input
                  type="tel"
                  placeholder={txt.phoneNumber}
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  required
                  className="form-input"
                  data-ocid="contact.input"
                />
              </div>
              <div className="form-field">
                <textarea
                  placeholder={txt.message}
                  value={formMsg}
                  onChange={(e) => setFormMsg(e.target.value)}
                  rows={3}
                  className="form-input form-textarea"
                  data-ocid="contact.textarea"
                />
              </div>
              <button
                type="submit"
                className="form-submit-btn"
                data-ocid="contact.submit_button"
              >
                <span>💬</span>
                <span>{txt.sendMessage}</span>
              </button>
            </form>
          </section>

          <div className="divider" />

          {/* ── Footer ── */}
          <footer className="card-footer">
            <p className="footer-cta">{txt.footerCta}</p>
            <p>© {year} InstaSite Kerala | All Rights Reserved</p>
            <p>
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Built with ❤️ using caffeine.ai
              </a>
            </p>

            {!identity && (
              <button
                type="button"
                onClick={() => login()}
                className="admin-login-link"
                data-ocid="admin.primary_button"
                disabled={isLoggingIn || checkingAdmin}
              >
                {isLoggingIn ? txt.loggingIn : txt.adminLogin}
              </button>
            )}
          </footer>
        </div>
      </main>

      {/* Admin Panel */}
      {showAdmin && (
        <Suspense fallback={null}>
          <AdminModal
            card={card}
            onClose={() => setShowAdmin(false)}
            onSaved={(updatedCard) => {
              setCard(updatedCard);
              setShowAdmin(false);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
