import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { imagery } from "@/lib/catalog";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact Us — CIAO D MILANO" },
    { name: "description", content: "Contact the CIAO D MILANO client services team for personal shopping, orders and collection enquiries." },
    { property: "og:title", content: "Contact Us — CIAO D MILANO" },
    { property: "og:description", content: "Private client service, from Milan to the world." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };
  return <>
    <section className="bg-ink-deep text-paper"><div className="mx-auto grid min-h-[52vh] max-w-[1440px] lg:grid-cols-2"><div className="flex flex-col justify-end p-6 pb-16 sm:p-10 lg:p-16"><p className="text-[10px] uppercase tracking-[.2em] text-sand">Client Services</p><h1 className="mt-5 max-w-[10ch] font-serif text-6xl leading-none sm:text-7xl">Contact Us</h1><p className="mt-7 max-w-md text-sm leading-7 text-paper/55">Our private client team is here to assist with orders, styling, sizing and every detail in between.</p></div><img src={imagery.stillLife} alt="CIAO D MILANO private client service" width={1536} height={1024} className="h-full min-h-[360px] w-full object-cover"/></div></section>
    <section className="mx-auto grid max-w-[1440px] gap-16 px-6 py-24 lg:grid-cols-12 lg:px-10 lg:py-32"><aside className="lg:col-span-4"><p className="text-[10px] uppercase tracking-[.2em] text-stone">Speak with the House</p><div className="mt-10 divide-y divide-border border-y border-border"><ContactLine icon={<Mail />} label="Email" value="clientservices@ciaodmilano.com" href="mailto:clientservices@ciaodmilano.com"/><ContactLine icon={<Phone />} label="Telephone" value="+971 4 555 0198" href="tel:+97145550198"/><ContactLine icon={<MapPin />} label="Regional Service" value="Dubai, United Arab Emirates"/></div><p className="mt-8 max-w-sm text-xs leading-6 text-stone">Monday–Saturday, 10:00–19:00 GST. We aim to reply to every enquiry within one business day.</p></aside>
      <div className="lg:col-span-7 lg:col-start-6"><p className="text-[10px] uppercase tracking-[.2em] text-stone">Send an Enquiry</p><h2 className="mt-5 font-serif text-4xl">How may we assist you?</h2>{sent ? <div className="mt-10 border border-border bg-ivory p-10"><p className="font-serif text-3xl">Grazie.</p><p className="mt-3 text-sm leading-7 text-stone">Your message has been received. Our client services team will be in touch shortly.</p><Button variant="outline" className="mt-7" onClick={() => setSent(false)}>Send another enquiry</Button></div> : <form onSubmit={submit} className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2"><Field label="First Name" name="firstName"/><Field label="Last Name" name="lastName"/><Field label="Email Address" name="email" type="email"/><Field label="Telephone" name="phone" type="tel"/><label className="sm:col-span-2"><span className="text-[10px] uppercase tracking-[.16em]">Topic</span><select required className="mt-3 h-12 w-full border-b border-input bg-transparent text-sm outline-none focus:border-ink"><option>Order enquiry</option><option>Product and sizing</option><option>Personal shopping</option><option>Press and partnerships</option><option>Other</option></select></label><label className="sm:col-span-2"><span className="text-[10px] uppercase tracking-[.16em]">Message</span><textarea required rows={5} className="mt-3 w-full resize-none border-b border-input bg-transparent py-3 text-sm outline-none focus:border-ink"/></label><div className="sm:col-span-2"><Button type="submit" size="lg">Send Enquiry <ArrowUpRight /></Button></div></form>}</div>
    </section>
  </>;
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) { return <label><span className="text-[10px] uppercase tracking-[.16em]">{label}</span><input required name={name} type={type} className="mt-3 h-12 w-full border-b border-input bg-transparent text-sm outline-none focus:border-ink"/></label>; }
function ContactLine({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) { const content=<><span className="text-stone [&_svg]:size-4">{icon}</span><span><span className="block text-[9px] uppercase tracking-[.16em] text-stone">{label}</span><span className="mt-1 block text-sm">{value}</span></span></>; return href?<a href={href} className="grid grid-cols-[24px_1fr] gap-3 py-6 transition-opacity hover:opacity-55">{content}</a>:<div className="grid grid-cols-[24px_1fr] gap-3 py-6">{content}</div>; }