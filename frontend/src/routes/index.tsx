import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorialSlideshow, ProductGrid, type EditorialSlide } from "@/components/storefront";
import { mixCatalogProducts, useCatalogItems } from "@/lib/catalog-api";
import { imagery } from "@/lib/catalog";
import dubaiDeliveryBanner from "@/assets/dubai-delivery-banner.jpg";
import signatureTeeModel from "@/assets/signature-tee-model.jpg";
import signatureTeeStillLife from "@/assets/signature-tee-still-life.jpg";
import homeImage from "@/assets/home.png";
import homeSlide1 from "@/assets/home_slideshow1.png";
import homeSlide2 from "@/assets/home_slideshow2.png";
import homeSlide3 from "@/assets/home_slideshow3.png";
import homeSlide4 from "@/assets/home_slideshow4.png";

const slides: EditorialSlide[] = [
  {
    eyebrow: "Autumn — Winter 2026",
    title: "The Quiet Luxury of Milan",
    copy: "Discover Italian tailoring, timeless silhouettes and considered details.",
    image: homeSlide1,
    alt: "CIAO D MILANO autumn winter campaign in Milan",
    linkTo: "/collections",
    linkLabel: "Shop Collection",
  },
  {
    eyebrow: "The House",
    title: "A Milanese Point of View",
    copy: "A study in restraint, shaped by enduring materials and impeccable craft.",
    image: homeSlide2,
    alt: "CIAO D MILANO campaign from the house collection",
  },
  {
    eyebrow: "Made to Endure",
    title: "Considered by Design",
    copy: "Modern pieces defined by precision, movement and quiet confidence.",
    image: homeSlide3,
    alt: "Considered Italian design from CIAO D MILANO",
  },
  {
    eyebrow: "The Season's Edit",
    title: "The Art of Dressing",
    copy: "Discover the latest expressions from the CIAO D MILANO atelier.",
    image: homeSlide4,
    alt: "Seasonal edit from the CIAO D MILANO atelier",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "CIAO D MILANO — The Quiet Luxury of Milan" }, { name: "description", content: "Discover CIAO D MILANO's latest Italian fashion collection, tailored with restraint and precision." }, { property: "og:title", content: "CIAO D MILANO — The Quiet Luxury of Milan" }, { property: "og:description", content: "Discover Italian tailoring, timeless womenswear and modern menswear." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: HomePage,
});

function HomePage() {
  const men = useCatalogItems("men_items", 2);
  const women = useCatalogItems("women_items", 2);
  const seasonEdit = mixCatalogProducts(men.data ?? [], women.data ?? []);
  const seasonError = men.error ?? women.error;
  return <>
  <EditorialSlideshow label="Home highlights" slides={slides} align="left" />
  <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28"><div className="mb-10 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"><div><p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-stone">New Arrivals</p><h2 className="font-serif text-4xl sm:text-5xl">This Season's Edit</h2></div><Link to="/new-arrivals" className="hidden text-[10px] uppercase tracking-[0.16em] sm:block">View All →</Link></div><ProductGrid items={seasonEdit} loading={men.isLoading || women.isLoading} error={seasonError instanceof Error ? seasonError.message : undefined} /></section>
  <section className="mx-auto grid max-w-[1440px] gap-6 px-4 pb-24 sm:px-6 md:grid-cols-12 lg:px-10"><Campaign to="/women" image={imagery.women} alt="Women's collection in a Milan atelier" eyebrow="Women" title="The Atelier Edit" className="md:col-span-7" /><div className="flex flex-col justify-between md:col-span-5"><div className="py-8 md:py-0"><p className="text-[10px] uppercase tracking-[0.2em] text-stone">Men</p><h2 className="mt-3 max-w-[12ch] font-serif text-4xl sm:text-5xl">Tailored for the Modern Man</h2><p className="mt-4 max-w-[40ch] text-sm leading-7 text-stone">Cut in Milan, finished by hand. A wardrobe built on restraint and precision.</p></div><Campaign to="/men" image={imagery.men} alt="Men's tailoring collection" title="Explore Menswear" compact /></div></section>
  <SignatureTee />
  <section className="relative min-h-[68vh] overflow-hidden bg-ink-deep"><img src={homeImage} alt="Italian craftsmanship and accessories" loading="lazy" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-ink-deep/80 via-ink-deep/25 to-transparent" /><div className="relative mx-auto flex min-h-[68vh] max-w-[1440px] items-center px-6 lg:px-10"><div className="max-w-xl text-paper"><p className="mb-4 text-[10px] uppercase tracking-[0.22em] text-sand">The Journal</p><h2 className="font-serif text-5xl leading-none sm:text-6xl">Crafted in the Quiet</h2><Button asChild variant="link" className="mt-6 px-0 text-paper"><Link to="/about">Read the Story <ArrowRight /></Link></Button></div></div></section>
  <section className="mx-auto grid max-w-[1440px] gap-8 px-6 py-24 md:grid-cols-12 lg:px-10 lg:py-28"><p className="text-[10px] uppercase tracking-[0.2em] text-stone md:col-span-4">Our Story</p><div className="md:col-span-8"><h2 className="max-w-[28ch] font-serif text-3xl leading-tight sm:text-4xl">Founded in Milan, CIAO D MILANO is a study in restraint — garments that speak softly and endure.</h2><p className="mt-6 max-w-[54ch] text-sm leading-7 text-stone">Every piece is cut from considered Italian fabric and finished in our atelier, where the pace is slow and the standard is absolute.</p><Button asChild variant="link" className="mt-5 px-0"><Link to="/about">Discover Our House <ArrowRight /></Link></Button></div></section>
  <DeliveryBanner />
  <Newsletter />
</>; }

