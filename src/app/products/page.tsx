'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductGrid } from '@/components/ProductGrid';
import { API } from '@/lib/api';
import { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.getProducts().then(({ products }) => {
      setProducts(products);
      setLoading(false);
    });
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 min-h-screen">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition mb-2 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-white">
            All <span className="text-lime-400">Products</span>
          </h1>
        </div>
        <p className="text-zinc-500 text-sm hidden sm:block">Full Drop 001 Collection</p>
      </div>

      <ProductGrid products={products} loading={loading} />

      <div className="mt-16 max-w-2xl mx-auto">
        <details className="group border border-white/10 rounded-2xl bg-zinc-900/40 overflow-hidden">
          <summary className="font-display font-bold text-base text-white cursor-pointer list-none flex justify-between items-center px-6 py-5 hover:text-lime-400 transition">
            <span>📏 Size Chart</span>
            <span className="transition group-open:rotate-45 text-lime-400 font-bold text-xl">+</span>
          </summary>
          <div className="px-6 pb-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white mb-3">Regular T-Shirt</h3>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 px-2 text-zinc-500 font-semibold text-xs uppercase tracking-wider">Size</th>
                      <th className="text-left py-2 px-2 text-zinc-500 font-semibold text-xs uppercase tracking-wider">Chest (inches)</th>
                    </tr>
                  </thead>
                  <tbody className="text-zinc-300">
                    <tr className="border-b border-white/5"><td className="py-2 px-2 font-semibold">S</td><td className="py-2 px-2">38</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2 px-2 font-semibold">M</td><td className="py-2 px-2">40</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2 px-2 font-semibold">L</td><td className="py-2 px-2">42</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2 px-2 font-semibold">XL</td><td className="py-2 px-2">44</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2 px-2 font-semibold">2XL</td><td className="py-2 px-2">46</td></tr>
                    <tr><td className="py-2 px-2 font-semibold">3XL</td><td className="py-2 px-2">48</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-3">Oversized T-Shirt</h3>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 px-2 text-zinc-500 font-semibold text-xs uppercase tracking-wider">Size</th>
                      <th className="text-left py-2 px-2 text-zinc-500 font-semibold text-xs uppercase tracking-wider">Chest (inches)</th>
                    </tr>
                  </thead>
                  <tbody className="text-zinc-300">
                    <tr className="border-b border-white/5"><td className="py-2 px-2 font-semibold">S</td><td className="py-2 px-2">40</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2 px-2 font-semibold">M</td><td className="py-2 px-2">42</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2 px-2 font-semibold">L</td><td className="py-2 px-2">44</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2 px-2 font-semibold">XL</td><td className="py-2 px-2">46</td></tr>
                    <tr><td className="py-2 px-2 font-semibold">2XL</td><td className="py-2 px-2">48</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </details>
      </div>
    </main>
  );
}
