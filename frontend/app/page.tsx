import { SmoothScroll } from "@/components/smooth-scroll"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { ImageAnalysis } from "@/components/image-analysis"
import { LogoMarquee } from "@/components/logo-marquee"
import { HowItWorks } from "@/components/how-it-works"
import { BentoGrid } from "@/components/bento-grid"
import { Pricing } from "@/components/pricing"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-zinc-950">
        <Navbar />
        <Hero />
        <ImageAnalysis />
        <HowItWorks />
        {/* <LogoMarquee /> */}
        <BentoGrid />
        {/* <Pricing /> */}
        <FinalCTA />
        <Footer />
      </main>
    </SmoothScroll>
  )
}
