'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { API } from '@/lib/api';
import { CheckoutFormData, OrderResponse, PaymentCreateResponse } from '@/types';
import { MockPaymentModal } from '@/components/MockPaymentModal';

const SIZE_LABEL: Record<string, string> = {
  xs: 'XS',
  s: 'S',
  m: 'M',
  l: 'L',
  xl: 'XL',
};

const inr = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN');

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, isEmpty, clear } = useCart();
  const { toast } = useToast();

  const [gateway, setGateway] = useState<'phonepe' | 'razorpay'>('phonepe');

  const [form, setForm] = useState<CheckoutFormData>({
    customerName: '',
    contact: '',
    email: '',
    address: '',
    roomNumber: '',
    hostelName: '',
  });

  const [loading, setLoading] = useState(false);

  // Mock payment state for Razorpay
  const [mockInfo, setMockInfo] = useState<{
    order: OrderResponse;
    razorpay: PaymentCreateResponse['razorpay'];
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ((window as any).Razorpay) return resolve();
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error('Could not load Razorpay checkout. Check your network.'));
      document.head.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmpty) {
      toast('Cart is empty, legend.', 'error');
      return;
    }

    for (const key of ['customerName', 'contact', 'email', 'address', 'roomNumber', 'hostelName'] as const) {
      if (!form[key].trim()) {
        toast('Fill in every field — we need the deets.', 'error');
        return;
      }
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      toast('That email is not emailing.', 'error');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customerName: form.customerName.trim(),
        contact: form.contact.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        roomNumber: form.roomNumber.trim(),
        hostelName: form.hostelName.trim(),
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.name,
          size: i.size,
          quantity: i.qty,
          price: i.price,
        })),
      };

      const { order } = await API.placeOrder(payload);

      if (gateway === 'phonepe') {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        const phonepeRes = await API.createPhonePePaymentOrder({
          orderId: order.id,
          amount: order.total || subtotal,
          frontendUrl: origin,
        });

        if (phonepeRes.redirectUrl) {
          window.location.href = phonepeRes.redirectUrl;
        } else {
          toast('PhonePe initialization failed.', 'error');
          setLoading(false);
        }
      } else {
        const amount = Math.max(1, Math.round((order.total || subtotal) * 100));
        const payment = await API.createPaymentOrder({ orderId: order.id, amount });

        if (payment.razorpay && payment.razorpay.mock) {
          setMockInfo({ order, razorpay: payment.razorpay });
        } else {
          await openRazorpayCheckout(order, payment.razorpay);
        }
      }
    } catch (err: any) {
      toast(err.message || 'Checkout failed. Make sure backend is running.', 'error');
      setLoading(false);
    }
  };

  const openRazorpayCheckout = async (
    order: OrderResponse,
    rzp: PaymentCreateResponse['razorpay']
  ) => {
    try {
      await loadRazorpayScript();
      const options = {
        key: rzp.key,
        amount: rzp.amount,
        currency: rzp.currency,
        name: 'InsiderMemes',
        description: 'Drop 001 — Limited Merch',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeEg4hslTC_Y8BJ1Twku1yqJf7l5VspZsq5fsQG4ba7cMPdCSrFVp6DEqp&s=10',
        order_id: rzp.id,
        prefill: {
          name: order.customerName,
          email: order.email,
          contact: order.contact,
        },
        theme: { color: '#a3e635' },
        handler: async (resp: any) => {
          try {
            await API.verifyPayment({
              orderId: order.id,
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            });
            handleOrderFinish(order.id, resp.razorpay_payment_id);
          } catch (err: any) {
            toast(err.message || 'Payment verification failed.', 'error');
            setLoading(false);
          }
        },
      };

      const rzpInstance = new (window as any).Razorpay(options);
      rzpInstance.on('payment.failed', (err: any) => {
        toast('Payment failed: ' + (err.error?.description || 'try again'), 'error');
        setLoading(false);
      });
      rzpInstance.open();
    } catch (err: any) {
      toast(err.message || 'Failed to initialize payment gateway', 'error');
      setLoading(false);
    }
  };

  const handleOrderFinish = (orderId: string, paymentId: string) => {
    clear();
    router.push(`/order-success?orderId=${encodeURIComponent(orderId)}&paymentId=${encodeURIComponent(paymentId)}`);
  };

  if (isEmpty) {
    return (
      <main className="max-w-3xl mx-auto px-4 pt-28 pb-20 text-center min-h-screen">
        <h1 className="font-display text-3xl font-bold text-white mb-4">Cart is Empty</h1>
        <p className="text-zinc-500 mb-6">Add products to your cart before proceeding to checkout.</p>
        <Link href="/products" className="btn-primary">
          Browse Drop 001
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 min-h-screen">
      <Link
        href="/cart"
        className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition mb-6 inline-block"
      >
        ← Back to Cart
      </Link>

      <div className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden grid lg:grid-cols-5 shadow-2xl">
        {/* Form Column */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-3 p-8 space-y-6">
          <div>
            <h1 className="font-display font-bold text-3xl text-white">
              Delivery <span className="text-lime-400">deets</span>
            </h1>
            <p className="text-zinc-500 text-xs mt-1">Hostel room delivery ready.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="field-label">Full name</span>
              <input
                id="customerName"
                required
                value={form.customerName}
                onChange={handleChange}
                placeholder="Bobby Meme"
                className="field"
              />
            </label>
            <label className="block">
              <span className="field-label">Phone / WhatsApp</span>
              <input
                id="contact"
                required
                value={form.contact}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="field"
              />
            </label>
          </div>

          <label className="block">
            <span className="field-label">Email</span>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="campus.email@college.edu"
              className="field"
            />
          </label>

          <label className="block">
            <span className="field-label">Address</span>
            <input
              id="address"
              required
              value={form.address}
              onChange={handleChange}
              placeholder="Block C, Road 4, near the canteen"
              className="field"
            />
          </label>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="field-label">Hostel name</span>
              <input
                id="hostelName"
                required
                value={form.hostelName}
                onChange={handleChange}
                placeholder="e.g. Bravo Army"
                className="field"
              />
            </label>
            <label className="block">
              <span className="field-label">Room no.</span>
              <input
                id="roomNumber"
                required
                value={form.roomNumber}
                onChange={handleChange}
                placeholder="e.g. 420"
                className="field"
              />
            </label>
          </div>

          {/* Payment Method Selector */}
          <div className="pt-2">
            <span className="field-label block mb-2">Select Payment Method</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGateway('phonepe')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition ${
                  gateway === 'phonepe'
                    ? 'border-purple-500 bg-purple-500/10 text-white'
                    : 'border-white/10 bg-zinc-950/40 text-zinc-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-sm text-purple-400">PhonePe PG</span>
                  {gateway === 'phonepe' && <span className="text-purple-400 font-bold">✓</span>}
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">UPI, QR Code, Cards & Netbanking</p>
              </button>

              <button
                type="button"
                onClick={() => setGateway('razorpay')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition ${
                  gateway === 'razorpay'
                    ? 'border-lime-400 bg-lime-400/10 text-white'
                    : 'border-white/10 bg-zinc-950/40 text-zinc-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-sm text-lime-400">Razorpay</span>
                  {gateway === 'razorpay' && <span className="text-lime-400 font-bold">✓</span>}
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">Standard Cards & Wallets</p>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 !rounded-xl text-base hidden lg:block"
          >
            {loading
              ? 'Securing your order…'
              : gateway === 'phonepe'
              ? 'Pay via PhonePe PG'
              : 'Pay via Razorpay'}
          </button>
        </form>

        {/* Order Summary Column */}
        <div className="lg:col-span-2 border-t lg:border-t-0 lg:border-l border-white/10 bg-zinc-950/40 p-8 flex flex-col justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-white mb-4">Order summary</h2>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex justify-between gap-3 text-sm"
                >
                  <span className="text-zinc-400 truncate">
                    {item.qty}× {item.name}{' '}
                    <span className="text-zinc-600">
                      ({SIZE_LABEL[item.size] || item.size.toUpperCase()})
                    </span>
                  </span>
                  <span className="font-bold text-white shrink-0">
                    {inr(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 mt-6 pt-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="text-white font-semibold">{inr(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Shipping</span>
                <span className="text-lime-400 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between font-display text-2xl font-bold pt-2 text-white">
                <span>Total</span>
                <span className="text-lime-400">{inr(subtotal)}</span>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={handlePlaceOrder as any}
              disabled={loading}
              className="btn-primary w-full py-4 !rounded-xl text-base block lg:hidden mt-6"
            >
              {loading
                ? 'Securing your order…'
                : gateway === 'phonepe'
                ? 'Pay via PhonePe PG'
                : 'Pay via Razorpay'}
            </button>
            <p className="text-center text-[11px] text-zinc-500 mt-4">
              🔒 256-bit Encrypted Checkout · Powered by {gateway === 'phonepe' ? 'PhonePe' : 'Razorpay'}
            </p>
          </div>
        </div>
      </div>

      {mockInfo && (
        <MockPaymentModal
          order={mockInfo.order}
          razorpayInfo={mockInfo.razorpay}
          onSuccess={(paymentId) => handleOrderFinish(mockInfo.order.id, paymentId)}
          onCancel={() => {
            setMockInfo(null);
            setLoading(false);
          }}
        />
      )}
    </main>
  );
}
