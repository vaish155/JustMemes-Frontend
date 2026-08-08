'use client';

import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { API } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { PaymentCreateResponse, OrderResponse } from '@/types';

const inr = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN');

interface MockPaymentModalProps {
  order: OrderResponse;
  razorpayInfo: PaymentCreateResponse['razorpay'];
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

export const MockPaymentModal: React.FC<MockPaymentModalProps> = ({
  order,
  razorpayInfo,
  onSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSimulatePayment = async () => {
    setLoading(true);
    try {
      const paymentId = 'pay_' + Date.now().toString(36).toUpperCase();
      const signature = CryptoJS.HmacSHA256(
        `${razorpayInfo.id}|${paymentId}`,
        'test_secret'
      ).toString();

      await API.verifyPayment({
        orderId: order.id,
        razorpay_order_id: razorpayInfo.id,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess(paymentId);
      }, 700);
    } catch (err: any) {
      toast(err.message || 'Payment simulation failed', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onCancel} />
      <div className="relative bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-sm p-8 text-center drawer-panel">
        <p className="overline">Test Mode</p>
        <h3 className="font-display font-bold text-2xl mb-1 text-white">
          Insider<span className="text-lime-400">Pay.</span>
        </h3>
        <p className="text-zinc-500 text-sm mb-6">Simulated Razorpay — no real money moves.</p>

        <div className="relative mx-auto w-16 h-16 mb-6 flex items-center justify-center">
          {success ? (
            <span className="text-4xl">✅</span>
          ) : loading ? (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-white/10" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-lime-400 animate-spin" />
              <div className="absolute inset-0 grid place-items-center text-xl">💳</div>
            </>
          ) : (
            <div className="w-16 h-16 rounded-full bg-zinc-800 grid place-items-center text-2xl">
              💳
            </div>
          )}
        </div>

        <p className="font-mono text-lg font-semibold text-white">
          {inr(razorpayInfo.amount / 100)}
        </p>
        <p className="text-xs text-zinc-500 mt-1">paying via test@upi</p>

        <button
          onClick={handleSimulatePayment}
          disabled={loading || success}
          className="btn-primary w-full mt-6 !rounded-xl"
        >
          {loading ? 'Processing...' : 'Simulate Payment'}
        </button>

        <button
          onClick={onCancel}
          disabled={loading}
          className="text-xs text-zinc-500 hover:text-rose-400 transition mt-3 block w-full text-center"
        >
          Cancel transaction
        </button>

        <p className="text-[11px] text-zinc-600 mt-3">
          In production, Razorpay&apos;s checkout takes over here.
        </p>
      </div>
    </div>
  );
};
