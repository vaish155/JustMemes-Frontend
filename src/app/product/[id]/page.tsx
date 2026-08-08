'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { API } from '@/lib/api';
import { Product, Size } from '@/types';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

const SIZE_LABEL: Record<string, string> = {
  xs: 'XS',
  s: 'S',
  m: 'M',
  l: 'L',
  xl: 'XL',
};

const inr = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN');

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<Size | ''>('');
  const [qty, setQty] = useState(1);
  const [sizeHint, setSizeHint] = useState('');

  const { add } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    API.getProductById(id).then((p) => {
      setProduct(p);
      if (p && p.size && p.size.length === 1) {
        setSelectedSize(p.size[0]);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto px-4 pt-28 pb-20 min-h-screen">
        <div className="skeleton h-[500px] rounded-3xl" />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="max-w-5xl mx-auto px-4 pt-28 pb-20 min-h-screen text-center">
        <h1 className="font-display text-3xl font-bold text-white mb-4">Product Not Found</h1>
        <p className="text-zinc-500 mb-6">Looks like this fit doesn&apos;t exist in Drop 001.</p>
        <Link href="/products" className="btn-primary">
          Back to Shop
        </Link>
      </main>
    );
  }

  const isSoldOut = product.stock <= 0;

  const handleAddToCart = () => {
    if (isSoldOut) {
      toast('That one is gone, my guy.', 'error');
      return;
    }
    if (!selectedSize) {
      setSizeHint('You have to pick a size, obviously.');
      return;
    }
    add(product, selectedSize, qty);
    toast(
      `${product.name} (${SIZE_LABEL[selectedSize] || selectedSize.toUpperCase()}) added to cart`,
      'success'
    );
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 min-h-screen">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-lime-400 transition mb-6"
      >
        ← Back to Shop
      </Link>

      <div className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-2">
        {/* Left: Image Container */}
        <div className="bg-zinc-800/40 relative min-h-[380px] md:min-h-[480px]">
          <div className="modal-glow" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <span
            className={`absolute top-4 left-4 text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur bg-black/60 border ${
              isSoldOut
                ? 'border-rose-400/50 text-rose-400'
                : product.stock <= 5
                ? 'border-amber-400/50 text-amber-300'
                : 'border-lime-400/50 text-lime-300'
            }`}
          >
            {isSoldOut
              ? 'Sold out'
              : product.stock <= 5
              ? `Only ${product.stock} left`
              : 'In stock'}
          </span>
        </div>

        {/* Right: Details & Action */}
        <div className="p-8 flex flex-col justify-between">
          <div>
            <p className="overline mb-1">Drop 001</p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl leading-tight text-white mb-3">
              {product.name}
            </h1>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              {product.description || 'The drop piece. If no one laughs, wear it anyway.'}
            </p>
            <p className="font-display text-4xl font-bold text-lime-400 mb-6">
              {inr(product.price)}
            </p>

            <p className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-2">
              Select Size
            </p>
            <div className="flex gap-2 mb-2 flex-wrap">
              {product.size.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSelectedSize(s);
                    setSizeHint('');
                  }}
                  className={`size-btn ${selectedSize === s ? 'selected' : ''}`}
                >
                  {SIZE_LABEL[s] || String(s).toUpperCase()}
                </button>
              ))}
            </div>
            {sizeHint && <p className="text-[11px] text-amber-300 font-medium mb-4">{sizeHint}</p>}

            <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-zinc-950/50 p-2 mb-6">
              <span className="pl-3 text-sm font-semibold text-white">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty((q) => Math.max(q - 1, 1))}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 font-bold transition active:scale-90 text-white"
                >
                  −
                </button>
                <span className="w-6 text-center font-bold text-white">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(q + 1, 99))}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 font-bold transition active:scale-90 text-white"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={handleAddToCart}
              disabled={isSoldOut}
              className="btn-primary w-full py-4 !rounded-xl shine text-base"
            >
              {isSoldOut
                ? 'Sold Out — Gone Forever'
                : !selectedSize
                ? 'Pick a size first'
                : `Add to Cart — ${inr(product.price * qty)}`}
            </button>
            <p className="text-center text-xs text-zinc-500 mt-4">
              ⚡ Ships from the next batch · Free hostel delivery
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
