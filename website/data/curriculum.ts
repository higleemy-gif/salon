export type Module = {
  icon: string;
  title: string;
  items: string[];
};

export const COURSE = {
  name: "3-Month Professional Beauty Course",
  duration: "3 Months",
  /** Fees intentionally not displayed on the site — shared on WhatsApp enquiry. */
  fees: "On enquiry",
  focus: "Skin + Hair + Makeup",
  training: "Theory + Practical + Live Model"
};

export const MODULES: Module[] = [
  {
    icon: "💇",
    title: "Hair Professional Training",
    items: [
      "Hair & Scalp Analysis",
      "Hair Washing & Blow Dry",
      "Basic & Advanced Hair Cutting",
      "Straight, U, V & Layer Cut",
      "Hair Styling",
      "Hair Spa & Scalp Treatment",
      "Hair Colour Theory & Colour Wheel",
      "Global Colour & Root Touch-up",
      "Highlights",
      "Keratin",
      "Smoothening",
      "Nanoplastia",
      "Hair Botox",
      "Straightening",
      "Dandruff & Hair-care Knowledge"
    ]
  },
  {
    icon: "🧖",
    title: "Skin & Beauty Training",
    items: [
      "Skin Analysis & Skin Types",
      "Basic Cleanup",
      "Facial Techniques",
      "Fruit Facial",
      "Professional Facial",
      "De-tan",
      "Bleach",
      "Threading",
      "Waxing",
      "Manicure & Pedicure",
      "Skin-care Product Knowledge",
      "Client Consultation"
    ]
  },
  {
    icon: "💄",
    title: "Makeup Training",
    items: [
      "Makeup Basics",
      "Skin Preparation",
      "Base Making",
      "Eye Makeup",
      "Party Makeup",
      "Engagement Makeup",
      "HD Makeup",
      "Bridal Makeup",
      "Bridal Hairstyle",
      "Saree Draping",
      "Makeup Product Knowledge"
    ]
  },
  {
    icon: "💅",
    title: "Nail Art",
    items: [
      "Nail Hygiene",
      "Nail Shaping",
      "Manicure",
      "Basic Nail Art",
      "French Nail Art",
      "Gel Polish Basics",
      "Nail Extension Basics"
    ]
  },
  {
    icon: "🧔",
    title: "Gents Grooming",
    items: [
      "Men's Haircut",
      "Beard Styling",
      "Shaving",
      "Hair Styling",
      "Head Massage",
      "Men's Facial",
      "De-tan"
    ]
  },
  {
    icon: "🏆",
    title: "Salon Management",
    items: [
      "Professional Client Handling",
      "Consultation Skills",
      "Service & Pricing Knowledge",
      "Hygiene & Sanitization",
      "Product Knowledge",
      "Appointment Management",
      "Billing & Daily Sales Record",
      "Basic Salon Management",
      "Social Media & Instagram Basics"
    ]
  },
  {
    icon: "🎯",
    title: "Practical Training",
    items: [
      "Live Models",
      "Demonstrations",
      "Practical Assignments",
      "Final Assessment"
    ]
  }
];
