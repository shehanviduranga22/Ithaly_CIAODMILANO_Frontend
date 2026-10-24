import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import contactImage from "@/assets/contact.png";

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
    <section className="relative overflow-hidden bg-ink-deep text-paper">
      <div className="mx-auto grid max-w-[1440px] lg:min-h-[480px] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <div className="absolute left-6 top-8 h-px w-12 bg-sand/70 sm:left-10 lg:left-16" />
          <p className="text-[10px] uppercase tracking-[.24em] text-sand">Private Client Services <span className="mx-2 text-paper/30">/</span> Milano</p>
          <h1 className="mt-8 whitespace-nowrap font-serif text-5xl leading-none sm:text-6xl lg:text-7xl">Contact <span className="italic text-sand">Us</span></h1>
          <p className="mt-9 max-w-sm text-sm leading-7 text-paper/60">A considered response, a personal recommendation, or simply a conversation. Our client team is here for every detail.</p>
          <a href="#client-services" className="mt-9 inline-flex w-fit items-center gap-3 border-b border-sand/50 pb-2 text-[10px] uppercase tracking-[.18em] transition-colors hover:border-sand hover:text-sand">Speak with the House <ArrowUpRight className="size-4" /></a>
          <span aria-hidden="true" className="pointer-events-none absolute bottom-5 right-6 font-serif text-8xl leading-none text-paper/[0.04] sm:right-10 sm:text-9xl lg:right-12">CDM</span>
        </div>
        <div className="relative min-h-[320px] overflow-hidden lg:min-h-[480px]">
          <img src={contactImage} alt="CIAO D MILANO private client service" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/65 via-transparent to-ink-deep/10" />
          <div className="absolute inset-5 border border-paper/25 sm:inset-7" />
          <p className="absolute right-10 top-10 text-right text-[9px] uppercase leading-5 tracking-[.2em] text-paper/75 sm:right-12 sm:top-12">A personal service<br />from Milan to the world</p>
          <div className="absolute bottom-8 right-8 flex size-20 flex-col items-center justify-center rounded-full border border-paper/50 bg-ink-deep/20 text-center text-[8px] uppercase leading-4 tracking-[.14em] text-paper backdrop-blur-sm sm:bottom-10 sm:right-10">Always<br />personal</div>
        </div>
      </div>
    </section>
    <section id="client-services" className="mx-auto grid max-w-[1440px] gap-16 px-6 py-24 lg:grid-cols-12 lg:px-10 lg:py-32"><aside className="lg:col-span-4"><p className="text-[10px] uppercase tracking-[.2em] text-stone">Speak with the House</p><div className="mt-10 divide-y divide-border border-y border-border"><ContactLine icon={<Mail />} label="Email" value="clientservices@ciaodmilano.com" href="mailto:clientservices@ciaodmilano.com"/><ContactLine icon={<Phone />} label="Telephone" value="+971 4 555 0198" href="tel:+97145550198"/><ContactLine icon={<MapPin />} label="Regional Service" value="Dubai, United Arab Emirates"/></div><p className="mt-8 max-w-sm text-xs leading-6 text-stone">Monday–Saturday, 10:00–19:00 GST. We aim to reply to every enquiry within one business day.</p></aside>
      <div className="lg:col-span-7 lg:col-start-6"><p className="text-[10px] uppercase tracking-[.2em] text-stone">Send an Enquiry</p><h2 className="mt-5 font-serif text-4xl">How may we assist you?</h2>{sent ? <div className="mt-10 border border-border bg-ivory p-10"><p className="font-serif text-3xl">Grazie.</p><p className="mt-3 text-sm leading-7 text-stone">Your message has been received. Our client services team will be in touch shortly.</p><Button variant="outline" className="mt-7" onClick={() => setSent(false)}>Send another enquiry</Button></div> : <form onSubmit={submit} className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2"><Field label="First Name" name="firstName"/><Field label="Last Name" name="lastName"/><Field label="Email Address" name="email" type="email"/><Field label="Telephone" name="phone" type="tel"/><label className="sm:col-span-2"><span className="text-[10px] uppercase tracking-[.16em]">Topic</span><select required className="mt-3 h-12 w-full border-b border-input bg-transparent text-sm outline-none focus:border-ink"><option>Order enquiry</option><option>Product and sizing</option><option>Personal shopping</option><option>Press and partnerships</option><option>Other</option></select></label><label className="sm:col-span-2"><span className="text-[10px] uppercase tracking-[.16em]">Message</span><textarea required rows={5} className="mt-3 w-full resize-none border-b border-input bg-transparent py-3 text-sm outline-none focus:border-ink"/></label><div className="sm:col-span-2"><Button type="submit" size="lg">Send Enquiry <ArrowUpRight /></Button></div></form>}</div>
    </section>
  </>;
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) { return <label><span className="text-[10px] uppercase tracking-[.16em]">{label}</span><input required name={name} type={type} className="mt-3 h-12 w-full border-b border-input bg-transparent text-sm outline-none focus:border-ink"/></label>; }
function ContactLine({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) { const content=<><span className="text-stone [&_svg]:size-4">{icon}</span><span><span className="block text-[9px] uppercase tracking-[.16em] text-stone">{label}</span><span className="mt-1 block text-sm">{value}</span></span></>; return href?<a href={href} className="grid grid-cols-[24px_1fr] gap-3 py-6 transition-opacity hover:opacity-55">{content}</a>:<div className="grid grid-cols-[24px_1fr] gap-3 py-6">{content}</div>; }