import React from 'react';
import Link from 'next/link';

export const Hero: React.FC = () => {
  return (
    <header id="top" className="pt-16 relative overflow-hidden">
      <div className="hero-glow" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center relative">
        <div className="inline-flex items-center gap-2 border border-lime-400/30 bg-lime-400/5 text-lime-300 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-8 animate-rise">
          <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
          Drop 001 — Live
        </div>
        <h1 className="font-display font-bold leading-[0.95] tracking-tight text-6xl sm:text-7xl lg:text-8xl animate-rise">
          College culture,<br />
          <span className="text-lime-400">but make it</span>{' '}
          <span className="outline-text">merch.</span>
        </h1>
        <p className="mt-6 text-zinc-400 text-lg max-w-2xl mx-auto animate-rise">
          Unhinged internet culture, screen-printed and shipped. Premium cotton, zero filter.
          Built for the hostel, worn by the legend.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-rise">
          <Link href="/products" className="btn-primary">
            Enter the Drop
          </Link>
          <a href="#the-drop" className="btn-ghost">
            Peep the Fits
          </a>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-2 animate-rise">
          <span className="chip -rotate-2">100% SUPER-COMBED</span>
          <span className="chip rotate-2 chip-pink">BIO-WASHED</span>
          <span className="chip -rotate-1 chip-violet">PREMIUM 240GSM</span>
          <span className="chip rotate-1 chip-yellow">XS → XL</span>
        </div>
      </div>
    </header>
  );
};
