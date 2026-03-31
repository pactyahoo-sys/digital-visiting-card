import {
  CheckCircle2,
  Leaf,
  MapPin,
  Phone,
  Shield,
  Users,
  Zap,
} from "lucide-react";

const TEL_URL = "tel:+918838510443";
const WHATSAPP_URL = "https://wa.me/918838510443";

const services = [
  {
    emoji: "🪲",
    title: "Termite Control",
    description:
      "Complete termite inspection, treatment & long-term prevention for homes and commercial properties.",
  },
  {
    emoji: "🪳",
    title: "Cockroach Control",
    description:
      "Fast-acting gel bait and spray treatment for permanent cockroach elimination.",
  },
  {
    emoji: "🦟",
    title: "Mosquito Control",
    description:
      "Thermal fogging and larvicide treatment to eliminate mosquito breeding grounds.",
  },
  {
    emoji: "🐀",
    title: "Rodent Control",
    description:
      "Safe trapping and baiting programs to keep rats and mice out of your space.",
  },
];

const reasons = [
  {
    Icon: Users,
    label: "Experienced Professionals",
    detail: "Years of hands-on pest management expertise",
  },
  {
    Icon: Leaf,
    label: "Safe & Eco-friendly Methods",
    detail: "Treatments safe for your family and pets",
  },
  {
    Icon: Zap,
    label: "Affordable Pricing",
    detail: "Competitive rates with no hidden charges",
  },
  {
    Icon: Shield,
    label: "Fast Response",
    detail: "Quick on-site visits across Thiruvananthapuram",
  },
];

export default function App() {
  const year = new Date().getFullYear();
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* ── HERO ── */}
      <header className="hero-gradient text-white" data-ocid="hero.section">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-sm font-medium bg-white/15 border border-white/25 backdrop-blur-sm">
            <Shield size={13} />
            <span>Licensed &amp; Certified Pest Control</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight mb-4">
            BPTS Pest Control Services
          </h1>
          <p className="text-xl font-light opacity-85 mb-10">
            Trusted Pest Control in Thiruvananthapuram
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={TEL_URL}
              className="cta-call"
              data-ocid="hero.primary_button"
            >
              📞 Call Now
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-whatsapp"
              data-ocid="hero.secondary_button"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>

        {/* Decorative wave divider */}
        <div className="relative h-12 overflow-hidden">
          <svg
            aria-hidden="true"
            viewBox="0 0 1440 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute bottom-0 w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 48 C360 0 1080 0 1440 48 L1440 48 L0 48 Z"
              fill="oklch(0.98 0.005 255)"
            />
          </svg>
        </div>
      </header>

      {/* ── ABOUT ── */}
      <section className="py-16 px-6 bg-background" data-ocid="about.section">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-5">
            Pest Control Services in Thiruvananthapuram
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We provide professional pest control services including termite
            control, cockroach control, mosquito control, and rodent control
            across Trivandrum. Safe, effective and affordable solutions for
            homes and businesses.
          </p>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-16 px-6 bg-muted" data-ocid="services.section">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-10">
            Our Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((service, i) => (
              <article
                key={service.title}
                className="service-card"
                data-ocid={`services.item.${i + 1}`}
              >
                <div className="text-4xl mb-3">{service.emoji}</div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2
                    size={16}
                    className="flex-shrink-0"
                    style={{ color: "oklch(0.50 0.13 255)" }}
                  />
                  <h3 className="font-display font-semibold text-lg text-foreground">
                    {service.title}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-16 px-6 bg-background" data-ocid="why.section">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-10">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {reasons.map((reason, i) => (
              <div
                key={reason.label}
                className="reason-card"
                data-ocid={`why.item.${i + 1}`}
              >
                <div
                  className="p-2.5 rounded-lg flex-shrink-0"
                  style={{
                    background: "oklch(0.30 0.165 255 / 0.1)",
                    color: "oklch(0.30 0.165 255)",
                  }}
                >
                  <reason.Icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {reason.label}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {reason.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="py-16 px-6 bg-muted" data-ocid="contact.section">
        <div className="max-w-md mx-auto">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-8">
            Contact Us
          </h2>
          <div className="bg-card rounded-2xl border border-border p-8 shadow-card text-center">
            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <MapPin size={16} style={{ color: "oklch(0.30 0.165 255)" }} />
                <span>Thiruvananthapuram, Kerala</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Phone size={16} style={{ color: "oklch(0.30 0.165 255)" }} />
                <span>+91 8838510443</span>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={TEL_URL}
                className="contact-btn-call"
                data-ocid="contact.primary_button"
              >
                <Phone size={15} />
                Call Now
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-btn-whatsapp"
                data-ocid="contact.secondary_button"
              >
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="py-8 px-6 text-center"
        style={{
          background: "oklch(0.18 0.12 255)",
          color: "oklch(0.82 0.04 255)",
        }}
      >
        <p className="text-sm mb-1">
          © {year} BPTS Pest Control | All Rights Reserved
        </p>
        <p className="text-xs" style={{ color: "oklch(0.60 0.06 255)" }}>
          Built with ❤️ using{" "}
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
