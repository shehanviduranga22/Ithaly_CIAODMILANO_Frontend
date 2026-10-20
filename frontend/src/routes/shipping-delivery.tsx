import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Box, Globe2, PackageCheck, RefreshCw, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { imagery } from "@/lib/catalog";

export const Route = createFileRoute("/shipping-delivery")({
  head: () => ({ meta: [
    { title: "Shipping & Delivery — CIAO D MILANO" },
    { name: "description", content: "UAE and international delivery, returns, tracking and secure packaging from CIAO D MILANO." },
    { property: "og:title", content: "Shipping & Delivery — CIAO D MILANO" },
    { property: "og:description", content: "Everything you need to know about receiving and returning your CIAO D MILANO order." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: ShippingPage,
});

const services = [
  { n:"01", icon:Truck, title:"UAE Delivery", lead:"Complimentary delivery across the Emirates.", copy:"Dubai orders are typically delivered within 1–2 business days. Allow 2–3 business days for Abu Dhabi and the Northern Emirates. A signature is required on arrival." },
  { n:"02", icon:Globe2, title:"International Delivery", lead:"From Milan, carefully sent worldwide.", copy:"International orders typically arrive within 3–7 business days. Delivery time and cost are calculated at checkout. Local duties and taxes may apply according to your destination." },
  { n:"03", icon:RefreshCw, title:"Returns & Exchanges", lead:"Considered purchases, with time to decide.", copy:"Eligible unworn pieces may be returned within 14 days of delivery with original tags and packaging. Final sale and personalised items cannot be returned." },
  { n:"04", icon:PackageCheck, title:"Order Tracking", lead:"Follow every stage of the journey.", copy:"Once your order leaves our care, you will receive an email with your tracking link. Updates become available after the courier completes the first scan." },
];

function ShippingPage(){return <>
  <section className="mx-auto grid max-w-[1440px] gap-10 px-6 pb-16 pt-20 lg:grid-cols-12 lg:px-10 lg:pb-24 lg:pt-28"><div className="lg:col-span-6"><p className="text-[10px] uppercase tracking-[.2em] text-stone">Client Care · Worldwide</p><h1 className="mt-5 max-w-[10ch] font-serif text-6xl leading-none sm:text-7xl lg:text-8xl">Shipping & Delivery</h1></div><div className="flex items-end lg:col-span-5 lg:col-start-8"><p className="max-w-lg text-sm leading-7 text-stone">Each order is prepared with the same precision as the piece itself. Explore delivery timing, returns and the details that protect your purchase in transit.</p></div></section>
  <section className="mx-auto max-w-[1440px] px-6 lg:px-10"><img src={imagery.hero} alt="CIAO D MILANO delivery from Milan" width={1536} height={1024} className="aspect-[16/7] min-h-[360px] w-full object-cover"/></section>
  <section className="mx-auto max-w-[1200px] px-6 py-24 lg:py-32"><div className="divide-y divide-border border-y border-border">{services.map(({n,icon:Icon,title,lead,copy})=><article key={title} className="grid gap-6 py-12 md:grid-cols-12 md:py-16"><div className="flex items-start gap-4 md:col-span-3"><span className="text-[10px] text-stone">{n}</span><Icon className="size-5" strokeWidth={1.3}/></div><h2 className="font-serif text-3xl md:col-span-3">{title}</h2><div className="md:col-span-5 md:col-start-8"><p className="font-serif text-xl">{lead}</p><p className="mt-4 text-sm leading-7 text-stone">{copy}</p></div></article>)}</div></section>
  <section className="bg-ink-deep text-paper"><div className="mx-auto grid max-w-[1440px] md:grid-cols-2"><div className="flex min-h-[480px] flex-col justify-between p-8 sm:p-14 lg:p-20"><div><Box className="size-7 text-sand" strokeWidth={1.2}/><p className="mt-8 text-[10px] uppercase tracking-[.2em] text-sand">05 · Secure Packaging</p></div><div><h2 className="max-w-[10ch] font-serif text-4xl sm:text-5xl">Protected with care. Presented with restraint.</h2><p className="mt-6 max-w-lg text-sm leading-7 text-paper/55">Your purchase is wrapped in acid-free tissue, placed in our signature recyclable box and secured inside discreet weather-resistant outer packaging.</p></div></div><img src={imagery.stillLife} alt="Secure luxury packaging by CIAO D MILANO" loading="lazy" width={1536} height={1024} className="min-h-[420px] h-full w-full object-cover"/></div></section>
  <section className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-8 px-6 py-20 sm:flex-row sm:items-center"><div><p className="text-[10px] uppercase tracking-[.2em] text-stone">Need more help?</p><h2 className="mt-3 font-serif text-3xl">Our client team is at your service.</h2></div><Button asChild variant="outline" size="lg"><Link to="/contact">Contact Us <ArrowRight /></Link></Button></section>
</>}