'use client'
import { useEffect, useState } from "react";
import DeoSequence from "@/components/DeoSequence";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Team from "@/components/Team";
import { DeoSequenceMobile } from "@/components/DeoSequenceMobile";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's 'md' breakpoint
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <Hero />
      {isMobile ? <DeoSequenceMobile /> : <DeoSequence />}
      <Team />
      <Footer />
    </div>
  );
}