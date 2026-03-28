import { Toaster } from "@/components/ui/sonner";
import { motion } from "motion/react";
import { SiWhatsapp } from "react-icons/si";

export default function App() {
  const profileSrc =
    "/assets/uploads/file_00000000a268720b8d35c42ca2dd4768-019d356b-0113-7442-b1d1-e9afa2b638a9-1.png";

  const vcfContent = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "FN:Nagarajan",
    "ORG:InstaSite Kerala",
    "TITLE:Sales Officer",
    "TEL:+918838510443",
    "EMAIL:cynorlux@gmail.com",
    "END:VCARD",
  ].join("\n");

  const vcfBlob = new Blob([vcfContent], { type: "text/vcard" });
  const vcfUrl = URL.createObjectURL(vcfBlob);

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
          {/* Logo */}
          <div style={{ fontSize: "20px", fontWeight: 600, color: "#00d4ff" }}>
            InstaSite Kerala
          </div>
          <div
            style={{ fontSize: "12px", color: "#ccc", marginBottom: "15px" }}
          >
            Build. Launch. Grow.
          </div>

          {/* Profile photo */}
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

          {/* Name */}
          <div
            style={{
              fontSize: "26px",
              color: "gold",
              fontWeight: "bold",
            }}
          >
            Nagarajan
          </div>

          {/* Role */}
          <div
            style={{ fontSize: "14px", marginBottom: "15px", color: "white" }}
          >
            Sales Officer
          </div>

          {/* Info */}
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

          {/* Buttons */}
          <a
            href={vcfUrl}
            download="Nagarajan.vcf"
            style={{
              display: "block",
              margin: "10px 0",
              padding: "14px",
              borderRadius: "12px",
              textDecoration: "none",
              color: "black",
              fontWeight: 500,
              background: "linear-gradient(45deg,#f7971e,#ffd200)",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
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
            style={{
              display: "block",
              margin: "10px 0",
              padding: "14px",
              borderRadius: "12px",
              textDecoration: "none",
              color: "white",
              fontWeight: 500,
              background: "linear-gradient(45deg,#007bff,#00c6ff)",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
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
            style={{
              display: "block",
              margin: "10px 0",
              padding: "14px",
              borderRadius: "12px",
              textDecoration: "none",
              color: "white",
              fontWeight: 500,
              background: "linear-gradient(45deg,#25D366,#128C7E)",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
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
            style={{
              display: "block",
              margin: "10px 0",
              padding: "14px",
              borderRadius: "12px",
              textDecoration: "none",
              color: "white",
              fontWeight: 500,
              background: "linear-gradient(45deg,#ff512f,#dd2476)",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
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
            style={{
              display: "block",
              margin: "10px 0",
              padding: "14px",
              borderRadius: "12px",
              textDecoration: "none",
              color: "white",
              fontWeight: 500,
              background: "linear-gradient(45deg,#6a11cb,#2575fc)",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
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

          {/* Footer */}
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
