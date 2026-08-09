'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { API } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clear } = useCart();
  const { toast } = useToast();

  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const txnId = searchParams.get('txnId');
    const mock = searchParams.get('mock') === 'true';

    if (!orderId) {
      setError('Missing order ID in payment return link.');
      setVerifying(false);
      return;
    }

    async function verify() {
      try {
        const res = await API.verifyPhonePePayment({
          orderId: orderId!,
          merchantTransactionId: txnId || undefined,
          isMock: mock,
        });

        if (res.success && res.valid) {
          clear();
          toast('Payment verified via PhonePe!', 'success');
          router.push(`/order-success?orderId=${encodeURIComponent(orderId!)}&paymentId=${encodeURIComponent(txnId || 'PhonePe')}`);
        } else {
          setError('Payment status verification returned non-success from PhonePe.');
          toast('Payment incomplete or failed.', 'error');
        }
      } catch (err: any) {
        setError(err.message || 'Error verifying PhonePe payment.');
        toast(err.message || 'Payment verification failed.', 'error');
      } finally {
        setVerifying(false);
      }
    }

    verify();
  }, [searchParams, clear, toast, router]);

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-3xl p-10 max-w-md w-full text-center space-y-6 shadow-2xl">
      {verifying ? (
        <>
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Verifying PhonePe Payment</h1>
            <p className="text-sm text-zinc-400 mt-2">Connecting to PhonePe servers to confirm transaction status…</p>
          </div>
        </>
      ) : error ? (
        <>
          <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center text-2xl mx-auto font-bold">
            ✕
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Payment Verification Issue</h1>
            <p className="text-sm text-red-400 mt-2">{error}</p>
          </div>
          <button
            onClick={() => router.push('/checkout')}
            className="btn-primary w-full py-3 !rounded-xl text-sm"
          >
            Return to Checkout
          </button>
        </>
      ) : (
        <>
          <div className="w-16 h-16 bg-lime-500/10 text-lime-400 rounded-full flex items-center justify-center text-2xl mx-auto font-bold">
            ✓
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Payment Confirmed</h1>
        </>
      )}
    </div>
  );
}

export default function PhonePeCallbackPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20">
      <Suspense fallback={<div className="text-zinc-400">Loading...</div>}>
        <CallbackContent />
      </Suspense>
    </main>
  );
}
