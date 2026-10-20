"use client";

import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ChevronDown, Heart, Menu, Pause, Play, Search, Shirt, ShoppingBag, UserRound } from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { imagery, money, products, type Product } from "@/lib/catalog";

type Commerce = { cart: Record<string, number>; wishlist: string[]; add: (id: string) => void; remove: (id: string) => void; setQty: (id: string, qty: number) => void; toggleWish: (id: string) => void };
const CommerceContext = createContext<Commerce | null>(null);

type MegaStaticPath = "/men" | "/women" | "/new-arrivals" | "/accessories" | "/collections" | "/about" | "/shipping-delivery";
type MegaLink = { label: string; to: MegaStaticPath; hash?: string } | { label: string; to: "/men" | "/women" | "/accessories"; category: string } | { label: string; productId: string };

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [wishlist, setWishlist] = useState<string[]>([]);
  const value = useMemo(() => ({ cart, wishlist, add: (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 })), remove: (id: string) => setCart((c) => { const next = { ...c }; delete next[id]; return next; }), setQty: (id: string, qty: number) => setCart((c) => qty < 1 ? Object.fromEntries(Object.entries(c).filter(([key]) => key !== id)) : ({ ...c, [id]: qty })), toggleWish: (id: string) => setWishlist((w) => w.includes(id) ? w.filter((x) => x !== id) : [...w, id]) }), [cart, wishlist]);
  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}

export function useCommerce() { const value = useContext(CommerceContext); if (!value) throw new Error("CommerceProvider missing"); return value; }

