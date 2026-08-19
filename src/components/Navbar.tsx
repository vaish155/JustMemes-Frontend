'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export const Navbar: React.FC = () => {
  const { count, openDrawer } = useCart();

  return (
    <nav className="fixed top-0 inset-x-0 z-40 border-b border-white/5 bg-zinc-950/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="font-display font-bold text-2xl tracking-tighter text-white">
            Meme<span className="text-lime-400">Theory.</span>
          </Link>
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            <Link href="/products" className="text-white hover:text-lime-400 transition">
              Shop
            </Link>
            <Link href="/trackorder" className="text-zinc-400 hover:text-white transition">
              Track Order
            </Link>
            <Link href="/#the-drop" className="text-zinc-400 hover:text-white transition">
              The Drop
            </Link>
            <Link href="/#faq" className="text-zinc-400 hover:text-white transition">
              FAQ
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative flex items-center gap-2 font-semibold text-sm bg-lime-400 text-zinc-950 px-4 py-2 rounded-lg hover:bg-lime-300 transition active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                />
              </svg>
              Cart
              <span className="bg-zinc-950 text-lime-400 text-xs rounded-full w-5 h-5 grid place-items-center font-bold">
                {count}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
