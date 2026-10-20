import hero from "@/assets/ciao-hero.jpg";
import women from "@/assets/ciao-women.jpg";
import men from "@/assets/ciao-men.jpg";
import stillLife from "@/assets/ciao-still-life.jpg";

export type Product = { id: string; name: string; category: string; price: number; image: string; label?: string; description: string };

export const imagery = { hero, women, men, stillLife };
export const products: Product[] = [
  { id: "camel-wool-coat", name: "Camel Wool Coat", category: "Women · Outerwear", price: 1290, image: hero, label: "New", description: "A long, softly structured coat cut in double-faced Italian virgin wool." },
  { id: "silk-column-dress", name: "Silk Column Dress", category: "Women · Evening", price: 640, image: women, description: "Fluid ivory silk, sculpted through the waist and finished by hand in Milan." },
  { id: "atelier-blazer", name: "Atelier Blazer", category: "Women · Tailoring", price: 890, image: women, label: "Limited", description: "An architectural wool blazer with a precise shoulder and elongated line." },
  { id: "nero-suit", name: "Nero Wool Suit", category: "Men · Tailoring", price: 2450, image: men, label: "New", description: "A two-piece suit in superfine wool with a clean Milanese silhouette." },
  { id: "merino-knit", name: "Fine Merino Knit", category: "Men · Knitwear", price: 390, image: men, description: "A lightweight merino crewneck designed for effortless layering." },
  { id: "milan-handbag", name: "Milano Handbag", category: "Women · Leather Goods", price: 1850, image: stillLife, label: "Limited", description: "A disciplined top-handle silhouette in smooth Italian calfskin." },
  { id: "cashmere-knit", name: "Ivory Cashmere Knit", category: "Women · Knitwear", price: 420, image: stillLife, description: "Pure cashmere with a relaxed line and hand-linked finishing." },
  { id: "penny-loafer", name: "Brera Penny Loafer", category: "Men · Footwear", price: 690, image: stillLife, description: "Polished calfskin loafers, crafted in a family workshop near Milan." },
  { id: "silk-twill-scarf", name: "Como Silk Scarf", category: "Accessories · Silk", price: 280, image: stillLife, label: "New", description: "Hand-rolled twill silk, printed in a family mill on Lake Como." },
  { id: "calfskin-belt", name: "Cintura Calfskin Belt", category: "Accessories · Leather", price: 320, image: stillLife, description: "A slim belt in vegetable-tanned calfskin with a hand-polished brass buckle." },
  { id: "leather-cardholder", name: "Porta Carte Cardholder", category: "Accessories · Leather", price: 210, image: stillLife, description: "Six-card holder in smooth Italian leather, edge-painted by hand." },
  { id: "cashmere-scarf", name: "Cashmere Travel Wrap", category: "Accessories · Cashmere", price: 450, image: stillLife, label: "Limited", description: "An oversized pure-cashmere wrap, woven in Biella for journeys and evenings." },
];

export const money = (value: number) => new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);