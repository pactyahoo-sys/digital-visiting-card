import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit3,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";
import type { Card } from "./backend.d";
import { useGetCard, useUpdateCard } from "./hooks/useQueries";

/* ─── helpers ─────────────────────────────────────────────────────── */

function buildVCard(card: Card): string {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${card.name}`,
    `TITLE:${card.jobTitle}`,
    `ORG:${card.company}`,
    `EMAIL:${card.email}`,
    `TEL:${card.phone}`,
    `ADR:;;${card.location};;;;`,
    card.website !== "#" ? `URL:${card.website}` : "",
    `NOTE:${card.bio}`,
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\n");
}

/* ─── card front ──────────────────────────────────────────────────── */

function CardFront({ card }: { card: Card }) {
  return (
    <div
      className="flex flex-col h-full p-6 gap-3"
      style={{
        background: "rgba(0,0,0,0.70)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      {/* Top: logo row */}
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-lg font-extrabold tracking-tight"
            style={{ color: "#00d4ff" }}
          >
            InstaSite Kerala
          </p>
          <p className="text-xs" style={{ color: "#888" }}>
            {card.bio || "Build. Launch. Grow."}
          </p>
        </div>
        {/* Avatar */}
        <div
          className="w-14 h-14 rounded-full flex-shrink-0 overflow-hidden"
          style={{
            boxShadow: "0 0 18px rgba(0,212,255,0.4)",
            border: "2px solid rgba(0,212,255,0.5)",
          }}
        >
          <img
            src="/assets/uploads/file_00000000a268720b8d35c42ca2dd4768-019d356b-0113-7442-b1d1-e9afa2b638a9-1.png"
            alt="Nagarajan"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Divider */}
      <div
        className="w-full h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #00d4ff55, transparent)",
        }}
      />

      {/* Name + role */}
      <div>
        <h2
          className="text-2xl font-extrabold leading-tight"
          style={{ color: "#ffd700" }}
        >
          {card.name}
        </h2>
        <p className="text-sm font-semibold text-white/80 mt-0.5">
          {card.jobTitle}
        </p>
      </div>

      {/* Contact rows */}
      <div className="flex flex-col gap-1.5 mt-auto">
        {card.email && (
          <a
            href={`mailto:${card.email}`}
            className="flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors"
          >
            <Mail size={12} style={{ color: "#00d4ff" }} />
            <span className="truncate">{card.email}</span>
          </a>
        )}
        {card.phone && (
          <a
            href={`tel:${card.phone}`}
            className="flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors"
          >
            <Phone size={12} style={{ color: "#00d4ff" }} />
            <span>{card.phone}</span>
          </a>
        )}
        {card.location && (
          <div className="flex items-start gap-2 text-xs text-white/60">
            <MapPin
              size={12}
              className="flex-shrink-0 mt-0.5"
              style={{ color: "#00d4ff" }}
            />
            <span className="line-clamp-2">{card.location}</span>
          </div>
        )}
        {card.website && card.website !== "#" && (
          <a
            href={card.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors"
          >
            <Globe size={12} style={{ color: "#00d4ff" }} />
            <span>{card.website}</span>
          </a>
        )}
      </div>

      {/* Flip hint */}
      <p
        className="text-center text-xs mt-1"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        Tap to flip
      </p>
    </div>
  );
}

/* ─── card back ───────────────────────────────────────────────────── */

function CardBack({ card }: { card: Card }) {
  const vcard = buildVCard(card);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&format=svg&data=${encodeURIComponent(vcard)}&color=00d4ff&bgcolor=000000&qzone=1`;

  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-4 p-6"
      style={{
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div className="text-center">
        <p
          className="text-xs tracking-widest uppercase font-semibold mb-0.5"
          style={{ color: "#00d4ff" }}
        >
          Scan to Connect
        </p>
        <p className="font-bold text-sm" style={{ color: "#ffd700" }}>
          {card.name}
        </p>
        <p className="text-xs text-white/50">{card.company}</p>
      </div>
      <div
        className="p-2 rounded-xl"
        style={{
          background: "rgba(0,0,0,0.6)",
          border: "1px solid rgba(0,212,255,0.3)",
        }}
      >
        <img
          src={qrUrl}
          alt={`QR code to connect with ${card.name}`}
          width={130}
          height={130}
          className="rounded-lg"
          style={{ display: "block" }}
        />
      </div>
      <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
        Saves contact to your phone
      </p>
    </div>
  );
}

/* ─── edit form ───────────────────────────────────────────────────── */

interface EditFormProps {
  card: Card;
  onSave: (card: Card) => void;
  onClose: () => void;
  isSaving: boolean;
}

function EditCardForm({ card, onSave, onClose, isSaving }: EditFormProps) {
  const [form, setForm] = useState<Card>(card);

  const handleChange = useCallback(
    (field: keyof Card) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
      },
    [],
  );

  const fields: {
    key: keyof Card;
    label: string;
    placeholder: string;
    textarea?: boolean;
  }[] = [
    { key: "name", label: "Full Name", placeholder: "Nagarajan" },
    { key: "jobTitle", label: "Job Title", placeholder: "Sales Officer" },
    { key: "company", label: "Company", placeholder: "InstaSite Kerala" },
    { key: "email", label: "Email", placeholder: "cynorlux@gmail.com" },
    { key: "phone", label: "Phone", placeholder: "+91 8838510443" },
    { key: "location", label: "Location", placeholder: "Thiruvananthapuram" },
    { key: "website", label: "Website", placeholder: "https://instasite.in" },
    { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/..." },
    { key: "twitter", label: "Twitter / X", placeholder: "@handle" },
    {
      key: "bio",
      label: "Tagline / Bio",
      placeholder: "Build. Launch. Grow.",
      textarea: true,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        {fields.map(({ key, label, placeholder, textarea }) => (
          <div key={key} className={textarea ? "col-span-2" : ""}>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">
              {label}
            </Label>
            {textarea ? (
              <Textarea
                value={form[key]}
                onChange={handleChange(key)}
                placeholder={placeholder}
                rows={2}
                data-ocid={`edit.${key}.textarea`}
                className="bg-popover border-border text-foreground resize-none text-sm"
              />
            ) : (
              <Input
                value={form[key]}
                onChange={handleChange(key)}
                placeholder={placeholder}
                data-ocid={`edit.${key}.input`}
                className="bg-popover border-border text-foreground text-sm h-9"
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onClose}
          className="flex-1"
          data-ocid="edit.cancel_button"
        >
          <X size={14} className="mr-2" /> Cancel
        </Button>
        <Button
          onClick={() => onSave(form)}
          disabled={isSaving}
          className="flex-1"
          style={{
            background: "linear-gradient(135deg, #00d4ff, #0077ff)",
            color: "white",
          }}
          data-ocid="edit.save_button"
        >
          {isSaving ? (
            <Loader2 size={14} className="mr-2 animate-spin" />
          ) : null}
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

/* ─── main app ────────────────────────────────────────────────────── */

export default function App() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [localCard, setLocalCard] = useState<Card | null>(null);

  const { data: fetchedCard, isLoading } = useGetCard();
  const { mutateAsync: updateCard, isPending: isSaving } = useUpdateCard();

  const card = localCard ?? fetchedCard;

  const handleSave = async (updated: Card) => {
    setLocalCard(updated);
    try {
      await updateCard(updated);
      toast.success("Card updated successfully!");
      setEditOpen(false);
    } catch {
      toast.error("Failed to save. Changes kept locally.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        backgroundAttachment: "fixed",
      }}
    >
      <Toaster richColors position="top-center" />

      {/* Header */}
      <header className="pt-10 pb-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p
            className="text-2xl font-extrabold tracking-tight"
            style={{
              color: "#00d4ff",
              textShadow: "0 0 20px rgba(0,212,255,0.5)",
            }}
          >
            InstaSite Kerala
          </p>
          <p className="text-xs mt-1" style={{ color: "#888" }}>
            Digital Visiting Card
          </p>
        </motion.div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-6">
        {isLoading ? (
          <div
            className="flex flex-col items-center gap-3"
            data-ocid="card.loading_state"
          >
            <Loader2
              size={32}
              className="animate-spin"
              style={{ color: "#00d4ff" }}
            />
            <p className="text-white/50 text-sm">Loading card...</p>
          </div>
        ) : card ? (
          <>
            {/* ── flippable card ── */}
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ perspective: "1200px" }}
              data-ocid="card.panel"
            >
              <button
                type="button"
                aria-label={isFlipped ? "Show card front" : "Show QR code"}
                className="relative cursor-pointer focus:outline-none bg-transparent border-0 p-0"
                style={{
                  width: "min(380px, calc(100vw - 40px))",
                  height: "300px",
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onClick={() => setIsFlipped((f) => !f)}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 rounded-2xl overflow-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    border: "1px solid rgba(0,212,255,0.2)",
                    boxShadow:
                      "0 25px 60px -10px rgba(0,0,0,0.6), 0 0 40px rgba(0,212,255,0.08)",
                  }}
                >
                  <CardFront card={card} />
                </div>
                {/* Back */}
                <div
                  className="absolute inset-0 rounded-2xl overflow-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    border: "1px solid rgba(0,212,255,0.2)",
                    boxShadow:
                      "0 25px 60px -10px rgba(0,0,0,0.6), 0 0 40px rgba(0,212,255,0.08)",
                  }}
                >
                  <CardBack card={card} />
                </div>
              </button>
            </motion.div>

            {/* flip hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-3 flex items-center gap-1.5"
            >
              <RotateCcw size={11} style={{ color: "#00d4ff" }} />
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                {isFlipped
                  ? "Tap to see contact info"
                  : "Tap card to reveal QR code"}
              </p>
            </motion.div>

            {/* ── action buttons ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.55 }}
              className="flex flex-col gap-3 mt-7"
              style={{ width: "min(380px, calc(100vw - 40px))" }}
            >
              {/* Call Now */}
              <a
                href="tel:+918838510443"
                className="action-btn flex items-center justify-center gap-3 py-3.5 rounded-xl font-bold text-white text-base"
                style={{
                  background: "linear-gradient(135deg, #007bff, #0056d6)",
                  boxShadow: "0 4px 20px rgba(0,123,255,0.4)",
                  textDecoration: "none",
                }}
                data-ocid="card.call_button"
              >
                <Phone size={18} /> Call Now
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/918838510443"
                target="_blank"
                rel="noopener noreferrer"
                className="action-btn flex items-center justify-center gap-3 py-3.5 rounded-xl font-bold text-white text-base"
                style={{
                  background: "linear-gradient(135deg, #25D366, #128C7E)",
                  boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
                  textDecoration: "none",
                }}
                data-ocid="card.whatsapp_button"
              >
                <SiWhatsapp size={18} /> WhatsApp
              </a>

              {/* Location */}
              <a
                href="https://maps.google.com/?q=Puliarakonnam+Moonnammoodu+Road+Trivandrum"
                target="_blank"
                rel="noopener noreferrer"
                className="action-btn flex items-center justify-center gap-3 py-3.5 rounded-xl font-bold text-white text-base"
                style={{
                  background: "linear-gradient(135deg, #ff5722, #e64a19)",
                  boxShadow: "0 4px 20px rgba(255,87,34,0.4)",
                  textDecoration: "none",
                }}
                data-ocid="card.location_button"
              >
                <MapPin size={18} /> Location
              </a>

              {/* Visit Website */}
              {card.website && card.website !== "#" ? (
                <a
                  href={
                    card.website.startsWith("http")
                      ? card.website
                      : `https://${card.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-btn flex items-center justify-center gap-3 py-3.5 rounded-xl font-bold text-white text-base"
                  style={{
                    background: "linear-gradient(135deg, #6f42c1, #5a32a3)",
                    boxShadow: "0 4px 20px rgba(111,66,193,0.4)",
                    textDecoration: "none",
                  }}
                  data-ocid="card.website_button"
                >
                  <Globe size={18} /> Visit Website
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="action-btn flex items-center justify-center gap-3 py-3.5 rounded-xl font-bold text-white text-base opacity-70 cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #6f42c1, #5a32a3)",
                    boxShadow: "0 4px 20px rgba(111,66,193,0.4)",
                  }}
                  data-ocid="card.website_button"
                >
                  <Globe size={18} /> Visit Website
                </button>
              )}

              {/* Edit Card — smaller secondary */}
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="action-btn flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.55)",
                }}
                data-ocid="card.edit_button"
              >
                <Edit3 size={14} /> Edit Card
              </button>
            </motion.div>
          </>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
          Powered by <span style={{ color: "#00d4ff" }}>InstaSite Kerala</span>{" "}
          &mdash;{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            Built with caffeine.ai
          </a>
        </p>
      </footer>

      {/* Edit Dialog */}
      <AnimatePresence>
        {editOpen && card && (
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent
              className="max-w-lg max-h-[90vh] overflow-y-auto"
              style={{
                background: "rgba(15, 32, 39, 0.97)",
                borderColor: "rgba(0,212,255,0.2)",
                backdropFilter: "blur(20px)",
              }}
              data-ocid="edit.dialog"
            >
              <DialogHeader>
                <DialogTitle
                  className="font-bold text-lg"
                  style={{ color: "#00d4ff" }}
                >
                  Edit Your Card
                </DialogTitle>
              </DialogHeader>
              <EditCardForm
                card={card}
                onSave={handleSave}
                onClose={() => setEditOpen(false)}
                isSaving={isSaving}
              />
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
