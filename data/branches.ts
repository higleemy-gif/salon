export type BranchId = "Gunupur" | "Rayagada";

export type Branch = {
  id: BranchId;
  name: string;
  city: string;
  address: string;
  phone: string;
  phoneDial: string; // digits only for tel:
  whatsapp: string; // digits only, includes country code
  hours: string;
  mapEmbed: string;
  mapsLink: string;
};

export const BRANCHES: Record<BranchId, Branch> = {
  Gunupur: {
    id: "Gunupur",
    name: "MIRRORS Gunupur",
    city: "Gunupur, Rayagada district, Odisha",
    address: "Near Indian Petrol Pump, Jio Mart 2nd Floor, Gunupur, Rayagada, Odisha",
    phone: "+91 94390 80105",
    phoneDial: "+919439080105",
    whatsapp: "919439080105",
    hours: "Mon – Sun · 9:00 AM – 9:00 PM",
    mapEmbed: "⟨MAP_EMBED_GUNUPUR⟩",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=MIRRORS+Salon+Gunupur"
  },
  Rayagada: {
    id: "Rayagada",
    name: "MIRRORS Rayagada",
    city: "Rayagada, Odisha",
    address: "Raniguda Farm, Near Bhaskar Chhaka, Rayagada, Odisha",
    phone: "+91 94390 80105",
    phoneDial: "+919439080105",
    whatsapp: "919439080105",
    hours: "Mon – Sun · 9:00 AM – 9:00 PM",
    mapEmbed: "⟨MAP_EMBED_RAYAGADA⟩",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=MIRRORS+Salon+Rayagada"
  }
};

export const BRANCH_LIST: Branch[] = [BRANCHES.Gunupur, BRANCHES.Rayagada];

export const ACADEMY_WHATSAPP = "919439080105";

export const CONTACT = {
  email: "⟨EMAIL⟩",
  instagram:
    "https://www.instagram.com/_sujata_mirrors_beauti_parlour?utm_source=qr&igsh=MTJncWVtYnBuZ3N0bQ%3D%3D",
  facebook:
    "https://www.facebook.com/profile.php?id=100068391823868",
  youtube: "⟨YOUTUBE_URL⟩"
};
