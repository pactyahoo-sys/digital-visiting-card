# InstaSite Kerala - Digital Card

## Current State
The app is a premium mobile-first digital visiting card for Nagarajan / InstaSite Kerala. It has:
- Brand header with tagline and 5-star rating
- Profile photo, contact info, action buttons (WhatsApp, Save Contact, Call, Location, Visit Website, Share, QR)
- Services grid, gallery, Google Maps embed, contact/booking form
- Malayalam/English language toggle
- Admin panel via Internet Identity

## Requested Changes (Diff)

### Add
- Testimonial/review section with 3 real-sounding user reviews (name, business type, star rating, quote)
- "Live Demo" preview cards section above the fold (after brand header, before profile) showing 3 sample card types
- "Why Choose Us" section with 4 unique differentiators (speed, no-code, WhatsApp integration, lifetime support)
- Pricing/free trial section showing 3 tiers (Free, Pro, Business) with clear CTAs
- Nav bar at top with text labels alongside icons (Home, Services, Gallery, Contact)

### Modify
- Main WhatsApp CTA text → "Chat on WhatsApp – Get Your Free Card Now"
- Brand tagline → stronger: "Kerala's Fastest Digital Business Cards"
- Sub-tagline → "Ready in 30 Minutes. No Coding. No Hassle."
- Footer CTA → "Create Your Free Website Now – No Coding Needed"
- Services section descriptions → more benefit-driven, specific to Kerala business owners
- Happy clients count → "500+ Kerala Businesses Trust Us"
- Header navigation: add clear text labels, not icon-only

### Remove
- Nothing removed; only additions and modifications

## Implementation Plan
1. Update translations (en + ml) with new text, testimonials, pricing, why-choose-us data, nav labels, demo cards
2. Add `TestimonialsSection` component inline in App.tsx
3. Add `LiveDemoSection` component (above profile area, below brand header)
4. Add `WhyChooseUsSection` component
5. Add `PricingSection` component
6. Add top `NavBar` component with text + icon labels
7. Update existing text strings (CTA, taglines, service descriptions)
8. Add CSS styles for all new sections
