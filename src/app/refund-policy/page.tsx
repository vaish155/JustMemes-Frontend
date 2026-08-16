import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Refund & Cancellation Policy | Meme Theory',
  description: 'Refund, return, exchange, and cancellation rules for Meme Theory.',
};

export default function RefundPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 text-zinc-300">
      <Link
        href="/"
        className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition mb-6 inline-block"
      >
        ← Back to Home
      </Link>

      <h1 className="font-display text-4xl font-bold text-white mb-6">
        Refund & <span className="text-lime-400">Cancellation Policy</span>
      </h1>

      <p className="text-sm text-zinc-500 mb-8">Last updated: August 9, 2026</p>

      <div className="space-y-8 text-sm leading-relaxed border-t border-white/10 pt-8">
        <section>
          <h2 className="text-xl font-bold text-white mb-3">1. Order Cancellations</h2>
          <p>
            You may cancel your order within 2 hours of placing it, provided it has not already been dispatched for delivery. To cancel an order, email us at support@justmemes.in or reach out via our contact options.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">2. Returns & Exchanges</h2>
          <p>
            We offer replacement or returns within 7 days of delivery under the following conditions:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400">
            <li>Item received is damaged, defective, or misprinted.</li>
            <li>Incorrect size or product delivered compared to your order confirmation.</li>
            <li>The item must be unused, unwashed, and in its original packaging with tags intact.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">3. Refund Processing</h2>
          <p>
            Once a return is approved, refunds will be initiated to your original payment method (Razorpay, UPI, Netbanking, or Card) within 5 to 7 business days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">4. Non-Refundable Items</h2>
          <p>
            Items bought during end-of-season clearance sales, customized merchandise, or damaged due to customer misuse are non-refundable.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">5. Contact Support</h2>
          <p>
            For any return or refund requests, please contact us at support@justmemes.in or visit our{' '}
            <Link href="/contact" className="text-lime-400 underline">
              Contact Page
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
