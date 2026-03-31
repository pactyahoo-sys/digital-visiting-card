import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { HttpAgent } from "@icp-sdk/core/agent";
import { Loader2, LogOut, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Card } from "./backend";
import { createActorWithConfig, loadConfig } from "./config";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { StorageClient } from "./utils/StorageClient";

const DEFAULT_PROFILE_IMG = `${import.meta.env.BASE_URL}assets/uploads/nagarajan-profile.png`;

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

// ─── Card Skeleton ──────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div
      className="glass-card"
      style={{
        gap: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Skeleton
        className="h-6 w-40 rounded-full"
        style={{ background: "rgba(255,255,255,0.15)" }}
      />
      <Skeleton
        className="h-4 w-56 rounded-full"
        style={{ background: "rgba(255,255,255,0.1)" }}
      />
      <Skeleton
        className="h-24 w-24 rounded-full"
        style={{ background: "rgba(255,255,255,0.15)" }}
      />
      <Skeleton
        className="h-6 w-32 rounded-full"
        style={{ background: "rgba(255,255,255,0.15)" }}
      />
      <Skeleton
        className="h-4 w-24 rounded-full"
        style={{ background: "rgba(255,255,255,0.1)" }}
      />
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton
          key={i}
          className="h-12 w-full rounded-full"
          style={{ background: "rgba(255,255,255,0.1)" }}
        />
      ))}
    </div>
  );
}

// ─── Admin Edit Modal ────────────────────────────────────────────────────────
interface AdminModalProps {
  card: Card;
  onClose: () => void;
  onSaved: (card: Card) => void;
}

