import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Contact Us | Meme Theory',
  description: 'Get in touch with the Meme Theory team for customer support, orders, and inquiries.',
};

export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 text-zinc-300">
      <Link
        href="/"
        className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition mb-6 inline-block"
      >
        ← Back to Home
      </Link>

      <h1 className="font-display text-4xl font-bold text-white mb-6">
        Contact <span className="text-lime-400">Us</span>
      </h1>

      <p className="text-sm text-zinc-500 mb-8">
        Have questions about your drop order, payment, or campus delivery? We&apos;re here to help.
      </p>

      <div className="grid md:grid-cols-2 gap-8 border-t border-white/10 pt-8">
        <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white">Merchant & Business Details</h2>
          <div className="text-sm text-zinc-400 space-y-3">
            <p>
              <strong className="text-white">Business Name:</strong> Meme Theory Apparel
            </p>
            <p>
              <strong className="text-white">Customer Support Email:</strong>{' '}
              <a href="mailto:support@memetheory.in" className="text-lime-400 underline">
                support@memetheory.in
              </a>
            </p>
            <p>
              <strong className="text-white">Phone / WhatsApp Support:</strong> +91 98765 43210
            </p>
            <p>
              <strong className="text-white">Operating Address:</strong> Indian Institute of Science (IISc), CV Raman Rd, Bengaluru, Karnataka 560012, India
            </p>
            <p>
              <strong className="text-white">Support Hours:</strong> Monday – Saturday, 10:00 AM – 7:00 PM IST
            </p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white">Quick Help Links</h2>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li>
              → View{' '}
              <Link href="/refund-policy" className="text-lime-400 hover:underline">
                Refund & Cancellation Policy
              </Link>
            </li>
            <li>
              → View{' '}
              <Link href="/shipping-policy" className="text-lime-400 hover:underline">
                Shipping & Delivery Policy
              </Link>
            </li>
            <li>
              → Read{' '}
              <Link href="/terms" className="text-lime-400 hover:underline">
                Terms & Conditions
              </Link>
            </li>
            <li>
              → Read{' '}
              <Link href="/privacy" className="text-lime-400 hover:underline">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
