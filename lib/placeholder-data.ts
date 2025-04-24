export interface ProductDetail {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  slug: string;
}

export const placeholderProducts: ProductDetail[] = [
  {
    id: "eco-101",
    name: "EcoBlend Bamboo Tumbler",
    price: 24.99,
    imageUrl: "/placeholder-tumbler.svg",
    description:
      "Stay hydrated sustainably with our stylish EcoBlend tumbler. Made from natural bamboo fiber with a secure BPA-free lid. Perfect for hot or cold beverages on the go.",
    slug: "ecoblend-bamboo-tumbler",
  },
  {
    id: "tech-gdt-005",
    name: "Aura Glow Smart Lamp",
    price: 79.5,
    imageUrl: "/placeholder-lamp.svg",
    description:
      "Set the perfect mood with the Aura Glow Smart Lamp. Control millions of colors and brightness levels via app or voice command. Integrates seamlessly with your smart home ecosystem.",
    slug: "aura-glow-smart-lamp",
  },
  {
    id: "kit-cb-pro",
    name: "Artisan Maple Cutting Board",
    price: 45.0,
    imageUrl: "/placeholder-board.svg",
    description:
      "Crafted from premium North American maple, this durable cutting board is gentle on knives and features a juice groove. A beautiful and functional addition to any kitchen.",
    slug: "artisan-maple-cutting-board",
  },
  {
    id: "stat-nb-01",
    name: "Nomad Leather Bound Journal",
    price: 32.0,
    imageUrl: "/placeholder-journal.svg",
    description:
      "Capture your thoughts and ideas in style. This A5 journal features a supple full-grain leather cover, 200 pages of acid-free lined paper, and a lay-flat binding.",
    slug: "nomad-leather-journal",
  },
  {
    id: "audio-hp-elite",
    name: "SoundScape Elite Wireless Headphones",
    price: 199.99,
    imageUrl: "/placeholder-headphones.svg",
    description:
      "Immerse yourself in rich, detailed audio with the SoundScape Elite. Featuring active noise cancellation, 30-hour battery life, and crystal-clear microphone for calls.",
    slug: "soundscape-elite-headphones",
  },
  {
    id: "home-diffuser-01",
    name: "Serenity Ultrasonic Diffuser",
    price: 55.0,
    imageUrl: "/placeholder-diffuser.svg",
    description:
      "Create a calming atmosphere with the Serenity Diffuser. Uses ultrasonic technology to gently disperse essential oils, with customizable mist settings and ambient light options.",
    slug: "serenity-ultrasonic-diffuser",
  },
];

// You could also define a simpler type for the PLP card if needed
export interface ProductSummary {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  slug: string;
}
