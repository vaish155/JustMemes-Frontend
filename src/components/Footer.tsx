import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 py-10 px-4 text-center text-zinc-500 text-sm">
      <div className="max-w-4xl mx-auto space-y-4">
        <p className="font-display font-bold text-white text-base">
          Meme<span className="text-lime-400">Theory.</span>
        </p>
        <p className="text-xs text-zinc-400">
          Made for the hostel, by the hostel. Secure 256-bit instant payments.
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-zinc-400 pt-2">
          <Link href="/trackorder" className="hover:text-lime-400 transition">
            Track Order
          </Link>
          <Link href="/terms" className="hover:text-lime-400 transition">
            Terms & Conditions
          </Link>
          <Link href="/privacy" className="hover:text-lime-400 transition">
            Privacy Policy
          </Link>
          <Link href="/refund-policy" className="hover:text-lime-400 transition">
            Refund & Cancellation
          </Link>
          <Link href="/shipping-policy" className="hover:text-lime-400 transition">
            Shipping Policy
          </Link>
          <Link href="/contact" className="hover:text-lime-400 transition">
            Contact Us
          </Link>
        </div>
        <p className="text-[11px] text-zinc-600 pt-2">
          © {new Date().getFullYear()} Meme Theory. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

