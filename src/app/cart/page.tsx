'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { API } from '@/lib/api';
import { Product, Size } from '@/types';

const SIZE_LABEL: Record<string, string> = {
  xs: 'XS',
  s: 'S',
  m: 'M',
  l: 'L',
  xl: 'XL',
};

const inr = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN');

export default function CartPage() {
  const router = useRouter();
  const { items, subtotal, isEmpty, setQty, changeSize, remove, clear } = useCart();
  const { toast } = useToast();

  const [productsMap, setProductsMap] = useState<Record<string, Product>>({});

  useEffect(() => {
    API.getProducts().then(({ products }) => {
      const map: Record<string, Product> = {};
      products.forEach((p) => {
        map[p.id] = p;
      });
      setProductsMap(map);
    });
  }, []);

  const handleClearCart = () => {
    clear();
    toast('Cart cleared. Pristine. Empty. Sad.', 'info');
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 min-h-screen">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition mb-2 inline-block"
          >
            ← Continue Shopping
          </Link>
          <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-white">
            Your <span className="text-lime-400">Cart</span>
          </h1>
        </div>
        {!isEmpty && (
          <button
            onClick={handleClearCart}
            className="text-xs text-zinc-500 hover:text-rose-400 transition"
          >
            Clear cart
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-12 text-center my-8">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="font-display font-bold text-2xl mb-2 text-white">Nothing yet, legend</h2>
          <p className="text-sm text-zinc-500 mb-8 max-w-sm mx-auto">
            Emptier than the canteen after 9pm. Go grab some Drop 001 pieces.
          </p>
          <Link href="/products" className="btn-primary text-sm px-8 py-4 !rounded-xl">
            Go shop the drop
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => {
              const product = productsMap[item.productId];
              const availableSizes =
                product && product.size && product.size.length
                  ? product.size
                  : [item.size];

              return (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="bg-zinc-900/70 border border-white/10 rounded-2xl p-4 flex gap-4 items-center"
                >
                  <div className="w-20 h-24 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        href={`/product/${item.productId}`}
                        className="font-semibold text-base leading-snug text-white hover:text-lime-400 transition truncate"
                      >
                        {item.name}
                      </Link>
                      <p className="text-base font-bold text-lime-400 shrink-0">
                        {inr(item.price * item.qty)}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-zinc-500">Size:</span>
                        <select
                          value={item.size}
                          onChange={(e) =>
                            changeSize(item.productId, item.size, e.target.value as Size)
                          }
                          className="bg-zinc-950 border border-white/15 text-xs text-white rounded-lg px-2 py-1 outline-none focus:border-lime-400"
                        >
                          {availableSizes.map((s) => (
                            <option key={s} value={s}>
                              {SIZE_LABEL[s] || String(s).toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={() => setQty(item.productId, item.size, item.qty - 1)}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition active:scale-90"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-white">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => setQty(item.productId, item.size, item.qty + 1)}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition active:scale-90"
                        >
                          +
                        </button>
                        <button
                          onClick={() => remove(item.productId, item.size)}
                          className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 font-bold transition active:scale-90 ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 sticky top-24">
            <h2 className="font-display font-bold text-xl text-white mb-4">Summary</h2>
            <div className="space-y-2 text-sm text-zinc-400 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-semibold">{inr(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Hostel Courier</span>
                <span className="text-lime-400 font-semibold">FREE</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between font-display text-xl font-bold text-white">
                <span>Total</span>
                <span className="text-lime-400">{inr(subtotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="btn-primary w-full py-4 !rounded-xl text-center block text-base"
            >
              Proceed to Checkout →
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
