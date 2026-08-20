'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { Marquee } from '@/components/Marquee';
import { ProductGrid } from '@/components/ProductGrid';
import { FAQ } from '@/components/FAQ';
import { API } from '@/lib/api';
import { Product } from '@/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.getProducts().then(({ products }) => {
      setProducts(products);
      setLoading(false);
    });
  }, []);

  return (
    <main className="min-h-screen">
      <Hero />
      <Marquee />

      {/* Main Shop Preview */}
      <section id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div id="the-drop" className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="overline">The Drop</p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-white">
              Pick your <span className="text-lime-400">fit.</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-zinc-500 text-sm hidden sm:block">Six designs. Zero chill.</p>
            <Link
              href="/products"
              className="text-xs font-semibold text-lime-400 hover:underline uppercase tracking-wider"
            >
              View All Products →
            </Link>
          </div>
        </div>

        <ProductGrid products={products} loading={loading} />
      </section>

      <FAQ />
    </main>
  );
}
