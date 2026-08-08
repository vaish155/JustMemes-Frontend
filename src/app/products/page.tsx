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
    </main>
  );
}
