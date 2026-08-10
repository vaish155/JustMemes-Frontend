'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ConfettiCanvas } from '@/components/ConfettiCanvas';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || searchParams.get('ref') || '—';
  const paymentId = searchParams.get('paymentId') || '—';

  const [animateCheck, setAnimateCheck] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateCheck(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="max-w-md mx-auto px-4 pt-28 pb-24 min-h-screen flex flex-col justify-center items-center relative">
      <ConfettiCanvas trigger={true} />

      <div className="relative bg-zinc-950 border border-lime-400/30 rounded-3xl w-full p-10 text-center shadow-2xl drawer-panel">
        <div
          className={`w-16 h-16 mx-auto rounded-full bg-lime-400 grid place-items-center mb-6 transition-transform duration-500 ease-out ${
            animateCheck ? 'scale-100' : 'scale-0'
          }`}
        >
          <svg
            className="w-8 h-8 text-zinc-950"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-display font-bold text-3xl text-white">Locked in.</h1>
        <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
          Your drip is officially on the way.
          <br />
          We&apos;ll slide into your DMs when it ships.
        </p>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left text-sm space-y-3 font-sans overflow-hidden">
          <div className="flex items-start justify-between gap-3 min-w-0">
            <span className="text-zinc-500 shrink-0">Order ref</span>
            <span className="font-mono font-bold text-white uppercase text-right break-all text-xs sm:text-sm min-w-0" title={orderId}>
              {orderId}
            </span>
          </div>
          <div className="flex items-start justify-between gap-3 min-w-0">
            <span className="text-zinc-500 shrink-0">Payment</span>
            <span className="font-mono text-lime-400 font-bold text-right break-all text-xs sm:text-sm min-w-0" title={paymentId}>
              {paymentId}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-zinc-500 shrink-0">Status</span>
            <span className="text-lime-400 font-bold">PAID</span>
          </div>
        </div>

        <Link href="/" className="btn-primary w-full mt-6 !rounded-xl text-center block">
          Back to the Drop
        </Link>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen grid place-items-center text-zinc-400 font-display">
          Loading order status...
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
