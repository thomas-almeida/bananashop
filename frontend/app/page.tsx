import { HeroSection } from "@/app/components/lp/heroSection"
import { StepsSection } from "@/app/components/lp/stepsSection"
import { FaqSection } from "@/app/components/lp/faqSection"
import { CtaSection } from "@/app/components/lp/ctaSection"
import { FloatingWhatsAppButton } from "./components/ui/FloatingWhatsAppButton"
import Footer from "./components/Footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <StepsSection />
      <FaqSection />
      <CtaSection />
      <FloatingWhatsAppButton />
      <Footer />
    </main>
  )
}
