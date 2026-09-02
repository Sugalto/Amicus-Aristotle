import React from 'react';
import Hero from '@/components/landing/Hero';
import About from '@/components/landing/About';
import HowItWorks from '@/components/landing/HowItWorks';
import Misconceptions from '@/components/landing/Misconceptions';
import CTA from '@/components/landing/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <HowItWorks />
      <Misconceptions />
      <CTA />
    </>
  );
}