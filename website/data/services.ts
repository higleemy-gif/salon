export type Audience = "Women" | "Men" | "Unisex";

export type Service = {
  name: string;
  desc?: string;
  price?: string; // display string, e.g. "₹499" or "On enquiry"
  audience?: Audience;
};

export type ServiceCategory = {
  id: string; // anchor slug
  key: string; // A, B, C…
  title: string;
  eyebrow?: string;
  image: string; // stock image URL
  blurb: string;
  services: Service[];
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "hair-women",
    key: "A",
    title: "Hair — Women",
    eyebrow: "Category A",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=80",
    blurb:
      "Precision cuts, luxurious spas, and colour crafted for hair that feels as good as it looks.",
    services: [
      { name: "Haircut & styling", audience: "Women" },
      { name: "Hair wash & blow-dry", audience: "Women" },
      { name: "Layer / U / V / Step cut", audience: "Women" },
      { name: "Hair styling (curls / tongs / iron)", audience: "Women" },
      { name: "Hair spa & scalp treatment", audience: "Women" },
      { name: "Head massage", audience: "Women" },
      { name: "Anti-dandruff treatment", audience: "Women" },
      { name: "Anti-hairfall treatment", audience: "Women" },
      { name: "Hair colour – global", audience: "Women" },
      { name: "Root touch-up", audience: "Women" },
      { name: "Highlights / Streaks", audience: "Women" },
      { name: "Balayage / Ombré", audience: "Women" },
      { name: "Keratin", audience: "Women" },
      { name: "Smoothening", audience: "Women" },
      { name: "Nanoplastia", audience: "Women" },
      { name: "Hair Botox", audience: "Women" },
      { name: "Cysteine", audience: "Women" },
      { name: "Straightening / Rebonding", audience: "Women" },
      { name: "Perming", audience: "Women" },
      { name: "Hair extensions", audience: "Women" }
    ]
  },
  {
    id: "hair-men",
    key: "B",
    title: "Hair & Grooming — Men",
    eyebrow: "Category B",
    image:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1400&q=80",
    blurb:
      "Sharp haircuts, beard sculpting, and grooming treatments crafted for the modern gentleman.",
    services: [
      { name: "Men's haircut", audience: "Men" },
      { name: "Beard styling & trim", audience: "Men" },
      { name: "Shave / clean shave", audience: "Men" },
      { name: "Hair styling", audience: "Men" },
      { name: "Hair colour", audience: "Men" },
      { name: "Head massage", audience: "Men" },
      { name: "Kids haircut", audience: "Unisex" },
      { name: "De-tan (men)", audience: "Men" },
      { name: "Men's facial", audience: "Men" }
    ]
  },
  {
    id: "skin-face",
    key: "C",
    title: "Skin & Face",
    eyebrow: "Category C",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1400&q=80",
    blurb:
      "Facials, glow treatments and HydraFacial protocols designed for radiant, healthy skin.",
    services: [
      { name: "Basic cleanup", audience: "Unisex" },
      { name: "Herbal / fruit cleanup", audience: "Unisex" },
      { name: "Fruit facial", audience: "Unisex" },
      { name: "Professional facial", audience: "Unisex" },
      { name: "Gold facial", audience: "Unisex" },
      { name: "Anti-ageing facial", audience: "Unisex" },
      { name: "Brightening / glow facial", audience: "Unisex" },
      { name: "HydraFacial", audience: "Unisex" },
      { name: "Korean glass-skin treatment", audience: "Unisex" },
      { name: "De-tan (face / body)", audience: "Unisex" },
      { name: "Bleach", audience: "Unisex" },
      { name: "Threading (brow / upper lip / forehead / full face)", audience: "Women" },
      { name: "Face massage", audience: "Unisex" },
      { name: "Under-eye treatment", audience: "Unisex" }
    ]
  },
  {
    id: "waxing-body",
    key: "D",
    title: "Waxing & Body",
    eyebrow: "Category D",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1400&q=80",
    blurb: "Gentle waxing rituals and body treatments that leave skin smooth and cared-for.",
    services: [
      { name: "Full-arm / full-leg waxing", audience: "Women" },
      { name: "Full-body waxing", audience: "Women" },
      { name: "Rica / honey / chocolate waxing", audience: "Women" },
      { name: "Body polishing", audience: "Unisex" },
      { name: "Body scrub", audience: "Unisex" },
      { name: "Body spa / massage", audience: "Unisex" }
    ]
  },
  {
    id: "makeup",
    key: "E",
    title: "Makeup",
    eyebrow: "Category E",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=80",
    blurb: "Camera-ready HD & airbrush artistry for parties, engagements and receptions.",
    services: [
      { name: "Party makeup", audience: "Women" },
      { name: "Engagement makeup", audience: "Women" },
      { name: "Reception makeup", audience: "Women" },
      { name: "HD makeup", audience: "Women" },
      { name: "Airbrush makeup", audience: "Women" },
      { name: "Basic / trial makeup", audience: "Women" },
      { name: "Groom makeup", audience: "Men" },
      { name: "Hairdo / hairstyling for makeup", audience: "Women" },
      { name: "Saree draping", audience: "Women" },
      { name: "Mehendi (party)", audience: "Women" }
    ]
  },
  {
    id: "bridal",
    key: "F",
    title: "Bridal",
    eyebrow: "Category F — Signature",
    image:
      "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1400&q=80",
    blurb:
      "Full-day bridal experiences — from pre-bridal glow sessions to the final aisle look.",
    services: [
      { name: "Bridal makeover", audience: "Women" },
      { name: "Bridal / reception package", audience: "Women" },
      { name: "Pre-bridal package (skin + hair + body sessions)", audience: "Women" },
      { name: "Bridal saree draping", audience: "Women" },
      { name: "Bridal hairstyle", audience: "Women" },
      { name: "Bridal mehendi", audience: "Women" },
      { name: "Complete wedding package (bride + groom)", audience: "Unisex" }
    ]
  },
  {
    id: "nails",
    key: "G",
    title: "Nails",
    eyebrow: "Category G",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1400&q=80",
    blurb: "Manicures, pedicures, extensions and nail art with a couture finish.",
    services: [
      { name: "Regular manicure", audience: "Unisex" },
      { name: "French manicure", audience: "Women" },
      { name: "Paraffin / spa manicure", audience: "Women" },
      { name: "Regular pedicure", audience: "Unisex" },
      { name: "Spa / chocolate pedicure", audience: "Women" },
      { name: "Nail art", audience: "Women" },
      { name: "Gel polish", audience: "Women" },
      { name: "Nail extensions", audience: "Women" }
    ]
  }
];

// Flat list for the booking modal's service dropdown.
export const ALL_SERVICES: { label: string; group: string }[] = [
  ...SERVICE_CATEGORIES.flatMap((c) =>
    c.services.map((s) => ({ label: s.name, group: c.title }))
  ),
  { label: "Other / Not sure", group: "Other" }
];
