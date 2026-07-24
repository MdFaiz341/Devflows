
import { PricingCard } from "../components/PricingCard";
import { LazyMotion, domAnimation } from "framer-motion";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { Navbar } from "../components/Navbar";
import { Features } from "../components/Features";
import SecondBrainCard from "../components/SecondBrainCard";
import { Workspace } from "../components/Workspace";
import { BannerCard } from "../components/BannerCard";






export default function DevFlowsPreview() {
  return (
    <LazyMotion features={domAnimation}>
      <main className="min-h-screen overflow-hidden bg-black text-white">
        <Navbar/>
        <Hero/>
        <Features/>
        <Workspace/>
        <SecondBrainCard/>
        <PricingCard/>
        <BannerCard/>
        <Footer/>
      </main>
    </LazyMotion>
  );
}
