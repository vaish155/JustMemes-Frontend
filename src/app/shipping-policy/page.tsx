import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Shipping & Delivery Policy | Meme Theory',
  description: 'Shipping timelines and campus hostel delivery details for Meme Theory.',
};

export default function ShippingPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 text-zinc-300">
      <Link
        href="/"
        className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition mb-6 inline-block"
      >
        ← Back to Home
      </Link>

      <h1 className="font-display text-4xl font-bold text-white mb-6">
        Shipping & <span className="text-lime-400">Delivery Policy</span>
      </h1>

      <p className="text-sm text-zinc-500 mb-8">Last updated: August 9, 2026</p>

      <div className="space-y-8 text-sm leading-relaxed border-t border-white/10 pt-8">
        <section>
          <h2 className="text-xl font-bold text-white mb-3">1. Shipping Coverage & Charges</h2>
          <p>
            We deliver across India, with special priority hostel-room delivery across participating university campuses. Standard shipping is <strong>FREE</strong> on all apparel drops.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">2. Processing & Delivery Timelines</h2>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li><strong>Campus & Hostel Delivery:</strong> Delivered within 24 to 48 hours directly to your hostel block/room.</li>
            <li><strong>Standard Pan-India Shipping:</strong> Dispatched within 1-2 business days; delivered in 3-5 business days depending on location.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">3. Shipment Tracking</h2>
          <p>
            Once your order is processed, you will receive confirmation and tracking details via SMS/WhatsApp on the contact number provided during checkout.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">4. Delivery Issues</h2>
          <p>
            If you are unavailable at your hostel or address during delivery, our team will re-attempt delivery once. If delivery fails repeatedly due to incorrect contact information, re-shipping charges may apply.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">5. Contact Support</h2>
          <p>
            For delivery status inquiries, reach out via our{' '}
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
