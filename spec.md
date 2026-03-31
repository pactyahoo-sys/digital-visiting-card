# Digital Visiting Card — SEO Implementation

## Current State
The app is a PWA digital visiting card for Nagarajan / InstaSite Kerala. It has a basic `<title>` tag, theme-color meta, and PWA manifest, but lacks SEO meta tags, structured data, sitemap, robots.txt, and semantic heading structure.

## Requested Changes (Diff)

### Add
- Full SEO meta block in `index.html`: description, keywords (Thiruvananthapuram local SEO), Open Graph, Twitter Card, canonical, robots, geo meta tags
- JSON-LD LocalBusiness structured data schema in `index.html` for Google rich results and local SEO
- `public/sitemap.xml` — static sitemap referencing the live URL
- `public/robots.txt` — allow all crawlers, reference sitemap
- Semantic HTML heading elements (h1, h2) in App.tsx for proper heading structure
- Improved alt tags on QR code image

### Modify
- `index.html` — expand `<head>` with full SEO meta tags and JSON-LD script
- `src/App.tsx` — wrap name in `<h1>`, role/company in semantic elements, improve QR alt text

### Remove
- Nothing removed

## Implementation Plan
1. Update `index.html` with full meta tag set + JSON-LD LocalBusiness schema
2. Create `public/sitemap.xml` with the GitHub Pages URL
3. Create `public/robots.txt`
4. Update `App.tsx` to use semantic h1/h2 for name and title while preserving visual design
