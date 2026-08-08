'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Product } from '@/types';

const SIZE_LABEL: Record<string, string> = {
  xs: 'XS',
  s: 'S',
  m: 'M',
  l: 'L',
  xl: 'XL',
};

const inr = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN');

function stockChip(stock: number) {
  if (stock <= 0)
    return (
      <span className="bg-rose-500/15 border border-rose-500/40 text-rose-400 text-[10px] font-bold tracking-wider uppercase rounded-full px-2.5 py-1">
        Sold out
      </span>
    );
  if (stock <= 5)
    return (
      <span className="bg-amber-400/15 border border-amber-400/40 text-amber-300 text-[10px] font-bold tracking-wider uppercase rounded-full px-2.5 py-1">
        Only {stock} left
      </span>
    );
  return (
    <span className="bg-white/5 border border-white/15 text-zinc-400 text-[10px] font-bold tracking-wider uppercase rounded-full px-2.5 py-1">
      In stock
    </span>
  );
}

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${
      py * -7
    }deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = '';
  };

  return (
    <Link href={`/product/${product.id}`} className="block">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="product-card group"
      >
        <div className="card-img-wrap aspect-square mb-4 relative bg-zinc-800/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 grid place-items-center bg-black/45">
              <span className="font-display font-bold text-2xl tracking-widest border-2 border-rose-400 text-rose-400 px-4 py-2 rounded-lg -rotate-12">
                SOLD OUT
              </span>
            </div>
          )}
        </div>
        <div className="card-body flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display font-bold text-lg leading-snug text-white group-hover:text-lime-400 transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              {product.size.map((s) => SIZE_LABEL[s] || String(s).toUpperCase()).join(' · ')}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-display font-bold text-lg text-lime-400">{inr(product.price)}</p>
            <p className="mt-1">{stockChip(product.stock)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
