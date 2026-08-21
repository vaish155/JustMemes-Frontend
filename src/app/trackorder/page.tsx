'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { API, ApiError } from '@/lib/api';
import { AdminOrder, colorLabel } from '@/types';

const SIZE_LABEL: Record<string, string> = {
  xs: 'XS',
  s: 'S',
  m: 'M',
  l: 'L',
  xl: 'XL',
};

const inr = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN');

const DELIVERY_DAYS_MIN = 7;
const DELIVERY_DAYS_MAX = 10;

const formatDate = (date: string) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

function StatusChip({ paymentStatus }: { paymentStatus: string }) {
  const paid = paymentStatus === 'paid';
  const failed = paymentStatus === 'failed';
  return (
    <span
      className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border ${
        paid
          ? 'border-lime-400/50 text-lime-300 bg-lime-400/10'
          : failed
          ? 'border-rose-400/50 text-rose-300 bg-rose-400/10'
          : 'border-amber-400/50 text-amber-300 bg-amber-400/10'
      }`}
    >
      {paid ? 'PAID' : failed ? 'FAILED' : 'PENDING'}
    </span>
  );
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [ref, setRef] = useState('');
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = async (id: string) => {
    setLoading(true);
    setSearched(false);
    setOrder(null);
    try {
      const found = await API.getOrderById(id);
      setOrder(found);
      toast('Order found.', 'success');
    } catch (err) {
      const msg =
        err instanceof ApiError && err.status === 404
          ? 'No order found with that ref.'
          : 'Something went wrong. Try again later.';
      toast(msg, 'error');
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  useEffect(() => {
    const urlRef = searchParams.get('ref');
    if (urlRef) {
      setRef(urlRef);
      doSearch(urlRef);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = ref.trim();
    if (!id) {
      toast('Enter your order ref first.', 'error');
      return;
    }
    doSearch(id);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 min-h-screen">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-lime-400 transition mb-6"
      >
        ← Back to Store
      </Link>

      <div className="mb-8">
        <p className="overline">Track Order</p>
        <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-white mt-1">
          Where&apos;s my <span className="text-lime-400">drip?</span>
        </h1>
        <p className="text-zinc-500 text-sm mt-2">
          Enter the order ref you got after checkout to view its status.
        </p>
      </div>

      <form
        onSubmit={handleTrack}
        className="bg-zinc-900 border border-white/10 rounded-3xl p-6 flex flex-col sm:flex-row gap-3"
      >
        <input
          type="text"
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="e.g. order_12 or 667f…"
          className="field !m-0 flex-1 font-mono"
          autoFocus
        />
        <button type="submit" disabled={loading} className="btn-primary shrink-0">
          {loading ? 'Searching…' : 'Track Order'}
        </button>
      </form>

      {loading && (
        <div className="mt-8 space-y-3">
          <div className="skeleton h-32 rounded-2xl" />
          <div className="skeleton h-40 rounded-2xl" />
        </div>
      )}

      {!loading && searched && !order && (
        <div className="mt-8 border border-amber-400/30 bg-amber-400/5 text-amber-200 text-sm rounded-2xl px-4 py-6 text-center">
          <p className="font-bold">Nothing found for “{ref.trim()}”.</p>
          <p className="text-amber-200/60 mt-1 text-xs">
            Double-check the ref from your order confirmation email or the order success page.
          </p>
        </div>
      )}

      {!loading && order && (
        <div className="mt-8 bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden">
          <div className="border-b border-white/10 p-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Order ref</p>
              <p className="font-mono font-bold text-white break-all mt-0.5" title={order.id}>
                {order.id}
              </p>
              <p className="text-xs text-zinc-500 mt-2">{formatDate(order.createdAt)}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusChip paymentStatus={order.paymentStatus} />
              <span className="font-display font-bold text-lime-400 text-2xl">
                {inr(order.total)}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="text-sm text-zinc-400 space-y-1">
              <p>
                <span className="text-zinc-500">Customer:</span>{' '}
                <span className="text-white font-semibold">{order.customerName}</span>
              </p>
              <p>
                <span className="text-zinc-500">Email:</span> {order.email}
              </p>
              <p>
                <span className="text-zinc-500">Contact:</span> {order.contact}
              </p>
              <p>
                <span className="text-zinc-500">Delivery:</span>{' '}
                {order.hostelName}, Room {order.roomNumber}, {order.address}
              </p>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-1">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between gap-3 text-sm">
                  <span className="text-zinc-300 truncate">
                    {item.quantity}× {item.productName}{' '}
                    <span className="text-zinc-600">
                      ({SIZE_LABEL[item.size] || String(item.size).toUpperCase()} ·{' '}
                      {colorLabel(item.color || 'black')})
                    </span>
                  </span>
                  <span className="font-semibold text-zinc-200 shrink-0">
                    {inr(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {order.paymentStatus === 'paid' && (
              <div className="border-t border-white/10 pt-4">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2">Estimated Delivery</p>
                <p className="text-sm text-zinc-300">
                  {new Date(new Date(order.createdAt).getTime() + DELIVERY_DAYS_MIN * 86400000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  {' '}&mdash;{' '}
                  {new Date(new Date(order.createdAt).getTime() + DELIVERY_DAYS_MAX * 86400000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
                <p className="text-[11px] text-zinc-600 mt-1">
                  Ordered on {formatDate(order.createdAt)}. Delivery within {DELIVERY_DAYS_MIN}&ndash;{DELIVERY_DAYS_MAX} business days.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen grid place-items-center text-zinc-400 font-display">
          Loading...
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}