const megaNav = [
  {
    label: "Men",
    to: "/men",
    image: imagery.men,
    imageAlt: "CIAO D MILANO menswear campaign",
    feature: "The Modern Milanese",
    copy: "Precise tailoring, fine knitwear and enduring leather.",
    columns: [
      { title: "Shop", links: [{ label: "View All", to: "/men" }, { label: "New Arrivals", to: "/new-arrivals" }, { label: "Tailoring", to: "/men", category: "Tailoring" }, { label: "Knitwear", to: "/men", category: "Knitwear" }] },
      { title: "Discover", links: [{ label: "The Nero Suit", productId: "nero-suit" }, { label: "Fine Merino", productId: "merino-knit" }, { label: "Brera Loafer", productId: "penny-loafer" }] },
    ],
  },
  {
    label: "Women",
    to: "/women",
    image: imagery.women,
    imageAlt: "CIAO D MILANO womenswear campaign",
    feature: "The Woman of Milan",
    copy: "Fluid silk, sculptural tailoring and considered essentials.",
    columns: [
      { title: "Shop", links: [{ label: "View All", to: "/women" }, { label: "New Arrivals", to: "/new-arrivals" }, { label: "Outerwear", to: "/women", category: "Outerwear" }, { label: "Evening", to: "/women", category: "Evening" }] },
      { title: "Discover", links: [{ label: "Silk Column Dress", productId: "silk-column-dress" }, { label: "Atelier Blazer", productId: "atelier-blazer" }, { label: "Milano Handbag", productId: "milan-handbag" }] },
    ],
  },
  {
    label: "New Arrivals",
    to: "/new-arrivals",
    image: imagery.hero,
    imageAlt: "The latest CIAO D MILANO collection",
    feature: "The New Collection",
    copy: "A considered edit for the season ahead.",
    columns: [
      { title: "Explore", links: [{ label: "View All New Arrivals", to: "/new-arrivals" }, { label: "For Her", to: "/women" }, { label: "For Him", to: "/men" }, { label: "Accessories", to: "/accessories" }] },
      { title: "Highlights", links: [{ label: "Camel Wool Coat", productId: "camel-wool-coat" }, { label: "Nero Wool Suit", productId: "nero-suit" }, { label: "Como Silk Scarf", productId: "silk-twill-scarf" }] },
    ],
  },
  {
    label: "Accessories",
    to: "/accessories",
    image: imagery.stillLife,
    imageAlt: "Italian leather accessories and silk",
    feature: "Finishing Touches",
    copy: "Objects of quiet distinction, made by specialist hands.",
    columns: [
      { title: "Shop", links: [{ label: "View All", to: "/accessories" }, { label: "Leather Goods", to: "/accessories", category: "Leather" }, { label: "Silk", to: "/accessories", category: "Silk" }, { label: "Cashmere", to: "/accessories", category: "Cashmere" }] },
      { title: "Discover", links: [{ label: "Como Silk Scarf", productId: "silk-twill-scarf" }, { label: "Cintura Belt", productId: "calfskin-belt" }, { label: "Porta Carte", productId: "leather-cardholder" }] },
    ],
  },
  {
    label: "Collections",
    to: "/collections",
    image: imagery.hero,
    imageAlt: "CIAO D MILANO seasonal collection in Milan",
    feature: "The House Edit",
    copy: "Stories of material, proportion and Italian craft.",
    columns: [
      { title: "Collections", links: [{ label: "View All", to: "/collections" }, { label: "New Arrivals", to: "/new-arrivals" }, { label: "Women", to: "/women" }, { label: "Men", to: "/men" }] },
      { title: "The House", links: [{ label: "Our Story", to: "/about", hash: "our-story" }, { label: "The Art of Making", to: "/about", hash: "art-of-making" }, { label: "Shipping & Delivery", to: "/shipping-delivery" }] },
    ],
  },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cart, wishlist } = useCommerce();
  const location = useRouterState({ select: (state) => state.location });
  const pathname = location.pathname;
  const closeMenus = () => { setOpenMenu(null); setMobileOpen(false); };
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 12); onScroll(); window.addEventListener("scroll", onScroll); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpenMenu(null); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);
  useEffect(() => { setOpenMenu(null); setMobileOpen(false); }, [location.href]);

  return <header onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpenMenu(null); }} onMouseLeave={() => setOpenMenu(null)} className={`sticky top-0 z-50 bg-paper/95 backdrop-blur-md transition-colors duration-500 ${scrolled || openMenu ? "border-b border-border" : "border-b border-transparent"}`}>
    <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-[auto_minmax(0,1fr)_auto] items-center px-4 sm:px-6 lg:px-10">
      <nav className="hidden h-full items-center gap-1 lg:flex" aria-label="Primary navigation">
        {megaNav.map((item) => {
          const active = pathname === item.to;
          const expanded = openMenu === item.label;
          return <Button key={item.to} asChild variant="ghost" className="nav-trigger h-full gap-1 px-2 text-[9px]"><Link to={item.to} onMouseEnter={() => setOpenMenu(item.label)} onFocus={() => setOpenMenu(item.label)} onClick={closeMenus} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); setOpenMenu(item.label); window.requestAnimationFrame(() => document.getElementById(`mega-${item.label.toLowerCase().replaceAll(" ", "-")}`)?.querySelector<HTMLElement>("a")?.focus()); } }} aria-expanded={expanded} aria-controls={`mega-${item.label.toLowerCase().replaceAll(" ", "-")}`} data-active={active || expanded}>{item.label}<ChevronDown className={`size-3 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} /></Link></Button>;
        })}
      </nav>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}><SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu"><Menu /></Button></SheetTrigger><SheetContent side="left" className="w-full max-w-none overflow-y-auto bg-paper p-0"><SheetTitle className="sr-only">Menu</SheetTitle><div className="border-b border-border px-6 py-5"><Link to="/" className="font-serif text-xl tracking-[0.12em]">CIAO D MILANO</Link></div><nav className="px-6 py-8" aria-label="Mobile navigation"><div className="divide-y divide-border">{megaNav.map((item) => <details key={item.to} className="group py-4"><summary className="flex cursor-pointer list-none items-center justify-between font-serif text-3xl"><span>{item.label}</span><ChevronDown className="size-4 transition-transform duration-300 group-open:rotate-180" /></summary><div className="grid grid-cols-2 gap-6 pb-3 pt-5"><div>{item.columns[0].links.map((link) => <MegaMenuLink key={link.label} link={link} className="mb-3 block text-[10px] uppercase tracking-[0.16em] text-stone" />)}</div><Link to={item.to} className="block"><img src={item.image} alt={item.imageAlt} className="aspect-[4/3] w-full object-cover" /><span className="mt-2 block font-serif text-lg">{item.feature}</span></Link></div></details>)}</div><Link to="/about" className="mt-8 block text-[10px] uppercase tracking-[0.18em] text-stone">About the House</Link></nav></SheetContent></Sheet>
      <Link to="/" className="justify-self-center truncate font-serif text-lg tracking-[0.12em] sm:text-[22px]">CIAO D MILANO</Link>
      <nav className="flex shrink-0 items-center gap-1 sm:gap-2">
        <IconLink to="/search" label="Search"><Search /></IconLink><IconLink to="/account" label="Account" extra="hidden sm:inline-flex"><UserRound /></IconLink><IconLink to="/wishlist" label={`Wishlist ${wishlist.length}`}><Heart /><span className="hidden text-[10px] sm:inline">{wishlist.length || ""}</span></IconLink><IconLink to="/cart" label={`Bag ${count}`}><ShoppingBag /><span className="hidden text-[10px] sm:inline">{count || ""}</span></IconLink>
      </nav>
    </div>
    {megaNav.map((item) => {
      const expanded = openMenu === item.label;
      return <div key={item.to} id={`mega-${item.label.toLowerCase().replaceAll(" ", "-")}`} aria-hidden={!expanded} className={`absolute inset-x-0 top-full hidden overflow-hidden border-t border-border bg-paper shadow-xl transition-[opacity,transform,visibility] duration-300 lg:block ${expanded ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}>
        <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_1fr_1.35fr] gap-12 px-10 py-9">
          {item.columns.map((column) => <div key={column.title}><p className="mb-5 text-[9px] uppercase tracking-[0.2em] text-stone">{column.title}</p><ul className="space-y-3">{column.links.map((link) => <li key={link.label}><MegaMenuLink link={link} tabIndex={expanded ? 0 : -1} className="mega-link font-serif text-xl" /></li>)}</ul></div>)}
          <Link to={item.to} tabIndex={expanded ? 0 : -1} className="group grid grid-cols-[1.05fr_1fr] bg-ink-deep text-paper"><img src={item.image} alt={item.imageAlt} width={600} height={420} className="h-52 w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.02]" /><span className="flex flex-col justify-end p-6"><span className="text-[9px] uppercase tracking-[0.2em] text-sand">Editorial Focus</span><span className="mt-2 font-serif text-2xl">{item.feature}</span><span className="mt-2 text-[11px] leading-5 text-paper/60">{item.copy}</span><span className="mt-4 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.18em]">Discover <ArrowRight className="size-3" /></span></span></Link>
        </div>
      </div>;
    })}
  </header>;
}