function Campaign({ to, image, alt, eyebrow, title, className = "", compact = false }: { to: "/women" | "/men"; image: string; alt: string; eyebrow?: string; title: string; className?: string; compact?: boolean }) { return <Link to={to} className={`group relative block overflow-hidden ${className}`}><img src={image} alt={alt} loading="lazy" width={1024} height={1280} className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.02] ${compact ? "aspect-[4/5]" : "aspect-[4/5]"}`} /><div className="absolute inset-0 bg-gradient-to-t from-ink-deep/65 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-6 text-paper lg:p-8">{eyebrow && <p className="text-[9px] uppercase tracking-[0.18em] text-sand">{eyebrow}</p>}<h3 className="mt-2 font-serif text-3xl">{title}</h3></div></Link>; }
function SignatureTee() { return <section className="bg-ivory"><div className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(270px,0.9fr)_minmax(0,1fr)] md:gap-8 lg:gap-16 lg:px-10 lg:py-28"><div className="overflow-hidden"><img src={signatureTeeModel} alt="Man wearing the CIAO D MILANO essential ivory T-shirt in Milan" loading="lazy" width={1024} height={1280} className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-[1.02]" /></div><div className="order-first mx-auto max-w-md text-center md:order-none"><p className="text-[10px] uppercase tracking-[0.24em] text-sand">Our Signature Piece</p><h2 className="mt-6 font-serif text-5xl leading-[.95] sm:text-6xl md:text-5xl lg:text-6xl">The Essential<br />T-Shirt</h2><div className="mx-auto mt-5 flex w-16 items-center justify-center gap-2" aria-hidden="true"><span className="h-px w-5 bg-primary" /><span className="h-px w-5 bg-paper" /><span className="h-px w-5 bg-burgundy" /></div><p className="mt-6 text-[10px] font-medium uppercase tracking-[0.2em]">Simple. Refined. Italian.</p><p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-stone">Premium Italian cotton, shaped with a considered fit and finished for effortless everyday wear.</p><Button asChild size="lg" variant="outline" className="mt-8 border-ink bg-transparent hover:bg-ink hover:text-paper"><Link to="/men">Shop T-Shirts <ArrowRight /></Link></Button></div><div className="overflow-hidden"><img src={signatureTeeStillLife} alt="Ivory essential T-shirt displayed in the CIAO D MILANO atelier" loading="lazy" width={1024} height={1280} className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-[1.02]" /></div></div></section>; }
function DeliveryBanner() { return <section className="relative isolate min-h-[500px] overflow-hidden bg-ink-deep sm:min-h-[540px] lg:min-h-[430px]"><img src={dubaiDeliveryBanner} alt="Dubai skyline at golden hour" loading="lazy" width={1920} height={768} className="absolute inset-0 h-full w-full object-cover object-[58%_center]" /><div className="absolute inset-0 bg-gradient-to-r from-ink-deep via-ink-deep/70 to-ink-deep/20" /><div className="relative mx-auto grid min-h-[500px] max-w-[1440px] items-center gap-10 px-6 py-14 sm:min-h-[540px] lg:min-h-[430px] lg:grid-cols-[minmax(0,1fr)_300px] lg:px-10"><div className="max-w-2xl text-paper"><p className="mb-5 text-[10px] uppercase tracking-[0.22em] text-sand">We Deliver Style to You</p><h2 className="font-serif text-5xl leading-[.95] sm:text-6xl lg:text-7xl">Complimentary Delivery<br />Across the UAE</h2><p className="mt-6 max-w-md text-sm leading-7 text-paper/75">No minimum order. No hidden charges.<br />From our house to your door, anywhere in the UAE.</p><Button asChild size="lg" variant="outline" className="mt-8 border-sand bg-ink-deep/75 text-paper hover:bg-paper hover:text-ink"><Link to="/shipping-delivery">Delivery Details <ArrowRight /></Link></Button></div><div className="hidden justify-self-center lg:block"><div className="rotate-[-4deg] border border-sand/70 px-10 py-14 text-center text-sand"><p className="font-serif text-3xl tracking-[0.12em]">CIAO D</p><p className="mt-2 text-[10px] uppercase tracking-[0.35em]">Milano</p></div></div></div></section>; }
function Newsletter() { return <section className="border-t border-border"><div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-10"><div className="max-w-xl"><h2 className="font-serif text-4xl">Join the Atelier</h2><p className="mt-4 text-sm text-stone">Receive private previews and studio notes. No noise, only what matters.</p><form onSubmit={(e) => e.preventDefault()} className="mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-center border-b border-input pb-3"><input type="email" aria-label="Email address" required placeholder="Your email address" className="min-w-0 bg-transparent text-sm outline-none placeholder:text-stone" /><Button type="submit" variant="ghost">Subscribe</Button></form></div></div></section>; }