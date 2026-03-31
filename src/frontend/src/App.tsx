import { Toaster } from "@/components/ui/sonner";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { SiWhatsapp } from "react-icons/si";

const VCF_CONTENT = [
  "BEGIN:VCARD",
  "VERSION:3.0",
  "FN:Nagarajan",
  "ORG:InstaSite Kerala",
  "TITLE:Sales Officer",
  "TEL:+918838510443",
  "EMAIL:cynorlux@gmail.com",
  "ADR:;;Puliarakonnam Moonnammoodu Road;Thiruvananthapuram;;;India",
  "URL:https://instasite.in",
  "END:VCARD",
].join("\n");

const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(VCF_CONTENT)}`;

export default function App() {
  const profileSrc =
    "/assets/uploads/file_00000000a268720b8d35c42ca2dd4768-019d356b-0113-7442-b1d1-e9afa2b638a9-1.png";

  const vcfBlob = new Blob([VCF_CONTENT], { type: "text/vcard" });
  const vcfUrl = URL.createObjectURL(vcfBlob);

  const [showQR, setShowQR] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setInstallPrompt(null);
  };

  const handleShareWhatsApp = () => {
    const cardUrl = window.location.href;
    const message = `Hi! Check out my Digital Visiting Card 👇%0A${encodeURIComponent(cardUrl)}`;
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const btnStyle = (bg: string, textColor = "white") => ({
    display: "block",
    margin: "10px 0",
    padding: "14px",
    borderRadius: "12px",
    textDecoration: "none",
    color: textColor,
    fontWeight: 500,
    background: bg,
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "pointer",
    border: "none",
    width: "100%",
    fontSize: "14px",
    textAlign: "center" as const,
  });

  return (
    <div
      className="min-h-screen flex justify-center"
      style={{
        background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap"
        rel="stylesheet"
      />
      <Toaster richColors position="top-center" />

      <div className="w-full max-w-[380px] px-5 py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: "25px",
            padding: "25px",
            textAlign: "center",
            backdropFilter: "blur(15px)",
            WebkitBackdropFilter: "blur(15px)",
            boxShadow: "0 0 25px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ fontSize: "20px", fontWeight: 600, color: "#00d4ff" }}>
            InstaSite Kerala
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#00d4ff",
              opacity: 0.75,
              letterSpacing: "0.5px",
              marginBottom: "4px",
              fontWeight: 500,
            }}
          >
            Premium Digital Business Cards &amp; Websites
          </div>
          <div
            style={{ fontSize: "12px", color: "#ccc", marginBottom: "15px" }}
          >
            Build. Launch. Grow.
          </div>

          <img
            src={profileSrc}
            alt="Nagarajan"
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              border: "3px solid #00d4ff",
              margin: "10px auto",
              display: "block",
              objectFit: "cover",
            }}
          />

          <div style={{ fontSize: "26px", color: "gold", fontWeight: "bold" }}>
            Nagarajan
          </div>

          <div
            style={{ fontSize: "14px", marginBottom: "15px", color: "white" }}
          >
            Sales Officer
          </div>

          <div
            style={{
              fontSize: "13px",
              color: "#ccc",
              marginBottom: "20px",
              lineHeight: "1.8",
            }}
          >
            📞 +91 8838510443 <br />📧 cynorlux@gmail.com <br />📍
            Thiruvananthapuram
          </div>

          <a
            href={vcfUrl}
            download="Nagarajan.vcf"
            style={btnStyle("linear-gradient(45deg,#f7971e,#ffd200)", "black")}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "scale(1.05)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 0 10px rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "scale(1)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
            }}
          >
            💾 Save Contact
          </a>

          <a
            href="tel:+918838510443"
            style={btnStyle("linear-gradient(45deg,#007bff,#00c6ff)")}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "scale(1.05)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 0 10px rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "scale(1)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
            }}
          >
            📞 Call Now
          </a>

          <a
            href="https://wa.me/918838510443?text=Hi%20I%20saw%20your%20digital%20card"
            target="_blank"
            rel="noopener noreferrer"
            style={btnStyle("linear-gradient(45deg,#25D366,#128C7E)")}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "scale(1.05)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 0 10px rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "scale(1)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
            }}
          >
            <span className="inline-flex items-center gap-2 justify-center w-full">
              <SiWhatsapp size={16} /> WhatsApp
            </span>
          </a>

          <a
            href="https://maps.google.com/?q=Puliarakonnam Moonnammoodu Road Trivandrum"
            target="_blank"
            rel="noopener noreferrer"
            style={btnStyle("linear-gradient(45deg,#ff512f,#dd2476)")}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "scale(1.05)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 0 10px rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "scale(1)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
            }}
          >
            📍 Location
          </a>

          <a
            href="https://instasite.in"
            target="_blank"
            rel="noopener noreferrer"
            style={btnStyle("linear-gradient(45deg,#6a11cb,#2575fc)")}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "scale(1.05)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 0 10px rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "scale(1)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
            }}
          >
            🌐 Visit Website
          </a>

          {/* Share via WhatsApp button */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            style={btnStyle("linear-gradient(45deg,#25D366,#075E54)")}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1.05)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 10px rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            <span className="inline-flex items-center gap-2 justify-center w-full">
              <SiWhatsapp size={16} /> Share this Card
            </span>
          </button>

          {/* Install App button */}
          {installPrompt && !installed && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onClick={handleInstall}
              data-ocid="install.primary_button"
              style={btnStyle("linear-gradient(45deg,#00b894,#00cec9)")}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1.05)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 10px rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              📲 Install App
            </motion.button>
          )}

          {/* QR Code section */}
          <div style={{ marginTop: "20px" }}>
            <button
              type="button"
              onClick={() => setShowQR((v) => !v)}
              style={btnStyle("linear-gradient(45deg,#00d4ff,#007bff)")}
            >
              {showQR ? "🔼 Hide QR Code" : "📲 Show QR Code"}
            </button>

            {showQR && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "16px",
                  display: "inline-block",
                  marginTop: "12px",
                  boxShadow: "0 0 20px rgba(0,212,255,0.4)",
                }}
              >
                <img
                  src={QR_URL}
                  alt="QR Code"
                  width={200}
                  height={200}
                  style={{ display: "block" }}
                />
                <div
                  style={{
                    fontSize: "11px",
                    color: "#555",
                    marginTop: "8px",
                    textAlign: "center",
                  }}
                >
                  Scan to save contact
                </div>
              </motion.div>
            )}
          </div>

          <div
            style={{
              marginTop: "15px",
              fontSize: "11px",
              color: "#aaa",
            }}
          >
            Get your digital card from InstaSite Kerala
          </div>
        </motion.div>
      </div>
    </div>
  );
}