function AdminModal({ card, onClose, onSaved }: AdminModalProps) {
  const { actor } = useActor();
  const { identity, clear } = useInternetIdentity();
  const [form, setForm] = useState<Card>({ ...card });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set(field: keyof Card, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !identity) return;
    setUploading(true);
    try {
      const config = await loadConfig();
      const agent = new HttpAgent({ identity, host: config.backend_host });
      if (config.backend_host?.includes("localhost")) {
        await agent.fetchRootKey().catch(() => {});
      }
      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await storageClient.putFile(bytes);
      const url = await storageClient.getDirectURL(hash);
      setForm((prev) => ({ ...prev, profilePhotoUrl: url }));
      toast.success("Photo uploaded!");
    } catch (err) {
      toast.error(
        `Upload failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!actor) return;
    setSaving(true);
    try {
      await actor.updateCard(form);
      onSaved(form);
      toast.success("Card updated successfully!");
      onClose();
    } catch (err) {
      toast.error(
        `Save failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    clear();
    onClose();
    toast.success("Logged out");
  }

  const photoSrc = form.profilePhotoUrl || DEFAULT_PROFILE_IMG;

  const fields: { key: keyof Card; label: string; type?: string }[] = [
    { key: "name", label: "Name" },
    { key: "jobTitle", label: "Job Title" },
    { key: "company", label: "Company" },
    { key: "bio", label: "Bio" },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "email", label: "Email", type: "email" },
    { key: "location", label: "Location" },
    { key: "website", label: "Website", type: "url" },
  ];

  return (
    <motion.div
      className="admin-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-ocid="admin.modal"
    >
      <motion.div
        className="admin-panel"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="admin-panel-header">
          <h2 className="admin-panel-title">Edit Card</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={handleLogout}
              className="admin-icon-btn"
              data-ocid="admin.close_button"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="admin-icon-btn"
              data-ocid="admin.cancel_button"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Photo upload */}
        <div className="admin-photo-section">
          <img src={photoSrc} alt="Profile" className="admin-photo-preview" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: "none" }}
            data-ocid="admin.upload_button"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="admin-upload-btn"
            disabled={uploading}
            data-ocid="admin.upload_button"
          >
            {uploading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Upload size={14} />
            )}
            {uploading ? "Uploading..." : "Change Photo"}
          </button>
        </div>

        {/* Form fields */}
        <div className="admin-form">
          {fields.map(({ key, label, type }) => (
            <div key={key} className="admin-field">
              <label htmlFor={`admin-field-${key}`} className="admin-label">
                {label}
              </label>
              <input
                type={type || "text"}
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                id={`admin-field-${key}`}
                className="admin-input"
                data-ocid={`admin.${key}.input`}
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="admin-actions">
          <button
            type="button"
            onClick={onClose}
            className="admin-btn admin-btn-cancel"
            data-ocid="admin.cancel_button"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="admin-btn admin-btn-save"
            data-ocid="admin.save_button"
            disabled={saving || uploading}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : null}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const year = new Date().getFullYear();
  const [showQR, setShowQR] = useState(false);
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [_isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(false);

  const { login, isLoggingIn, identity } = useInternetIdentity();
  const { actor, isFetching } = useActor();

  // Load public card data on mount (anonymous)
  useEffect(() => {
    let cancelled = false;
    async function fetchCard() {
      try {
        const anonActor = await createActorWithConfig();
        const data = await anonActor.getPublicCard();
        if (!cancelled) setCard(data);
      } catch {
        if (!cancelled) {
          // fallback static data
          setCard({
            name: "Nagarajan",
            jobTitle: "Sales Officer",
            company: "InstaSite Kerala",
            bio: "Premium Digital Business Cards & Websites",
            phone: "+918838510443",
            email: "cynorlux@gmail.com",
            location: "Thiruvananthapuram",
            website: "https://instasite.in",
            profilePhotoUrl: "",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
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

  const profileImg = card?.profilePhotoUrl
    ? card.profilePhotoUrl
    : DEFAULT_PROFILE_IMG;
  const vcard = card ? buildVCard(card) : "";

  return (
    <div className="card-page" data-ocid="card.page">
      <Toaster position="top-center" richColors />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <main className="card-wrapper">
        {loading ? (
          <CardSkeleton />
        ) : (
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Brand Header */}
            <motion.div
              className="brand-header"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45 }}
            >
              <h2 className="brand-title">
                {card?.company || "InstaSite Kerala"}
              </h2>
              <p className="brand-subtitle">
                {card?.bio || "Premium Digital Business Cards & Websites"}
              </p>
              <p className="brand-tagline">Build. Launch. Grow.</p>
            </motion.div>

            <div className="divider" />

            {/* Profile Photo */}
            <motion.div
              className="profile-ring"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: "backOut" }}
            >
              <img
                src={profileImg}
                alt={`${card?.name || ""} — ${card?.jobTitle || ""}, ${card?.company || ""}`}
                className="profile-img"
              />
            </motion.div>

            {/* Identity */}
            <motion.div
              className="identity"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.45 }}
            >
              <h1 className="name">{card?.name || "Nagarajan"}</h1>
              <p className="title">{card?.jobTitle || "Sales Officer"}</p>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="contact-info"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.4 }}
            >
              {card?.phone && (
                <a
                  href={`tel:${card.phone}`}
                  className="contact-row"
                  data-ocid="card.link"
                >
                  <span className="contact-icon">📞</span>
                  <span>{card.phone}</span>
                </a>
              )}
              {card?.email && (
                <a
                  href={`mailto:${card.email}`}
                  className="contact-row"
                  data-ocid="card.link"
                >
                  <span className="contact-icon">📧</span>
                  <span>{card.email}</span>
                </a>
              )}
              {card?.location && (
                <div className="contact-row">
                  <span className="contact-icon">📍</span>
                  <span>{card.location}</span>
                </div>
              )}
            </motion.div>

            <div className="divider" />

            {/* Full-width action buttons */}
            <motion.div
              className="actions-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.44, duration: 0.4 }}
              data-ocid="card.section"
            >
              <motion.button
                type="button"
                onClick={() => card && saveContact(card)}
                className="action-pill action-pill-amber"
                data-ocid="card.save.button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.46 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="pill-icon">💾</span>
                <span>Save Contact</span>
              </motion.button>

              {card?.phone && (
                <motion.a
                  href={`tel:${card.phone}`}
                  className="action-pill action-pill-blue"
                  data-ocid="card.call.button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="pill-icon">📞</span>
                  <span>Call Now</span>
                </motion.a>
              )}

              {card?.phone && (
                <motion.a
                  href={`https://wa.me/${card.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-pill action-pill-green"
                  data-ocid="card.whatsapp.button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.54 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="pill-icon">💬</span>
                  <span>WhatsApp</span>
                </motion.a>
              )}

              {card?.location && (
                <motion.a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${card.location},India`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-pill action-pill-red"
                  data-ocid="card.location.button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.58 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="pill-icon">📍</span>
                  <span>Location</span>
                </motion.a>
              )}

              {card?.website && (
                <motion.a
                  href={card.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-pill action-pill-purple"
                  data-ocid="card.website.button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.62 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="pill-icon">🌐</span>
                  <span>Visit Website</span>
                </motion.a>
              )}

              <motion.button
                type="button"
                onClick={() => card && shareCard(card)}
                className="action-pill action-pill-whatsapp"
                data-ocid="card.share.button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.66 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="pill-icon">🔗</span>
                <span>Share this Card</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => setShowQR((v) => !v)}
                className="action-pill action-pill-cyan"
                data-ocid="card.qr.button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="pill-icon">📱</span>
                <span>{showQR ? "Hide QR Code" : "Show QR Code"}</span>
              </motion.button>
            </motion.div>

            {/* QR Code */}
            <AnimatePresence>
              {showQR && vcard && (
                <motion.div
                  className="qr-section"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3 }}
                  data-ocid="card.panel"
                >
                  <p className="qr-label">Scan to Save Contact Instantly</p>
                  <div className="qr-box">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(vcard)}&color=0b3d91&bgcolor=ffffff`}
                      alt={`QR Code to save ${card?.name || ""} contact`}
                      width={140}
                      height={140}
                      style={{ display: "block" }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
          </motion.div>
        )}
      </main>

      {/* Admin Panel */}
      <AnimatePresence>
        {showAdmin && card && (
          <AdminModal
            card={card}
            onClose={() => setShowAdmin(false)}
            onSaved={(updatedCard) => {
              setCard(updatedCard);
              setShowAdmin(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
