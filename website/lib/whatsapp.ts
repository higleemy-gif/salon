import { BRANCHES, BranchId, ACADEMY_WHATSAPP } from "@/data/branches";

export type SalonBookingData = {
  branch: BranchId;
  /** One or more services. */
  services: string[];
  name: string;
  phone: string;
  date?: string;
  time?: string;
  notes?: string;
};

export type AcademyEnquiryData = {
  location: BranchId;
  name: string;
  phone: string;
  courseInterest: string;
  message?: string;
};

/** "2026-10-01" → "Wed, 1 Oct 2026" (falls back to raw value if malformed). */
function formatDateHuman(iso?: string): string {
  if (!iso) return "flexible";
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  if (isNaN(d.getTime())) return iso;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/** "14:30" → "2:30 PM" (falls back to raw value if malformed). */
function formatTimeHuman(hhmm?: string): string {
  if (!hhmm) return "flexible";
  const [hStr, mStr] = hhmm.split(":");
  const h = Number(hStr);
  if (isNaN(h)) return hhmm;
  const suffix = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mStr} ${suffix}`;
}

export function buildSalonMessage(d: SalonBookingData): string {
  const servicesBlock =
    d.services.length === 1
      ? `• Service: ${d.services[0]}`
      : `• Services (${d.services.length}):\n${d.services
          .map((s) => `    - ${s}`)
          .join("\n")}`;

  return `Hello MIRRORS Salon (${d.branch} branch),
I'd like to book an appointment.

${servicesBlock}
• Name: ${d.name}
• Phone: ${d.phone}
• Preferred date: ${formatDateHuman(d.date)}
• Preferred time: ${formatTimeHuman(d.time)}
• Notes: ${d.notes || "-"}

Please confirm my slot. Thank you!`;
}

export function buildAcademyMessage(d: AcademyEnquiryData): string {
  return `Hello MIRRORS Academy (${d.location}),
I'm interested in the 3-Month Professional Beauty Course.

• Course/Focus: ${d.courseInterest}
• Name: ${d.name}
• Phone: ${d.phone}
• Message: ${d.message || "-"}

Please share batch details & admission process. Thank you!`;
}

export function salonWhatsAppUrl(d: SalonBookingData): string {
  const number = BRANCHES[d.branch].whatsapp;
  return `https://wa.me/${number}?text=${encodeURIComponent(buildSalonMessage(d))}`;
}

export function academyWhatsAppUrl(d: AcademyEnquiryData): string {
  const number = ACADEMY_WHATSAPP;
  return `https://wa.me/${number}?text=${encodeURIComponent(buildAcademyMessage(d))}`;
}

export function branchWhatsAppUrl(branch: BranchId, greeting?: string): string {
  const number = BRANCHES[branch].whatsapp;
  const msg =
    greeting ||
    `Hello MIRRORS ${branch}, I'd like to know more about your salon & academy.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

export function openInNewTab(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}
