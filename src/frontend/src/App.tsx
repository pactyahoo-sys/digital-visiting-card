import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const VCARD = `BEGIN:VCARD
VERSION:3.0
FN:Nagarajan
N:Nagarajan;;;;
ORG:InstaSite Kerala
TITLE:Sales Officer
TEL;TYPE=CELL:+918838510443
EMAIL:cynorlux@gmail.com
URL:https://instasite.in
END:VCARD`;

const PROFILE_IMG = `${import.meta.env.BASE_URL}assets/uploads/file_00000000a268720b8d35c42ca2dd4768-019d356b-0113-7442-b1d1-e9afa2b638a9-1.png`;

function saveContact() {
  const blob = new Blob([VCARD], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Nagarajan-InstaSiteKerala.vcf";
  a.click();
  URL.revokeObjectURL(url);
}

async function shareCard() {
  const shareData = {
    title: "Nagarajan | InstaSite Kerala",
    text: "Premium Digital Business Cards & Websites — Nagarajan, Sales Officer at InstaSite Kerala",
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

export default function App() {
  const year = new Date().getFullYear();
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="card-page" data-ocid="card.page">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <main className="card-wrapper">
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
            <h2 className="brand-title">InstaSite Kerala</h2>
            <p className="brand-subtitle">
              Premium Digital Business Cards &amp; Websites
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
              src={PROFILE_IMG}
              alt="Nagarajan — Sales Officer, InstaSite Kerala"
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
            <h1 className="name">Nagarajan</h1>
            <p className="title">Sales Officer</p>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.4 }}
          >
            <a
              href="tel:+918838510443"
              className="contact-row"
              data-ocid="card.link"
            >
              <span className="contact-icon">📞</span>
              <span>+91 8838510443</span>
            </a>
            <a
              href="mailto:cynorlux@gmail.com"
              className="contact-row"
              data-ocid="card.link"
            >
              <span className="contact-icon">📧</span>
              <span>cynorlux@gmail.com</span>
            </a>
            <div className="contact-row">
              <span className="contact-icon">📍</span>
              <span>Thiruvananthapuram</span>
            </div>
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
            {/* Save Contact */}
            <motion.button
              type="button"
              onClick={saveContact}
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

            {/* Call Now */}
            <motion.a
              href="tel:+918838510443"
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

            {/* WhatsApp */}
            <motion.a
              href="https://wa.me/918838510443"
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

            {/* Location */}
            <motion.a
              href="https://maps.google.com/?q=Thiruvananthapuram,Kerala,India"
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

            {/* Visit Website */}
            <motion.a
              href="https://instasite.in"
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

            {/* Share this Card */}
            <motion.button
              type="button"
              onClick={shareCard}
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

            {/* Show QR Code toggle */}
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

          {/* QR Code (toggle) */}
          <AnimatePresence>
            {showQR && (
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
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(VCARD)}&color=0b3d91&bgcolor=ffffff`}
                    alt="QR Code to save Nagarajan contact"
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
          </footer>
        </motion.div>
      </main>
    </div>
  );
}
