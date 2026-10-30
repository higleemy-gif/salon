# MIRRORS Unisex Salon & Academy — Website

A premium, mobile-first marketing + booking site for **MIRRORS Unisex Salon & Academy** (Gunupur & Rayagada, Odisha), built with **Next.js 14 (App Router) + TypeScript + Tailwind + Framer Motion**.

There is **no backend**. Every booking / enrolment form assembles a WhatsApp `wa.me` deep link with a pre-filled message and opens it in a new tab, routing to the branch-specific number.

---

## Quick start

```bash
npm install
npm run dev
# → http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

Deploy anywhere Next.js works (Vercel recommended).

---

## Where to fill placeholders

Everything the owner needs to swap is a visible `⟨PLACEHOLDER⟩` token so it's easy to find.

Global search & replace inside these files:

| File | What to update |
| --- | --- |
| `data/branches.ts` | Phone, WhatsApp, address, hours, Google Maps embed URLs for **both** branches; email, Instagram / Facebook / YouTube; **academy WhatsApp number** |
| `data/services.ts` | Prices (optional — leave blank for "On enquiry"), service copy |
| `data/curriculum.ts` | Course fees / duration edits if needed |
| `app/about/page.tsx` | Owner story (replace the `⟨PLACEHOLDER⟩` block) |
| `app/academy/page.tsx` | FAQ answers marked `⟨PLACEHOLDER⟩` (batch timings, etc.) |
| `app/page.tsx` | Testimonials marked `⟨PLACEHOLDER⟩` |
| `app/layout.tsx` + `app/sitemap.ts` + `app/robots.ts` | Replace `mirrors-salon.example.com` with the real domain |

The WhatsApp number format is **country code + number, digits only** (e.g. India: `9198XXXXXXXX`).

---

## Booking flow (how it works)

- Any "Book Appointment" button opens the global `BookingModal` (see `components/BookingModal.tsx`).
- Buttons can pre-select a **branch** and/or a **service** (see `<BookButton branch="Gunupur" service="Bridal makeover" />`).
- On submit, the modal builds `https://wa.me/<NUMBER>?text=<encoded message>` and opens it.
- Message template & URL builder live in `lib/whatsapp.ts`.

The **Academy enquiry** flow is the same pattern — see `components/AcademyEnquiryModal.tsx` and `<EnrolButton />`.

The **Floating WhatsApp** button (bottom-right) asks the user to pick a branch, then opens that branch's WhatsApp with a generic greeting.

---

## Design system

Colours, fonts and primitives live in:

- `app/globals.css` — CSS variables (`--color-gold`, `--gradient-gold`, etc.) and reusable classes (`btn-primary`, `btn-outline`, `card-dark`, `eyebrow`, `heading-serif`, `input-field`, `gold-hairline`).
- `tailwind.config.ts` — brand colour aliases and shadow/animation utilities.
- Fonts: **Playfair Display** (display) + **Poppins** (body) via `next/font`.

---

## Structure

```
app/
  layout.tsx          Root layout (header, footer, floating WhatsApp, JSON-LD)
  page.tsx            Home (all 11 sections)
  services/page.tsx   Full catalog A–G
  academy/page.tsx    3-Month course + full curriculum + FAQ
  branches/page.tsx   Two branch blocks + maps
  gallery/page.tsx    Masonry gallery
  about/page.tsx      Brand story + values
  contact/page.tsx    Branch cards + socials
  book/page.tsx       Fallback that auto-opens the booking modal
  sitemap.ts          /sitemap.xml
  robots.ts           /robots.txt
components/           Header, Footer, FloatingWhatsApp, BookingProvider,
                     BookingModal, AcademyEnquiryModal, PageHero, ui.tsx, JSON-LD
data/                 branches.ts, services.ts, curriculum.ts
lib/                  whatsapp.ts (URL + message builder)
public/logo.png       The MIRRORS logo
```

---

## SEO

- Per-page `title` + `description` metadata.
- `HealthAndBeautyBusiness` JSON-LD for **each branch** and a `Course` JSON-LD for the 3-month course (see `components/BranchesJsonLd.tsx`).
- `sitemap.xml` + `robots.txt` generated automatically.
- OpenGraph / Twitter cards use `/logo.png` — swap for a proper OG image when available.

---

## Accessibility

- WCAG AA gold-on-black / ink-on-cream contrast throughout.
- Visible gold focus rings, keyboard-navigable modals, ARIA labels.
- `prefers-reduced-motion` honoured (animations disabled).
- Semantic headings + alt text on images.

---

## Notes

- Gallery, testimonials and hero use tasteful Unsplash placeholders — swap for real photos in `data/*` and `app/gallery/page.tsx` when available.
- The academy WhatsApp number defaults to `⟨WHATSAPP_ACADEMY⟩` (`data/branches.ts`). If the owner prefers per-branch admissions, replace `ACADEMY_WHATSAPP` in `lib/whatsapp.ts` with `BRANCHES[d.location].whatsapp`.
