import { BRANCH_LIST, CONTACT } from "@/data/branches";
import { COURSE } from "@/data/curriculum";

export function BranchesJsonLd() {
  const businesses = BRANCH_LIST.map((b) => ({
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: b.name,
    image: "/logo.png",
    telephone: b.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: b.address,
      addressLocality: b.id,
      addressRegion: "Odisha",
      addressCountry: "IN"
    },
    openingHours: "Mo-Su 09:00-21:00",
    sameAs: [CONTACT.instagram, CONTACT.facebook, CONTACT.youtube].filter(
      (s) => s && !s.startsWith("⟨")
    ),
    priceRange: "₹₹"
  }));

  const course = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `MIRRORS Salon & Academy — ${COURSE.name}`,
    description:
      "3-Month Professional Beauty Course covering Skin, Hair and Makeup with theory, practical training and live-model practice. Certificate awarded on completion.",
    provider: {
      "@type": "Organization",
      name: "MIRRORS Unisex Salon & Academy",
      sameAs: [CONTACT.instagram, CONTACT.facebook].filter(
        (s) => s && !s.startsWith("⟨")
      )
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      location: [
        { "@type": "Place", name: "MIRRORS Gunupur" },
        { "@type": "Place", name: "MIRRORS Rayagada" }
      ]
    }
  };

  return (
    <>
      {businesses.map((b, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(b) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(course) }}
      />
    </>
  );
}
