'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { API } from '@/lib/api';
import { AdminOrder } from '@/types';

const SIZE_LABEL: Record<string, string> = {
  xs: 'XS',
  s: 'S',
  m: 'M',
  l: 'L',
  xl: 'XL',
};

const inr = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN');

const shortId = (id: string) => String(id).slice(-8).toUpperCase();

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

const isCompleted = (order: AdminOrder) => order.paymentStatus === 'paid';

function StatusChip({ order }: { order: AdminOrder }) {
  const paid = isCompleted(order);
  const text = paid
    ? 'PAID'
    : order.paymentStatus === 'failed'
    ? 'FAILED'
    : 'PENDING';
  return (
    <span
      className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border ${
        paid
          ? 'border-lime-400/50 text-lime-300 bg-lime-400/10'
          : order.paymentStatus === 'failed'
          ? 'border-rose-400/50 text-rose-300 bg-rose-400/10'
          : 'border-amber-400/50 text-amber-300 bg-amber-400/10'
      }`}
    >
      {text}
    </span>
  );
}

function OrderCard({ order }: { order: AdminOrder }) {
  return (
    <div className="bg-zinc-950/60 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display font-bold text-white truncate">{order.customerName}</p>
          <p className="text-xs text-zinc-500 mt-0.5">
            #{shortId(order.id)} · {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusChip order={order} />
          <span className="font-display font-bold text-lime-400">{inr(order.total)}</span>
        </div>
      </div>

      <div className="text-xs text-zinc-400 space-y-1">
        <p>
          {order.hostelName} · Room {order.roomNumber}
        </p>
        <p className="truncate">{order.contact}</p>
        <p className="truncate">{order.email}</p>
      </div>

      <div className="border-t border-white/10 pt-3 space-y-1">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between gap-3 text-sm">
            <span className="text-zinc-300 truncate">
              {item.quantity}× {item.productName}{' '}
              <span className="text-zinc-600">
                ({SIZE_LABEL[item.size] || String(item.size).toUpperCase()})
              </span>
            </span>
            <span className="font-semibold text-zinc-200 shrink-0">
              {inr(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderSection({ title, count, orders }: { title: string; count: number; orders: AdminOrder[] }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900/60 overflow-hidden">
      <header className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <h2 className="font-display font-bold text-xl text-white">{title}</h2>
        <span className="chip">{count}</span>
      </header>
      <div className="p-4 space-y-4">
        {orders.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-8">No {title.toLowerCase()} orders yet.</p>
        ) : (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </section>
  );
}

export default function AdminPage() {
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    API.getOrders()
      .then(setOrders)
      .catch(() => setError('Could not reach the backend. Is it running?'));
  }, []);

  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 min-h-screen">
        <div className="flex items-start gap-3 border border-amber-400/30 bg-amber-400/5 text-amber-200 text-sm rounded-xl px-4 py-3 max-w-xl">
          <span className="mt-0.5">⚠️</span>
          <div>
            <strong>{error}</strong>
            <p className="mt-1">
              The backend <code className="text-lime-300">/orders</code> endpoint is at{' '}
              <code className="text-lime-300">{API.base}</code>.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (orders === null) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 min-h-screen">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="skeleton h-[400px] rounded-3xl" />
          <div className="skeleton h-[300px] rounded-3xl" />
        </div>
      </main>
    );
  }

  const pending = orders.filter((o) => !isCompleted(o));
  const completed = orders.filter(isCompleted);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 min-h-screen">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-lime-400 transition mb-6"
      >
        ← Back to Store
      </Link>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="overline">Admin</p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-white">
            Orders <span className="text-lime-400">Desk</span>
          </h1>
        </div>
        <button
          onClick={() => {
            setOrders(null);
            API.getOrders()
              .then(setOrders)
              .catch(() => setError('Could not reach the backend. Is it running?'));
          }}
          className="btn-ghost !py-2.5 !px-6 text-sm"
        >
          Refresh
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <OrderSection title="Pending" count={pending.length} orders={pending} />
        <OrderSection title="Completed" count={completed.length} orders={completed} />
      </div>
    </main>
  );
}
