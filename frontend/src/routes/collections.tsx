import { createFileRoute, Link } from "@tanstack/react-router";
import { imagery } from "@/lib/catalog";
import { EditorialSlideshow, type EditorialSlide } from "@/components/storefront";
import collectionSlide1 from "@/assets/collection_slideshow1.png";
import collectionSlide2 from "@/assets/collection_slideshow2.png";
import collectionSlide3 from "@/assets/collection_slideshow3.png";
import collectionSlide4 from "@/assets/collection_slideshow4.png";

const slides: EditorialSlide[] = [
  {
    eyebrow: "The House",
    title: "Collections",
    copy: "Seasonal studies in silhouette, material and the quiet architecture of dress.",
    image: collectionSlide1,
    alt: "CIAO D MILANO collection objects in the atelier",
  },
  {
    eyebrow: "Atelier No. 01",
    title: "Sculpted Ease",
    copy: "Fluid womenswear balanced by exact lines and a distinctly Milanese restraint.",
    image: collectionSlide2,
    alt: "Sculpted womenswear from the atelier collection",
  },
  {
    eyebrow: "Atelier No. 02",
    title: "Precision in Black",
    copy: "A modern menswear study built around impeccable tailoring and enduring form.",
    image: collectionSlide3,
    alt: "Black tailoring from the men's collection",
  },
  {
    eyebrow: "The Season's Edit",
    title: "Quiet Signatures",
    copy: "Discover the considered details and enduring materials of the house.",
    image: collectionSlide4,
    alt: "CIAO D MILANO seasonal collection",
  },
];

export const Route = createFileRoute("/collections")({ head: () => ({ meta: [{ title: "Collections — CIAO D MILANO" }, { name: "description", content: "Explore the seasonal collections of CIAO D MILANO." }, { property: "og:title", content: "Collections — CIAO D MILANO" }, { property: "og:description", content: "Milanese collections shaped by fabric, proportion and restraint." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: Collections });
function Collections(){return <><EditorialSlideshow label="Collection highlights" slides={slides}/><section className="mx-auto grid max-w-[1440px] gap-6 px-6 py-20 md:grid-cols-2 lg:px-10 lg:py-24">{[["The Atelier Edit",imagery.women,"/women"],["Precision in Black",imagery.men,"/men"],["Objects of Permanence",imagery.stillLife,"/new-arrivals"]].map(([title,img,to],i)=><Link key={title} to={to as "/women" | "/men" | "/new-arrivals"} className={`group relative overflow-hidden ${i===2?"md:col-span-2":""}`}><img src={img} alt={title} loading="lazy" width={1536} height={1280} className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.02] ${i===2?"aspect-[16/7]":"aspect-[4/5]"}`}/><div className="absolute inset-0 bg-gradient-to-t from-ink-deep/65 to-transparent"/><h2 className="absolute bottom-7 left-7 font-serif text-4xl text-paper">{title}</h2></Link>)}</section></>}