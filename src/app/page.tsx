import { Hero } from "@/components/Landingpage/Hero";
import { LogoTicker } from "@/components/Landingpage/LogoTicker";
import BookView from "@/components/Landingpage/BookView"
import { ProductShowcase } from "@/components/Landingpage/ProductionShowcase";
import Exhibitpro from "@/components/Landingpage/ExhibitPro";
import ParticleRing from "@/components/Landingpage/ParticleRing";
import { Testimonials } from "@/components/Landingpage/Testimonials";
import { CallToAction } from "@/components/Landingpage/CallToAction";

export default function Home() {
  return (
   <>
    <Hero/>
    <LogoTicker/>
    <BookView/>
    <ProductShowcase/>
    <Exhibitpro/>
    <ParticleRing/>
    <Testimonials/>
    <CallToAction/>
   </>
  );
}