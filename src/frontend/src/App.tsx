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
    tagline: "Kerala's #1 Digital Business Card Service",
    buildLaunchGrow: "Build. Launch. Grow.",
    happyClients: "500+ Happy Clients in Kerala",
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
    sendMessage: "Send via WhatsApp",
    contactUs: "Contact Us",
    whatsappCta: "Chat on WhatsApp",
    footerCta: "Get your digital card from InstaSite Kerala",
    adminLogin: "Admin Login",
    loggingIn: "Logging in...",
    salesOfficer: "Sales Officer",
    jobTitle: "Sales Officer",
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
        desc: "Premium, shareable digital cards for professionals",
      },
      {
        icon: "🌐",
        title: "Business Websites",
        desc: "Fast, mobile-first websites for Kerala businesses",
      },
      {
        icon: "📱",
        title: "Social Media Branding",
        desc: "Professional profiles and branded content",
      },
      {
        icon: "📈",
        title: "SEO & Marketing",
        desc: "Get found on Google locally",
      },
    ],
  },
  ml: {
    brandName: "ഇൻസ്റ്റ സൈറ്റ് കേരള",
    tagline: "കേരളത്തിലെ #1 ഡിജിറ്റൽ ബിസിനസ് കാർഡ് സേവനം",
    buildLaunchGrow: "നിർമ്മിക്കൂ. ആരംഭിക്കൂ. വളരൂ.",
    happyClients: "500+ സന്തുഷ്ട ക്ലയൻ്റുകൾ",
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
    sendMessage: "വാട്സ്ആപ്പ് വഴി അയക്കൂ",
    contactUs: "ഞങ്ങളെ ബന്ധപ്പെടൂ",
    whatsappCta: "വാട്സ്ആപ്പിൽ ചാറ്റ് ചെയ്യൂ",
    footerCta: "InstaSite Kerala-ൽ നിന്ന് നിങ്ങളുടെ ഡിജിറ്റൽ കാർഡ് നേടൂ",
    adminLogin: "അഡ്മിൻ ലോഗിൻ",
    loggingIn: "ലോഗിൻ ചെയ്യുന്നു...",
    salesOfficer: "സെയിൽസ് ഓഫീസർ",
    jobTitle: "സെയിൽസ് ഓഫീസർ",
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
        desc: "പ്രൊഫഷണലുകൾക്കായി പ്രീമിയം ഡിജിറ്റൽ കാർഡുകൾ",
      },
      {
        icon: "🌐",
        title: "ബിസിനസ് വെബ്സൈറ്റുകൾ",
        desc: "കേരള ബിസിനസുകൾക്കായി വേഗമേറിയ വെബ്സൈറ്റുകൾ",
      },
      {
        icon: "📱",
        title: "സോഷ്യൽ മീഡിയ ബ്രാൻഡിംഗ്",
        desc: "പ്രൊഫഷണൽ പ്രൊഫൈലുകളും ബ്രാൻഡഡ് കൺടൻ്റും",
      },
      { icon: "📈", title: "SEO & മാർക്കറ്റിംഗ്", desc: "Google-ൽ ലോക്കലി കാണപ്പെടൂ" },
    ],
  },
} as const;

type Lang = "en" | "ml";

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

      <main className="card-wrapper">
        <div className="glass-card fade-in-card">
          {/* ── Hero Header ── */}
          <div className="brand-header fade-in-up">
            <h2 className="brand-title">{txt.brandName}</h2>
            <p className="brand-tagline-main">{txt.tagline}</p>
            <p className="brand-tagline">{txt.buildLaunchGrow}</p>
            <div className="star-row">
              <span className="stars">⭐⭐⭐⭐⭐</span>
              <span className="star-label">{txt.happyClients}</span>
            </div>
          </div>

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

          {/* ── Services Section ── */}
          <section className="card-section" data-ocid="services.section">
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
          <section className="card-section" data-ocid="gallery.section">
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
          <section className="card-section" data-ocid="contact.section">
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