function MegaMenuLink({ link, className, tabIndex }: { link: MegaLink; className: string; tabIndex?: number }) {
  if ("productId" in link) return <Link to="/product/$id" params={{ id: link.productId }} tabIndex={tabIndex} className={className}>{link.label}</Link>;
  if ("category" in link) return <Link to={link.to} search={{ category: link.category }} hash="collection-products" tabIndex={tabIndex} className={className}>{link.label}</Link>;
  return <Link to={link.to} hash={link.hash ?? ""} tabIndex={tabIndex} className={className}>{link.label}</Link>;
}

function IconLink({ to, label, children, extra = "" }: { to: "/search" | "/account" | "/wishlist" | "/cart"; label: string; children: ReactNode; extra?: string }) { return <Link to={to} aria-label={label} title={label} className={`inline-flex h-9 min-w-9 items-center justify-center gap-1 text-ink transition-opacity hover:opacity-55 [&_svg]:size-[17px] ${extra}`}>{children}</Link>; }

export function SiteFooter() { return <footer className="bg-ink-deep text-paper/70"><div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-10"><div className="grid grid-cols-2 gap-10 md:grid-cols-5"><div className="col-span-2"><p className="font-serif text-2xl tracking-[0.1em] text-paper">CIAO D MILANO</p><p className="mt-4 max-w-[26ch] text-xs text-paper/50">Quiet Italian luxury, shaped by craft and time.</p></div><FooterList title="Shop" links={[["Women","/women"],["Men","/men"],["Accessories","/accessories"],["Collections","/collections"]]} /><FooterList title="House" links={[["About Us","/about"],["Contact Us","/contact"],["Shipping & Delivery","/shipping-delivery"]]} /><FooterList title="Customer Care" links={[["New Arrivals","/new-arrivals"],["Account","/account"],["Wishlist","/wishlist"],["Shopping Bag","/cart"]]} /></div><div className="mt-16 flex flex-col gap-4 border-t border-paper/10 pt-6 text-[10px] uppercase tracking-[0.15em] text-paper/40 sm:flex-row sm:justify-between"><p>© 2026 CIAO D MILANO</p><p>Privacy · Terms & Conditions · Instagram · Pinterest</p></div></div></footer>; }
function FooterList({ title, links }: { title: string; links: readonly (readonly [string,string])[] }) { return <div><p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-paper/40">{title}</p><ul className="space-y-2 text-xs">{links.map(([label, to]) => <li key={to}><Link to={to} className="transition-colors hover:text-paper">{label}</Link></li>)}</ul></div>; }

const fittingSizes = ["XS", "S", "M", "L", "XL"];

function FittingRoom({ product }: { product: Product }) {
  const { add } = useCommerce();
  const [size, setSize] = useState("M");
  const [added, setAdded] = useState(false);

  const addFittedPiece = () => {
    add(product.id);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return <Popover>
    <PopoverTrigger asChild>
      <Button variant="ghost" size="icon" aria-label={`View ${product.name} details in the fitting room`} title="Fitting room" className="absolute right-2 top-12 bg-paper/90 hover:bg-paper">
        <Shirt />
      </Button>
    </PopoverTrigger>
    <PopoverContent align="end" side="right" sideOffset={10} collisionPadding={12} className="w-[min(92vw,360px)] rounded-none border-border bg-paper p-5 shadow-xl sm:p-6">
      <p className="text-[9px] uppercase tracking-[0.2em] text-stone">Private Fitting</p>
      <h3 className="mt-2 font-serif text-2xl leading-tight">{product.name}</h3>
      <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-stone">{product.category}</p>
      <p className="mt-3 text-sm">{money(product.price)}</p>
      <p className="mt-3 text-xs leading-6 text-stone">{product.description}</p>
      <div className="mt-5 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <p className="text-[9px] uppercase tracking-[0.16em] text-stone">Select size</p>
          <p className="text-[9px] uppercase tracking-[0.16em] text-stone">Selected · Size {size}</p>
        </div>
        <div className="mt-2 flex flex-wrap gap-1" aria-label="Choose fitting size">
          {fittingSizes.map((option) => <Button key={option} type="button" variant={size === option ? "default" : "outline"} size="icon" onClick={() => setSize(option)} aria-pressed={size === option} className="h-8 w-8 text-[9px]">{option}</Button>)}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-[9px] uppercase tracking-[0.16em] text-stone">Free delivery · 30-day returns</p>
        <Button type="button" onClick={addFittedPiece} className="min-h-10 shrink-0 px-4">{added ? "Added to Bag" : `Add Size ${size}`}</Button>
      </div>
    </PopoverContent>
  </Popover>;
}

export function ProductCard({ product, fittingRoom = false }: { product: Product; fittingRoom?: boolean }) {
  const { add, toggleWish, wishlist } = useCommerce();
  return <article className="group min-w-0"><div className="relative overflow-hidden bg-ivory"><Link to="/product/$id" params={{ id: product.id }}><img src={product.image} alt={product.name} loading="lazy" width={1024} height={1280} className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" /></Link>{product.label && <span className="absolute left-3 top-3 bg-paper/90 px-2 py-1 text-[9px] uppercase tracking-[0.14em]">{product.label}</span>}<Button variant="ghost" size="icon" onClick={() => toggleWish(product.id)} aria-label="Add to wishlist" className="absolute right-2 top-2 bg-paper/80"><Heart className={wishlist.includes(product.id) ? "fill-current" : ""} /></Button>{fittingRoom && <FittingRoom product={product} />}<Button onClick={() => add(product.id)} className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">Quick Add</Button></div><div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] gap-3"><div className="min-w-0"><p className="text-[9px] uppercase tracking-[0.14em] text-stone">{product.category}</p><Link to="/product/$id" params={{ id: product.id }} className="mt-1 block truncate font-serif text-lg">{product.name}</Link></div><p className="text-sm">{money(product.price)}</p></div></article>;
}

export function PageIntro({ eyebrow, title, copy }: { eyebrow?: string; title: string; copy?: string }) { return <section className="mx-auto max-w-[1440px] px-6 pb-14 pt-20 lg:px-10 lg:pb-20 lg:pt-28">{eyebrow && <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-stone">{eyebrow}</p>}<h1 className="max-w-[16ch] font-serif text-5xl leading-[.98] sm:text-6xl lg:text-7xl">{title}</h1>{copy && <p className="mt-6 max-w-[52ch] text-sm leading-7 text-stone">{copy}</p>}</section>; }

export type EditorialSlide = {
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
  alt: string;
};

export function EditorialSlideshow({ slides, label }: { slides: EditorialSlide[]; label: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 5500);
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  const [firstSlide] = slides;
  if (!firstSlide) return null;
  const currentSlide = slides[active] ?? firstSlide;

  const changeSlide = (next: number) => {
    setPaused(true);
    setActive((next + slides.length) % slides.length);
  };

  return <section className="relative isolate min-h-[430px] overflow-hidden bg-ink-deep text-paper sm:min-h-[510px] lg:min-h-[600px]" aria-roledescription="carousel" aria-label={label}>
    {slides.map((slide, index) => <div key={slide.title} className={`absolute inset-0 transition-opacity duration-700 ${index === active ? "z-0 opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={index !== active}>
      <img src={slide.image} alt={index === active ? slide.alt : ""} width={1536} height={1024} className={`h-full w-full object-cover transition-transform duration-[6000ms] ease-out ${index === active ? "scale-[1.025]" : "scale-100"}`} />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-deep/35 via-ink-deep/40 to-ink-deep/75" />
    </div>)}
    <div className="relative z-10 mx-auto flex min-h-[430px] max-w-[1440px] flex-col items-center justify-center px-6 py-20 text-center sm:min-h-[510px] lg:min-h-[600px] lg:px-10">
      <div key={active} className="editorial-rise flex max-w-3xl flex-col items-center">
        <p className="text-[10px] uppercase tracking-[0.24em] text-paper/80">CIAO D MILANO · {currentSlide.eyebrow}</p>
        <h1 className="mt-5 font-serif text-5xl leading-[.92] text-paper sm:text-7xl lg:text-8xl">{currentSlide.title}</h1>
        <span className="mt-6 h-px w-16 bg-sand" />
        <p className="mt-5 max-w-xl text-xs leading-6 text-paper/80 sm:text-sm">{currentSlide.copy}</p>
      </div>
    </div>
    <div className="absolute inset-x-0 bottom-0 z-20 mx-auto flex max-w-[1440px] items-center justify-between px-4 pb-5 sm:px-6 sm:pb-7 lg:px-10">
      <div className="flex items-center gap-2" aria-label="Choose slide">
        {slides.map((slide, index) => <Button key={slide.title} variant="ghost" size="icon" onClick={() => changeSlide(index)} aria-label={`Show slide ${index + 1}: ${slide.title}`} aria-current={index === active ? "true" : undefined} className="h-8 w-8 text-paper hover:bg-paper/10 hover:text-paper"><span className={`block h-px transition-all duration-300 ${index === active ? "w-7 bg-paper" : "w-3 bg-paper/50"}`} /></Button>)}
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={() => changeSlide(active - 1)} aria-label="Previous slide" className="text-paper hover:bg-paper/10 hover:text-paper"><ArrowLeft /></Button>
        <Button variant="ghost" size="icon" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Play slideshow" : "Pause slideshow"} className="text-paper hover:bg-paper/10 hover:text-paper">{paused ? <Play /> : <Pause />}</Button>
        <Button variant="ghost" size="icon" onClick={() => changeSlide(active + 1)} aria-label="Next slide" className="text-paper hover:bg-paper/10 hover:text-paper"><ArrowRight /></Button>
      </div>
    </div>
    <p className="sr-only" aria-live="polite">Slide {active + 1} of {slides.length}: {currentSlide.title}</p>
  </section>;
}

export function CollectionGrid({ items = products, fittingRoom = false }: { items?: Product[]; fittingRoom?: boolean }) {
  const [sort, setSort] = useState("featured");
  const location = useRouterState({ select: (state) => state.location });
  const selectedCategory = "category" in location.search && typeof location.search.category === "string" ? location.search.category : "All";
  const [filter, setFilter] = useState(selectedCategory);
  useEffect(() => {
    setFilter(selectedCategory);
    if (location.hash !== "collection-products") return;
    const frame = window.requestAnimationFrame(() => document.getElementById("collection-products")?.scrollIntoView({ block: "start" }));
    return () => window.cancelAnimationFrame(frame);
  }, [selectedCategory, location.href, location.hash]);
  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map((p) => p.category.split("·")[1]?.trim() ?? p.category)))], [items]);
  const filtered = filter === "All" ? items : items.filter((p) => (p.category.split("·")[1]?.trim() ?? p.category) === filter);
  const sorted = [...filtered].sort((a,b) => sort === "low" ? a.price-b.price : sort === "high" ? b.price-a.price : 0);
  return <section id="collection-products" className="mx-auto max-w-[1440px] scroll-mt-20 px-4 pb-24 sm:px-6 lg:px-10">
    <div className="mb-10 border-y border-border py-5">
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Filter by category">
          <span className="text-[10px] uppercase tracking-[0.16em] text-stone">{sorted.length} Pieces</span>
          <span className="h-3 w-px bg-border" aria-hidden="true" />
          {categories.map((category) => <Button variant="ghost" key={category} type="button" onClick={() => setFilter(category)} aria-pressed={filter === category} className={`h-auto p-0 text-[10px] uppercase tracking-[0.16em] transition-colors duration-300 hover:bg-transparent hover:text-ink ${filter === category ? "text-ink underline underline-offset-[6px]" : "text-stone hover:text-ink"}`}>{category}</Button>)}
        </div>
        <label className="flex items-center gap-3 text-[10px] uppercase tracking-[0.16em]">Sort <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent text-right outline-none"><option value="featured">Featured</option><option value="low">Price: Low</option><option value="high">Price: High</option></select></label>
      </div>
    </div>
    {sorted.length === 0 ? <p className="py-16 text-center text-sm text-stone">No pieces in this category yet.</p> : <div className="grid grid-cols-2 gap-x-3 gap-y-12 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">{sorted.map((product) => <ProductCard key={product.id} product={product} fittingRoom={fittingRoom} />)}</div>}
  </section>;
}

export function EmptyState({ title, copy, to = "/new-arrivals" }: { title: string; copy: string; to?: "/new-arrivals" | "/cart" }) { return <section className="mx-auto flex min-h-[60vh] max-w-[1440px] flex-col items-center justify-center px-6 text-center"><h1 className="font-serif text-5xl">{title}</h1><p className="mt-4 max-w-md text-sm text-stone">{copy}</p><Button asChild size="lg" className="mt-8"><Link to={to}>Continue Shopping</Link></Button></section>; }