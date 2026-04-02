import { Toaster } from "@/components/ui/sonner";
import { Suspense, lazy, useEffect, useState } from "react";
import { toast } from "sonner";
import type { Card } from "./backend";
import { createActorWithConfig } from "./config";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

const AdminModal = lazy(() => import("./components/AdminModal"));

const DEFAULT_PROFILE_IMG = `${import.meta.env.BASE_URL}assets/uploads/nagarajan-profile.png`;

const FALLBACK_CARD: Card = {
  name: "Nagarajan",
  jobTitle: "Sales Officer",
  company: "InstaSite Kerala",
  bio: "Premium Digital Business Cards & Websites",
  phone: "+918838510443",
  email: "cynorlux@gmail.com",
  location: "Thiruvananthapuram",
  website: "https://instasite.in",
  profilePhotoUrl: "",
};

function buildVCard(card: Card): string {
  return `BEGIN:VCARD
VERSION:3.0
FN:${card.name}
N:${card.name};;;;
ORG:${card.company}
TITLE:${card.jobTitle}
TEL;TYPE=CELL:${card.phone}
EMAIL:${card.email}
URL:${card.website}
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

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const year = new Date().getFullYear();
  const [showQR, setShowQR] = useState(false);
  const [card, setCard] = useState<Card>(FALLBACK_CARD);
  const [showAdmin, setShowAdmin] = useState(false);
  const [_isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(false);

  const { login, isLoggingIn, identity } = useInternetIdentity();
  const { actor, isFetching } = useActor();

  // Load public card data in background (no skeleton — show fallback immediately)
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
        const adminStatus = await actor!.isCallerAdmin();
        if (!cancelled) {
          if (adminStatus) {
            setIsAdmin(true);
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

  return (
    <div className="card-page" data-ocid="card.page">
      <Toaster position="top-center" richColors />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <main className="card-wrapper">
        <div className="glass-card fade-in-card">
          {/* Brand Header */}
          <div className="brand-header fade-in-up">
            <h2 className="brand-title">{card.company}</h2>
            <p className="brand-subtitle">{card.bio}</p>
            <p className="brand-tagline">Build. Launch. Grow.</p>
          </div>

          <div className="divider" />

          {/* Profile Photo */}
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

          {/* Identity */}
          <div className="identity fade-in-up fade-in-up-d2">
            <h1 className="name">{card.name}</h1>
            <p className="title">{card.jobTitle}</p>
          </div>

          {/* Contact Info */}
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

          {/* Full-width action buttons */}
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
              <span>Save Contact</span>
            </button>

            {card.phone && (
              <a
                href={`tel:${card.phone}`}
                className="action-pill action-pill-blue"
                data-ocid="card.call.button"
              >
                <span className="pill-icon">📞</span>
                <span>Call Now</span>
              </a>
            )}

            {card.phone && (
              <a
                href={`https://wa.me/${card.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="action-pill action-pill-green"
                data-ocid="card.whatsapp.button"
              >
                <span className="pill-icon">💬</span>
                <span>WhatsApp</span>
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
                <span>Location</span>
              </a>
            )}

            {card.website && (
              <a
                href={card.website}
                target="_blank"
                rel="noopener noreferrer"
                className="action-pill action-pill-purple"
                data-ocid="card.website.button"
              >
                <span className="pill-icon">🌐</span>
                <span>Visit Website</span>
              </a>
            )}

            <button
              type="button"
              onClick={() => shareCard(card)}
              className="action-pill action-pill-whatsapp"
              data-ocid="card.share.button"
            >
              <span className="pill-icon">🔗</span>
              <span>Share this Card</span>
            </button>

            <button
              type="button"
              onClick={() => setShowQR((v) => !v)}
              className="action-pill action-pill-cyan"
              data-ocid="card.qr.button"
            >
              <span className="pill-icon">📱</span>
              <span>{showQR ? "Hide QR Code" : "Show QR Code"}</span>
            </button>
          </div>

          {/* QR Code — conditionally rendered to avoid unnecessary network request */}
          {showQR && (
            <div
              className="qr-section"
              style={{ minHeight: "164px" }}
              data-ocid="card.panel"
            >
              <p className="qr-label">Scan to Save Contact Instantly</p>
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

          <footer className="card-footer">
            <p className="footer-cta">
              Get your digital card from InstaSite Kerala
            </p>
            <p>© {year} InstaSite Kerala | All Rights Reserved</p>

            {/* Subtle admin login */}
            {!identity && (
              <button
                type="button"
                onClick={() => login()}
                className="admin-login-link"
                data-ocid="admin.primary_button"
                disabled={isLoggingIn || checkingAdmin}
              >
                {isLoggingIn ? "Logging in..." : "Admin Login"}
              </button>
            )}
          </footer>
        </div>
      </main>

      {/* Admin Panel — lazy loaded, only mounted when needed */}
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
